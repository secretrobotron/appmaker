var Prototype = new Tool('Prototype')
Prototype.set('color', 'rgba(26, 134, 214, 1)')
Prototype.set('description', 'Design pages for your project.')

// What spot the maker is on the timeline for the current page
Prototype.page = new Page()
Prototype.edge = new Space()
Prototype.stage = {}
Prototype.stage.activePage = 'index'
// store.get('activePage')
Prototype.stage.selection = {}

Prototype.blank = function () {

  var page = new Space($('#PrototypeBlankPage').text())
  var pageName = prompt('Name your page', Prototype.nextName())
  if (!pageName)
    return null
  Prototype.create(pageName, page)
}

Prototype.blurThis = function (){
  $(this).blur()
}

/**
 *
 */
Prototype.clearTimelinePrompt = function () {
  
  if (!confirm("Are you sure you want to erase the history of this page?"))
    return false

  var page = Prototype.stage.activePage
  Prototype.stage.close()
  Project.delete('timelines ' + page)
  Prototype.stage.open(page)
}

/**
 * Creates a new page. todo: rename page param to edge
 *
 * @param {string} Name of the file
 * @param {Space} A first patch to initialize the page with.
 * @return {string} The name of the created page
 */
Prototype.create = function (name, template) {
  
  name = (name ? Permalink(name) : Prototype.nextName())
  
  // page already exists
  if (Project.get('pages ' + name))
    return Flasher.error('A page named ' + name + ' already exists.')
  
  var page = new Space()
  var timeline = new Space()
  if (template && template.toString().length > 2) {
    page = new Space(template.toString())
    var commit = new Space()
    commit.set('author', Cookie.email)
    commit.set('values', new Space(template.toString()))
    timeline.set(new Date().getTime(), commit)
  }
  
  Project.create('pages ' + name, page)
  Project.create('timelines ' + name, timeline)
  
  Prototype.stage.open(name)
  mixpanel.track("I created a new webpage")
  return name
}

/**
 * Deletes a page.
 *
 * @param {string} Name of the file
 * @return {string} todo: why return a string?
 */
Prototype.deletePage = function (name) {
  name = name || Prototype.stage.activePage
  // If its the currently open page, open the previous page first
  if (Prototype.stage.activePage === name)
    Prototype.stage.back()

  Project.delete('pages ' + name)
  Project.delete('timelines ' + name)
  
  Flasher.success('Deleted ' + name, 1000)
  mixpanel.track('I deleted a page')
  return ''
}

/**
 * Duplicates the current open page.
 *
 * @param {string} name of page to duplicate. Defaults to current page.
 * @param {string} name of new page. Defaults to source + 1
 * @param {bool} We need to skip prompting for unit testing.
 * @return {string} Name of new page
 */
Prototype.duplicatePage = function (source, destination, skipPrompt) {
  
  source = source || Prototype.stage.activePage
  
  destination = Prototype.nextName(destination || source)
  
  if (!skipPrompt) {
    destination = prompt('Name your new page', destination)
    if (!destination)
      return false
  }
  
  if (!Project.get('pages').get(source))
    return Flasher.error('Page ' + source + ' not found')
  
  mixpanel.track('I duplicated a page')
  
  // If we are duplicating a page thats not open, easy peasy
  if (source !== Prototype.stage.activePage)
    return Prototype.create(destination, Project.get('pages').get(source))
  
  return Prototype.create(destination, Prototype.page)
}

Prototype.getPageDimensions = function (page) {
  page = new Page(page)
  page._static = true
  var iframe = $('<iframe class="deleteMe" style="position: fixed; right: 0px; top: 0px;"></iframe>')
  iframe.attr('frameborder', 0)
  iframe.attr('scrolling', 'no')
  iframe.css('width', 1)
  iframe.css('height', 1)
  $('#Temp').append(iframe)
  iframe.contents().find('body').append(page.toHtml())
  var box = {}
  var first = false
  iframe.contents().find('.scrap').each(function () {
    var left
    var right
    var _top
    var bottom
    if (!first) {
      box.left = $(this).position().left
      box.right = box.left + $(this).outerWidth()
      box.top = $(this).position().top
      box.bottom = box.top + $(this).outerHeight()
      first = true
    }
    else {
      left = $(this).position().left
      right = left + $(this).outerWidth()
      _top = $(this).position().top
      bottom = top + $(this).outerHeight()
      if (left < box.left)
        box.left = left
      if (right > box.right)
        box.right = right
      if (_top < box.top)
        box.top = _top
      if (bottom > box.bottom)
        box.bottom = bottom
    }
  })
  box.height = box.bottom - box.top
  box.width = box.right - box.left
  $('.deleteMe').remove()
  return box
}

