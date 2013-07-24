/**
 */
Designer.oncut = function(e) {
  
  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  if (!Designer.stage.selection.exists())
    return true
    
  if (e.clipboardData) {
    e.preventDefault()
    e.clipboardData.setData(
        'text/xcustom', Designer.stage.selection.toSpace().toString())

    var setStatus = e.clipboardData.setData(
        'text/plain', Designer.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  if (window.clipboardData) {
    e.returnValue = false
    var setStatus = window.clipboardData.setData(
      'Text', Designer.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  Designer.stage.selection.delete()
  Designer.stage.commit()
  mixpanel.track('I cut something')
}

