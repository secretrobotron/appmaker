Boston.isFirstOpen = true

Boston.on('page', Boston.updateTabs)

Boston.on('step', Boston.stage.updateTimeline)

Boston.on('ready', function () {
  // We dont use the default tool convention
  $('#Boston').hide()
})

Boston.on('open', function () {

  Boston.grid = new Grid()
  
  $('#BostonStage,#BostonBar').show()
  
  Screens.on('change', Boston.updateSelections)
  Screens.on('change', Boston.updateTabs)
  
  Project.on('delete', Boston.updateTabs)
  
  Lasso.selector = '#BostonStageBody .scrap:visible'
  $(document).on('lasso', '.scrap', function () {
    $(this).selectMe(true)
    return false
  })
  Lasso.enable()
  
  $(document).on("slidestart", Boston.pen.draw)
  
  $('#BostonStage').on('click', Boston.pen.insertTextBlock)

  // Prevent Images from dragging on Firefox
  $(document).on('dragstart', 'img', function(event) { event.preventDefault()})
  
  var page = store.get('activePage') || 'index'
  if (!Project.get('pages ' + page))
    page = 'index'
  // Create an index page.
  if (!Project.get('pages ' + page))
    Boston.create('index')
  Boston.stage.open(page)
  
  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
    // iPad fixeds
    $(document).on("touchstart", Boston.stopPropagation)
    // Allow someone to drag
    $(document).on("touchmove", Boston.preventDefault) 
  }
  
  
  window.addEventListener('copy', Boston.oncopy, false)
  window.addEventListener('cut', Boston.oncut, false)
  window.addEventListener('paste', Boston.onpaste, false)
  window.addEventListener('resize', Boston.onresize, false)
  
  $("body").on("keydown", Boston.onkeydown)

  Events.shortcut.shortcuts = Boston.shortcuts


  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.addEventListener('touchstart', Boston.Mouse.onTouchStart, true)
    document.addEventListener('touchend', Boston.Mouse.onTouchEnd, true)
    document.addEventListener('touchmove', Boston.Mouse.onTouchMove, true)
  } else {
    document.addEventListener('mousedown', Boston.Mouse.onmousedown, true)
    document.addEventListener('mousemove', Boston.Mouse.onmousemove, true)
    document.addEventListener('mouseup', Boston.Mouse.onmouseup, true)
  }
  
  // temporary fix until we clean this up.
  if (Boston.isFirstOpen) {
    Boston.isFirstOpen = false
    Boston.trigger('firstOpen')
  }
  
  $('#BostonComponentsTab').trigger('click')
  
})

Boston.on('close', function () {
  
  $(document).off("slidestart", Boston.pen.draw)
  
  $('#BostonStage,#BostonBar').hide()
  
  Boston.off('selection', Boston.broadcastSelection)
  Screens.off('change', Boston.updateSelections)
  Screens.off('change', Boston.updateTabs)
  $('#BostonStage').off('click', Boston.pen.insertTextBlock)
  
  Project.off('delete', Boston.updateTabs)
  
  Boston.stage.close()

  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i))
    return null
  
  // iPad fixeds
  $(document).off("touchstart", Boston.stopPropagation)
  // Allow someone to drag
  $(document).off("touchmove", Boston.preventDefault)
  
  window.removeEventListener('copy', Boston.oncopy, false)
  window.removeEventListener('cut', Boston.oncut, false)
  window.removeEventListener('paste', Boston.onpaste, false)
  window.removeEventListener('resize', Boston.onresize, false)
  $("body").off("keydown", Boston.onkeydown)
  
  Events.shortcut.shortcuts = {}
  
  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.removeEventListener('touchstart', Boston.Mouse.onTouchStart, true)
    document.removeEventListener('touchend', Boston.Mouse.onTouchEnd, true)
    document.removeEventListener('touchmove', Boston.Mouse.onTouchMove, true)
  } else {
    document.removeEventListener('mousedown', Boston.Mouse.onmousedown, true)
    document.removeEventListener('mousemove', Boston.Mouse.onmousemove, true)
    document.removeEventListener('mouseup', Boston.Mouse.onmouseup, true)
  }

  
})

Boston.on('open', function () {
  
  // Todo: refactor
  Events.shortcut.onfire = Boston.trackShortcuts
  
  $(document).on('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#BostonStage').on("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').on("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).on('mousedown click','input.scrap,textarea.scrap', Boston.returnFalse)
  $(document).on('focus', 'input.scrap,textarea.scrap', Boston.blurThis)
  
  $("#BostonStage").on("tap", Boston.stage.clearOnTap)
  $(window).on('resize', Boston.stage.onresize)
  
})

Boston.on('selection', Boston.broadcastSelection)

Boston.on('close', function () {
  $(document).off('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#BostonStage').off("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').off("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).off('mousedown click','input.scrap,textarea.scrap', Boston.returnFalse)
  $(document).off('focus', 'input.scrap,textarea.scrap', Boston.blurThis)
  
  $("#BostonStage").off("tap", Boston.stage.clearOnTap)
  $(window).off('resize', Boston.stage.onresize)

})

Boston.on('commit', Boston.stage.expand)

Boston.on('page', function () {
  Boston.stage.expand()
  Boston.stage.views.get(Boston.stage.currentView)()
  $('#BostonStageBody').width() // Force repaint
  Boston.stage.reset()

})






