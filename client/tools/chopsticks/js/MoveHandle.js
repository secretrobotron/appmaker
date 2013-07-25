/**
 * MoveHandle changes the (x, y) coordinates of selected Scraps 
 */
Chopsticks.MoveHandle = function () {
}

Chopsticks.MoveHandle.create = function (scrap) {
  
  var element = scrap.element()
  
  
  var div = $('<div></div>')
  div.attr('value', scrap.getPath())
  div.addClass('handle ' + scrap.id + 'Handle moveHandle')
  div.attr('id', 'moveHandle' + scrap.id)
  div.attr('title', scrap.id)
  
  var position = element.css('position')
  if (position === 'fixed' || position === 'absolute') {
    div.on("mousedown", Chopsticks.MoveHandle.mousedown)
    div.on("slide", Chopsticks.MoveHandle.slide)
    div.on("slidestart", Chopsticks.MoveHandle.slidestart)
    div.on("slideend", Chopsticks.MoveHandle.slideend)
    div.css('cursor', 'move')
  }
  div.css({
    "position" : (position === 'fixed' ? 'fixed' : 'absolute'),
    "z-index" : "50"
  })
  element.parent().append(div)
  div.on("tap", Chopsticks.MoveHandle.tap)
  div.on("update", Chopsticks.MoveHandle.update)
  div.on("dblclick", function (event) {
    if (event.metaKey) {
      element.togglePosition()
      Chopsticks.stage.commit()
      element.deselect().selectMe()
    } else
      scrap.edit(true)
  })
  
  div.trigger("update")
}

// We cache the start dimensions
Chopsticks.MoveHandle.dimensions = {}

//If small block is on top of (higher z-index) a bigger block, selects small block
Chopsticks.MoveHandle.mousedown = function () {
//  Chopsticks.MoveHandle.selectTopScrap()
  Chopsticks.MoveHandle.dimensions = $(this).owner().dimensions()
  Chopsticks.MoveHandle.last_x_change = 0
  Chopsticks.MoveHandle.last_y_change = 0
  
  Chopsticks.MoveHandle.scrollTop = Chopsticks.stage.scrollTop()
  return true
}

/**
 * if the click is on another smaller div select that one instead of move.
 *
 * @param true. Allow propogation
 */
Chopsticks.MoveHandle.selectTopScrap = function () {

  // get element at point
  var offsetLeft = $('#ChopsticksStageBody').offset().left
  var offsetTop = $('#ChopsticksStageBody').offset().top
  var element = $.topDiv('.scrap:visible', Chopsticks.Mouse.down.pageX - offsetLeft, Chopsticks.Mouse.down.pageY - offsetTop + Chopsticks.stage.scrollTop())
  // if a narrow div and no element underneath, return
  if (!element)
    return true
  // Its the selection block
  if (element.hasClass("selection"))
    return true
  var scrap = element.scrap()
  // Dont select block if locked
  if (scrap.get('locked'))
    return true
  Chopsticks.stage.selection.clear()
  element.selectMe()
  return true
}

/**
 * Changes top and/or left and/or bottom and/or right and/or margin
 */
Chopsticks.MoveHandle.slide = function (event, mouseEvent) {

  var owner = $(this).owner()
  var scrap = owner.scrap()
  var dimensions = Chopsticks.MoveHandle.dimensions
  
  var scrollChange = Chopsticks.stage.scrollTop() - Chopsticks.MoveHandle.scrollTop

  var y_change = Chopsticks.Mouse.yChange + scrollChange
  var x_change = Chopsticks.Mouse.xChange
  

  $('.selection').each(function (){
    $(this).scrap().move(x_change - Chopsticks.MoveHandle.last_x_change, y_change - Chopsticks.MoveHandle.last_y_change)
  })
  
  var position = 'X ' + parseFloat(owner.css('left')) + '<br>Y ' + parseFloat(owner.css('top'))
  $('#ChopsticksDimensions').css({
    left : 10 + owner.offset().left + owner.outerWidth(),
    top : -10 + owner.offset().top + Math.round(owner.outerHeight(true)/2)
    }).html(position)
  
  Chopsticks.MoveHandle.last_x_change = x_change
  Chopsticks.MoveHandle.last_y_change = y_change
  
  return false
  
}

Chopsticks.MoveHandle.slideend = function () {
  
  $('.handle').trigger('update').show()
  $('#ChopsticksDimensions').hide()
  Chopsticks.stage.commit()
}

Chopsticks.MoveHandle.slidestart = function () {
  
  $('.handle').not(this).hide()
  var owner = $(this).owner()
  var position = 'X ' + parseFloat(owner.css('left')) + '<br>Y ' + parseFloat(owner.css('top'))
  $('#ChopsticksDimensions').css({
    left : 10 + owner.offset().left + owner.outerWidth(),
    top : -10 + owner.offset().top + Math.round(owner.outerHeight(true)/2)
    }).html(position).show()
  return false
}

// Dont propogate tap events
Chopsticks.MoveHandle.tap = function () {
  // If shift key is down, remove from selection
  if (Chopsticks.Mouse.down && Chopsticks.Mouse.down.shiftKey)
    $(this).owner().deselect()
  return false
}

Chopsticks.MoveHandle.update = function () {
  var owner = $(this).owner()
  if (!owner.position())
    debugger
  // make it easy to move narrow divs
  var top_padding  = Math.min(10, owner.outerHeight(true) - 20)
  var left_padding = Math.min(10, owner.outerWidth() - 20)
  var style = {
    "left" : owner.position().left + left_padding  + 'px',
    "top" : (owner.position().top + top_padding) + 'px',
    "height" : (owner.outerHeight(true) - top_padding * 2) + 'px',
    "width" : (owner.outerWidth() - left_padding * 2)  + 'px'}
  $(this).css(style)
}
