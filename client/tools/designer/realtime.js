Designer.realtime = function (key, value) {
  
  // 
  
  var parts = key.split(/ /g)
  if (parts[0] !== 'timelines' || parts[1] !== Designer.stage.activePage)
    return true
  var behind = Designer.stage.isBehind()
  var commit = value.get('values')
//  console.log(commit.toString())
  
  Designer.trigger('step')
  
//  if (behind)
//    return true

//  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
//    return true

  // Todo: this breaks if you are in content editable
  Designer.stage.redo()
  
}

Designer.on('close', function () {
  Project.off('incoming-append', Designer.realtime)
})

Designer.on('open', function () {
  Project.on('incoming-append', Designer.realtime)
})

/*
onpatch
var behind = Designer.stage.isBehind()

// If the page has been deleted, change page
if (patch.get('pages ' + Designer.stage.activePage) === '')
  Designer.stage.back()
  
  Designer.updateTabs()

  // If the active page isnt touched, we are all done
  if (!patch.get('timelines ' + Designer.stage.activePage))
    return true    

  if (behind)
    return Designer.trigger('step')

  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return Designer.trigger('step')

  // Todo: this breaks if you are in content editable
  Designer.stage.redo()

*/