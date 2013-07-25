var Designer = new Tool('Designer')
Designer.set('color', 'rgba(26, 134, 214, 1)')
Designer.set('description', 'Design pages for your project.')

// What spot the maker is on the timeline for the current page
Designer.page = new Page()
Designer.edge = new Space()
Designer.stage = {}
Designer.stage.activePage = null
Designer.menu = {}
// store.get('activePage')
Designer.stage.selection = {}

Designer.blurThis = function (){
  $(this).blur()
}

Designer.stopProp = function(event) {
  event.stopPropagation()
}

Designer.stopPropagation = function(event) {
  if (event.originalEvent.touches.length > 1) {
    event.stopPropagation()
  }
}

Designer.preventDefault = function(event) {
  if (event.originalEvent.touches.length == 1) {
    event.preventDefault()
  }
}

Designer.returnFalse = function (){
  return false
}



