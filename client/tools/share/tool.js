var Share = new Tool('Share')
Share.set('color', 'rgba(231, 189, 44, 1)')
Share.set('description', 'Share your project for others to remix.')
Share.set('beta', true)

Share.on('open', function () {
  
  var code = '<form method="post" action="http://' + Project.get('hostname') + '/create">'
  code += '<input type="hidden" name="dir" value="/nudgepad/projects/' + document.location.host + '">'
  code += '<button type="submit">Create</button>'
  code += '</form>'
  $('#ShareCode').val(code)
    
})
