
/**
 * The Stage holds the current open page.
 * We do a frame so the ribbon doesnt overlap the work area.
 * Its not actually a frame though, just a div with scroll.
 */
Chopsticks.stage.version = 0 // how many steps in we are
Chopsticks.stage.percentElapsed = 100
Chopsticks.stage.currentView = store.get('ChopsticksView') || 'mobile'

/**
 * Open the previous page
 */
Chopsticks.stage.back = function () {
  Chopsticks.stage.open(Project.get('pages').prev(Chopsticks.stage.activePage))
}

Chopsticks.stage.close = function () {
  $('#ChopsticksStageBody').attr('style', '')
  $('#ChopsticksStageHead').html('')
  $(".scrap,#body").remove()
}

/**
 * Generates a Space of the change and posts it to the server.
 *
 * @return {string} todo: why return a string?
 */
Chopsticks.stage.commit = function () {
  
  var timestamp = new Date().getTime()
  
  // You are always committing against the edge.
  var diff = Chopsticks.edge.diff(Chopsticks.page)
  var diffOrder = Chopsticks.edge.diffOrder(Chopsticks.page)

  if (diff.isEmpty() && diffOrder.isEmpty()) {
    console.log('no change')
    return false
  }
  var commit = new Space()
  commit.set('author', Cookie.email)
  if (!diff.isEmpty())
    commit.set('values', new Space(diff.toString()))
  if (!diffOrder.isEmpty())
    commit.set('order', new Space(diffOrder.toString()))

  Chopsticks.stage.timeline.set(timestamp, commit)
  Chopsticks.edge = new Space(Chopsticks.page.toString())
  
  // A commit always advances the position index to the edge.
  Chopsticks.stage.version = Chopsticks.stage.timeline.keys.length
  
  Chopsticks.trigger('selection')
  Chopsticks.trigger('commit')
  Chopsticks.trigger('step')
  
  Project.set('pages ' + Chopsticks.stage.activePage, new Space(Chopsticks.page.toString()))
  Project.append('timelines ' + Chopsticks.stage.activePage + ' ' + timestamp, commit)
  
  // Todo: move this out of here
  if (Chopsticks.menu.autopublish)
    Chopsticks.menu.publish(Chopsticks.stage.activePage)
  
  return diff
}

Chopsticks.stage.dragAndDrop = function (scrap, callback) {
  
  if (typeof scrap === 'string')
    scrap = new Space(scrap)
  
  var halfWidth = 0
  var halfHeight = 0
  var height = scrap.get('head style html height') || 100
  var width = scrap.get('head style html height') || 140
  width = parseFloat(width)
  height = parseFloat(height)
  var halfWidth = Math.round(width/2)
  var halfHeight = Math.round(height/2)

  var pageLeft = $('#ChopsticksStageBody').offset().left
  var bodyScroll = $('#ChopsticksStage').scrollTop()
  
  var left = Chopsticks.Mouse.move.pageX - pageLeft - halfWidth
  var y = Chopsticks.Mouse.move.pageY - halfHeight + bodyScroll

  Chopsticks.stage.insert(scrap, true, left, y, null, callback)
}

/**
 * Advances position_index, advanced position.
 */
Chopsticks.stage.editSource = function () {
  TextPrompt.open('Enter code...', Chopsticks.page.toString(), function (val) {
    Chopsticks.page = new Space(val)
    Chopsticks.stage.commit()
    Chopsticks.stage.open(Chopsticks.stage.activePage)
  })
}

/**
 * Deletes all scraps from the page and DOM.
 */
Chopsticks.stage.erase = function () {
  Chopsticks.stage.selectAll()
  Chopsticks.stage.selection.delete()
  Chopsticks.stage.commit()
}

Chopsticks.stage.expand = function () {
  // Absolute positioned elements won't expand the container(it seems
  // that way anyway, maybe theres a better way to do it via css), so we need
  // to do it manually.
  var max = 700
  $('.scrap').each(function () {
    var bottom = $(this).position().top + $(this).outerHeight()
    if (bottom > max)
      max = bottom
  })

  $('#ChopsticksStageBody').css({
    'height' : max + 'px'
  })

}

/**
 * Open the next page
 */
Chopsticks.stage.forward = function () {
  Chopsticks.stage.open(Project.get('pages').next(Chopsticks.stage.activePage))
}

Chopsticks.stage.goto = function (version) {
  Chopsticks.stage.selection.save()
  Chopsticks.stage.selection.clear()
  if (version < 0)
    return false
  if (version > Chopsticks.stage.timeline.keys.length)
    return false
  
  // If we are going back in time, start from 0
  if (Chopsticks.stage.version > version) {
    Chopsticks.page = new Page()
    Chopsticks.stage.version = 0
  }
  for (var i = Chopsticks.stage.version; i < version; i++) {
    var timestamp = Chopsticks.stage.timeline.keys[i]
    var patch = Chopsticks.stage.timeline.values[timestamp].values.values
    var orderPatch = Chopsticks.stage.timeline.values[timestamp].values.order
    if (patch)
      Chopsticks.page.patch(patch.toString())
    if (orderPatch)
      Chopsticks.page.patchOrder(orderPatch.toString())
    Chopsticks.stage.version++
  }
  Chopsticks.trigger('step')
  Chopsticks.stage.render()
  Chopsticks.stage.selection.restore()
  Chopsticks.trigger('stage')
}

