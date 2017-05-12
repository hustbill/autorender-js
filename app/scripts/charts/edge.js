import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { enterEdge, leaveEdge } from '../actions/app-actions';
import { NODE_BASE_SIZE } from '../constants/styles';

class Edge extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  render() {
    const {
      id,
      path,
      highlighted,
      blurred,
      focused,
      scale,
      source,
      target
    } = this.props;
    const className = classNames('edge', { highlighted, blurred, focused });
    const thickness = (scale * 0.01) * NODE_BASE_SIZE;
    const strokeWidth = focused ? thickness * 3 : thickness;
    const shouldRenderMarker = (focused || highlighted) && (source !== target);
    console.log(target);
    console.log(source);
    console.log(path);
    /* const d = {path};
    console.log(d);
    const dx = d.target.x - d.source.x;
    const dy = d.target.y - d.source.y; */
    const strokeColor = (focused || highlighted) ? 'red' : 'white';
    // Draws the edge so that its thickness reflects the zoom scale.
    // Edge shadow is always made 10x thicker than the edge itself.
    return (
      <g
        id={id} className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <path className="shadow" d={path} style={{ strokeWidth: 10 * strokeWidth, stroke: 'red' }} />
        <path
          className="link"
          d={path}
          markerEnd={shouldRenderMarker ? 'url(#end-arrow)' : null}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
        />
        <path id="lineAB" d={path} stroke="red" strokeWidth="3" fill="none" />
        <circle d={path} r="20" fill="green" />
        <circle d={path} r="80" fill="purple" />
        { /*
                <text
                  textAnchor="middle"
                  pointerEvents="none"
                  fontSize="8px"
                  fill="#FFFFFF"
                  x={dx}
                  y={dy}>event2</text>
        <path id="lineAB" d={path} stroke="red" strokeWidth="3" fill="none" />
        style={{ strokeWidth: {strokeWidth}, stroke: {strokeColor} }}
        <path id="lineAB" d={path} stroke="red" strokeWidth="1" fill="none" />
        <path id="lineBC" d="M 250 50 l 150 300" stroke="red" strokeWidth="3" fill="none" />
        <path d="M 175 200 l 150 0" stroke="green" strokeWidth="3" fill="none" />
        <path d="M 100 350 q 150 -300 300 0" stroke="blue" strokeWidth="5" fill="none" />
        <g stroke="black" strokeWidth="3" fill="black">
          <circle id="pointA" cx="100" cy="350" r="3" />
          <circle id="pointB" cx="250" cy="50" r="3" />
          <circle id="pointC" cx="400" cy="350" r="3" />
        </g> */ }
      </g>
    );
  }

  handleMouseEnter(ev) {
    this.props.enterEdge(ev.currentTarget.id);
  }

  handleMouseLeave(ev) {
    this.props.leaveEdge(ev.currentTarget.id);
  }
}

function mapStateToProps(state) {
  return {
    contrastMode: state.get('contrastMode')
  };
}

export default connect(
  mapStateToProps,
  { enterEdge, leaveEdge }
)(Edge);
