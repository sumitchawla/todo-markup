/*global define, $, brackets, window */

/* 
  System Shortcuts
*/
define(function (require, exports, module) {
    "use strict";
    function log(msg){
      console.log("TODO-MARKUP:" + msg);
    }

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        EditorManager   = brackets.getModule('editor/EditorManager'),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    
    
    //window.editor = editor = EditorManager.getActiveEditor();
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    
    
    var prefs = PreferencesManager.getExtensionPrefs("todo-markup");
    
    //object of shortcuts
    prefs.definePreference( "shortcuts", "object", {
                                                    CTRL_Z:"New Day!",
                                                    CTRL_N:"Note with Today's Date",
                                                    CTRL_X:"Done Date",
                                                    CTRL_1:"Action Item: 7 Days",
                                                    CTRL_2:"Action Item: 15 Days",
                                                    CTRL_3:"Action Item: 30 Days",
                                                    CTRL_SHIFT_1:"Sumit Action Item: 7 Days",
                                                    CTRL_SHIFT_2:"Sumit Action Item: 15 Days",
                                                    CTRL_SHIFT_3:"Sumit Action Item: 30 Days"
                                                  },
                            { description: "Add shortcut as Key and what it types as the value (except for html-template)" }
    );
    var shortcuts = prefs.get("shortcuts");

    function txt_with_position(txt,prefix,suffix, prefix_next_line, suffix_next_line) {
        var editor = EditorManager.getActiveEditor();
        if( editor ) {
            var doc = editor.document;
            var cpos = editor._codeMirror.getCursor(true);
            log("1");
            console.log(pos)
            var pos = cpos;
            pos.ch = 0;
            if (prefix_next_line) {
              pos.line = pos.line + 1;
              editor.setCursorPos(pos.line,0);
              log("2.1");
              doc.replaceRange("\n", pos, pos);
              log("2.2");
              pos.line = pos.line + 1;
              editor.setCursorPos(pos.line,0);
              log("2.3");
            }  
            var s = '';
            if (prefix.length > 0){ 
              s += prefix;
            }
            s += txt;
            if (suffix.length > 0){ 
              s += suffix;
            }
            console.log(pos)
            log("1.1");
            doc.replaceRange(s, pos, pos);
            log("1.2");
            editor.setSelection(pos);
            log("1.3");
            pos.sticky = null; 
            editor.setCursorPos(pos.line - 1,0+txt.length);
            console.log(pos)
            console.log(txt.length)
            log("1.4");

            /*
            if (suffix_next_line) {
              pos.line = pos.line + 1;
              editor.setCursorPos(pos.line,0);
              log("3.1");
              doc.replaceRange("\n", pos, pos);
              log("3.2");
              pos.line = pos.line + 1;
              editor.setCursorPos(pos.line,0);
              log("3.3");
            } 
*/ 

        } else {
          log("unable to get reference to editor");
        }
    }
  
    function get_date_string(day_offset) {
       var d =  new Date();
        d.setDate(d.getDate() + day_offset)
        return d.toLocaleDateString("en-US", {"day":"numeric", "year": "numeric", "month": "numeric"})
    }
      

    function handleShortcut(shortcut) {
        log("got " + shortcut); 
         switch(shortcut){
          case "CTRL_Z": 
             
           txt_with_position("Attendees:\nCC:\n\nMeeting Notes: (Sumit DUE "+ get_date_string(1) + ")" + "\nDiscussed:\n\n",get_date_string(0) + "\n", "\n\nAction Items:\n",true, true);
           return;
          case "CTRL_N": 
           return txt_with_position("\t\t-[" +  get_date_string(0) + "]","","",true, true);
          case "CTRL_X": 
           return txt_with_position("[Done-" +  get_date_string(0) + "]","","",false, false);
          case "CTRL_1": 
           return txt_with_position("\t* (DUE "+ get_date_string(7) + ")","", "",true, false);
          case "CTRL_2": 
           return txt_with_position("\t* (DUE "+ get_date_string(15) + ")","",true, false);
          case "CTRL_3": 
           return txt_with_position("\t* (DUE "+ get_date_string(30) + ")","", "",true, false);
          case "CTRL_SHIFT_1": 
           return txt_with_position("\t* (Sumit DUE "+ get_date_string(7) + ")","","",false, false);
          case "CTRL_SHIFT_2": 
           return txt_with_position("\t* (Sumit DUE "+ get_date_string(15) + ")","","",false, false);
          case "CTRL_SHIFT_3": 
           return txt_with_position("\t* (Sumit DUE "+ get_date_string(30) + ")","","",false, false);
       }      
    }
    
    
    
    /* ************************************************
        Creates Shortcuts and their respective functions
        -Then call function
    */
    var funcs = {};
    function registerCommands(shortcuts){
        
        for(var key in shortcuts){
            
            //funcs.OPT_T = ϴ;
            var funcName = "td_mkp_" + key;
            eval("funcs." + funcName + " = function(){ handleShortcut('" + key + "'); }");
            

            var command_id = "pk.charShortcuts" + key;
            var name = "char: " + shortcuts[key];

            //Register Command
            CommandManager.register(name, command_id, funcs[funcName]);

            var keys = key.replace(/_/g, '-');
            //add menu item and shortcut
            menu.addMenuItem(command_id, keys);

            log("registered command with command id-" + command_id);

       }
    }
    
    log("Register commands")
    registerCommands(shortcuts);
    
});


