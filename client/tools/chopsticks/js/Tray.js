Chopsticks.dragComponent = function() {
  var path = $(this).attr('path')
  /* 
  function (selector) {
    Flasher.success('dropped')
  }
  */
  Chopsticks.stage.dragAndDrop(Chopsticks.components.get(path))
  mixpanel.track('I dragged a component')
}

Chopsticks.loadComponents = function () {
  Chopsticks.components = new Space()
  var list = $('#ChopsticksComponentsList')
  list.html('')
  $('.ChopsticksComponents').each(function () {
    var path = $(this).attr('path')
    var component = new Space($(this).text())
    var thumb = $(new Scrap(path, component.get('thumb')).toHtml())
    thumb.attr('path', path)
    thumb.addClass('ChopsticksComponent')
    // todo: we should not need to do this
    thumb.removeClass('scrap')
    component.delete('thumb')
    Chopsticks.components.set(path, component)
    list.append(thumb)
  })
}

Chopsticks.tapComponent = function() {
  var path = $(this).attr('path')
  Chopsticks.stage.insert(Chopsticks.components.get(path), false, 0, 0, true)
  mixpanel.track('I tapped a component')
}


Chopsticks.on('ready', Chopsticks.loadComponents)

Chopsticks.on('firstOpen', function () {
  
  $('#ChopsticksComponentsList').on('tap', '.ChopsticksComponent', Chopsticks.tapComponent)
  $('#ChopsticksComponentsList').on('slidestart', '.ChopsticksComponent', Chopsticks.dragComponent)
  $('#ChopsticksTray').on('mousedown slide slidestart', Chopsticks.stopProp)

})

