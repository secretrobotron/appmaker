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
  
  Ceci._components
  var list = $('#ChopsticksComponentsList')
  list.html('')
  _.each(Ceci._components, function (value, tag) {
    var component = new Space('tag ' + tag)
    var thumb = $('<div>' + tag + '</div>')
    thumb.attr('path', tag)
    thumb.addClass('ChopsticksComponent')
    // todo: we should not need to do this
    thumb.removeClass('scrap')
    Chopsticks.components.set(tag + ' ' + tag, component)
    list.append(thumb)
  })
}

Chopsticks.tapComponent = function() {
  // insert Ceci
  if (!Chopsticks.page.get('body scraps ceci'))
    Chopsticks.stage.insert('ceci\n tag script\n src http://mozilla.github.io/Ceci/ceci-combo.js\n class ceciScript', false, 0, 0, true)
  
  var path = $(this).attr('path')
  var result = Chopsticks.stage.insert(Chopsticks.components.get(path), false, 0, 0, true)
  mixpanel.track('I tapped a component')
  Ceci.faire($(result[0])[0])
}

Chopsticks.on('firstOpen', function () {
  
  $('body').append('<script src="http://mozilla.github.io/Ceci/ceci-combo.js"></script>')
  
  setTimeout('Ceci.commencer();Chopsticks.loadComponents()', 1000)
  
  $('#ChopsticksComponentsList').on('tap', '.ChopsticksComponent', Chopsticks.tapComponent)
  $('#ChopsticksComponentsList').on('slidestart', '.ChopsticksComponent', Chopsticks.dragComponent)
  $('#ChopsticksTray').on('mousedown slide slidestart', Chopsticks.stopProp)

})

