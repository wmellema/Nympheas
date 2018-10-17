import React, {Component} from 'react'
import {Rect, Group} from 'react-konva'

import {Anchor} from './common'

export default class FlexRect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    }

    this.reposition = this.reposition.bind(this)
    this.resize = this.resize.bind(this)
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

  render () {
    const {x, y, width, height} = this.state

    return (
      <Group x={x} y={y} draggable={true} onDragEnd={this.reposition}>
        <Rect
          width={width} height={height}
          fill={this.props.fill}
          shadowBlur={5}
          onDblClick={this.randomizeColor}
        />
        <Anchor
          name="topLeft"
          x={0} y={0}
          onDragMove={this.resize}
        />
        <Anchor
          name="topRight"
          x={width} y={0}
          onDragMove={this.resize}
        />
        <Anchor
          name="bottomLeft"
          x={0} y={height}
          onDragMove={this.resize}
        />
        <Anchor
          name="bottomRight"
          x={width} y={height}
          onDragMove={this.resize}
        />
      </Group>
    )
  }
}
