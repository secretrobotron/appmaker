/**
 */
Chopsticks.oncopy = function(event) {
  
  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  if (!Chopsticks.stage.selection.exists())
    return true

  if (event.clipboardData) {
    event.preventDefault()
    event.clipboardData.setData(
        'text/xcustom', Chopsticks.stage.selection.toSpace().toString())

    var setStatus = event.clipboardData.setData(
        'text/plain', Chopsticks.stage.selection.toSpace().toString())
  }
  
  // whats this for, IE?
  if (window.clipboardData) {
    event.returnValue = false
    var setStatus = window.clipboardData.setData(
      'Text', Chopsticks.stage.selection.toSpace().toString())
  }
  mixpanel.track('I copied something')
}

