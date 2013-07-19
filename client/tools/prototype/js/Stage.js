
/**
 * The Stage holds the current open page.
 * We do a frame so the ribbon doesnt overlap the work area.
 * Its not actually a frame though, just a div with scroll.
 */
Prototype.stage.version = 0 // how many steps in we are
Prototype.stage.percentElapsed = 100
Prototype.stage.currentView = store.get('PrototypeView') || 'mobile'

/**
 * Open the previous page
 */
Prototype.stage.back = function () {
  Prototype.stage.open(Project.get('pages').prev(Prototype.stage.activePage))
}

Prototype.stage.close = function () {
  $('#PrototypeStageBody').attr('style', '')
  $('#PrototypeStageHead').html('')
  $('#PrototypeRemoteSelections').html('')
  $(".scrap,#body").remove()
}

/**
 * Generates a Space of the change and posts it to the server.
 *
 * @return {string} todo: why return a string?
 */
Prototype.stage.commit = function () {
  
  var timestamp = new Date().getTime()
  
  // You are always committing against the edge.
  var diff = Prototype.edge.diff(Prototype.page)
  var diffOrder = Prototype.edge.diffOrder(Prototype.page)

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

  Prototype.stage.timeline.set(timestamp, commit)
  Prototype.edge = new Space(Prototype.page.toString())
  
  // A commit always advances the position index to the edge.
  Prototype.stage.version = Prototype.stage.timeline.keys.length
  
  Prototype.trigger('selection')
  Prototype.trigger('commit')
  Prototype.trigger('step')
  
  Project.set('pages ' + Prototype.stage.activePage, new Space(Prototype.page.toString()))
  Project.append('timelines ' + Prototype.stage.activePage + ' ' + timestamp, commit)
  
  Prototype.stage.publish()
  
  return diff
}

Prototype.stage.dragAndDrop = function (scrap) {
  
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

  var pageLeft = $('#PrototypeStageBody').offset().left
  var bodyScroll = $('#PrototypeStage').scrollTop()
  
  var left = Prototype.Mouse.move.pageX - pageLeft - halfWidth
  var y = Prototype.Mouse.move.pageY - halfHeight + bodyScroll

  Prototype.stage.insert(scrap, true, left, y)
}

/**
 * Advances position_index, advanced position.
 */
Prototype.stage.editSource = function () {
  TextPrompt.open('Enter code...', Prototype.page.toString(), function (val) {
    Prototype.page = new Space(val)
    Prototype.stage.commit()
    Prototype.stage.open(Prototype.stage.activePage)
  })
}

/**
 * Deletes all scraps from the page and DOM.
 */
Prototype.stage.erase = function () {
  Prototype.stage.selectAll()
  Prototype.stage.selection.delete()
  Prototype.stage.commit()
}

Prototype.stage.expand = function () {
  // Absolute positioned elements won't expand the container(it seems
  // that way anyway, maybe theres a better way to do it via css), so we need
  // to do it manually.
  var max = 700
  $('.scrap').each(function () {
    var bottom = $(this).position().top + $(this).outerHeight()
    if (bottom > max)
      max = bottom
  })

  $('#PrototypeStageBody').css({
    'height' : max + 'px'
  })

}

/**
 * Open the next page
 */
Prototype.stage.forward = function () {
  Prototype.stage.open(Project.get('pages').next(Prototype.stage.activePage))
}

Prototype.stage.goto = function (version) {
  Prototype.stage.selection.save()
  Prototype.stage.selection.clear()
  if (version < 0)
    return false
  if (version > Prototype.stage.timeline.keys.length)
    return false
  
  // If we are going back in time, start from 0
  if (Prototype.stage.version > version) {
    Prototype.page = new Page()
    Prototype.stage.version = 0
  }
  for (var i = Prototype.stage.version; i < version; i++) {
    var timestamp = Prototype.stage.timeline.keys[i]
    var patch = Prototype.stage.timeline.values[timestamp].values.values
    var orderPatch = Prototype.stage.timeline.values[timestamp].values.order
    if (patch)
      Prototype.page.patch(patch.toString())
    if (orderPatch)
      Prototype.page.patchOrder(orderPatch.toString())
    Prototype.stage.version++
  }
  Prototype.trigger('step')
  Prototype.stage.render()
  Prototype.stage.selection.restore()
  Prototype.trigger('stage')
}

Prototype.stage.height = function () {
  return $(window).height() - $('#PrototypeBar').outerHeight()
}

Prototype.stage.insertBody = function () {
  if (!Prototype.page.get('body')) {
    Prototype.page.set('body', new Scrap('body', 'tag body\nscraps\n'))
    Prototype.page.get('body').render()
  }
  if (!Prototype.page.get('body scraps'))
    Prototype.page.set('body scraps', new Space())
//    Prototype.page.set('body scraps', new Space())
//    level = Prototype.page.get('body scraps')
}

/**
 * Creates new scraps, commits them and adds them to DOM.
 *
 * @param {Space}  An optional space to initialize the scrap with.
 * @return {string} IDs of the new scraps
 */
