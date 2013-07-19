Boston.trackShortcuts  = function (key) {
  mixpanel.track('I used the Boston keyboard shortcut ' +  key)
}


/**
 * We manually add some shortcuts to certain functions.
 * This clearly could be cleaned up.
 */
Boston.shortcuts = {}
Boston.shortcuts['meta+shift+p'] = Boston.stage.selection.patchPrompt

Boston.shortcuts['ctrl+a'] = Boston.stage.selectAll
Boston.shortcuts['meta+a'] = Boston.stage.selectAll

Boston.shortcuts['meta+p'] = function () { window.open(Boston.stage.activePage + '.html?' + new Date().getTime(), 'published') }


Boston.shortcuts['meta+shift+left'] = Boston.stage.selection.alignLeft
Boston.shortcuts['meta+shift+right'] = Boston.stage.selection.alignRight
Boston.shortcuts['meta+shift+up'] = Boston.stage.selection.alignTop
Boston.shortcuts['meta+shift+down'] = Boston.stage.selection.alignBottom

Boston.shortcuts['meta+shift+v'] = Boston.stage.selection.distributeVertical
Boston.shortcuts['meta+shift+h'] = Boston.stage.selection.distributeHorizontal
Boston.shortcuts['shift+d'] = Boston.stage.selection.distributeHorizontal

Boston.shortcuts['alt+o'] = Explorer.quickEdit

Boston.deleteShortcut = function () { Boston.stage.selection.delete(); Boston.stage.commit() }
Boston.shortcuts['delete'] = Boston.deleteShortcut
Boston.shortcuts['backspace'] = Boston.deleteShortcut

Boston.shortcuts['ctrl+d'] = Boston.stage.selection.duplicate
Boston.shortcuts['meta+d'] = Boston.stage.selection.duplicate

Boston.editSourceToggle = function () { ($('.selection').length ? Boston.stage.selection.editSource() : Boston.stage.editSource())}
Boston.shortcuts['ctrl+u'] = Boston.editSourceToggle
Boston.shortcuts['meta+u'] = Boston.editSourceToggle

Boston.shortcuts['meta+shift+u'] = Boston.codePanel.toggle

Boston.shortcuts['meta+e'] = Boston.stage.selection.editProperty


Boston.shortcuts['meta+l'] = Boston.stage.selection.editLoop

Boston.shortcuts['shift+space'] = function () {
  var command = prompt('Enter a command')
  if (!command)
    return false
  if (command.match(/^(w|width) (.*)/)) {
    var match = command.match(/^(w|width) (.*)/)
    Boston.stage.selection.css('width ' + match[2])
  }
}

Boston.shortcuts['meta+backspace'] = Boston.menu.delete

Boston.shortcuts['meta+o'] = Boston.menu.spotlight
Boston.shortcuts['ctrl+o'] = Boston.menu.spotlight


Boston.shortcuts['ctrl+n'] = Boston.menu.blank
Boston.shortcuts['meta+n'] = Boston.menu.blank

Boston.shortcuts['esc'] = Boston.stage.selection.clear

Boston.shortcuts['shift+n'] = Boston.menu.duplicate

Boston.shortcuts['up'] = function (){Boston.stage.selection.move(0, -1)}
Boston.shortcuts['left'] = function (){Boston.stage.selection.move(-1, 0)}
Boston.shortcuts['down'] = function (){Boston.stage.selection.move(0, 1)}
Boston.shortcuts['right'] = function (){Boston.stage.selection.move(1, 0)}

Boston.shortcuts['shift+up'] = function (){Boston.stage.selection.move(0, -10)}
Boston.shortcuts['shift+left'] = function (){Boston.stage.selection.move(-10, 0)}
Boston.shortcuts['shift+down'] = function (){Boston.stage.selection.move(0, 10)}
Boston.shortcuts['shift+right'] = function (){Boston.stage.selection.move(10, 0)}

Boston.shortcuts['alt+left'] = Boston.stage.back
Boston.shortcuts['alt+right'] = Boston.stage.forward

Boston.shortcuts['ctrl+z'] = Boston.stage.undo
Boston.shortcuts['meta+z'] = Boston.stage.undo
Boston.shortcuts['meta+shift+z'] = Boston.stage.redo
Boston.shortcuts['meta+y'] = Boston.stage.redo
Boston.shortcuts['ctrl+y'] = Boston.stage.redo
Boston.shortcuts['meta+shift+s'] = Boston.stage.selection.cssPrompt

