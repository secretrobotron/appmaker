Prototype.dragComponent = function() {
  var path = $(this).attr('path')
  Prototype.stage.dragAndDrop(Prototype.components.get(path))
  mixpanel.track('I dragged a component')
}

Prototype.loadComponents = function () {
  Prototype.components = new Space()
  var list = $('#PrototypeComponentsList')
  list.html('')
  console.log('hi')
  $('.ComponentSet').each(function () {
    var path = $(this).attr('path')
    var component = new Space($(this).text())
    var thumb = $(new Scrap(path, component.get('thumb')).toHtml())
    thumb.attr('path', path)
    thumb.addClass('Component')
    // todo: we should not need to do this
    thumb.removeClass('scrap')
    component.delete('thumb')
    Prototype.components.set(path, component)
    list.append(thumb)
  })
}

Prototype.tapComponent = function() {
  var path = $(this).attr('path')
  Prototype.stage.insert(Prototype.components.get(path), false, 0, 0, true)
  mixpanel.track('I tapped a component')
}


Prototype.on('ready', Prototype.loadComponents)

Prototype.on('firstOpen', function () {
  
  $('#PrototypeComponentsList').on('tap', '.Component', Prototype.tapComponent)
  $('#PrototypeComponentsList').on('slidestart', '.Component', Prototype.dragComponent)
  $('#PrototypeComponentsRibbon').on('mousedown slide slidestart', Prototype.stopProp)

})

