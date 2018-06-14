import React from 'react'
import { Trail, animated } from 'react-spring'
import './styles.css'

export default class TrailsExample extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { toggle: true, items: [] }
    for (let i = 1; i < 5; i++) {
      this.state.items.push('item' + i)
    }
  }
  toggle = () => this.setState(state => ({ toggle: !state.toggle }))
  render() {
    const { toggle, items } = this.state
    return (
      <div style={{ backgroundColor: '#247BA0' }}>
        <Trail
          native
          from={{ opacity: 0, x: -100 }}
          to={{ opacity: toggle ? 1 : 0.25, x: toggle ? 0 : 100 }}
          keys={items}>
          {items.map(item => ({ x, opacity }) => (
            <animated.div
              className="box"
              onClick={this.toggle}
              style={{
                opacity,
                transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
              }}
            />
          ))}
        </Trail>
      </div>
    )
  }
}
