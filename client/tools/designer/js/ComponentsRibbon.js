Designer.dragComponent = function() {
  var path = $(this).attr('path')
  Designer.stage.dragAndDrop(Designer.components.get(path))
  mixpanel.track('I dragged a component')
}

Designer.loadComponents = function () {
  Designer.components = new Space()
  var list = $('#DesignerComponentsList')
  list.html('')
  $('.ComponentSet').each(function () {
    var path = $(this).attr('path')
    var component = new Space($(this).text())
    var thumb = $(new Scrap(path, component.get('thumb')).toHtml())
    thumb.attr('path', path)
    thumb.addClass('Component')
    // todo: we should not need to do this
    thumb.removeClass('scrap')
    component.delete('thumb')
    Designer.components.set(path, component)
    list.append(thumb)
  })
}

Designer.tapComponent = function() {
  var path = $(this).attr('path')
  Designer.stage.insert(Designer.components.get(path), false, 0, 0, true)
  mixpanel.track('I tapped a component')
}


Designer.on('ready', Designer.loadComponents)

Designer.on('firstOpen', function () {
  
  $('#DesignerComponentsList').on('tap', '.Component', Designer.tapComponent)
  $('#DesignerComponentsList').on('slidestart', '.Component', Designer.dragComponent)
  $('#DesignerComponentsRibbon').on('mousedown slide slidestart', Designer.stopProp)

})

