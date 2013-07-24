Designer.isFirstOpen = true

Designer.on('page', Designer.updateTabs)

Designer.on('step', Designer.stage.updateTimeline)

Designer.on('ready', function () {
  // We dont use the default tool convention
  $('#Designer').hide()
})

Designer.on('open', function () {

  Designer.grid = new Grid()
  
  $('#DesignerStage,#DesignerBar').show()
  
  Screens.on('change', Designer.updateSelections)
  Screens.on('change', Designer.updateTabs)
  
  Project.on('delete', Designer.updateTabs)
  
  Lasso.selector = '#DesignerStageBody .scrap:visible'
  $(document).on('lasso', '.scrap', function () {
    $(this).selectMe(true)
    return false
  })
  Lasso.enable()
  
  $(document).on("slidestart", Designer.pen.draw)
  
  $('#DesignerStage').on('click', Designer.pen.insertTextBlock)

  // Prevent Images from dragging on Firefox
  $(document).on('dragstart', 'img', function(event) { event.preventDefault()})
  
  // Open the last open page, or create a new untitled page.
  var page = store.get('activePage')
  if (!Project.get('pages ' + page))
    Designer.menu.create()
  else
    Designer.stage.open(page)
  
  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
    // iPad fixeds
    $(document).on("touchstart", Designer.stopPropagation)
    // Allow someone to drag
    $(document).on("touchmove", Designer.preventDefault) 
  }
  
  
  window.addEventListener('copy', Designer.oncopy, false)
  window.addEventListener('cut', Designer.oncut, false)
  window.addEventListener('paste', Designer.onpaste, false)
  window.addEventListener('resize', Designer.onresize, false)
  
  $("body").on("keydown", Designer.onkeydown)

  Events.shortcut.shortcuts = Designer.shortcuts


  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.addEventListener('touchstart', Designer.Mouse.onTouchStart, true)
    document.addEventListener('touchend', Designer.Mouse.onTouchEnd, true)
    document.addEventListener('touchmove', Designer.Mouse.onTouchMove, true)
  } else {
    document.addEventListener('mousedown', Designer.Mouse.onmousedown, true)
    document.addEventListener('mousemove', Designer.Mouse.onmousemove, true)
    document.addEventListener('mouseup', Designer.Mouse.onmouseup, true)
  }
  
  // temporary fix until we clean this up.
  if (Designer.isFirstOpen) {
    Designer.isFirstOpen = false
    Designer.trigger('firstOpen')
  }
  
  $('#DesignerComponentsTab').trigger('click')
  
})

Designer.on('close', function () {
  
  $(document).off("slidestart", Designer.pen.draw)
  
  $('#DesignerImagesRibbon,#DesignerComponentsRibbon').hide()
  
  $('#DesignerStage,#DesignerBar').hide()
  
  Designer.off('selection', Designer.broadcastSelection)
  Screens.off('change', Designer.updateSelections)
  Screens.off('change', Designer.updateTabs)
  $('#DesignerStage').off('click', Designer.pen.insertTextBlock)
  
  Project.off('delete', Designer.updateTabs)
  
  Designer.stage.close()

  if (!navigator.userAgent.match(/iPad|iPhone|iPod/i))
    return null
  
  // iPad fixeds
  $(document).off("touchstart", Designer.stopPropagation)
  // Allow someone to drag
  $(document).off("touchmove", Designer.preventDefault)
  
  window.removeEventListener('copy', Designer.oncopy, false)
  window.removeEventListener('cut', Designer.oncut, false)
  window.removeEventListener('paste', Designer.onpaste, false)
  window.removeEventListener('resize', Designer.onresize, false)
  $("body").off("keydown", Designer.onkeydown)
  
  Events.shortcut.shortcuts = {}
  
  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ) {
    document.removeEventListener('touchstart', Designer.Mouse.onTouchStart, true)
    document.removeEventListener('touchend', Designer.Mouse.onTouchEnd, true)
    document.removeEventListener('touchmove', Designer.Mouse.onTouchMove, true)
  } else {
    document.removeEventListener('mousedown', Designer.Mouse.onmousedown, true)
    document.removeEventListener('mousemove', Designer.Mouse.onmousemove, true)
    document.removeEventListener('mouseup', Designer.Mouse.onmouseup, true)
  }

  
})

Designer.on('open', function () {
  
  // Todo: refactor
  Events.shortcut.onfire = Designer.trackShortcuts
  
  $(document).on('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#DesignerStage').on("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').on("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).on('mousedown click','input.scrap,textarea.scrap', Designer.returnFalse)
  $(document).on('focus', 'input.scrap,textarea.scrap', Designer.blurThis)
  
  $("#DesignerStage").on("tap", Designer.stage.clearOnTap)
  $(window).on('resize', Designer.stage.onresize)
  
})

Designer.on('selection', Designer.broadcastSelection)

Designer.on('close', function () {
  $(document).off('click', 'a.scrap, .scrap a, .scrap div', Scrap.disableLinks)
  $('#DesignerStage').off("tap", ".scrap", Scrap.selectOnTap)
  
  $('body').off("hold", ".scrap", Scrap.unlock)
  
  // When editing input blocks, prevent them from taking focus
  $(document).off('mousedown click','input.scrap,textarea.scrap', Designer.returnFalse)
  $(document).off('focus', 'input.scrap,textarea.scrap', Designer.blurThis)
  
  $("#DesignerStage").off("tap", Designer.stage.clearOnTap)
  $(window).off('resize', Designer.stage.onresize)

})

Designer.on('commit', Designer.stage.expand)

Designer.on('page', function () {
  Designer.stage.expand()
  Designer.stage.views.get(Designer.stage.currentView)()
  $('#DesignerStageBody').width() // Force repaint
  Designer.stage.reset()

})






