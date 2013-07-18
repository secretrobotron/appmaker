// Shim window.console for IE.
if (!window.console)
 window.console = {log: function() {}}

/**
 * The Editor. The main nudgepad namespace.
 *
 * @special Singleton
 */
var nudgepad = {}
nudgepad.isTesting = false
// In case we open multiple tabs
window.name = 'nudgepad'
var Query = ParseQueryString()
var Cookie = parseCookie(document.cookie)

/**
 * Requests the data from the server and loads the editor.
 */
nudgepad.main = function () {
  
  $.get('/nudgepad.project', function (space) {
    Project._patch(new Space(space))
    Project._patch('timelines', new Space())
    
    // We do this here because chrome is weird
    // Revert to a previously saved state
    window.addEventListener('popstate', function (event) {
      Launcher.openToolFromQueryString()
    })
    
    nudgepad.warnBeforeReload = true
    window.onbeforeunload = nudgepad.beforeUnload

    Launcher.openToolFromQueryString()
    
    $('#LoadingScreen').hide()
    
    // fetch other timelines in background for now
    // SLOW
    Explorer.downloadTimelines()
    
    nudgepad.askToRegister()
    nudgepad.benchmarkCreationTime()
    mixpanel.track('I opened NudgePad')
    
  })

}

nudgepad.askToRegister = function () {
  // Ask them to register the project if they haven't
  // We assume owner@projectname is the default name for now.
  // In the future we'll want to update that
  if (Cookie.email === ('owner@' + document.location.host))
    RegisterForm.open()
}

nudgepad.beforeUnload = function(e) {
  if (nudgepad.warnBeforeReload)
    return nudgepad.reloadMessage()
}

nudgepad.benchmarkCreationTime = function () {
  // Only do this once per project
  if (!Query.newProject && store.get('opens'))
    return true

  store.set('opens', 1)
  var howLongItTookToCreateThisProject = new Date().getTime() - Query.timestamp
  mixpanel.track('I created a new project', {
    'time' : howLongItTookToCreateThisProject
  })
  console.log('It took %sms to create this project', howLongItTookToCreateThisProject) 
}

nudgepad.reloadMessageOneTime = ''
nudgepad.reloadMessage = function () {
  var message
  if (message = nudgepad.reloadMessageOneTime) {
    nudgepad.reloadMessageOneTime = ''
    return message
  }
  return 'Are you sure you want to leave Nudgepad?'
}

nudgepad.restartCheck = function () {
  $.get('/nudgepad.started', {}, function (data) {
    if (!Project.get('started'))
      return true
    if (data !== Project.get('started')) {
      nudgepad.reloadMessageOneTime = 'Your project restarted. Please refresh the page.'
      location.reload()
    }
  })
}

window.onerror = function(message, url, lineNumber) {
  mixpanel.track('I got a javascript error')
  $('.nudgepad#JavascriptError').prepend('<div>Javascript Error: '+message+'</div>').show()
  //save error and send to server for example.
  return false
}



