Test.add('test create', function () {
  // Create a new page
  Chopsticks.menu.create()
  // Stage should be empty
  Test.equal(0, $('#ChopsticksStageBody').children().length)
})

// Paste
Test.add('paste html', function () {
  Chopsticks.menu.create()
  // Stage should be empty
  Test.equal(0, $('#ChopsticksStageBody').children().length)
  Chopsticks.pasteHtml('<a>Hello world</a>')
  // Stage should have 1 element
  Test.equal(1, $('#ChopsticksStageBody').children().length)
})

Test.add('https://github.com/nudgepad/nudgepad/issues/332', function () {
  Chopsticks.menu.create()
  Chopsticks.pasteHtml('<head><title id="title">Hello world</title></head>')
  Test.equal($('#Test332').text(), Chopsticks.page.toString())  
})

Test.start()
