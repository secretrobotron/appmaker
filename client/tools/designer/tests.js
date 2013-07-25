Test.add('test create', function () {
  // Create a new page
  Designer.menu.create()
  // Stage should be empty
  Test.equal(0, $('#DesignerStageBody').children().length)
})

// Paste
Test.add('paste html', function () {
  Designer.menu.create()
  // Stage should be empty
  Test.equal(0, $('#DesignerStageBody').children().length)
  Designer.pasteHtml('<a>Hello world</a>')
  // Stage should have 1 element
  Test.equal(1, $('#DesignerStageBody').children().length)
})

Test.add('https://github.com/nudgepad/nudgepad/issues/332', function () {
  Designer.menu.create()
  Designer.pasteHtml('<head><title id="title">Hello world</title></head>')
  Test.equal($('#Test332').text(), Designer.page.toString())  
})

Test.start()
