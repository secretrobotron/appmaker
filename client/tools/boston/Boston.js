var Boston = new Tool('Boston')
Boston.set('color', 'rgba(26, 134, 214, 1)')
Boston.set('description', 'Design pages for your project.')

// What spot the maker is on the timeline for the current page
Boston.page = new Page()
Boston.edge = new Space()
Boston.stage = {}
Boston.stage.activePage = 'index'
// store.get('activePage')
Boston.stage.selection = {}

Boston.blank = function () {

  var page = new Space($('#BostonBlankPage').text())
  var pageName = prompt('Name your page', Boston.nextName())
  if (!pageName)
    return null
  Boston.create(pageName, page)
}

Boston.blurThis = function (){
  $(this).blur()
}

/**
 *
 */
Boston.clearTimelinePrompt = function () {
  
  if (!confirm("Are you sure you want to erase the history of this page?"))
    return false

  var page = Boston.stage.activePage
  Boston.stage.close()
  Project.delete('timelines ' + page)
  Boston.stage.open(page)
}

/**
 * Creates a new page. todo: rename page param to edge
 *
 * @param {string} Name of the file
 * @param {Space} A first patch to initialize the page with.
 * @return {string} The name of the created page
 */
Boston.create = function (name, template) {
  
  name = (name ? Permalink(name) : Boston.nextName())
  
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
  
  Boston.stage.open(name)
  mixpanel.track("I created a new webpage")
  return name
}

/**
 * Deletes a page.
 *
 * @param {string} Name of the file
 * @return {string} todo: why return a string?
 */
Boston.deletePage = function (name) {
  name = name || Boston.stage.activePage
  // If its the currently open page, open the previous page first
  if (Boston.stage.activePage === name)
    Boston.stage.back()

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
Boston.duplicatePage = function (source, destination, skipPrompt) {
  
  source = source || Boston.stage.activePage
  
  destination = Boston.nextName(destination || source)
  
  if (!skipPrompt) {
    destination = prompt('Name your new page', destination)
    if (!destination)
      return false
  }
  
  if (!Project.get('pages').get(source))
    return Flasher.error('Page ' + source + ' not found')
  
  mixpanel.track('I duplicated a page')
  
  // If we are duplicating a page thats not open, easy peasy
  if (source !== Boston.stage.activePage)
    return Boston.create(destination, Project.get('pages').get(source))
  
  return Boston.create(destination, Boston.page)
}

Boston.import = function (url) {
  $.get('/nudgepad.import/' + url, {}, function (data) {
    Boston.page = new Page(data)
    Boston.stage.commit()
    Boston.stage.open(Boston.stage.activePage)
  })
}

Boston.importPrompt = function () {
  
  var url = prompt('Enter a url to import', 'http://')
  if (!url)
    return false
  
  if (!url.match(/^https?\:\/\//))
    url = 'http://' + url
  Boston.import(url)
  
}

/**
 * Get the next available name. For example untitled_1 or untitled_2
 *
 * @param {string} Optional prefix to add to the name. Defaults to untitled_
 * @return {string} The new name
 */
Boston.nextName = function (prefix) {
  var prefix = prefix || 'untitled'
  if (!(prefix in Project.values.pages.values))
    return prefix
  for (var i = 1; i < 1000; i++) {
    if (!(prefix + i in Project.values.pages.values))
      return prefix + i
  }
}

Boston.stopProp = function(event) {
  event.stopPropagation()
}

Boston.stopPropagation = function(event) {
  if (event.originalEvent.touches.length > 1) {
    event.stopPropagation()
  }
}

Boston.preventDefault = function(event) {
  if (event.originalEvent.touches.length == 1) {
    event.preventDefault()
  }
}

/**
 * Renames the currently open page.
 *
 * @param {string} New name
 * @return {string} todo: why return a string?
 */
Boston.renamePage = function (newName) {
  
  mixpanel.track('I renamed a page')
  
  newName = Permalink(newName)
  var oldName = Boston.stage.activePage
  
  if (!newName.length)
    return Flasher.error('Name cannot be blank')
  
  // page already exists
  if (Project.get('pages ' + newName))
    return Flasher.error('A page named ' + newName + ' already exists.')  

  Project.rename('pages ' + oldName, 'pages ' + newName)
  Project.rename('timelines ' + oldName, 'timelines ' + newName)
  
  Boston.stage.open(newName)
  
  mixpanel.track('I renamed a page')
  
  return ''

}

Boston.renamePrompt = function () {
  var name = prompt('Enter a new name', Boston.stage.activePage)
  if (name)
    Boston.renamePage(name)
}

Boston.returnFalse = function (){
  return false
}

/**
 * Launches the spotlight page picker
 */
Boston.spotlight = function () {
  
  var name = prompt('Enter the name of the page to open...', '')
  if (name)
    Boston.stage.open(name)
}


