"""Regression: native text isolation must see light glyphs without changing them."""
import importlib.util
from pathlib import Path
import unittest
from xml.etree import ElementTree as ET

import fitz
import numpy as np

spec = importlib.util.spec_from_file_location(
    "render_layout", Path(__file__).parents[1] / "scripts" / "render-layout.py")
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)


def text_object(*colors):
    root = ET.Element(renderer.P("sp"))
    for color in colors:
        run = ET.SubElement(root, renderer.A("rPr"))
        fill = ET.SubElement(run, renderer.A("solidFill"))
        ET.SubElement(fill, renderer.A("srgbClr"), {"val": color})
    return root


def raster(background, colors):
    doc = fitz.open()
    page = doc.new_page(width=240, height=90)
    page.draw_rect(page.rect, color=None,
                   fill=tuple(c / 255 for c in background))
    for i, color in enumerate(colors):
        page.insert_text((20 + i * 110, 55), "LLM", fontsize=26,
                         color=tuple(c / 255 for c in color))
    pix = page.get_pixmap(alpha=False)
    arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
        pix.height, pix.width, pix.n)[:, :, :3].copy()
    doc.close()
    return arr


class TextIsolationRegression(unittest.TestCase):
    def test_white_and_dark_glyphs_have_real_ink_bounds(self):
        for hexcolor, rgb in [("FFFFFF", (255, 255, 255)),
                              ("10151F", (16, 21, 31))]:
            with self.subTest(color=hexcolor):
                bg = renderer.isolation_background(text_object(hexcolor))
                arr = raster(bg, [rgb])
                y, x = np.where(renderer.text_ink_mask(arr, bg))
                self.assertGreater(len(x), 100)
                self.assertGreaterEqual(x.min(), 19)
                self.assertLess(x.max(), 100)
                self.assertGreater(y.min(), 25)
                self.assertLess(y.max(), 57)

    def test_mixed_white_black_runs_both_survive(self):
        bg = renderer.isolation_background(text_object("FFFFFF", "000000"))
        mask = renderer.text_ink_mask(
            raster(bg, [(255, 255, 255), (0, 0, 0)]), bg)
        self.assertGreater(mask[:, :110].sum(), 100)
        self.assertGreater(mask[:, 110:].sum(), 100)

    def test_blank_mattes_never_become_glyph_ink(self):
        for bg in [(0, 0, 0), (128, 128, 128), (255, 255, 255)]:
            self.assertFalse(renderer.text_ink_mask(raster(bg, []), bg).any())

    def test_existing_white_matte_detection_is_unchanged(self):
        arr = raster((255, 255, 255), [(15, 40, 120)])
        np.testing.assert_array_equal(
            renderer.text_ink_mask(arr, (255, 255, 255)),
            arr.min(axis=2) < 220)


if __name__ == "__main__":
    unittest.main()
