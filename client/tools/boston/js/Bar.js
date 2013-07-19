Boston.on('firstOpen', function () {
  
  $('#BostonImageTab').on('click', function () {
    $('#BostonComponentsRibbon').hide()
    $('#BostonImagesRibbon').toggle()
  })  

  $('#BostonComponentsTab').on('click', function () {
    $('#BostonImagesRibbon').hide()
    $('#BostonComponentsRibbon').toggle()
  })
  
  // todo: clean up. remove this Popup class and manually bind it.
  // maybe use a debounce pattern. (the one where it calls itself once)
  // like jquery.one()
  $('#BostonBarMenuButton').on('mousedown', function (event) {
    if ($('#BostonMenu:visible').length > 0) {
      Popup.hide(event)
      return true
    }
    Popup.open('#BostonMenu')
    mixpanel.track('I opened the designer menu')
  })
  $('#BostonBarMenuButton').on('mouseup', function (event) {
    event.stopPropagation()
    return false
  })

  // We do this on live, so that it wont interfere with events bound
  // to items inside the ribbon, but it will prevent events from
  // reaching nudgepadbody hopefull
  $('#BostonBar').on('slide slidestart', function (event) {
    
    event.stopPropagation()
  })

})



