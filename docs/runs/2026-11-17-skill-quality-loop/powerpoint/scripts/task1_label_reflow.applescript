on run argv
  set inputPath to item 1 of argv
  set outputPath to item 2 of argv
  set pdfPath to item 3 of argv
  tell application "Microsoft PowerPoint"
    open (POSIX file inputPath)
    delay 1
    set docRef to presentation (count of presentations)
    if (name of docRef as text) does not contain "label_reflow-input" then error "safety: expected owned label test document, got " & (name of docRef as text)
    tell slide 1 of docRef
      set targetShape to shape "nearest"
      set left position of targetShape to 907.5
      set width of targetShape to 285
      set content of text range of text frame of targetShape to "Nearest class description"
      set targetConnector to shape "similarity-readout"
      set width of targetConnector to 34.5
    end tell
    save docRef in outputPath as save as Open XML presentation
    save docRef in pdfPath as save as PDF
    close docRef saving no
  end tell
end run
