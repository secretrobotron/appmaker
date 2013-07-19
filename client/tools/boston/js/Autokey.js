Boston.autokey = function (space, prefix) {
  prefix = prefix || ''
  if (!space.get(prefix))
    return prefix
  
  var i = 2
  while (space.get(prefix + i.toString())) {
    i++
  }
  return prefix + i.toString()
}
