Boston.realtime = function (key, value) {
  
  // 
  
  var parts = key.split(/ /g)
  if (parts[0] !== 'timelines' || parts[1] !== Boston.stage.activePage)
    return true
  var behind = Boston.stage.isBehind()
  var commit = value.get('values')
//  console.log(commit.toString())
  
  Boston.trigger('step')
  
//  if (behind)
//    return true

//  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
//    return true

  // Todo: this breaks if you are in content editable
  Boston.stage.redo()
  
}

Boston.on('close', function () {
  Project.off('incoming-append', Boston.realtime)
})

Boston.on('open', function () {
  Project.on('incoming-append', Boston.realtime)
})

/*
onpatch
var behind = Boston.stage.isBehind()

// If the page has been deleted, change page
if (patch.get('pages ' + Boston.stage.activePage) === '')
  Boston.stage.back()
  
  Boston.updateTabs()

  // If the active page isnt touched, we are all done
  if (!patch.get('timelines ' + Boston.stage.activePage))
    return true    

  if (behind)
    return Boston.trigger('step')

  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return Boston.trigger('step')

  // Todo: this breaks if you are in content editable
  Boston.stage.redo()

*/