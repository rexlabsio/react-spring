import React from 'react'
import { Spring, Keyframes, animated } from 'react-spring'
import { TimingAnimation, Easing } from '../../../src/addons'

export default class TimingExample extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { items: [] }
    for (let i = 1; i < 1000; i++) {
      this.state.items.push('item' + i)
    }
  }

  render() {
    const Content = ({ radians, color }) =>
      this.state.items.map((_, i) => (
        <animated.svg
          key={i}
          style={{
            width: 50,
            height: 50,
            willChange: 'transform',
            transform: radians.interpolate(
              r =>
                `translate3d(0, ${50 * Math.sin(r + i * 2 * Math.PI / 5)}px, 0)`
            ),
          }}
          viewBox="0 0 400 400">
          <animated.g fill={color} fillRule="evenodd">
            <path id="path-1" d="M20,380 L380,380 L380,380 L200,20 L20,380 Z" />
          </animated.g>
        </animated.svg>
      ))
    const { items } = this.state

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'palevioletred',
        }}>
        <Keyframes
          reset
          native
          keys={items}
          impl={TimingAnimation}
          config={{ duration: 500, easing: Easing.linear }}
          script={async next => {
            while (true) {
              await next(Spring, {
                from: { radians: 0, color: '#247BA0' },
                to: { radians: 2 * Math.PI },
              })
            }
          }}>
          {Content}
        </Keyframes>
      </div>
    )
  }
}
