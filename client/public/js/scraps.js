// If Node.js, import dependencies.
if (typeof exports !== 'undefined')
  var Space = require('space')

function Element (tag, attrs) {
  this.tag = tag
  this.attrs = attrs || {}
  this.content = ''
  return this
}

Element.prototype.addClass = function (className) {
  if (this.attrs['class'])
    this.attrs['class'] += ' ' + className
  else
    this.attrs['class'] = className
}

Element.prototype.append = function (string) {
  this.content += string
}

Element.prototype.attr = function (key, value) {
  this.attrs[key] = value
}

Element.prototype.html = function (string) {
  this.content += string
}

Element.prototype.toHtml = function () {
  var string = '<' + this.tag
  
  for (var i in this.attrs) {
    if (!this.attrs.hasOwnProperty(i))
      continue
    string += ' ' + i + '="' + this.attrs[i] + '"' 
  }
  
  if (this.tag === 'meta') {
    string += ' content="' + this.content + '">'
  }
  else {
    string += '>' + this.content

    string += '</' + this.tag + '>'    
  }

  return string
}

/**
 * Scrap constructor
 * 
 * @param {string}
 * @param {Space}
 */
function Scrap (path, space) {
  this.path = path
  this.id = path.split(/ /g).pop() // Last part of path is id
  this.clear()
  if (!(space instanceof Space))
    space = new Space(space)
  this.patch(space)
  // load content?
  var children = this.get('scraps')
  if (children instanceof Space) {
    children.each(function (id, scrap){
      children._set(id, new Scrap(path + ' ' + id, scrap))
    })
  }
  
  return this
}

/**
 * Turns a style object like color red into css like .scrap { color : red; }
 * Also evals any variables.
 *
 * @param {string} DOM selector. .class #id etc.
 * @param {object} Name/values of css
 * @param {object} Context to evaluate any variables in
 * @return {string} 
 */
Scrap.styleToCss = function (selector, obj) {
  var string = selector + ' {\n'
  for (var cssProperty in obj) {
    if (!obj.hasOwnProperty(cssProperty))
      continue
    // Add colon and semicolon back on
    string += '  ' + cssProperty + ' : ' + obj[cssProperty].toString().replace(/\;$/, '') + ';\n'
  }
  string += '}\n'
  return string
}

/**
 * Turns a style object like color red into color: red;
 * Also evals any variables.
 *
 * @param {object} Name/values of css
 * @param {object} Context to evaluate any variables in
 * @return {string} 
 */
Scrap.styleToInline = function (obj) {
  var string = ''
  for (var cssProperty in obj) {
    if (!obj.hasOwnProperty(cssProperty))
      continue
    // Add colon and semicolon back on
    string += cssProperty + ': ' + obj[cssProperty].toString().replace(/\;$/, '') + '; '
  }
  return string
}

// Scrap extends Space.
Scrap.prototype = new Space()

/**
 * @return {Scrap}
 */
Scrap.prototype.clone = function (id) {
  return new Scrap(id, this)
}

Scrap.prototype.selector = function () {
  return '#' + this.path.replace(/ /g, ' #')
}

Scrap.prototype.setChildren = function (filter) {
  // If recursive
  var children = this.get('scraps')
  
  if (!children)
    return this
  
  var parent = this
  children.each(function (id, scrap) {
    parent.div.html(scrap.toHtml(filter))
  })
  return this
}

/**
 * Set the innerHTML.
 *
 * @param {object} Context to evaluate any variables in.
 */
Scrap.prototype.setContent = function () {
  
  // If leaf node
  if (this.get('content'))
    this.div.html(this.get('content'))
  
  // If styles node
  var styles = this.get('styles')
  if (styles && styles instanceof Space) {
    var div = this.div
    styles.each(function (key, value) {
      div.html(Scrap.styleToCss(key, value.values))
    })
  }
  return this
}

/**
 * Creates this.div. Sets the tag and HTML attrs of the dom element.
 *
 * @param {object} Context to evaluate any variables in.
 */
Scrap.prototype.setTag = function () {
  
  tag = (this.values.tag ? this.values.tag : 'div')
  this.div = new Element(tag)
  
}


Scrap.prototype.setProperties = function (name) {
  this.each(function (property, value) {
    // Skip certain properties
    if (property.match(/^(scraps|content|tag|on.*|style)$/))
      return true
    this.setProperty(property)
  })
}

/**
 * Set the standard HTML properties like value, title, et cetera.
 *
 * @param {string} Name of the property to set
 * @param {object} Context to evaluate the variables in.
 */
Scrap.prototype.setProperty = function (name) {
  if (this.get(name))
    this.div.attr(name, this.get(name))
}

/**
 * Return all javascript necessary for scraps operation
 *
 * todo: refacor this
 *
 * @return {string}
 */
Scrap.prototype.setHandlers = function () {

  this.each(function (event, value) {
    // Events all follow onclick onfocus on*
    if (!event.match(/^on.*$/))
      return true
    this.div.attr(event, value)
  })
}

/**
 * Return all css for a scrap.
 *
 * @param {object} Context to evaluate any variables in.
 * @return {string}
 */
Scrap.prototype.setStyle = function () {
  if (!this.values.style)
    return null
  if (!(this.values.style instanceof Space))
    return this.div.attr('style', this.values.style)
  this.div.attr('style', Scrap.styleToInline(this.values.style.values))
}

/**
 * Returns the HTML for a scrap without CSS or Script.
 *
 * @param {object} Context to evaluate any variables in.
 * @return {string}
 */
Scrap.prototype.toHtml = function (filter) {
  this.setTag()
  this.div.attr('id', this.id)
  this.setProperties()
  this.setContent()
  this.setChildren(filter)
  this.setStyle()
  this.setHandlers()
  if (filter)
    return filter.call(this)
  return this.div.toHtml()
}

/**
 * Constructor.
 *
 * @param {Space} Any values to load from.
 */
function Page (space) {
  
  this.clear()
  
  if (space)
    this.patch(space)
  
  this.loadScraps()
  return this
}

// Page inherits from Space
Page.prototype = new Space()

/**
 * Does a deep copy
 *
 * @return {Page}
 */
Page.prototype.clone = function () {
  return new Page(this.values)
}

/**
 * Converts any scraps from Space to class of Scrap.
 */
Page.prototype.loadScraps = function () {
  // load all scraps
  var page = this
  this.each(function (id, value) {
    page._set(id, new Scrap(id, value))
  })
}


/**
 * Get the full HTML of the page.
 *
 * @param {object} Context to evaluate variables in.
 * @return {string}
 */
Page.prototype.toHtml = function (filter) {

  // todo: separate css option
  // todo: separate javascript option
  var html = '<!doctype html>\n<html>'
  
  // Get all the html for every scrap
  // Todo: support after property
  this.each(function (id, scrap) {
    html += '\n  ' + scrap.toHtml(filter)
  })
  html += '\n</html>'
  return html
}

// If Node.js, export as a module.
if (typeof exports !== 'undefined')
  module.exports = Page;

