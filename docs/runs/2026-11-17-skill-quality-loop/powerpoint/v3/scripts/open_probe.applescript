on run argv
  set inputPath to item 1 of argv
  tell application "Microsoft PowerPoint"
    open (POSIX file inputPath)
    delay 2
    set d to presentation (count of presentations)
    set n to name of d as text
    if n contains "Repaired" then
      close d
      return "repaired=" & n
    end if
    close d
    return "normal=" & n
  end tell
end run
