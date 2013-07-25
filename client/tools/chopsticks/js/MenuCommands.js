Chopsticks.menu.autopublish = true

Chopsticks.menu.blank = function () {

  var pageName = prompt('Name your page', Chopsticks.menu.nextName())
  if (!pageName)
    return null
  Chopsticks.menu.create(pageName, $('#ChopsticksBlankPage').text())
}


/**
 * Delete a page's history
 */
Chopsticks.menu.clearTimelinePrompt = function () {
  
  if (!confirm("Are you sure you want to erase the history of this page?"))
    return false

  var page = Chopsticks.stage.activePage
  Chopsticks.stage.close()
  Project.delete('timelines ' + page)
  Chopsticks.stage.open(page)
}


/**
 * @param {string} Name of the file
 * @param {string} A template to initialize the page with.
 * @return {string} The name of the created page
 */
Chopsticks.menu.create = function (name, template) {
  
  name = (name ? Permalink(name) : Chopsticks.menu.nextName())
  
  // page already exists
  if (Project.get('pages ' + name))
    return Flasher.error('A page named ' + name + ' already exists.')
  
  var page = new Space(template)
  var timeline = new Space()
  // If passed a template, make that the first "undo" step
  if (template) {
    var commit = new Space()
    commit.set('author', Cookie.email)
    commit.set('values', new Space(template))
    timeline.set(new Date().getTime(), commit)
  }
  
  Project.create('pages ' + name, page)
  Project.create('timelines ' + name, timeline)
  
  Chopsticks.stage.open(name)
  mixpanel.track("I created a new webpage")
  Chopsticks.menu.publish(name)
  return name
}

/**
 * Deletes a page.
 *
 * @param {string} Name of the file
 * @return {string} todo: why return a string?
 */
Chopsticks.menu.delete = function (name) {
  name = name || Chopsticks.stage.activePage
  // If its the currently open page, open the previous page first
  if (Chopsticks.stage.activePage === name)
    Chopsticks.stage.back()

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
Chopsticks.menu.duplicate = function (source, destination, skipPrompt) {
  
  source = source || Chopsticks.stage.activePage
  
  destination = Chopsticks.menu.nextName(destination || source)
  
  if (!skipPrompt) {
    destination = prompt('Name your new page', destination)
    if (!destination)
      return false
  }
  
  if (!Project.get('pages').get(source))
    return Flasher.error('Page ' + source + ' not found')
  
  mixpanel.track('I duplicated a page')
  
  // If we are duplicating a page thats not open, easy peasy
  if (source !== Chopsticks.stage.activePage)
    return Chopsticks.menu.create(destination, Project.get('pages').get(source))
  
  return Chopsticks.menu.create(destination, Chopsticks.page.toString())
}

/**
 * Get the next available name. For example untitled_1 or untitled_2
 *
 * @param {string} Optional prefix to add to the name. Defaults to untitled_
 * @return {string} The new name
 */
Chopsticks.menu.nextName = function (prefix) {
  var prefix = prefix || 'untitled'
  if (!Project.get('pages ' + prefix))
    return prefix
  for (var i = 1; i < 1000; i++) {
    if (!Project.get('pages ' + prefix + i))
      return prefix + i
  }
}

Chopsticks.menu.prettyPrint = true

Chopsticks.menu.publish = function (name) {
  var page = Project.get('pages ' + name).toString()
  var html = new Page(page).toHtml(function () {
    // File draft scrap
    if (this.get('draft') === 'true')
      return ''
    return this.div.toHtml()
    
  })
  
  if (Chopsticks.menu.prettyPrint)
    html = html_beautify(html)
  
  Explorer.set(name + '.html', html)
}

/**
 * Renames the currently open page.
 *
 * @param {string} New name
 * @return {string} todo: why return a string?
 */
Chopsticks.menu.rename = function (newName) {
  
  mixpanel.track('I renamed a page')
  
  newName = Permalink(newName)
  var oldName = Chopsticks.stage.activePage
  
  if (!newName.length)
    return Flasher.error('Name cannot be blank')
  
  // page already exists
  if (Project.get('pages ' + newName))
    return Flasher.error('A page named ' + newName + ' already exists.')  

  Project.rename('pages ' + oldName, 'pages ' + newName)
  Project.rename('timelines ' + oldName, 'timelines ' + newName)
  
  Chopsticks.stage.open(newName)
  
  mixpanel.track('I renamed a page')
  
  return ''

}

Chopsticks.menu.renamePrompt = function () {
  var name = prompt('Enter a new name', Chopsticks.stage.activePage)
  if (name)
    Chopsticks.menu.rename(name)
}

/**
 * Launches the spotlight page picker
 */
Chopsticks.menu.spotlight = function () {
  
  var name = prompt('Enter the name of the page to open...', '')
  if (name)
    Chopsticks.stage.open(name)
}


