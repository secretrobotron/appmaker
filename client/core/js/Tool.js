function Tool(name) {
  this.keys = []
  this.values = {}
  this.events = {}
  this._set('name', name)
  this._open = false
  Tool.tools.push(name)
  return this
}

Tool.tools = []

Tool.openTool = null

Tool.prototype = new Space()

Tool.prototype.close = function (name) {

  // Return false if already closed
  if (!this._open)
    return false
  
  this.trigger('close')

  this._open = false
  Tool.openTool = null
  
  $('.Tool').hide()
  
  if (name)
    window[name].open()
  
}

/**
 * @return {bool}
 */
Tool.prototype.isOpen = function () {
  return this._open
}

Tool.prototype.open = function () {

  // Return false if already open
  if (this._open)
    return false
  
  // Close any open Tool
  if (Tool.openTool)
    return Tool.openTool.close(this.get('name'))
  
  // On open event
  this.trigger('open')
  
  // We could probably remove this.
  $('.Tool#' + this.get('name')).show()
  
  
  Tool.openTool = this
  this._open = true

  // On ready event
  this.trigger('ready')

  mixpanel.track('I opened the ' + this.get('name') + ' tool')
  Screen.set('tool', this.get('name'))
}

Tool.prototype.restart = function () {
  this.close()
  this.open()
}

Tool.prototype.test = function () {
  var name = this.get('name')
  $.get('/nudgepad/tools/' + name + '/tests.html', function (data) {
    $('body').append(data)
    $('body').append('<script type="text/javascript" src="/nudgepad/tools/' + name + '/tests.js"></script>')
  })
}

Tool.prototype.toggle = function () {
  if (this._open)
    this.close()
  else
    this.open()
}
