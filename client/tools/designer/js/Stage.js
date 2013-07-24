
/**
 * The Stage holds the current open page.
 * We do a frame so the ribbon doesnt overlap the work area.
 * Its not actually a frame though, just a div with scroll.
 */
Designer.stage.version = 0 // how many steps in we are
Designer.stage.percentElapsed = 100
Designer.stage.currentView = store.get('DesignerView') || 'mobile'

/**
 * Open the previous page
 */
Designer.stage.back = function () {
  Designer.stage.open(Project.get('pages').prev(Designer.stage.activePage))
}

Designer.stage.close = function () {
  $('#DesignerStageBody').attr('style', '')
  $('#DesignerStageHead').html('')
  $('#DesignerRemoteSelections').html('')
  $(".scrap,#body").remove()
}

/**
 * Generates a Space of the change and posts it to the server.
 *
 * @return {string} todo: why return a string?
 */
Designer.stage.commit = function () {
  
  var timestamp = new Date().getTime()
  
  // You are always committing against the edge.
  var diff = Designer.edge.diff(Designer.page)
  var diffOrder = Designer.edge.diffOrder(Designer.page)

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

  Designer.stage.timeline.set(timestamp, commit)
  Designer.edge = new Space(Designer.page.toString())
  
  // A commit always advances the position index to the edge.
  Designer.stage.version = Designer.stage.timeline.keys.length
  
  Designer.trigger('selection')
  Designer.trigger('commit')
  Designer.trigger('step')
  
  Project.set('pages ' + Designer.stage.activePage, new Space(Designer.page.toString()))
  Project.append('timelines ' + Designer.stage.activePage + ' ' + timestamp, commit)
  
  // Todo: move this out of here
  if (Designer.menu.autopublish)
    Designer.menu.publish(Designer.stage.activePage)
  
  return diff
}

Designer.stage.dragAndDrop = function (scrap) {
  
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

  var pageLeft = $('#DesignerStageBody').offset().left
  var bodyScroll = $('#DesignerStage').scrollTop()
  
  var left = Designer.Mouse.move.pageX - pageLeft - halfWidth
  var y = Designer.Mouse.move.pageY - halfHeight + bodyScroll

  Designer.stage.insert(scrap, true, left, y)
}

/**
 * Advances position_index, advanced position.
 */
Designer.stage.editSource = function () {
  TextPrompt.open('Enter code...', Designer.page.toString(), function (val) {
    Designer.page = new Space(val)
    Designer.stage.commit()
    Designer.stage.open(Designer.stage.activePage)
  })
}

/**
 * Deletes all scraps from the page and DOM.
 */
Designer.stage.erase = function () {
  Designer.stage.selectAll()
  Designer.stage.selection.delete()
  Designer.stage.commit()
}

Designer.stage.expand = function () {
  // Absolute positioned elements won't expand the container(it seems
  // that way anyway, maybe theres a better way to do it via css), so we need
  // to do it manually.
  var max = 700
  $('.scrap').each(function () {
    var bottom = $(this).position().top + $(this).outerHeight()
    if (bottom > max)
      max = bottom
  })

  $('#DesignerStageBody').css({
    'height' : max + 'px'
  })

}

/**
 * Open the next page
 */
Designer.stage.forward = function () {
  Designer.stage.open(Project.get('pages').next(Designer.stage.activePage))
}

Designer.stage.goto = function (version) {
  Designer.stage.selection.save()
  Designer.stage.selection.clear()
  if (version < 0)
    return false
  if (version > Designer.stage.timeline.keys.length)
    return false
  
  // If we are going back in time, start from 0
  if (Designer.stage.version > version) {
    Designer.page = new Page()
    Designer.stage.version = 0
  }
  for (var i = Designer.stage.version; i < version; i++) {
    var timestamp = Designer.stage.timeline.keys[i]
    var patch = Designer.stage.timeline.values[timestamp].values.values
    var orderPatch = Designer.stage.timeline.values[timestamp].values.order
    if (patch)
      Designer.page.patch(patch.toString())
    if (orderPatch)
      Designer.page.patchOrder(orderPatch.toString())
    Designer.stage.version++
  }
  Designer.trigger('step')
  Designer.stage.render()
  Designer.stage.selection.restore()
  Designer.trigger('stage')
}

Designer.stage.height = function () {
  return $(window).height() - $('#DesignerBar').outerHeight()
}

Designer.stage.insertBody = function () {
  if (!Designer.page.get('body')) {
    Designer.page.set('body', new Scrap('body', 'tag body\nscraps\n'))
    Designer.page.get('body').render()
  }
  if (!Designer.page.get('body scraps'))
    Designer.page.set('body scraps', new Space())
//    Designer.page.set('body scraps', new Space())
//    level = Designer.page.get('body scraps')
}

/**
 * Creates new scraps, commits them and adds them to DOM.
 *
 * @param {Space}  An optional space to initialize the scrap with.
 * @return {string} IDs of the new scraps
 */
