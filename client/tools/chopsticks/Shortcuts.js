

/**
 * We manually add some shortcuts to certain functions.
 * This clearly could be cleaned up.
 */
Chopsticks.shortcuts = {}
Chopsticks.shortcuts['meta+shift+p'] = Chopsticks.stage.selection.patchPrompt

Chopsticks.shortcuts['ctrl+a'] = Chopsticks.stage.selectAll
Chopsticks.shortcuts['meta+a'] = Chopsticks.stage.selectAll

Chopsticks.shortcuts['meta+p'] = function () { window.open(Chopsticks.stage.activePage + '.html?' + new Date().getTime(), 'published') }


Chopsticks.shortcuts['meta+shift+left'] = Chopsticks.stage.selection.alignLeft
Chopsticks.shortcuts['meta+shift+right'] = Chopsticks.stage.selection.alignRight
Chopsticks.shortcuts['meta+shift+up'] = Chopsticks.stage.selection.alignTop
Chopsticks.shortcuts['meta+shift+down'] = Chopsticks.stage.selection.alignBottom

Chopsticks.shortcuts['meta+shift+v'] = Chopsticks.stage.selection.distributeVertical
Chopsticks.shortcuts['meta+shift+h'] = Chopsticks.stage.selection.distributeHorizontal
Chopsticks.shortcuts['shift+d'] = Chopsticks.stage.selection.distributeHorizontal

Chopsticks.shortcuts['alt+o'] = Explorer.quickEdit

Chopsticks.deleteShortcut = function () { Chopsticks.stage.selection.delete(); Chopsticks.stage.commit() }
Chopsticks.shortcuts['delete'] = Chopsticks.deleteShortcut
Chopsticks.shortcuts['backspace'] = Chopsticks.deleteShortcut

Chopsticks.shortcuts['ctrl+d'] = Chopsticks.stage.selection.duplicate
Chopsticks.shortcuts['meta+d'] = Chopsticks.stage.selection.duplicate

Chopsticks.editSourceToggle = function () { ($('.selection').length ? Chopsticks.stage.selection.editSource() : Chopsticks.stage.editSource())}
Chopsticks.shortcuts['ctrl+u'] = Chopsticks.editSourceToggle
Chopsticks.shortcuts['meta+u'] = Chopsticks.editSourceToggle

Chopsticks.shortcuts['meta+e'] = Chopsticks.stage.selection.editProperty


Chopsticks.shortcuts['meta+l'] = Chopsticks.stage.selection.editLoop

Chopsticks.shortcuts['shift+space'] = function () {
  var command = prompt('Enter a command')
  if (!command)
    return false
  if (command.match(/^(w|width) (.*)/)) {
    var match = command.match(/^(w|width) (.*)/)
    Chopsticks.stage.selection.css('width ' + match[2])
  }
}

Chopsticks.shortcuts['meta+backspace'] = Chopsticks.menu.delete

Chopsticks.shortcuts['meta+o'] = Chopsticks.menu.spotlight
Chopsticks.shortcuts['ctrl+o'] = Chopsticks.menu.spotlight


Chopsticks.shortcuts['ctrl+n'] = Chopsticks.menu.blank
Chopsticks.shortcuts['meta+n'] = Chopsticks.menu.blank

Chopsticks.shortcuts['esc'] = Chopsticks.stage.selection.clear

Chopsticks.shortcuts['shift+n'] = Chopsticks.menu.duplicate

Chopsticks.shortcuts['up'] = function (){Chopsticks.stage.selection.move(0, -1)}
Chopsticks.shortcuts['left'] = function (){Chopsticks.stage.selection.move(-1, 0)}
Chopsticks.shortcuts['down'] = function (){Chopsticks.stage.selection.move(0, 1)}
Chopsticks.shortcuts['right'] = function (){Chopsticks.stage.selection.move(1, 0)}

Chopsticks.shortcuts['shift+up'] = function (){Chopsticks.stage.selection.move(0, -10)}
Chopsticks.shortcuts['shift+left'] = function (){Chopsticks.stage.selection.move(-10, 0)}
Chopsticks.shortcuts['shift+down'] = function (){Chopsticks.stage.selection.move(0, 10)}
Chopsticks.shortcuts['shift+right'] = function (){Chopsticks.stage.selection.move(10, 0)}

Chopsticks.shortcuts['alt+left'] = Chopsticks.stage.back
Chopsticks.shortcuts['alt+right'] = Chopsticks.stage.forward

Chopsticks.shortcuts['ctrl+z'] = Chopsticks.stage.undo
Chopsticks.shortcuts['meta+z'] = Chopsticks.stage.undo
Chopsticks.shortcuts['meta+shift+z'] = Chopsticks.stage.redo
Chopsticks.shortcuts['meta+y'] = Chopsticks.stage.redo
Chopsticks.shortcuts['ctrl+y'] = Chopsticks.stage.redo
Chopsticks.shortcuts['meta+shift+s'] = Chopsticks.stage.selection.cssPrompt

