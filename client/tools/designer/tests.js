var equal = function (a, b) {
  if (a === b)
    return console.log('PASS.')
  console.log('FAIL. We wanted %s but we got %s', a, b)
//  if (true)
//    debugger
}

console.log('Testing...')
// Create a new page
Designer.menu.create()
// Stage should be empty
equal(0, $('#DesignerStageBody').children().length)



// Paste
Designer.menu.create()
// Stage should be empty
equal(0, $('#DesignerStageBody').children().length)
Designer.pasteHtml('<a>Hello world</a>')
// Stage should have 1 element
equal(1, $('#DesignerStageBody').children().length)



