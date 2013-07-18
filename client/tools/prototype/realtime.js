Prototype.realtime = function (key, value) {
  
  // 
  
  var parts = key.split(/ /g)
  if (parts[0] !== 'timelines' || parts[1] !== Prototype.stage.activePage)
    return true
  var behind = Prototype.stage.isBehind()
  var commit = value.get('values')
//  console.log(commit.toString())
  
  Prototype.trigger('step')
  
//  if (behind)
//    return true

//  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
//    return true

  // Todo: this breaks if you are in content editable
  Prototype.stage.redo()
  
}

Prototype.on('close', function () {
  Project.off('incoming-append', Prototype.realtime)
})

Prototype.on('open', function () {
  Project.on('incoming-append', Prototype.realtime)
})

/*
onpatch
var behind = Prototype.stage.isBehind()

// If the page has been deleted, change page
if (patch.get('pages ' + Prototype.stage.activePage) === '')
  Prototype.stage.back()
  
  Prototype.updateTabs()

  // If the active page isnt touched, we are all done
  if (!patch.get('timelines ' + Prototype.stage.activePage))
    return true    

  if (behind)
    return Prototype.trigger('step')

  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return Prototype.trigger('step')

  // Todo: this breaks if you are in content editable
  Prototype.stage.redo()

*/