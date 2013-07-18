Prototype.trackShortcuts  = function (key) {
  mixpanel.track('I used the Prototype keyboard shortcut ' +  key)
}


/**
 * We manually add some shortcuts to certain functions.
 * This clearly could be cleaned up.
 */
Prototype.shortcuts = {}
Prototype.shortcuts['meta+shift+p'] = Prototype.stage.selection.patchPrompt

Prototype.shortcuts['ctrl+a'] = Prototype.stage.selectAll
Prototype.shortcuts['meta+a'] = Prototype.stage.selectAll

Prototype.shortcuts['meta+p'] = function () { window.open(Prototype.stage.activePage + '.html?' + new Date().getTime(), 'published') }


Prototype.shortcuts['meta+shift+left'] = Prototype.stage.selection.alignLeft
Prototype.shortcuts['meta+shift+right'] = Prototype.stage.selection.alignRight
Prototype.shortcuts['meta+shift+up'] = Prototype.stage.selection.alignTop
Prototype.shortcuts['meta+shift+down'] = Prototype.stage.selection.alignBottom

Prototype.shortcuts['meta+shift+v'] = Prototype.stage.selection.distributeVertical
Prototype.shortcuts['meta+shift+h'] = Prototype.stage.selection.distributeHorizontal
Prototype.shortcuts['shift+d'] = Prototype.stage.selection.distributeHorizontal

Prototype.shortcuts['alt+o'] = Explorer.quickEdit

Prototype.deleteShortcut = function () { Prototype.stage.selection.delete(); Prototype.stage.commit() }
Prototype.shortcuts['delete'] = Prototype.deleteShortcut
Prototype.shortcuts['backspace'] = Prototype.deleteShortcut

Prototype.shortcuts['ctrl+d'] = Prototype.stage.selection.duplicate
Prototype.shortcuts['meta+d'] = Prototype.stage.selection.duplicate

Prototype.editSourceToggle = function () { ($('.selection').length ? Prototype.stage.selection.editSource() : Prototype.stage.editSource())}
Prototype.shortcuts['ctrl+u'] = Prototype.editSourceToggle
Prototype.shortcuts['meta+u'] = Prototype.editSourceToggle

Prototype.shortcuts['meta+shift+u'] = Prototype.codePanel.toggle

Prototype.shortcuts['meta+e'] = Prototype.stage.selection.editProperty


Prototype.shortcuts['meta+l'] = Prototype.stage.selection.editLoop

Prototype.shortcuts['shift+space'] = function () {
  var command = prompt('Enter a command')
  if (!command)
    return false
  if (command.match(/^(w|width) (.*)/)) {
    var match = command.match(/^(w|width) (.*)/)
    Prototype.stage.selection.css('width ' + match[2])
  }
}

Prototype.shortcuts['meta+backspace'] = Prototype.deletePage

Prototype.shortcuts['meta+o'] = Prototype.spotlight
Prototype.shortcuts['ctrl+o'] = Prototype.spotlight


Prototype.shortcuts['ctrl+n'] = Prototype.blank
Prototype.shortcuts['meta+n'] = Prototype.blank

Prototype.shortcuts['esc'] = Prototype.stage.selection.clear

Prototype.shortcuts['shift+n'] = Prototype.duplicatePage

Prototype.shortcuts['up'] = function (){Prototype.stage.selection.move(0, -1)}
Prototype.shortcuts['left'] = function (){Prototype.stage.selection.move(-1, 0)}
Prototype.shortcuts['down'] = function (){Prototype.stage.selection.move(0, 1)}
Prototype.shortcuts['right'] = function (){Prototype.stage.selection.move(1, 0)}

Prototype.shortcuts['shift+up'] = function (){Prototype.stage.selection.move(0, -10)}
Prototype.shortcuts['shift+left'] = function (){Prototype.stage.selection.move(-10, 0)}
Prototype.shortcuts['shift+down'] = function (){Prototype.stage.selection.move(0, 10)}
Prototype.shortcuts['shift+right'] = function (){Prototype.stage.selection.move(10, 0)}

Prototype.shortcuts['alt+left'] = Prototype.stage.back
Prototype.shortcuts['alt+right'] = Prototype.stage.forward

Prototype.shortcuts['ctrl+z'] = Prototype.stage.undo
Prototype.shortcuts['meta+z'] = Prototype.stage.undo
Prototype.shortcuts['meta+shift+z'] = Prototype.stage.redo
Prototype.shortcuts['meta+y'] = Prototype.stage.redo
Prototype.shortcuts['ctrl+y'] = Prototype.stage.redo
Prototype.shortcuts['meta+shift+s'] = Prototype.stage.selection.cssPrompt