Prototype.stage.insert = function (space, drag, xMove, yMove, center) {
  
  if (!space)
    space = 'scrap\n content Hello world\n style\n  position absolute\n  top 10px\n  left 10px'
    
  // temporary fix for the revised scraps
  var patch = new Space(space.toString())
  Prototype.stage.selection.clear()
  
  Prototype.stage.insertBody()
  var level = Prototype.page.get('body scraps')
  
  
  // update the patch so there is no overwriting
  patch.each(function (key, value) {
    if (level.get(key)) {
      this.rename(key, Prototype.autokey(level, key))
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
    xMove = Math.round(($('#PrototypeStageBody').width() / 2) - selection_dimensions.width/2)
    yMove = Math.round(Prototype.stage.scrollTop() + ($(window).height() / 2) - selection_dimensions.height/2)
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
      ghost.css('font-family', $('#PrototypeStageBody').css('font-family'))
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
    Prototype.stage.commit()  
  }
  
  return selectors
}

/**
 * Is the head behind edge?
 * @returns {bool}
 */
Prototype.stage.isBehind = function () {
  return (Prototype.stage.version < Prototype.stage.timeline.keys.length)
}

/**
 * @param {string} Name of page
 */
Prototype.stage.open = function (name) {
  
  var page = Project.get('pages ' + name)
  if (!page)
    return Flasher.error('Page ' + name + ' not found')

  Prototype.stage.selection.clear()
  
  Prototype.stage.openTimeline(name)
  
  // Page change stuff
  Prototype.stage.activePage = name
  store.set('activePage', Prototype.stage.activePage)
  Screen.set('page', Prototype.stage.activePage)
  

  Prototype.edge = page
  Prototype.page = new Page(page.toString())
  Prototype.stage.version = Prototype.stage.timeline.length()

  Prototype.stage.render()
  
  Prototype.trigger('step')
  Prototype.trigger('page')
  return ''
  
}

Prototype.stage.publish = function () {
  var html = new Page(Prototype.page.toString())
  // todo: clean up published HTML
  Explorer.set(Prototype.stage.activePage + '.html', html.toHtml())
}

Prototype.stage.redo = function () {
  Prototype.stage.goto(Prototype.stage.version + 1)
}

/**
 * Refresh the stage.
 */
Prototype.stage.render = function () {
  Prototype.stage.close()
  Prototype.page.loadScraps()
  Prototype.page.render()
  Prototype.grid.create()
  Prototype.updateSelections()
}

Prototype.stage.reset = function () {
  $('#PrototypeStage').height($(window).height() - 40)
}

Prototype.stage.ribbonClose = function () {
  $('#PrototypeStage').height($(window).height() - 40)
}

Prototype.stage.ribbonOpen = function () {
  $('#PrototypeStage').height($(window).height() - 122)
}

/**
 * Returns scroll top of the frame.
 */
Prototype.stage.scrollTop = function () {
  return $('#PrototypeStage').scrollTop()
}

/**
 * Selects all blocks
 */
Prototype.stage.selectAll = function () {
  $('.scrap').each(function () {
    $(this).selectMe(true)
  })
  Prototype.trigger('selection')
}

/**
 * @return {object} Pointer to timeline object
 */
Prototype.stage.openTimeline = function (name) {
  
  if (Project.get('timelines ' + name)) {
    Prototype.stage.timeline = Project.get('timelines ' + name)
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
  
  Prototype.stage.timeline = Project.get('timelines ' + name)
  
}

Prototype.stage.views = new Space({
  'full' : function () {
    $('#PrototypeStage').css({
      width : '100%',
      padding : 0
    })
    $('#PrototypeStageBody').css({
      'min-height' : '1000px'
    })
  },
  'tablet' : function (){
    var padding = Math.round(($(window).width() - 1024)/2) + 'px'
    $('#PrototypeStage').css({
      width : '1024px',
      padding : '20px ' + padding + ' 1000px ' + padding,
    })
    $('#PrototypeStageBody').css({
      'min-height' : '768px'
    })
  },
  'mobile' : function (){
    var padding = Math.round(($(window).width() - 320)/2) + 'px'
    $('#PrototypeStage').css({
      padding : '20px ' + padding + ' 20px ' + padding,
      width: '320px'
    })
    $('#PrototypeStageBody').css({
      'min-height' : '356px'
    })
  }
})

Prototype.stage.toggleDevice = function () {
  
  Prototype.stage.currentView = Prototype.stage.views.next(Prototype.stage.currentView)
  Prototype.stage.views.get(Prototype.stage.currentView)()
  $('#PrototypeStageBody').width()
  Flasher.success(Prototype.stage.currentView + ' view')
  store.set('PrototypeView', Prototype.stage.currentView)
}

Prototype.stage.undo = function () {
  Prototype.stage.goto(Prototype.stage.version - 1)
}

Prototype.stage.updateTimeline = function () {
  // Set the history slider to the wherever the maker last had it (usally 100 if no history or havent edited it yet)
  Prototype.stage.percentElapsed = (Prototype.stage.timeline.keys.length ? Math.round(100 * Prototype.stage.version/Prototype.stage.timeline.keys.length) : 100)
  $('#PrototypeTimeline').attr('max', Prototype.stage.timeline.keys.length).val(Prototype.stage.version)
  $('#PrototypeTimelinePosition').text(Prototype.stage.version + '/' + Prototype.stage.timeline.keys.length)
}

Prototype.stage.clearOnTap = function (event) {
  Prototype.stage.selection.clear()
  return true
}

Prototype.stage.onresize = function (event) {
  Prototype.stage.views.get(Prototype.stage.currentView)()
  $('#PrototypeStageBody').width()
  if ($('.PrototypeRibbon:visible').length)
    $('#PrototypeStage').height($(window).height() - 122)
  else 
    $('#PrototypeStage').height($(window).height() - 40)
}


