/**
 * We provide easy access to querying the mouse position and state.
 *
 * @special Singleton.
 */
Chopsticks.Mouse = {}

// Is the mouse down?
Chopsticks.Mouse.isDown = false

/**
 * When a mousedown starts, we keep track of how far the mouse moves. Helpful for
 * drag and drop and drawing stuff.
 */
Chopsticks.Mouse.yChange = 0
Chopsticks.Mouse.xChange = 0
Chopsticks.Mouse.pathDistance = 0

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onmousedown = function (event) {
  //  console.log('mouse down')
  Chopsticks.Mouse.isDown = true
  Chopsticks.Mouse.down = event
  Chopsticks.Mouse.target = event.srcElement || event.originalTarget || event.target
  Chopsticks.Mouse.lastX = event.pageX
  Chopsticks.Mouse.lastY = event.pageY
  Chopsticks.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onmousemove = function (event) {
  Chopsticks.Mouse.move = event
//  console.log('mouse move')
  if (!Chopsticks.Mouse.isDown)
    return true
  
  Chopsticks.Mouse.pathDistance += Math.abs(event.pageX - Chopsticks.Mouse.lastX) + Math.abs(event.pageY - Chopsticks.Mouse.lastY)
  Chopsticks.Mouse.lastX = event.pageX
  Chopsticks.Mouse.lastY = event.pageY
  Chopsticks.Mouse.xChange = event.pageX - Chopsticks.Mouse.down.pageX
  Chopsticks.Mouse.yChange = event.pageY - Chopsticks.Mouse.down.pageY
  Chopsticks.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Chopsticks.Mouse.xChange, 2) +
      Math.pow(Chopsticks.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onmouseup = function (event) {
  Chopsticks.Mouse.isDown = false
  Chopsticks.Mouse.xChange = event.pageX - Chopsticks.Mouse.down.pageX
  Chopsticks.Mouse.yChange = event.pageY - Chopsticks.Mouse.down.pageY
  Chopsticks.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Chopsticks.Mouse.xChange, 2) +
      Math.pow(Chopsticks.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onTouchEnd = function (event) {
  Chopsticks.Mouse.isDown = false
  Chopsticks.Mouse.xChange = event.pageX - Chopsticks.Mouse.down.pageX
  Chopsticks.Mouse.yChange = event.pageY - Chopsticks.Mouse.down.pageY
  Chopsticks.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Chopsticks.Mouse.xChange, 2) +
      Math.pow(Chopsticks.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onTouchStart = function (event) {
  //  console.log('mouse down')
  Chopsticks.Mouse.isDown = true
  Chopsticks.Mouse.down = event
  Chopsticks.Mouse.target = event.srcElement || event.originalTarget || event.target
  Chopsticks.Mouse.lastX = event.pageX
  Chopsticks.Mouse.lastY = event.pageY
  Chopsticks.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Chopsticks.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Chopsticks.Mouse.onTouchMove = function (event) {
  Chopsticks.Mouse.move = event
//  console.log('mouse move')
  if (!Chopsticks.Mouse.isDown)
    return true
  
  Chopsticks.Mouse.pathDistance += Math.abs(event.pageX - Chopsticks.Mouse.lastX) + Math.abs(event.pageY - Chopsticks.Mouse.lastY)
  Chopsticks.Mouse.lastX = event.pageX
  Chopsticks.Mouse.lastY = event.pageY
  Chopsticks.Mouse.xChange = event.pageX - Chopsticks.Mouse.down.pageX
  Chopsticks.Mouse.yChange = event.pageY - Chopsticks.Mouse.down.pageY
  Chopsticks.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Chopsticks.Mouse.xChange, 2) +
      Math.pow(Chopsticks.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

