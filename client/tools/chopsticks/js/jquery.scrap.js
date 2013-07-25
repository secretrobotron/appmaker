$.fn.deselect = function (quiet) {
  var id = $(this).attr('id')
  $(this).removeClass('selection')
  $('.' + id + 'Handle').remove()
  if (!quiet)
    Chopsticks.trigger('selection')
  return $(this)
}

$.fn.duplicate = function () {
  
  var scrap = $(this).scrap()
  var id = $(this).attr('id')
  var parent = Chopsticks.page
  var path = $(this).parentPath()
  if (path) {
    parent = Chopsticks.page.get(path)
    path = path.replace(/ scraps/g,'') + ' '
  }
  var key = Chopsticks.autokey(parent, id)
  var newScrap = new Scrap(path + key, scrap.toString())
  var index = parent.keys.indexOf(id) + 1
  parent.set(key, newScrap, index)
  $(this).deselect(true)
  var element = newScrap.render(null, index).element()
  if (element.css('position') === 'absolute')
    newScrap.move(10,10)
  element.selectMe(true)
}

$.fn.owner = function () {
  return Chopsticks.page.get($(this).attr('value')).element()
}

$.fn.parentPath = function () {
  var path = $(this).attr('path')
  if (!path.match(/ /))
    return ''
  return path.replace(/ [^ ]+$/,'')
}

$.fn.scrap = function () {
  return Chopsticks.page.get($(this).attr('path'))
}

/**
 * @param {string}
 * @return {Scrap} this
 */
$.fn.selectMe = function (quiet) {
  
  var scrap = $(this).scrap()
  
  if (scrap.get('locked'))
    return false
  
  // Dont double select things
  if ($(this).hasClass('selection'))
    return this
  $(this).addClass('selection')
  

  Chopsticks.MoveHandle.create(scrap)
  
  if (!quiet)
    Chopsticks.trigger('selection')
  
  var style = scrap.get('style')
  // If no width, return
  if (!style)
    return this
  
  // Set Fixed proportions or not
  var fixed = (style.get('background-image') && style.get('background-size') === 'contain')
  
  if (fixed) {
    Chopsticks.StretchHandle.create(scrap, "middle", "left", fixed)
    Chopsticks.StretchHandle.create(scrap, "middle", "right", fixed)
    return this
  }
  
  // Everything can be resized
  Chopsticks.StretchHandle.create(scrap, "top", "left")
  Chopsticks.StretchHandle.create(scrap, "top", "center")
  Chopsticks.StretchHandle.create(scrap, "top", "right")
  Chopsticks.StretchHandle.create(scrap, "middle", "left")
  Chopsticks.StretchHandle.create(scrap, "middle", "right")
  Chopsticks.StretchHandle.create(scrap, "bottom", "left")
  Chopsticks.StretchHandle.create(scrap, "bottom", "center")
  Chopsticks.StretchHandle.create(scrap, "bottom", "right")
  
  return $(this)
}

$.fn.togglePosition = function () {
  var scrap = $(this).scrap()
  var position = 'absolute'
  if ($(this).css('position') === 'absolute') {
    position = 'relative'
    scrap.set('style left', '')
    scrap.set('style top', '')
  } else {
    scrap.set('style left', '0px')
    scrap.set('style top', '0px')
  }
  scrap.set('style position', position)
  $(this).attr('style', '')
  $(this).css(scrap.get('style').values)
}

$.fn.toggleSize = function () {
  var scrap = $(this).scrap()
  
  var width = $(this).width() + 'px'
  if (!scrap.get('style width') || !scrap.get('style width').match(/\%/))
    width = Math.round(100*$(this).width()/$(this).parent().width()) + '%'
  scrap.set('style width', width)
  
  var height = $(this).height() + 'px'
  if (!scrap.get('style height') || !scrap.get('style height').match(/\%/))
    height = Math.round(100*$(this).height()/$(this).parent().height()) + '%'
  scrap.set('style height', height)
  
  $(this).css({
    width : width,
    height : height
  })
}