Prototype.import = function (url) {
  $.get('/nudgepad.import/' + url, {}, function (data) {
    Prototype.page = new Page(data)
    Prototype.stage.commit()
    Prototype.stage.open(Prototype.stage.activePage)
  })
}

Prototype.importPrompt = function () {
  
  var url = prompt('Enter a url to import', 'http://')
  if (!url)
    return false
  
  if (!url.match(/^https?\:\/\//))
    url = 'http://' + url
  Prototype.import(url)
  
}

/**
 * Get the next available name. For example untitled_1 or untitled_2
 *
 * @param {string} Optional prefix to add to the name. Defaults to untitled_
 * @return {string} The new name
 */
Prototype.nextName = function (prefix) {
  var prefix = prefix || 'untitled'
  if (!(prefix in Project.values.pages.values))
    return prefix
  for (var i = 1; i < 1000; i++) {
    if (!(prefix + i in Project.values.pages.values))
      return prefix + i
  }
}

/**
 */
Prototype.oncut = function(e) {
  
  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  if (!Prototype.stage.selection.exists())
    return true
    
  if (e.clipboardData) {
    e.preventDefault()
    e.clipboardData.setData(
        'text/xcustom', Prototype.stage.selection.toSpace().toString())

    var setStatus = e.clipboardData.setData(
        'text/plain', Prototype.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  if (window.clipboardData) {
    e.returnValue = false
    var setStatus = window.clipboardData.setData(
      'Text', Prototype.stage.selection.toSpace().toString())
    console.log('setData: ' + setStatus)
  }
  Prototype.stage.selection.delete()
  Prototype.stage.commit()
  mixpanel.track('I cut something')
}

/**
 * Allows you to drag and drop files from finder onto the page.
 * Only supports 1 file at a time for now. And chrome. Very limited.
 */
Prototype.ondrop = function(e) {
  mixpanel.track('I dropped a file onto the page')
  var reader = new FileReader()
  reader.onload = function(evt) {
    var space = new Space(
      "tag img\n" +
      "src " + evt.target.result +
      "\nstyle" +
      "\n width auto" +
      "\n height auto")
    var scraps = new Space().set('scrap1', space)
    Prototype.stage.insert(scraps)
  }
  reader.readAsDataURL(e.dataTransfer.files[0])
  e.preventDefault()
}

Prototype.stopProp = function(event) {
  event.stopPropagation()
}

Prototype.stopPropagation = function(event) {
  if (event.originalEvent.touches.length > 1) {
    event.stopPropagation()
  }
}

Prototype.preventDefault = function(event) {
  if (event.originalEvent.touches.length == 1) {
    event.preventDefault()
  }
}

/**
 * Start editing text when maker enters a character key.
 *
 * @param {object} keydown event.
 * @return {bool} Allow propagation unless we start editing.
 */
Prototype.onkeydown = function (event) {
  // if maker is typing in a div or input already dont do anything
  if ($('input:focus, div:focus, textarea:focus, a:focus').length != 0)
    return true
  // allow control key combos to pass through
  if (event.ctrlKey || event.metaKey || event.shiftKey)
    return true
  // if a f key or something dont return.
  if ((event.keyCode < 48 && event.keyCode != 32) || event.keyCode > 90)
    return true
  // if no subject return
  if (!$('.selection').length)
    return true
  // if an input or something return true
  if ($('.selection').is("input") || $('.selection').is("textarea"))
    return true
  // trigger edit event on the scrap
  $('.selection').scrap().edit()
}

Prototype.onresize = function () {
  // Update all handles on resize
  $('.handle').trigger('update')
}

/**
 * Renames the currently open page.
 *
 * @param {string} New name
 * @return {string} todo: why return a string?
 */
Prototype.renamePage = function (newName) {
  
  mixpanel.track('I renamed a page')
  
  newName = Permalink(newName)
  var oldName = Prototype.stage.activePage
  
  if (!newName.length)
    return Flasher.error('Name cannot be blank')
  
  // page already exists
  if (Project.get('pages ' + newName))
    return Flasher.error('A page named ' + newName + ' already exists.')  

  Project.rename('pages ' + oldName, 'pages ' + newName)
  Project.rename('timelines ' + oldName, 'timelines ' + newName)
  
  Prototype.stage.open(newName)
  
  mixpanel.track('I renamed a page')
  
  return ''

}

Prototype.renamePrompt = function () {
  var name = prompt('Enter a new name', Prototype.stage.activePage)
  if (name)
    Prototype.renamePage(name)
}

Prototype.returnFalse = function (){
  return false
}

/**
 * Launches the spotlight page picker
 */
Prototype.spotlight = function () {
  
  var name = prompt('Enter the name of the page to open...', '')
  if (name)
    Prototype.stage.open(name)
}