Chopsticks.stage.height = function () {
  return $(window).height() - $('#ChopsticksBar').outerHeight()
}

Chopsticks.stage.insertBody = function () {
  if (!Chopsticks.page.get('body')) {
    Chopsticks.page.set('body', new Scrap('body', 'tag body\nscraps\n'))
    Chopsticks.page.get('body').render()
  }
  if (!Chopsticks.page.get('body scraps'))
    Chopsticks.page.set('body scraps', new Space())
//    Chopsticks.page.set('body scraps', new Space())
//    level = Chopsticks.page.get('body scraps')
}

/**
 * Creates new scraps, commits them and adds them to DOM.
 *
 * @param {Space}  An optional space to initialize the scrap with.
 * @return {string} IDs of the new scraps
 */
Chopsticks.stage.insert = function (space, drag, xMove, yMove, center, callback) {
  
  if (!space)
    space = 'scrap\n content Hello world\n style\n  position absolute\n  top 10px\n  left 10px'
    
  // temporary fix for the revised scraps
  var patch = new Space(space.toString())
  Chopsticks.stage.selection.clear()
  
  Chopsticks.stage.insertBody()
  var level = Chopsticks.page.get('body scraps')
  
  
  // update the patch so there is no overwriting
  patch.each(function (key, value) {
    if (level.get(key)) {
      this.rename(key, Chopsticks.autokey(level, key))
    }
  })
  // now merge stage
  level.patch(patch)
  var selectors = []
  patch.each(function (key, value) {
    level.values[key] = new Scrap('body ' + key, value)
    var element = level.values[key].render().element()
    // Some elemeents arenet seleectable (titles, for example)
    if (element.length) {
      element.selectMe()
      selectors.push(level.values[key].selector())
    }
  })
  
  if (center) {
    var selection_dimensions = $('.selection').dimensions()
    xMove = Math.round(($('#ChopsticksStageBody').width() / 2) - selection_dimensions.width/2)
    yMove = Math.round(Chopsticks.stage.scrollTop() + ($(window).height() / 2) - selection_dimensions.height/2)
  }
  
  if (xMove || yMove) {
    $('.selection').each(function () {
      $(this).scrap().move(xMove, yMove)
    })
  }
  
  $('.handle').trigger('update')
  
  if (drag) {
    var name = $('.selection').attr('id')
    // Pretend the mousedown was on the move handle
    Events.slide.target = $("#moveHandle" + name)
    $("#moveHandle" + name).triggerHandler("mousedown")
    $("#moveHandle" + name).triggerHandler("slidestart")
    
    
    $('.selection').each(function () {
      var subject = $(this)
      var ghost = subject.clone()
      var opacity = subject.css('opacity')
      var scrap = $(this).scrap()
      subject.css('opacity', '0.01')
      ghost.attr('id', 'nudgepad_move_ghost').removeClass('scrap selection')
      ghost.on('mousedown', function () {subject.remove()})
      // space.style
      ghost.css('font-family', $('#ChopsticksStageBody').css('font-family'))
      if (scrap.values.style)
        ghost.css(scrap.values.style.values)
      ghost.css({
        'z-index' : '600',
        'position' : 'fixed',
        'top' : subject.offset().top,
        'left' : subject.offset().left
      })
      $("#moveHandle" + name).on("slide", function (event) {
        ghost.css({
          'top' : subject.offset().top,
          'left' : subject.offset().left
        })
      })
      $("#moveHandle" + name).on("slideend", function (event) {
        subject.css('opacity', opacity)
        ghost.remove()
      })
      $('body').append(ghost)
      
    })
    
    
  } else {
    Chopsticks.stage.commit()  
  }
  
  if (callback)
    callback(selectors)
  
  return selectors
}

/**
 * Is the head behind edge?
 * @returns {bool}
 */
Chopsticks.stage.isBehind = function () {
  return (Chopsticks.stage.version < Chopsticks.stage.timeline.keys.length)
}

/**
 * @param {string} Name of page
 */
Chopsticks.stage.open = function (name) {
  
  var page = Project.get('pages ' + name)
  if (!page)
    return Flasher.error('Page ' + name + ' not found')

  Chopsticks.stage.selection.clear()
  
  Chopsticks.stage.openTimeline(name)
  
  // Page change stuff
  Chopsticks.stage.activePage = name
  store.set('activePage', Chopsticks.stage.activePage)
  Screen.set('page', Chopsticks.stage.activePage)
  

  Chopsticks.edge = page
  Chopsticks.page = new Page(page.toString())
  Chopsticks.stage.version = Chopsticks.stage.timeline.length()

  Chopsticks.stage.render()
  
  Chopsticks.trigger('step')
  Chopsticks.trigger('page')
  return ''
  
}

