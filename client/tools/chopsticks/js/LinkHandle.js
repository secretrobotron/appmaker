Chopsticks.LinkHandle = {}

Chopsticks.LinkHandle.create = function (scrap) {
  var element = scrap.element()
  Chopsticks.LinkHandle.scrap = scrap
  var container = $('<div class="ChopsticksLinkHandle"></div>')
  container.attr('value', scrap.getPath())
  container.addClass('handle linkHandle ' + scrap.id + 'Handle')
  var linkOptions = $('<ul></ul>')
  
  $('.scrap').not(element).each(function () {
    
    var choice = $('<li class="Linker">' + $(this).attr('id') + '</li>')
    linkOptions.append(choice)
    
  })

  container.append(linkOptions)
  
  element.parent().append(container)
  container.on("update", Chopsticks.LinkHandle.update)
  container.trigger("update")
}

Chopsticks.LinkHandle.update = function () {
  var owner = $(this).owner()
  $(this).css({
  "left" : owner.position().left + 2 + "px",
  "top" : owner.position().top + owner.outerHeight(true) + 4 + "px"
  })
}

$(document).on('ready', function () {
  $(document).on('tap', '.Linker', function (event) {
    console.log(this)
    console.log('link to ')
    console.log($('.selection'))
    
    var target = $(this).text()
    var scrap = Chopsticks.LinkHandle.scrap
    scrap.set('scraps link', new Space('tag avast\nmy value\nbe text\nto #' + target))    
    Chopsticks.stage.commit()
    event.stopPropagation()
    event.preventDefault()
    return false
  })
})

