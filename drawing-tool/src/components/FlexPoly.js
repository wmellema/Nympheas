import React, {PureComponent} from 'react'
import {Line, Group} from 'react-konva'

import {Anchor} from './common'

function getRandomPoints (n, size) {
  const {random, floor} = Math
  const arr = []
  for (let i = 0; i < n; i++) arr.push(floor(random() * size) + 1)
  return arr
}

export default class FlexPoly extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      points: getRandomPoints(props.corners * 2, props.size)
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
    const points = this.state.points.slice()
    const i = +event.target.name()
    const {x, y} = event.target.attrs
    points[i] = x
    points[i + 1] = y
    this.setState({points})
  }

  render () {
    const {x, y, points} = this.state

    const anchors = []
    for (let i = 0; i < points.length; i += 2) {
      anchors.push(
        <Anchor
          x={points[i]} y={points[i + 1]}
          key={i} name={`${i}`}
          onDragMove={this.resize}
        />
      )
    }

    return (
      <Group draggable={true} onDragEnd={this.reposition} x={x} y={y}>
        <Line
          closed={true} points={points}
          fill={this.props.fill} shadowBlur={5}
        />
        {anchors}
      </Group>
    )
  }
}
