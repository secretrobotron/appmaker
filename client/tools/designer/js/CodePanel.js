Designer.codePanel = {}

Designer.codePanel.livePreview = false
Designer.codePanel.livePreviewTimeout = false
Designer.codePanel.livePreviewStart = function () {
  clearTimeout(Designer.codePanel.livePreviewTimeout)
  Designer.codePanel.livePreviewTimeout = setTimeout('Designer.codePanel.livePreview()', 500)
}
Designer.codePanel.livePreview = function () {
  var space = new Space($('#DesignerCodePanel').val())
  if (Designer.stage.selection.exists()) {
    Designer.stage.selection.clear()
  }
//    Designer.page.patch(Designer.stage.selection.captured.diff(space))
//    Designer.stage.render()
//  } else {
    Designer.page = new Page(space)
    Designer.stage.render()
//  }
}

Designer.codePanel.close = function () {
  $('#DesignerCodePanel').hide()
  $('#DesignerStage').css('padding-left', Designer.codePanel.currentPadding)
  Designer.off('selection', Designer.codePanel.load)
  Designer.off('stage', Designer.codePanel.load)
}

Designer.codePanel.isOpen = function () {
  return $('#DesignerCodePanel:visible').length > 0
}

Designer.codePanel.load = function () {
  var textarea = $('#DesignerCodePanel')
  // todo: allow for just showing of selection
//  if (Designer.stage.selection.exists()) {
//    Designer.stage.selection.clear()
//    Designer.stage.selection.capture()
//    Designer.stage.selection.save()
//    textarea.val(Designer.stage.selection.toSpace().toString())
//  } else
  textarea.val(Designer.page.toString())
}

Designer.codePanel.open = function () {
  var textarea = $('#DesignerCodePanel')
  textarea.show()
  Designer.codePanel.currentPadding = $('#DesignerStage').css('padding-left')
  $('#DesignerStage').css('padding-left', '40%')
  Designer.codePanel.load()
  textarea.on('keyup', Designer.codePanel.livePreviewStart)
  textarea.on('blur', Designer.stage.commit)
  textarea.on('tap mousedown click slide slidestart slideend mouseup', function (event) {
    event.stopPropagation()
  })
  Designer.on('selection', Designer.codePanel.load)
  Designer.on('stage', Designer.codePanel.load)
}

Designer.codePanel.toggle = function () {
  if (Designer.codePanel.isOpen())
    Designer.codePanel.close()
  else
    Designer.codePanel.open()
}