Designer.stage.insert = function (space, drag, xMove, yMove, center) {
  
  if (!space)
    space = 'scrap\n content Hello world\n style\n  position absolute\n  top 10px\n  left 10px'
    
  // temporary fix for the revised scraps
  var patch = new Space(space.toString())
  Designer.stage.selection.clear()
  
  Designer.stage.insertBody()
  var level = Designer.page.get('body scraps')
  
  
  // update the patch so there is no overwriting
  patch.each(function (key, value) {
    if (level.get(key)) {
      this.rename(key, Designer.autokey(level, key))
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
    xMove = Math.round(($('#DesignerStageBody').width() / 2) - selection_dimensions.width/2)
    yMove = Math.round(Designer.stage.scrollTop() + ($(window).height() / 2) - selection_dimensions.height/2)
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
      ghost.css('font-family', $('#DesignerStageBody').css('font-family'))
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
    Designer.stage.commit()  
  }
  
  return selectors
}

/**
 * Is the head behind edge?
 * @returns {bool}
 */
Designer.stage.isBehind = function () {
  return (Designer.stage.version < Designer.stage.timeline.keys.length)
}

/**
 * @param {string} Name of page
 */
Designer.stage.open = function (name) {
  
  var page = Project.get('pages ' + name)
  if (!page)
    return Flasher.error('Page ' + name + ' not found')

  Designer.stage.selection.clear()
  
  Designer.stage.openTimeline(name)
  
  // Page change stuff
  Designer.stage.activePage = name
  store.set('activePage', Designer.stage.activePage)
  Screen.set('page', Designer.stage.activePage)
  

  Designer.edge = page
  Designer.page = new Page(page.toString())
  Designer.stage.version = Designer.stage.timeline.length()

  Designer.stage.render()
  
  Designer.trigger('step')
  Designer.trigger('page')
  return ''
  
}

Designer.stage.redo = function () {
  Designer.stage.goto(Designer.stage.version + 1)
}

/**
 * Refresh the stage.
 */
Designer.stage.render = function () {
  Designer.stage.close()
  Designer.page.loadScraps()
  Designer.page.render()
  Designer.grid.create()
  Designer.updateSelections()
}

Designer.stage.reset = function () {
  $('#DesignerStage').height($(window).height() - 40)
}

Designer.stage.ribbonClose = function () {
  $('#DesignerStage').height($(window).height() - 40)
}

Designer.stage.ribbonOpen = function () {
  $('#DesignerStage').height($(window).height() - 122)
}

/**
 * Returns scroll top of the frame.
 */
Designer.stage.scrollTop = function () {
  return $('#DesignerStage').scrollTop()
}

/**
 * Selects all blocks
 */
Designer.stage.selectAll = function () {
  $('.scrap').each(function () {
    $(this).selectMe(true)
  })
  Designer.trigger('selection')
}

/**
 * @return {object} Pointer to timeline object
 */
Designer.stage.openTimeline = function (name) {
  
  if (Project.get('timelines ' + name)) {
    Designer.stage.timeline = Project.get('timelines ' + name)
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
  
  Designer.stage.timeline = Project.get('timelines ' + name)
  
}

Designer.stage.views = new Space({
  'full' : function () {
    $('#DesignerStage').css({
      width : '100%',
      padding : 0
    })
    $('#DesignerStageBody').css({
      'min-height' : '1000px'
    })
  },
  'tablet' : function (){
    var padding = Math.round(($(window).width() - 1024)/2) + 'px'
    $('#DesignerStage').css({
      width : '1024px',
      padding : '20px ' + padding + ' 1000px ' + padding,
    })
    $('#DesignerStageBody').css({
      'min-height' : '768px'
    })
  },
  'mobile' : function (){
    var padding = Math.round(($(window).width() - 320)/2) + 'px'
    $('#DesignerStage').css({
      padding : '20px ' + padding + ' 20px ' + padding,
      width: '320px'
    })
    $('#DesignerStageBody').css({
      'min-height' : '356px'
    })
  }
})

Designer.stage.toggleDevice = function () {
  
  Designer.stage.currentView = Designer.stage.views.next(Designer.stage.currentView)
  Designer.stage.views.get(Designer.stage.currentView)()
  $('#DesignerStageBody').width()
  Flasher.success(Designer.stage.currentView + ' view')
  store.set('DesignerView', Designer.stage.currentView)
}

Designer.stage.undo = function () {
  Designer.stage.goto(Designer.stage.version - 1)
}

Designer.stage.updateTimeline = function () {
  // Set the history slider to the wherever the maker last had it (usally 100 if no history or havent edited it yet)
  Designer.stage.percentElapsed = (Designer.stage.timeline.keys.length ? Math.round(100 * Designer.stage.version/Designer.stage.timeline.keys.length) : 100)
  $('#DesignerTimeline').attr('max', Designer.stage.timeline.keys.length).val(Designer.stage.version)
  $('#DesignerTimelinePosition').text(Designer.stage.version + '/' + Designer.stage.timeline.keys.length)
}

Designer.stage.clearOnTap = function (event) {
  Designer.stage.selection.clear()
  return true
}

Designer.stage.onresize = function (event) {
  Designer.stage.views.get(Designer.stage.currentView)()
  $('#DesignerStageBody').width()
  if ($('.DesignerRibbon:visible').length)
    $('#DesignerStage').height($(window).height() - 122)
  else 
    $('#DesignerStage').height($(window).height() - 40)
}


