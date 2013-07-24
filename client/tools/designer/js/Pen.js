Designer.pen = {
  on : false
}

Designer.pen.insertTextBlock = function (event) {
  
  if (!event.metaKey)
    return true
  
  var offsetLeft = $('#DesignerStageBody').offset().left
  var offsetTop = $('#DesignerStageBody').offset().top
  var x = Designer.Mouse.down.pageX - offsetLeft
  var y = Designer.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('text', new Space("tag h2\nstyle\n position absolute\n left " + x + "px\n top " + y + "px\n"))
  var selector = Designer.stage.insert(scraps)[0]
  $(selector).scrap().edit()
  
}

Designer.pen.draw = function (event) {
  
  if (!Designer.pen.on && !Designer.Mouse.down.metaKey)
    return true
  
  if (!Designer.Mouse.isDown)
    return true
  
  if ($.isOnScrollbar(Designer.Mouse.down.clientX, Designer.Mouse.down.clientY))
    return true
  
  var offsetLeft = $('#DesignerStageBody').offset().left
  var offsetTop = $('#DesignerStageBody').offset().top
  var x = Designer.Mouse.down.pageX - offsetLeft
  var y = Designer.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('container', new Space("style\n position absolute\n left " + x + "px\n top " + y + "px\n width 1px\n height 1px\n"))
  var selector = Designer.stage.insert(scraps)[0]
  var id = $(selector).scrap().id
  console.log(id)
  // Pretend the mousedown was on the stretch handle
  Events.slide.target = $("#stretchHandleBottomRight" + id)
  $("#stretchHandleBottomRight" + id).triggerHandler("mousedown")
  $("#stretchHandleBottomRight" + id).triggerHandler("slidestart")
  mixpanel.track('I used the pen tool')
}

