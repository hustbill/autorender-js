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
      path,
      stroke,
      strokeWidth
    } = this.props;

    getDefaultProps() {
      return {
        stroke:   'blue',
        fill:     'none',
        strokeWidth: 3
      };
    },

    const className = classNames('line', { path, stroke, strokeWidth });
    const thickness = (scale * 0.01) * NODE_BASE_SIZE;
    const strokeWidth =  thickness * 3 : thickness;
    // Draws the edge so that its thickness reflects the zoom scale.
    // Edge shadow is always made 10x thicker than the edge itself.
    return (
      <g
        id={id} className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <path className="shadow" d={path} style={{ strokeWidth: 10 * strokeWidth }} />
        <path
          className="link"
          d={path}
          stroke={{ stroke }}
          strokeWidth={{ strokeWidth }}
        />
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
