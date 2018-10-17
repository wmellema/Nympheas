import React, {Component} from 'react'
import {Rect, Group} from 'react-konva'
import Konva from 'konva'

import {Anchor} from './common'

// used by rotate() method
const rotator = {
  interval: null,
  turnOn (callback) {
    if (this.interval === null) {
      this.interval = window.setInterval(callback, 1)
    }
  },
  turnOff () {
    window.clearInterval(this.interval)
    this.interval = null
  }
}

export default class FlexRect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      fill: props.fill || Konva.Util.getRandomColor(),
      rotation: 0
    }

    this.reposition = this.reposition.bind(this)
    this.resize = this.resize.bind(this)
    this.rotate = this.rotate.bind(this)
  }

  reposition (event) {
    if (event.target.nodeType !== 'Group') return
    const {x, y} = event.target.attrs
    this.setState({x, y})
  }

  resize (event) {
    let {x, y, width, height} = this.state
    const anchor = event.target.attrs

    switch (event.target.name()) {
      case 'topLeft':
        width -= anchor.x
        height -= anchor.y
        x += anchor.x
        y += anchor.y
        break
      case 'topRight':
        width = anchor.x
        height -= anchor.y
        y += anchor.y
        break
      case 'bottomLeft':
        width -= anchor.x
        height = anchor.y
        x += anchor.x
        break
      case 'bottomRight':
        width = anchor.x
        height = anchor.y
        break
      default:
    }

    this.setState({x, y, width, height})
  }

  rotate () {
    if (this.props.heldKeys.has('r')) {
      let {rotation} = this.state
      rotation++
      this.setState({rotation})
    }
  }

  setRotate (activate) {
    (activate) ? rotator.turnOn(this.rotate) : rotator.turnOff()
  }

  render () {
    const {x, y, width, height, fill, rotation} = this.state

    return (
      <Group
        x={x} y={y} draggable={true} rotation={rotation}
        onDragEnd={this.reposition}
        onMouseEnter={() => this.setRotate(true)}
        onMouseLeave={() => this.setRotate(false)}
      >
        <Rect
          width={width} height={height} fill={fill} shadowBlur={5}
          onDblClick={() => console.log(this.props.heldKeys)}
        />
        <Anchor name="topLeft" x={0} y={0} onDragMove={this.resize} />
        <Anchor name="topRight" x={width} y={0} onDragMove={this.resize} />
        <Anchor name="bottomLeft" x={0} y={height} onDragMove={this.resize} />
        <Anchor name="bottomRight" x={width} y={height} onDragMove={this.resize} />
      </Group>
    )
  }
}
