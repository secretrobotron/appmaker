var Chopsticks = new Tool('Chopsticks')
Chopsticks.set('color', 'rgba(26, 134, 214, 1)')
Chopsticks.set('description', 'Design pages for your project.')

// What spot the maker is on the timeline for the current page
Chopsticks.page = new Page()
Chopsticks.edge = new Space()
Chopsticks.stage = {}
Chopsticks.stage.activePage = null
Chopsticks.menu = {}
// store.get('activePage')
Chopsticks.stage.selection = {}

Chopsticks.blurThis = function (){
  $(this).blur()
}

Chopsticks.stopProp = function(event) {
  event.stopPropagation()
}

Chopsticks.stopPropagation = function(event) {
  if (event.originalEvent.touches.length > 1) {
    event.stopPropagation()
  }
}

Chopsticks.preventDefault = function(event) {
  if (event.originalEvent.touches.length == 1) {
    event.preventDefault()
  }
}

Chopsticks.returnFalse = function (){
  return false
}



