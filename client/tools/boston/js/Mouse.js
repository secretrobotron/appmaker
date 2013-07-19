/**
 * We provide easy access to querying the mouse position and state.
 *
 * @special Singleton.
 */
Boston.Mouse = {}

// Is the mouse down?
Boston.Mouse.isDown = false

/**
 * When a mousedown starts, we keep track of how far the mouse moves. Helpful for
 * drag and drop and drawing stuff.
 */
Boston.Mouse.yChange = 0
Boston.Mouse.xChange = 0
Boston.Mouse.pathDistance = 0

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Boston.Mouse.onmousedown = function (event) {
  //  console.log('mouse down')
  Boston.Mouse.isDown = true
  Boston.Mouse.down = event
  Boston.Mouse.target = event.srcElement || event.originalTarget || event.target
  Boston.Mouse.lastX = event.pageX
  Boston.Mouse.lastY = event.pageY
  Boston.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Boston.Mouse.onmousemove = function (event) {
  Boston.Mouse.move = event
//  console.log('mouse move')
  if (!Boston.Mouse.isDown)
    return true
  
  Boston.Mouse.pathDistance += Math.abs(event.pageX - Boston.Mouse.lastX) + Math.abs(event.pageY - Boston.Mouse.lastY)
  Boston.Mouse.lastX = event.pageX
  Boston.Mouse.lastY = event.pageY
  Boston.Mouse.xChange = event.pageX - Boston.Mouse.down.pageX
  Boston.Mouse.yChange = event.pageY - Boston.Mouse.down.pageY
  Boston.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Boston.Mouse.xChange, 2) +
      Math.pow(Boston.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Boston.Mouse.onmouseup = function (event) {
  Boston.Mouse.isDown = false
  Boston.Mouse.xChange = event.pageX - Boston.Mouse.down.pageX
  Boston.Mouse.yChange = event.pageY - Boston.Mouse.down.pageY
  Boston.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Boston.Mouse.xChange, 2) +
      Math.pow(Boston.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Boston.Mouse.onTouchEnd = function (event) {
  Boston.Mouse.isDown = false
  Boston.Mouse.xChange = event.pageX - Boston.Mouse.down.pageX
  Boston.Mouse.yChange = event.pageY - Boston.Mouse.down.pageY
  Boston.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Boston.Mouse.xChange, 2) +
      Math.pow(Boston.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Boston.Mouse.onTouchStart = function (event) {
  //  console.log('mouse down')
  Boston.Mouse.isDown = true
  Boston.Mouse.down = event
  Boston.Mouse.target = event.srcElement || event.originalTarget || event.target
  Boston.Mouse.lastX = event.pageX
  Boston.Mouse.lastY = event.pageY
  Boston.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Boston.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Boston.Mouse.onTouchMove = function (event) {
  Boston.Mouse.move = event
//  console.log('mouse move')
  if (!Boston.Mouse.isDown)
    return true
  
  Boston.Mouse.pathDistance += Math.abs(event.pageX - Boston.Mouse.lastX) + Math.abs(event.pageY - Boston.Mouse.lastY)
  Boston.Mouse.lastX = event.pageX
  Boston.Mouse.lastY = event.pageY
  Boston.Mouse.xChange = event.pageX - Boston.Mouse.down.pageX
  Boston.Mouse.yChange = event.pageY - Boston.Mouse.down.pageY
  Boston.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Boston.Mouse.xChange, 2) +
      Math.pow(Boston.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

