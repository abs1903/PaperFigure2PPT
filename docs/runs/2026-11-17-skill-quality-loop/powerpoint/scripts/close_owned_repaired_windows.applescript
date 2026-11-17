tell application "System Events"
  tell process "Microsoft PowerPoint"
    repeat with windowName in {"label_reflow-input [Repaired]", "encoder_move-input [Repaired]"}
      if exists window windowName then
        click button 1 of window windowName
        delay 1
        if exists window 1 then
          try
            if exists button "不保存" of window 1 then click button "不保存" of window 1
          end try
          try
            if exists button "Don't Save" of window 1 then click button "Don't Save" of window 1
          end try
        end if
      end if
    end repeat
  end tell
end tell
