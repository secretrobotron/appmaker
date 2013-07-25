// adapted from http://stackoverflow.com/questions/4217962/scroll-to-an-element-using-jquery
$.fn.scrollMinimal = function(smooth) {
  var cTop = this.position().top
  var cHeight = this.outerHeight(true)
  var windowTop = $('#ChopsticksStage').scrollTop()
  var visibleHeight = $('#ChopsticksStage').height()

  if (cTop < windowTop) {
    if (smooth) {
      $('#ChopsticksStage').animate({'scrollTop': cTop}, 'slow', 'swing')
    } else {
      $('#ChopsticksStage').scrollTop(cTop)
    }
  } else if (cTop + cHeight > windowTop + visibleHeight) {
    if (smooth) {
      $('#ChopsticksStage').animate({'scrollTop': cTop - visibleHeight + cHeight}, 'slow', 'swing')
    } else {
      $('#ChopsticksStage').scrollTop(cTop - visibleHeight + cHeight)
    }
  }
};

