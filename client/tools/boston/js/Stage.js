
/**
 * The Stage holds the current open page.
 * We do a frame so the ribbon doesnt overlap the work area.
 * Its not actually a frame though, just a div with scroll.
 */
Boston.stage.version = 0 // how many steps in we are
Boston.stage.percentElapsed = 100
Boston.stage.currentView = store.get('BostonView') || 'mobile'

/**
 * Open the previous page
 */
Boston.stage.back = function () {
  Boston.stage.open(Project.get('pages').prev(Boston.stage.activePage))
}

Boston.stage.close = function () {
  $('#BostonStageBody').attr('style', '')
  $('#BostonStageHead').html('')
  $('#BostonRemoteSelections').html('')
  $(".scrap,#body").remove()
}

/**
 * Generates a Space of the change and posts it to the server.
 *
 * @return {string} todo: why return a string?
 */
Boston.stage.commit = function () {
  
  var timestamp = new Date().getTime()
  
  // You are always committing against the edge.
  var diff = Boston.edge.diff(Boston.page)
  var diffOrder = Boston.edge.diffOrder(Boston.page)

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

  Boston.stage.timeline.set(timestamp, commit)
  Boston.edge = new Space(Boston.page.toString())
  
  // A commit always advances the position index to the edge.
  Boston.stage.version = Boston.stage.timeline.keys.length
  
  Boston.trigger('selection')
  Boston.trigger('commit')
  Boston.trigger('step')
  
  Project.set('pages ' + Boston.stage.activePage, new Space(Boston.page.toString()))
  Project.append('timelines ' + Boston.stage.activePage + ' ' + timestamp, commit)
  
  Boston.stage.publish()
  
  return diff
}

Boston.stage.dragAndDrop = function (scrap) {
  
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

  var pageLeft = $('#BostonStageBody').offset().left
  var bodyScroll = $('#BostonStage').scrollTop()
  
  var left = Boston.Mouse.move.pageX - pageLeft - halfWidth
  var y = Boston.Mouse.move.pageY - halfHeight + bodyScroll

  Boston.stage.insert(scrap, true, left, y)
}

/**
 * Advances position_index, advanced position.
 */
Boston.stage.editSource = function () {
  TextPrompt.open('Enter code...', Boston.page.toString(), function (val) {
    Boston.page = new Space(val)
    Boston.stage.commit()
    Boston.stage.open(Boston.stage.activePage)
  })
}

/**
 * Deletes all scraps from the page and DOM.
 */
Boston.stage.erase = function () {
  Boston.stage.selectAll()
  Boston.stage.selection.delete()
  Boston.stage.commit()
}

Boston.stage.expand = function () {
  // Absolute positioned elements won't expand the container(it seems
  // that way anyway, maybe theres a better way to do it via css), so we need
  // to do it manually.
  var max = 700
  $('.scrap').each(function () {
    var bottom = $(this).position().top + $(this).outerHeight()
    if (bottom > max)
      max = bottom
  })

  $('#BostonStageBody').css({
    'height' : max + 'px'
  })

}

/**
 * Open the next page
 */
Boston.stage.forward = function () {
  Boston.stage.open(Project.get('pages').next(Boston.stage.activePage))
}

Boston.stage.goto = function (version) {
  Boston.stage.selection.save()
  Boston.stage.selection.clear()
  if (version < 0)
    return false
  if (version > Boston.stage.timeline.keys.length)
    return false
  
  // If we are going back in time, start from 0
  if (Boston.stage.version > version) {
    Boston.page = new Page()
    Boston.stage.version = 0
  }
  for (var i = Boston.stage.version; i < version; i++) {
    var timestamp = Boston.stage.timeline.keys[i]
    var patch = Boston.stage.timeline.values[timestamp].values.values
    var orderPatch = Boston.stage.timeline.values[timestamp].values.order
    if (patch)
      Boston.page.patch(patch.toString())
    if (orderPatch)
      Boston.page.patchOrder(orderPatch.toString())
    Boston.stage.version++
  }
  Boston.trigger('step')
  Boston.stage.render()
  Boston.stage.selection.restore()
  Boston.trigger('stage')
}

Boston.stage.height = function () {
  return $(window).height() - $('#BostonBar').outerHeight()
}

Boston.stage.insertBody = function () {
  if (!Boston.page.get('body')) {
    Boston.page.set('body', new Scrap('body', 'tag body\nscraps\n'))
    Boston.page.get('body').render()
  }
  if (!Boston.page.get('body scraps'))
    Boston.page.set('body scraps', new Space())
//    Boston.page.set('body scraps', new Space())
//    level = Boston.page.get('body scraps')
}

/**
 * Creates new scraps, commits them and adds them to DOM.
 *
 * @param {Space}  An optional space to initialize the scrap with.
 * @return {string} IDs of the new scraps
 */