Chopsticks.stage.redo = function () {
  Chopsticks.stage.goto(Chopsticks.stage.version + 1)
}

/**
 * Refresh the stage.
 */
Chopsticks.stage.render = function () {
  Chopsticks.stage.close()
  Chopsticks.page.loadScraps()
  Chopsticks.page.render()
}

Chopsticks.stage.reset = function () {
  $('#ChopsticksStage').height($(window).height() - 40)
}

Chopsticks.stage.ribbonClose = function () {
  $('#ChopsticksStage').height($(window).height() - 40)
}

Chopsticks.stage.ribbonOpen = function () {
  $('#ChopsticksStage').height($(window).height() - 122)
}

/**
 * Returns scroll top of the frame.
 */
Chopsticks.stage.scrollTop = function () {
  return $('#ChopsticksStage').scrollTop()
}

/**
 * Selects all blocks
 */
Chopsticks.stage.selectAll = function () {
  $('.scrap').each(function () {
    $(this).selectMe(true)
  })
  Chopsticks.trigger('selection')
}

/**
 * @return {object} Pointer to timeline object
 */
Chopsticks.stage.openTimeline = function (name) {
  
  if (Project.get('timelines ' + name)) {
    Chopsticks.stage.timeline = Project.get('timelines ' + name)
    return true
  }
  
  // Do we need to do this?
  var request = $.ajax({
    type: "POST",
    url: '/nudgepad.explorer.get',
    data : {path : 'private timelines ' + name},
    async: false,
  })
  
  request.done(function (msg) {
    Project._set('timelines ' + name, new Space(msg))
  })
  
  request.fail(function () {
    
    var edge = Project.get('pages ' + name)
    var timeline = new Space()
    // If no timeline, but yes edge, make the edge the first commit
    if (edge && !edge.isEmpty()) {
      
      var commit = new Space()
      commit.set('author', Cookie.email)
      commit.set('values', new Space(edge.toString()))
    }
    

    Project.create('timelines ' + name, timeline  )
    Flasher.success('Timeline created')
    
    
  })
  
  Chopsticks.stage.timeline = Project.get('timelines ' + name)
  
}

Chopsticks.stage.views = new Space({
  'full' : function () {
    $('#ChopsticksStage').css({
      width : '100%',
      padding : 0
    })
    $('#ChopsticksStageBody').css({
      'min-height' : '1000px'
    })
  },
  'tablet' : function (){
    var padding = Math.round(($(window).width() - 1024)/2) + 'px'
    $('#ChopsticksStage').css({
      width : '1024px',
      padding : '20px ' + padding + ' 1000px ' + padding,
    })
    $('#ChopsticksStageBody').css({
      'min-height' : '768px'
    })
  },
  'mobile' : function (){
    var padding = Math.round(($(window).width() - 320)/2) + 'px'
    $('#ChopsticksStage').css({
      padding : '20px ' + padding + ' 20px ' + padding,
      width: '320px'
    })
    $('#ChopsticksStageBody').css({
      'min-height' : '356px'
    })
  }
})

Chopsticks.stage.toggleDevice = function () {
  
  Chopsticks.stage.currentView = Chopsticks.stage.views.next(Chopsticks.stage.currentView)
  Chopsticks.stage.views.get(Chopsticks.stage.currentView)()
  $('#ChopsticksStageBody').width()
  Flasher.success(Chopsticks.stage.currentView + ' view')
  store.set('ChopsticksView', Chopsticks.stage.currentView)
}

Chopsticks.stage.undo = function () {
  Chopsticks.stage.goto(Chopsticks.stage.version - 1)
}

Chopsticks.stage.updateTimeline = function () {
  // Set the history slider to the wherever the maker last had it (usally 100 if no history or havent edited it yet)
  Chopsticks.stage.percentElapsed = (Chopsticks.stage.timeline.keys.length ? Math.round(100 * Chopsticks.stage.version/Chopsticks.stage.timeline.keys.length) : 100)
  $('#ChopsticksTimeline').attr('max', Chopsticks.stage.timeline.keys.length).val(Chopsticks.stage.version)
  $('#ChopsticksTimelinePosition').text(Chopsticks.stage.version + '/' + Chopsticks.stage.timeline.keys.length)
}

Chopsticks.stage.clearOnTap = function (event) {
  Chopsticks.stage.selection.clear()
  return true
}

Chopsticks.stage.onresize = function (event) {
  Chopsticks.stage.views.get(Chopsticks.stage.currentView)()
  $('#ChopsticksStageBody').width()
  $('#ChopsticksStage').height($(window).height() - 82)
}


