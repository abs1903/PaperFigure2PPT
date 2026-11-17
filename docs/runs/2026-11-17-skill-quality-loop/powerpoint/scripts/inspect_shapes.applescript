on run argv
  set p to POSIX file (item 1 of argv)
  tell application "Microsoft PowerPoint"
    set docRef to open p
    set outText to "presentation=" & name of docRef & linefeed
    tell slide 1 of docRef
      set n to count of shapes
      set outText to outText & "shape_count=" & n & linefeed
      repeat with i from 1 to n
        set s to shape i
        set rec to i & "|" & name of s & "|" & (left position of s) & "," & (top of s) & "," & (width of s) & "," & (height of s) & "|connector=" & (is connector of s)
        try
          set rec to rec & "|text=" & (content of text range of text frame of s)
        end try
        set outText to outText & rec & linefeed
      end repeat
    end tell
    close docRef saving no
    return outText
  end tell
end run
