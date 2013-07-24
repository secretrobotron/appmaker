Designer.trackShortcuts  = function (key) {
  mixpanel.track('I used the Designer keyboard shortcut ' +  key)
}


/**
 * We manually add some shortcuts to certain functions.
 * This clearly could be cleaned up.
 */
Designer.shortcuts = {}
Designer.shortcuts['meta+shift+p'] = Designer.stage.selection.patchPrompt

Designer.shortcuts['ctrl+a'] = Designer.stage.selectAll
Designer.shortcuts['meta+a'] = Designer.stage.selectAll

Designer.shortcuts['meta+p'] = function () { window.open(Designer.stage.activePage + '.html?' + new Date().getTime(), 'published') }


Designer.shortcuts['meta+shift+left'] = Designer.stage.selection.alignLeft
Designer.shortcuts['meta+shift+right'] = Designer.stage.selection.alignRight
Designer.shortcuts['meta+shift+up'] = Designer.stage.selection.alignTop
Designer.shortcuts['meta+shift+down'] = Designer.stage.selection.alignBottom

Designer.shortcuts['meta+shift+v'] = Designer.stage.selection.distributeVertical
Designer.shortcuts['meta+shift+h'] = Designer.stage.selection.distributeHorizontal
Designer.shortcuts['shift+d'] = Designer.stage.selection.distributeHorizontal

Designer.shortcuts['alt+o'] = Explorer.quickEdit

Designer.deleteShortcut = function () { Designer.stage.selection.delete(); Designer.stage.commit() }
Designer.shortcuts['delete'] = Designer.deleteShortcut
Designer.shortcuts['backspace'] = Designer.deleteShortcut

Designer.shortcuts['ctrl+d'] = Designer.stage.selection.duplicate
Designer.shortcuts['meta+d'] = Designer.stage.selection.duplicate

Designer.editSourceToggle = function () { ($('.selection').length ? Designer.stage.selection.editSource() : Designer.stage.editSource())}
Designer.shortcuts['ctrl+u'] = Designer.editSourceToggle
Designer.shortcuts['meta+u'] = Designer.editSourceToggle

Designer.shortcuts['meta+shift+u'] = Designer.codePanel.toggle

Designer.shortcuts['meta+e'] = Designer.stage.selection.editProperty


Designer.shortcuts['meta+l'] = Designer.stage.selection.editLoop

Designer.shortcuts['shift+space'] = function () {
  var command = prompt('Enter a command')
  if (!command)
    return false
  if (command.match(/^(w|width) (.*)/)) {
    var match = command.match(/^(w|width) (.*)/)
    Designer.stage.selection.css('width ' + match[2])
  }
}

Designer.shortcuts['meta+backspace'] = Designer.menu.delete

Designer.shortcuts['meta+o'] = Designer.menu.spotlight
Designer.shortcuts['ctrl+o'] = Designer.menu.spotlight


Designer.shortcuts['ctrl+n'] = Designer.menu.blank
Designer.shortcuts['meta+n'] = Designer.menu.blank

Designer.shortcuts['esc'] = Designer.stage.selection.clear

Designer.shortcuts['shift+n'] = Designer.menu.duplicate

Designer.shortcuts['up'] = function (){Designer.stage.selection.move(0, -1)}
Designer.shortcuts['left'] = function (){Designer.stage.selection.move(-1, 0)}
Designer.shortcuts['down'] = function (){Designer.stage.selection.move(0, 1)}
Designer.shortcuts['right'] = function (){Designer.stage.selection.move(1, 0)}

Designer.shortcuts['shift+up'] = function (){Designer.stage.selection.move(0, -10)}
Designer.shortcuts['shift+left'] = function (){Designer.stage.selection.move(-10, 0)}
Designer.shortcuts['shift+down'] = function (){Designer.stage.selection.move(0, 10)}
Designer.shortcuts['shift+right'] = function (){Designer.stage.selection.move(10, 0)}

Designer.shortcuts['alt+left'] = Designer.stage.back
Designer.shortcuts['alt+right'] = Designer.stage.forward

Designer.shortcuts['ctrl+z'] = Designer.stage.undo
Designer.shortcuts['meta+z'] = Designer.stage.undo
Designer.shortcuts['meta+shift+z'] = Designer.stage.redo
Designer.shortcuts['meta+y'] = Designer.stage.redo
Designer.shortcuts['ctrl+y'] = Designer.stage.redo
Designer.shortcuts['meta+shift+s'] = Designer.stage.selection.cssPrompt

