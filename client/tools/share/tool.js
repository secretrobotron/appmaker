var Share = new Tool('Share')
Share.set('color', 'rgba(231, 189, 44, 1)')
Share.set('description', 'Share your project for others to remix.')
Share.set('beta', true)

Share.on('open', function () {

  Share.update()
  Explorer.get('private/sharecode.txt', function (data) {
    if (data)
      Share.code = data
    else
      Share.install()
  })
})

Share.install = function () {
  
  var max = 9999999
  var min = 1000000
  
  var random = Math.floor(Math.random() * (max - min + 1)) + min
  
  Share.code = random
  
  Explorer.create('private/sharecode.txt', random, function (data) {
    console.log(data)
    Share.update()
    if (!data)
      Flasher.success('Share Code Created')
    else
      console.log(data)
  })
}


Share.update = function () {
  var code = '<form method="post" action="http://' + Project.get('hostname') + '/create">\n'
  code += '  <input type="hidden" name="dir" value="/nudgepad/projects/' + document.location.host + '">\n'
  code += '  <input type="hidden" name="sharecode" value="' + Share.code + '">\n'
  code += '  <button type="submit">Create</button>\n'
  code += '</form>'
  $('#ShareCode').val(code)
}
