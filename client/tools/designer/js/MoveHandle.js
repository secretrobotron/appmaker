/**
 * MoveHandle changes the (x, y) coordinates of selected Scraps 
 */
Designer.MoveHandle = function () {
}

Designer.MoveHandle.create = function (scrap) {
  
  var element = scrap.element()
  
  
  var div = $('<div></div>')
  div.attr('value', scrap.getPath())
  div.addClass('handle ' + scrap.id + 'Handle moveHandle')
  div.attr('id', 'moveHandle' + scrap.id)
  div.attr('title', scrap.id)
  
  var position = element.css('position')
  if (position === 'fixed' || position === 'absolute') {
    div.on("mousedown", Designer.MoveHandle.mousedown)
    div.on("slide", Designer.MoveHandle.slide)
    div.on("slidestart", Designer.MoveHandle.slidestart)
    div.on("slideend", Designer.MoveHandle.slideend)
    div.css('cursor', 'move')
  }
  div.css({
    "position" : (position === 'fixed' ? 'fixed' : 'absolute'),
    "z-index" : "50"
  })
  element.parent().append(div)
  div.on("tap", Designer.MoveHandle.tap)
  div.on("update", Designer.MoveHandle.update)
  div.on("dblclick", function (event) {
    if (event.metaKey) {
      element.togglePosition()
      Designer.stage.commit()
      element.deselect().selectMe()
    } else
      scrap.edit(true)
  })
  
  div.trigger("update")
}

// We cache the start dimensions
Designer.MoveHandle.dimensions = {}

//If small block is on top of (higher z-index) a bigger block, selects small block
Designer.MoveHandle.mousedown = function () {
//  Designer.MoveHandle.selectTopScrap()
  Designer.MoveHandle.dimensions = $(this).owner().dimensions()
  Designer.grid.create()
  Designer.MoveHandle.last_x_change = 0
  Designer.MoveHandle.last_y_change = 0
  
  Designer.MoveHandle.scrollTop = Designer.stage.scrollTop()
  return true
}

/**
 * if the click is on another smaller div select that one instead of move.
 *
 * @param true. Allow propogation
 */
Designer.MoveHandle.selectTopScrap = function () {

  // get element at point
  var offsetLeft = $('#DesignerStageBody').offset().left
  var offsetTop = $('#DesignerStageBody').offset().top
  var element = $.topDiv('.scrap:visible', Designer.Mouse.down.pageX - offsetLeft, Designer.Mouse.down.pageY - offsetTop + Designer.stage.scrollTop())
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
  Designer.stage.selection.clear()
  element.selectMe()
  return true
}

/**
 * Changes top and/or left and/or bottom and/or right and/or margin
 */
Designer.MoveHandle.slide = function (event, mouseEvent) {

  var owner = $(this).owner()
  var scrap = owner.scrap()
  var dimensions = Designer.MoveHandle.dimensions
  
  var scrollChange = Designer.stage.scrollTop() - Designer.MoveHandle.scrollTop

  var grid_change = {y : 0, x : 0}

  if (!mouseEvent.shiftKey) {
    grid_change = Designer.grid.getDelta([
      {x : dimensions.left + Designer.Mouse.xChange, y : dimensions.top + Designer.Mouse.yChange + scrollChange},
      {x : dimensions.right + Designer.Mouse.xChange, y : dimensions.bottom + Designer.Mouse.yChange + scrollChange},
      {x :  dimensions.center + Designer.Mouse.xChange, y : dimensions.middle + Designer.Mouse.yChange + scrollChange}
    ])
  }
  var y_change = Designer.Mouse.yChange + scrollChange + grid_change.y
  var x_change = Designer.Mouse.xChange + grid_change.x
  

  $('.selection').each(function (){
    $(this).scrap().move(x_change - Designer.MoveHandle.last_x_change, y_change - Designer.MoveHandle.last_y_change)
  })
  
  var position = 'X ' + parseFloat(owner.css('left')) + '<br>Y ' + parseFloat(owner.css('top'))
  $('#DesignerDimensions').css({
    left : 10 + owner.offset().left + owner.outerWidth(),
    top : -10 + owner.offset().top + Math.round(owner.outerHeight(true)/2)
    }).html(position)
  
  Designer.MoveHandle.last_x_change = x_change
  Designer.MoveHandle.last_y_change = y_change
  
  return false
  
}

Designer.MoveHandle.slideend = function () {
  
  $('.handle').trigger('update').show()
  Designer.grid.removeSnaplines()
  $('#DesignerDimensions').hide()
  Designer.stage.commit()
}

Designer.MoveHandle.slidestart = function () {
  
  $('.handle').not(this).hide()
  var owner = $(this).owner()
  var position = 'X ' + parseFloat(owner.css('left')) + '<br>Y ' + parseFloat(owner.css('top'))
  $('#DesignerDimensions').css({
    left : 10 + owner.offset().left + owner.outerWidth(),
    top : -10 + owner.offset().top + Math.round(owner.outerHeight(true)/2)
    }).html(position).show()
  return false
}

// Dont propogate tap events
Designer.MoveHandle.tap = function () {
  // If shift key is down, remove from selection
  if (Designer.Mouse.down && Designer.Mouse.down.shiftKey)
    $(this).owner().deselect()
  return false
}

Designer.MoveHandle.update = function () {
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
