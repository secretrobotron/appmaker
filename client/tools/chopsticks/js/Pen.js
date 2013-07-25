Chopsticks.pen = {
  on : false
}

Chopsticks.pen.insertTextBlock = function (event) {
  
  if (!event.metaKey)
    return true
  
  var offsetLeft = $('#ChopsticksStageBody').offset().left
  var offsetTop = $('#ChopsticksStageBody').offset().top
  var x = Chopsticks.Mouse.down.pageX - offsetLeft
  var y = Chopsticks.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('text', new Space("tag h2\nstyle\n position absolute\n left " + x + "px\n top " + y + "px\n"))
  var selector = Chopsticks.stage.insert(scraps)[0]
  $(selector).scrap().edit()
  
}

Chopsticks.pen.draw = function (event) {
  
  if (!Chopsticks.pen.on && !Chopsticks.Mouse.down.metaKey)
    return true
  
  if (!Chopsticks.Mouse.isDown)
    return true
  
  if ($.isOnScrollbar(Chopsticks.Mouse.down.clientX, Chopsticks.Mouse.down.clientY))
    return true
  
  var offsetLeft = $('#ChopsticksStageBody').offset().left
  var offsetTop = $('#ChopsticksStageBody').offset().top
  var x = Chopsticks.Mouse.down.pageX - offsetLeft
  var y = Chopsticks.Mouse.down.pageY - offsetTop
  var scraps = new Space().set('container', new Space("style\n position absolute\n left " + x + "px\n top " + y + "px\n width 1px\n height 1px\n"))
  var selector = Chopsticks.stage.insert(scraps)[0]
  var id = $(selector).scrap().id
  console.log(id)
  // Pretend the mousedown was on the stretch handle
  Events.slide.target = $("#stretchHandleBottomRight" + id)
  $("#stretchHandleBottomRight" + id).triggerHandler("mousedown")
  $("#stretchHandleBottomRight" + id).triggerHandler("slidestart")
  mixpanel.track('I used the pen tool')
}

