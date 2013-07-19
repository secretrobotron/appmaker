Boston.contentEditor = {}

/**
 * Fires when a block being edited a blur occurs.
 */
Boston.contentEditor.onblur = function () {
  
  var scrap = $(this).scrap()
  scrap.set('content', $(this).html())

  // rebind the blocks
  $(this).off('tap mousedown slide slidestart hold slideend', Boston.contentEditor.killEvent)

  // remove the ability to edit & select text.
  $(this).removeAttr('contenteditable')

  // record the changes for undo/redo
  Boston.stage.commit()
  Boston.broadcastSelection()
}

/**
 * Focus and start editing the text of a block.
 *
 * @param {string} Scrap id
 * @param {bool} Whether to select all on focus
 */
Boston.contentEditor.focus = function (selector, selectAll) {
  
  
  // When focused, it's as if you have nothing selected. We're really going to do 
  // a patch instead
  Boston.stage.selection.clear()
  
  var element = $(selector)
  var scrap = element.scrap()  
  
  // If not suitable for contenteditable, pop prompt instead.
  if (!scrap.isContentEditable()) {
    
    var attr = 'content'
    var tag = scrap.values.tag
    
    if (tag && tag.match(/^(list)$/)) {
      Boston.stage.selection.clear()
      element.selectMe()
      Boston.stage.selection.editSource()
      return false
    }
    
    if (tag && tag.match(/^(textarea|input|password)$/))
      attr = 'placeholder'
    
    TextPrompt.open('Editing content for this block', scrap.get(attr), function (val) {
      scrap.set(attr, val)
      Boston.stage.commit()
      element.remove()
      scrap.render().element().selectMe()
    })
    return null
  }
  
  Boston.broadcastSelection(scrap.selector())

  // set element to editable
  element.attr('contenteditable', 'true')
  
  // stop propagation (todo: perhaps we could use these to make some sweet events!)
  element.on('tap slide slidestart hold slideend', Boston.contentEditor.killEvent)
  
  // on blur, remove all this stuff.
  element.on('blur', Boston.contentEditor.onblur)
  
  // focus the element
  element.focus()
  
  // move the cursor to the end of the element
  MoveCursorToEnd(element[0])

  // Select all
  if (selectAll)
    document.execCommand('selectAll',false,null)
}

/**
 * Stop propagation and prevent default by returning false.
 *
 * we name this instead of using an anonymous function so we can then remove it from
 * the element its bound to.
 *
 * @param {object} event
 * @return false.
 */
Boston.contentEditor.killEvent = function (event) {
  // 
  Boston.Mouse.down.stopPropagation()
  return false
}


