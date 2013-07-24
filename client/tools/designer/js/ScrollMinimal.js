// adapted from http://stackoverflow.com/questions/4217962/scroll-to-an-element-using-jquery
$.fn.scrollMinimal = function(smooth) {
  var cTop = this.position().top
  var cHeight = this.outerHeight(true)
  var windowTop = $('#DesignerStage').scrollTop()
  var visibleHeight = $('#DesignerStage').height()

  if (cTop < windowTop) {
    if (smooth) {
      $('#DesignerStage').animate({'scrollTop': cTop}, 'slow', 'swing')
    } else {
      $('#DesignerStage').scrollTop(cTop)
    }
  } else if (cTop + cHeight > windowTop + visibleHeight) {
    if (smooth) {
      $('#DesignerStage').animate({'scrollTop': cTop - visibleHeight + cHeight}, 'slow', 'swing')
    } else {
      $('#DesignerStage').scrollTop(cTop - visibleHeight + cHeight)
    }
  }
};

