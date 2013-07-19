Boston.dragComponent = function() {
  var path = $(this).attr('path')
  Boston.stage.dragAndDrop(Boston.components.get(path))
  mixpanel.track('I dragged a component')
}

Boston.loadComponents = function () {
  Boston.components = new Space()
  var list = $('#BostonComponentsList')
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
    Boston.components.set(path, component)
    list.append(thumb)
  })
}

Boston.tapComponent = function() {
  var path = $(this).attr('path')
  Boston.stage.insert(Boston.components.get(path), false, 0, 0, true)
  mixpanel.track('I tapped a component')
}


Boston.on('ready', Boston.loadComponents)

Boston.on('firstOpen', function () {
  
  $('#BostonComponentsList').on('tap', '.Component', Boston.tapComponent)
  $('#BostonComponentsList').on('slidestart', '.Component', Boston.dragComponent)
  $('#BostonComponentsRibbon').on('mousedown slide slidestart', Boston.stopProp)

})

