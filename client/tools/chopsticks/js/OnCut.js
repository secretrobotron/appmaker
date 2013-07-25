/**
 */
Chopsticks.oncut = function(e) {
  
  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  if (!Chopsticks.stage.selection.exists())
    return true
    
  if (e.clipboardData) {
    e.preventDefault()
    e.clipboardData.setData(
        'text/xcustom', Chopsticks.stage.selection.toSpace().toString())

    var setStatus = e.clipboardData.setData(
        'text/plain', Chopsticks.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  if (window.clipboardData) {
    e.returnValue = false
    var setStatus = window.clipboardData.setData(
      'Text', Chopsticks.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  Chopsticks.stage.selection.delete()
  Chopsticks.stage.commit()
  mixpanel.track('I cut something')
}

