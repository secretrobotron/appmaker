var Boston = new Tool('Boston')
Boston.set('color', 'rgba(26, 134, 214, 1)')
Boston.set('description', 'Design pages for your project.')

// What spot the maker is on the timeline for the current page
Boston.page = new Page()
Boston.edge = new Space()
Boston.stage = {}
Boston.stage.activePage = 'index'
Boston.menu = {}
// store.get('activePage')
Boston.stage.selection = {}

Boston.blurThis = function (){
  $(this).blur()
}

Boston.stopProp = function(event) {
  event.stopPropagation()
}

Boston.stopPropagation = function(event) {
  if (event.originalEvent.touches.length > 1) {
    event.stopPropagation()
  }
}

Boston.preventDefault = function(event) {
  if (event.originalEvent.touches.length == 1) {
    event.preventDefault()
  }
}

Boston.returnFalse = function (){
  return false
}


