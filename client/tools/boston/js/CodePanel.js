Boston.codePanel = {}

Boston.codePanel.livePreview = false
Boston.codePanel.livePreviewTimeout = false
Boston.codePanel.livePreviewStart = function () {
  clearTimeout(Boston.codePanel.livePreviewTimeout)
  Boston.codePanel.livePreviewTimeout = setTimeout('Boston.codePanel.livePreview()', 500)
}
Boston.codePanel.livePreview = function () {
  var space = new Space($('#BostonCodePanel').val())
  if (Boston.stage.selection.exists()) {
    Boston.stage.selection.clear()
  }
//    Boston.page.patch(Boston.stage.selection.captured.diff(space))
//    Boston.stage.render()
//  } else {
    Boston.page = new Page(space)
    Boston.stage.render()
//  }
}

Boston.codePanel.close = function () {
  $('#BostonCodePanel').hide()
  $('#BostonStage').css('padding-left', Boston.codePanel.currentPadding)
  Boston.off('selection', Boston.codePanel.load)
  Boston.off('stage', Boston.codePanel.load)
}

Boston.codePanel.isOpen = function () {
  return $('#BostonCodePanel:visible').length > 0
}

Boston.codePanel.load = function () {
  var textarea = $('#BostonCodePanel')
  // todo: allow for just showing of selection
//  if (Boston.stage.selection.exists()) {
//    Boston.stage.selection.clear()
//    Boston.stage.selection.capture()
//    Boston.stage.selection.save()
//    textarea.val(Boston.stage.selection.toSpace().toString())
//  } else
  textarea.val(Boston.page.toString())
}

Boston.codePanel.open = function () {
  var textarea = $('#BostonCodePanel')
  textarea.show()
  Boston.codePanel.currentPadding = $('#BostonStage').css('padding-left')
  $('#BostonStage').css('padding-left', '40%')
  Boston.codePanel.load()
  textarea.on('keyup', Boston.codePanel.livePreviewStart)
  textarea.on('blur', Boston.stage.commit)
  textarea.on('tap mousedown click slide slidestart slideend mouseup', function (event) {
    event.stopPropagation()
  })
  Boston.on('selection', Boston.codePanel.load)
  Boston.on('stage', Boston.codePanel.load)
}

Boston.codePanel.toggle = function () {
  if (Boston.codePanel.isOpen())
    Boston.codePanel.close()
  else
    Boston.codePanel.open()
}
