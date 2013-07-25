Chopsticks.isFirstOpen = true


Chopsticks.on('step', Chopsticks.stage.updateTimeline)

Chopsticks.on('ready', function () {
  // We dont use the default tool convention
  $('#Chopsticks').hide()
})

Chopsticks.on('open', function () {
  
  $('#ChopsticksStage,#ChopsticksBar').show()

  
  
  Lasso.selector = '#ChopsticksStageBody .scrap:visible'
  $(document).on('lasso', '.scrap', function () {
    $(this).selectMe(true)
    return false
  })
  Lasso.enable()
  
  $(document).on("slidestart", Chopsticks.pen.draw)
  
  $('#ChopsticksStage').on('click', Chopsticks.pen.insertTextBlock)

  // Prevent Images from dragging on Firefox
  $(document).on('dragstart', 'img', function(event) { event.preventDefault()})
  
  // Open the last open page, or index page, or create a new untitled page.
  var page = store.get('activePage') || 'index'
  if (!Project.get('pages ' + page))
    Chopsticks.menu.create()
  else
    Chopsticks.stage.open(page)
  
  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
    // iPad fixeds
    $(document).on("touchstart", Chopsticks.stopPropagation)
    // Allow someone to drag
    $(document).on("touchmove", Chopsticks.preventDefault) 
  }
  
  
  window.addEventListener('copy', Chopsticks.oncopy, false)
  window.addEventListener('cut', Chopsticks.oncut, false)
  window.addEventListener('paste', Chopsticks.onpaste, false)
  window.addEventListener('resize', Chopsticks.onresize, false)
  
  $("body").on("keydown", Chopsticks.onkeydown)

  Events.shortcut.shortcuts = Chopsticks.shortcuts


  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.addEventListener('touchstart', Chopsticks.Mouse.onTouchStart, true)
    document.addEventListener('touchend', Chopsticks.Mouse.onTouchEnd, true)
    document.addEventListener('touchmove', Chopsticks.Mouse.onTouchMove, true)
  } else {
    document.addEventListener('mousedown', Chopsticks.Mouse.onmousedown, true)
    document.addEventListener('mousemove', Chopsticks.Mouse.onmousemove, true)
    document.addEventListener('mouseup', Chopsticks.Mouse.onmouseup, true)
  }
  
  // temporary fix until we clean this up.
  if (Chopsticks.isFirstOpen) {
    Chopsticks.isFirstOpen = false
    Chopsticks.trigger('firstOpen')
  }
  
  $('#ChopsticksComponentsTab').trigger('click')
  
})

Chopsticks.on('close', function () {
  
  $(document).off("slidestart", Chopsticks.pen.draw)
  
  $('#ChopsticksTray').hide()
  
  $('#ChopsticksStage,#ChopsticksBar').hide()
  
  $('#ChopsticksStage').off('click', Chopsticks.pen.insertTextBlock)
  
  
  Chopsticks.stage.close()

  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i))
    return null
  
  // iPad fixeds
  $(document).off("touchstart", Chopsticks.stopPropagation)
  // Allow someone to drag
  $(document).off("touchmove", Chopsticks.preventDefault)
  
  window.removeEventListener('copy', Chopsticks.oncopy, false)
  window.removeEventListener('cut', Chopsticks.oncut, false)
  window.removeEventListener('paste', Chopsticks.onpaste, false)
  window.removeEventListener('resize', Chopsticks.onresize, false)
  $("body").off("keydown", Chopsticks.onkeydown)
  
  Events.shortcut.shortcuts = {}
  
  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.removeEventListener('touchstart', Chopsticks.Mouse.onTouchStart, true)
    document.removeEventListener('touchend', Chopsticks.Mouse.onTouchEnd, true)
    document.removeEventListener('touchmove', Chopsticks.Mouse.onTouchMove, true)
  } else {
    document.removeEventListener('mousedown', Chopsticks.Mouse.onmousedown, true)
    document.removeEventListener('mousemove', Chopsticks.Mouse.onmousemove, true)
    document.removeEventListener('mouseup', Chopsticks.Mouse.onmouseup, true)
  }

  
})

Chopsticks.on('open', function () {
  
  $(document).on('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#ChopsticksStage').on("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').on("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).on('mousedown click','input.scrap,textarea.scrap', Chopsticks.returnFalse)
  $(document).on('focus', 'input.scrap,textarea.scrap', Chopsticks.blurThis)
  
  $("#ChopsticksStage").on("tap", Chopsticks.stage.clearOnTap)
  $(window).on('resize', Chopsticks.stage.onresize)
  
})

Chopsticks.on('close', function () {
  $(document).off('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#ChopsticksStage').off("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').off("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).off('mousedown click','input.scrap,textarea.scrap', Chopsticks.returnFalse)
  $(document).off('focus', 'input.scrap,textarea.scrap', Chopsticks.blurThis)
  
  $("#ChopsticksStage").off("tap", Chopsticks.stage.clearOnTap)
  $(window).off('resize', Chopsticks.stage.onresize)

})

Chopsticks.on('commit', Chopsticks.stage.expand)

Chopsticks.on('page', function () {
  Chopsticks.stage.expand()
  Chopsticks.stage.views.get(Chopsticks.stage.currentView)()
  $('#ChopsticksStageBody').width() // Force repaint
  Chopsticks.stage.reset()

})






