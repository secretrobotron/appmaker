Boston.pen = {
  on : false
}

Boston.pen.insertTextBlock = function (event) {
  
  if (!event.metaKey)
    return true
  
  var offsetLeft = $('#BostonStageBody').offset().left
  var offsetTop = $('#BostonStageBody').offset().top
  var x = Boston.Mouse.down.pageX - offsetLeft
  var y = Boston.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('text', new Space("tag h2\nstyle\n position absolute\n left " + x + "px\n top " + y + "px\n"))
  var selector = Boston.stage.insert(scraps)[0]
  $(selector).scrap().edit()
  
}

Boston.pen.draw = function (event) {
  
  if (!Boston.pen.on && !Boston.Mouse.down.metaKey)
    return true
  
  if (!Boston.Mouse.isDown)
    return true
  
  if ($.isOnScrollbar(Boston.Mouse.down.clientX, Boston.Mouse.down.clientY))
    return true
  
  var offsetLeft = $('#BostonStageBody').offset().left
  var offsetTop = $('#BostonStageBody').offset().top
  var x = Boston.Mouse.down.pageX - offsetLeft
  var y = Boston.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('container', new Space("style\n position absolute\n left " + x + "px\n top " + y + "px\n width 1px\n height 1px\n"))
  var selector = Boston.stage.insert(scraps)[0]
  var id = $(selector).scrap().id
  console.log(id)
  // Pretend the mousedown was on the stretch handle
  Events.slide.target = $("#stretchHandleBottomRight" + id)
  $("#stretchHandleBottomRight" + id).triggerHandler("mousedown")
  $("#stretchHandleBottomRight" + id).triggerHandler("slidestart")
  mixpanel.track('I used the pen tool')
}

