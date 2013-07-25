var Test = {}
Test.tests = []

Test.equal = function (a, b) {
  if (a === b)
    return console.log('PASS.')
  console.log('FAIL. We wanted %s but we got %s', a, b)
//  if (true)
//    debugger
}

Test.add = function (module, fn) {
  Test.tests.push(fn)
}

Test.start = function () {
  console.log('Starting tests...')
  Test.tests.forEach(function (value) {
    value()
  })
}
