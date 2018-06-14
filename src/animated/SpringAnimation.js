import Animation from './Animation'
import * as Globals from './Globals'
import {
  tension_from_origami_value,
  friction_from_origami_value,
  calc_acceleration,
  Foo,
  PosVel,
} from '../wasm/wasm'

const withDefault = (value, defaultValue) =>
  value === undefined || value === null ? defaultValue : value
const tensionFromOrigamiValue = oValue => tension_from_origami_value(oValue)
const frictionFromOrigamiValue = oValue => friction_from_origami_value(oValue)
const fromOrigamiTensionAndFriction = (tension, friction) => ({
  tension: tensionFromOrigamiValue(tension),
  friction: frictionFromOrigamiValue(friction),
})

export default class SpringAnimation extends Animation {
  constructor(config) {
    super()
    this._overshootClamping = withDefault(config.overshootClamping, false)
    this._restDisplacementThreshold = withDefault(
      config.restDisplacementThreshold,
      0.0001
    )
    this._restSpeedThreshold = withDefault(config.restSpeedThreshold, 0.0001)
    this._initialVelocity = config.velocity
    this._lastVelocity = withDefault(config.velocity, 0)
    this._to = config.to
    var springConfig = fromOrigamiTensionAndFriction(
      withDefault(config.tension, 40),
      withDefault(config.friction, 7)
    )
    this._tension = springConfig.tension
    this._friction = springConfig.friction
  }

  start(fromValue, onUpdate, onEnd, previousAnimation) {
    this.__active = true
    this._startPosition = fromValue
    this._lastPosition = this._startPosition
    this._onUpdate = onUpdate
    this.__onEnd = onEnd
    this._lastTime = Date.now()

    if (previousAnimation instanceof SpringAnimation) {
      var internalState = previousAnimation.getInternalState()
      this._lastPosition = internalState.lastPosition
      this._lastVelocity = internalState.lastVelocity
      this._lastTime = internalState.lastTime
    }

    if (typeof fromValue === 'string') {
      this._onUpdate(fromValue)
      return this.__debouncedOnEnd({ finished: true })
    }

    if (this._initialVelocity !== undefined && this._initialVelocity !== null)
      this._lastVelocity = this._initialVelocity
    this.onUpdate()
  }

  getInternalState() {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime,
    }
  }

  onUpdate = () => {
    var position = this._lastPosition
    var velocity = this._lastVelocity
    var tempPosition = this._lastPosition
    var tempVelocity = this._lastVelocity

    // If for some reason we lost a lot of frames (e.g. process large payload or
    // stopped in the debugger), we only advance by 4 frames worth of
    // computation and will continue on the next frame. It's better to have it
    // running at faster speed than jumping to the end.
    var MAX_STEPS = 64
    var now = Date.now()

    if (now > this._lastTime + MAX_STEPS) now = this._lastTime + MAX_STEPS

    // We are using a fixed time step and a maximum number of iterations.
    // The following post provides a lot of thoughts into how to build this
    // loop: http://gafferongames.com/game-physics/fix-your-timestep/
    var TIMESTEP_MSEC = 1
    var numSteps = Math.floor((now - this._lastTime) / TIMESTEP_MSEC)

    // var foo = Foo.new();
    // console.log(foo.add(1));
    var pv = PosVel.new()

    var t0 = performance.now()
    pv.rk4(
      this._lastPosition,
      this._lastVelocity,
      numSteps,
      this._friction,
      this._tension,
      this._to
    )
    position = pv.get_pos()
    velocity = pv.get_vel()

    var t1 = performance.now()
    console.log('wasm loop took ' + (t1 - t0) + ' milliseconds.')

    this._lastTime = now
    this._lastPosition = position
    this._lastVelocity = velocity

    this._onUpdate(position)

    // a listener might have stopped us in _onUpdate
    if (!this.__active) return

    // Conditions for stopping the spring animation
    var isOvershooting = false
    if (this._overshootClamping && this._tension !== 0) {
      if (this._startPosition < this._to) {
        isOvershooting = position > this._to
      } else {
        isOvershooting = position < this._to
      }
    }

    var isVelocity = Math.abs(velocity) <= this._restSpeedThreshold
    var isDisplacement = true
    if (this._tension !== 0)
      isDisplacement =
        Math.abs(this._to - position) <= this._restDisplacementThreshold
    if (isOvershooting || (isVelocity && isDisplacement)) {
      // Ensure that we end up with a round value
      if (this._tension !== 0) this._onUpdate(this._to)
      return this.__debouncedOnEnd({ finished: true })
    }
    this._animationFrame = Globals.requestFrame(this.onUpdate)
  }

  stop() {
    this.__active = false
    clearTimeout(this._timeout)
    Globals.cancelFrame(this._animationFrame)
    this.__debouncedOnEnd({ finished: false })
  }
}
