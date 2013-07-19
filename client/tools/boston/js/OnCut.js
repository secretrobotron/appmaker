/**
 */
Boston.oncut = function(e) {
  
  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  if (!Boston.stage.selection.exists())
    return true
    
  if (e.clipboardData) {
    e.preventDefault()
    e.clipboardData.setData(
        'text/xcustom', Boston.stage.selection.toSpace().toString())

    var setStatus = e.clipboardData.setData(
        'text/plain', Boston.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  if (window.clipboardData) {
    e.returnValue = false
    var setStatus = window.clipboardData.setData(
      'Text', Boston.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  Boston.stage.selection.delete()
  Boston.stage.commit()
  mixpanel.track('I cut something')
}

