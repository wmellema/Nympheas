import React, {Component, Fragment} from 'react'
import {Rect, Group} from 'react-konva'
import Konva from 'konva'

import {Anchor} from './common'

export default class FlexRect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      fill: props.fill || Konva.Util.getRandomColor()
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
      case 'tl':
        width -= anchor.x
        height -= anchor.y
        x += anchor.x
        y += anchor.y
        break
      case 'tr':
        width = anchor.x
        height -= anchor.y
        y += anchor.y
        break
      case 'bl':
        width -= anchor.x
        height = anchor.y
        x += anchor.x
        break
      case 'br':
        width = anchor.x
        height = anchor.y
        break
      default:
    }
    this.setState({x, y, width, height})
  }

  render () {
    const {x, y, width, height, fill} = this.state
    const anchors = (!this.props.selected) ? null : (
      <Fragment>
        <Anchor name="tl" x={0} y={0} onDragMove={this.resize} />
        <Anchor name="tr" x={width} y={0} onDragMove={this.resize} />
        <Anchor name="bl" x={0} y={height} onDragMove={this.resize} />
        <Anchor name="br" x={width} y={height} onDragMove={this.resize} />
      </Fragment>
    )

    return (
      <Group
        x={x} y={y} draggable={true}
        onDragEnd={this.reposition}
      >
        <Rect
          width={width} height={height} fill={fill} shadowBlur={5}
          name={this.props.name}
          onMouseDown={this.props.onMouseDown}
        />
        {anchors}
      </Group>
    )
  }
}