Boston.stage.insert = function (space, drag, xMove, yMove, center) {
  
  if (!space)
    space = 'scrap\n content Hello world\n style\n  position absolute\n  top 10px\n  left 10px'
    
  // temporary fix for the revised scraps
  var patch = new Space(space.toString())
  Boston.stage.selection.clear()
  
  Boston.stage.insertBody()
  var level = Boston.page.get('body scraps')
  
  
  // update the patch so there is no overwriting
  patch.each(function (key, value) {
    if (level.get(key)) {
      this.rename(key, Boston.autokey(level, key))
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
    xMove = Math.round(($('#BostonStageBody').width() / 2) - selection_dimensions.width/2)
    yMove = Math.round(Boston.stage.scrollTop() + ($(window).height() / 2) - selection_dimensions.height/2)
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
      ghost.css('font-family', $('#BostonStageBody').css('font-family'))
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
    Boston.stage.commit()  
  }
  
  return selectors
}

/**
 * Is the head behind edge?
 * @returns {bool}
 */
Boston.stage.isBehind = function () {
  return (Boston.stage.version < Boston.stage.timeline.keys.length)
}

/**
 * @param {string} Name of page
 */
Boston.stage.open = function (name) {
  
  var page = Project.get('pages ' + name)
  if (!page)
    return Flasher.error('Page ' + name + ' not found')

  Boston.stage.selection.clear()
  
  Boston.stage.openTimeline(name)
  
  // Page change stuff
  Boston.stage.activePage = name
  store.set('activePage', Boston.stage.activePage)
  Screen.set('page', Boston.stage.activePage)
  

  Boston.edge = page
  Boston.page = new Page(page.toString())
  Boston.stage.version = Boston.stage.timeline.length()

  Boston.stage.render()
  
  Boston.trigger('step')
  Boston.trigger('page')
  return ''
  
}

Boston.stage.prettyPrint = true

Boston.stage.publish = function () {

  var html = new Page(Boston.page.toString()).toHtml(function () {
    // File draft scrap
    if (this.get('draft') === 'true')
      return ''
    return this.div.toHtml()
    
  })
  
  if (Boston.stage.prettyPrint)
    html = html_beautify(html)
  
  Explorer.set(Boston.stage.activePage + '.html', html)
}

Boston.stage.redo = function () {
  Boston.stage.goto(Boston.stage.version + 1)
}

/**
 * Refresh the stage.
 */
Boston.stage.render = function () {
  Boston.stage.close()
  Boston.page.loadScraps()
  Boston.page.render()
  Boston.grid.create()
  Boston.updateSelections()
}

Boston.stage.reset = function () {
  $('#BostonStage').height($(window).height() - 40)
}

Boston.stage.ribbonClose = function () {
  $('#BostonStage').height($(window).height() - 40)
}

Boston.stage.ribbonOpen = function () {
  $('#BostonStage').height($(window).height() - 122)
}

/**
 * Returns scroll top of the frame.
 */
Boston.stage.scrollTop = function () {
  return $('#BostonStage').scrollTop()
}

/**
 * Selects all blocks
 */
Boston.stage.selectAll = function () {
  $('.scrap').each(function () {
    $(this).selectMe(true)
  })
  Boston.trigger('selection')
}

/**
 * @return {object} Pointer to timeline object
 */
Boston.stage.openTimeline = function (name) {
  
  if (Project.get('timelines ' + name)) {
    Boston.stage.timeline = Project.get('timelines ' + name)
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
  
  Boston.stage.timeline = Project.get('timelines ' + name)
  
}

Boston.stage.views = new Space({
  'full' : function () {
    $('#BostonStage').css({
      width : '100%',
      padding : 0
    })
    $('#BostonStageBody').css({
      'min-height' : '1000px'
    })
  },
  'tablet' : function (){
    var padding = Math.round(($(window).width() - 1024)/2) + 'px'
    $('#BostonStage').css({
      width : '1024px',
      padding : '20px ' + padding + ' 1000px ' + padding,
    })
    $('#BostonStageBody').css({
      'min-height' : '768px'
    })
  },
  'mobile' : function (){
    var padding = Math.round(($(window).width() - 320)/2) + 'px'
    $('#BostonStage').css({
      padding : '20px ' + padding + ' 20px ' + padding,
      width: '320px'
    })
    $('#BostonStageBody').css({
      'min-height' : '356px'
    })
  }
})

Boston.stage.toggleDevice = function () {
  
  Boston.stage.currentView = Boston.stage.views.next(Boston.stage.currentView)
  Boston.stage.views.get(Boston.stage.currentView)()
  $('#BostonStageBody').width()
  Flasher.success(Boston.stage.currentView + ' view')
  store.set('BostonView', Boston.stage.currentView)
}

Boston.stage.undo = function () {
  Boston.stage.goto(Boston.stage.version - 1)
}

Boston.stage.updateTimeline = function () {
  // Set the history slider to the wherever the maker last had it (usally 100 if no history or havent edited it yet)
  Boston.stage.percentElapsed = (Boston.stage.timeline.keys.length ? Math.round(100 * Boston.stage.version/Boston.stage.timeline.keys.length) : 100)
  $('#BostonTimeline').attr('max', Boston.stage.timeline.keys.length).val(Boston.stage.version)
  $('#BostonTimelinePosition').text(Boston.stage.version + '/' + Boston.stage.timeline.keys.length)
}

Boston.stage.clearOnTap = function (event) {
  Boston.stage.selection.clear()
  return true
}

Boston.stage.onresize = function (event) {
  Boston.stage.views.get(Boston.stage.currentView)()
  $('#BostonStageBody').width()
  if ($('.BostonRibbon:visible').length)
    $('#BostonStage').height($(window).height() - 122)
  else 
    $('#BostonStage').height($(window).height() - 40)
}


