// adapted from http://stackoverflow.com/questions/4217962/scroll-to-an-element-using-jquery
$.fn.scrollMinimal = function(smooth) {
  var cTop = this.position().top
  var cHeight = this.outerHeight(true)
  var windowTop = $('#BostonStage').scrollTop()
  var visibleHeight = $('#BostonStage').height()

  if (cTop < windowTop) {
    if (smooth) {
      $('#BostonStage').animate({'scrollTop': cTop}, 'slow', 'swing')
    } else {
      $('#BostonStage').scrollTop(cTop)
    }
  } else if (cTop + cHeight > windowTop + visibleHeight) {
    if (smooth) {
      $('#BostonStage').animate({'scrollTop': cTop - visibleHeight + cHeight}, 'slow', 'swing')
    } else {
      $('#BostonStage').scrollTop(cTop - visibleHeight + cHeight)
    }
  }
};

