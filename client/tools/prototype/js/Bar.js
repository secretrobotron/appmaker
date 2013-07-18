Prototype.on('firstOpen', function () {
  
  $('#PrototypeImageTab').on('click', function () {
    $('#PrototypeComponentsRibbon').hide()
    $('#PrototypeImagesRibbon').toggle()
  })  

  $('#PrototypeComponentsTab').on('click', function () {
    $('#PrototypeImagesRibbon').hide()
    $('#PrototypeComponentsRibbon').toggle()
  })
  
  // todo: clean up. remove this Popup class and manually bind it.
  // maybe use a debounce pattern. (the one where it calls itself once)
  // like jquery.one()
  $('#PrototypeBarMenuButton').on('mousedown', function (event) {
    if ($('#PrototypeMenu:visible').length > 0) {
      Popup.hide(event)
      return true
    }
    Popup.open('#PrototypeMenu')
    mixpanel.track('I opened the designer menu')
  })
  $('#PrototypeBarMenuButton').on('mouseup', function (event) {
    event.stopPropagation()
    return false
  })

  // We do this on live, so that it wont interfere with events bound
  // to items inside the ribbon, but it will prevent events from
  // reaching nudgepadbody hopefull
  $('#PrototypeBar').on('slide slidestart', function (event) {
    
    event.stopPropagation()
  })

})



