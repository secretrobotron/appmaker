Designer.on('firstOpen', function () {
  
  $('#DesignerImageTab').on('click', function () {
    $('#DesignerComponentsRibbon').hide()
    $('#DesignerImagesRibbon').toggle()
  })  

  $('#DesignerComponentsTab').on('click', function () {
    $('#DesignerImagesRibbon').hide()
    $('#DesignerComponentsRibbon').toggle()
  })
  
  // todo: clean up. remove this Popup class and manually bind it.
  // maybe use a debounce pattern. (the one where it calls itself once)
  // like jquery.one()
  $('#DesignerBarMenuButton').on('mousedown', function (event) {
    if ($('#DesignerMenu:visible').length > 0) {
      Popup.hide(event)
      return true
    }
    Popup.open('#DesignerMenu')
    mixpanel.track('I opened the designer menu')
  })
  $('#DesignerBarMenuButton').on('mouseup', function (event) {
    event.stopPropagation()
    return false
  })

  // We do this on live, so that it wont interfere with events bound
  // to items inside the ribbon, but it will prevent events from
  // reaching nudgepadbody hopefull
  $('#DesignerBar').on('slide slidestart', function (event) {
    
    event.stopPropagation()
  })

})



