import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Map as makeMap, List as makeList } from 'immutable';
import { getNodeColor } from '../utils/color-utils';
import MatchedText from '../components/matched-text';
import MatchedResults from '../components/matched-results';
import { enterEdge, leaveEdge } from '../actions/app-actions';
import { NODE_BASE_SIZE } from '../constants/styles';

const labelWidth = 1.2 * NODE_BASE_SIZE;

class Edge extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  renderSvgLabels(labelClassName, labelMinorClassName, labelOffsetY) {
    const { label, labelMinor } = this.props;
    return (
      <g className="edge-labels-container">
        <text className={labelClassName} y={13 + labelOffsetY} textAnchor="middle">{label}</text>
        <text className={labelMinorClassName} y={30 + labelOffsetY} textAnchor="middle">
          {labelMinor}
        </text>
      </g>
    );
  }

  renderStandardLabels(labelClassName, labelMinorClassName, labelOffsetY) {
    const { label, labelMinor, matches = makeMap() } = this.props;
    const matchedMetadata = matches.get('metadata', makeList());
    const matchedParents = matches.get('parents', makeList());
    const matchedNodeDetails = matchedMetadata.concat(matchedParents);

    return (
      <foreignObject
        className="edge-labels-container"
        y={labelOffsetY}
        x={-0.5 * labelWidth}
        width={labelWidth}
        height="200">
        <div className="edge-label-wrapper">
          <div className={labelClassName}>
            <MatchedText text={label} match={matches.get('label')} />
          </div>
          <div className={labelMinorClassName}>
            <MatchedText text={labelMinor} match={matches.get('labelMinor')} />
          </div>
          <MatchedResults matches={matchedNodeDetails} />
        </div>
      </foreignObject>
    );
  }

  render() {
    const {
      id,
      path,
      rank,
      pseudo,
      label,
      highlighted,
      blurred,
      focused,
      scale,
      source,
      transform,
      metric,
      target
    } = this.props;

    const color = getNodeColor(rank, label, pseudo);
    const className = classNames('edge', { highlighted, blurred, focused });
    const thickness = (scale * 0.01) * NODE_BASE_SIZE;
    const strokeWidth = focused ? thickness * 3 : thickness;
    const shouldRenderMarker = (focused || highlighted) && (source !== target);

    // const truncate = !focused;
    // const labelOffsetY = 70;
    // (showingNetworks && networks) ? 40 : 28;

    // const labelClassName = classNames('edge-label', { truncate });
    // const labelMinorClassName = classNames('edge-label-minor', { truncate });
    // Draws the edge so that its thickness reflects the zoom scale.
    // Edge shadow is always made 10x thicker than the edge itself.
    return (
      <g
        id={id} className={className}
        transform={transform}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <path className="shadow" d={path} style={{ strokeWidth: 10 * strokeWidth }} />
        <path
          className="link"
          d={path}
          color={color}
          metric={metric}
          markerEnd={shouldRenderMarker ? 'url(#end-arrow)' : null}
          style={{ strokeWidth, color: {color} }}
        />
      </g>
    );
  }

  handleMouseEnter(ev) {
    // this.props.enterEdge(ev.currentTarget.id);
    ev.stopPropagation();
    this.props.clickNode(this.props.id, this.props.label, this.shapeRef.getBoundingClientRect());
  }

  handleMouseLeave(ev) {
    this.props.leaveEdge(ev.currentTarget.id);
  }

  handleMouseClick(ev) {
    ev.stopPropagation();
    this.props.clickNode(this.props.id, this.props.label, this.shapeRef.getBoundingClientRect());
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
