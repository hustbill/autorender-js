import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { hoverMetric, pinMetric, unpinMetric } from '../actions/app-actions';
import { selectedMetricTypeSelector } from '../selectors/node-metric';

const messageToUser = 'Alert! Please check containers network';

class MetricSelectorItem extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseOver() {
    const metricType = this.props.metric.get('label');
    this.props.hoverMetric(metricType);
  }

  onMouseClick() {
    const metricType = this.props.metric.get('label');
    const pinnedMetricType = this.props.pinnedMetricType;
    console.log(metricType);

    if (metricType !== pinnedMetricType) {
      this.props.pinMetric(metricType);
    } else {
      this.props.unpinMetric();
    }
  }

  onMouseLeave() {
    this.props.unpinMetric();
  }

  render() {
    const { metric, selectedMetricType, pinnedMetricType } = this.props;
    const type = metric.get('label');
    console.log(metric);
    console.log(selectedMetricType);
    console.log(pinnedMetricType);
    const isAlerted = (Math.floor(Math.random() * 4) + 1) === 2;
    const isPinned = (type === pinnedMetricType);
    const isSelected = (type === selectedMetricType);
    const className = classNames('metric-selector-action', {
      'metric-selector-action-selected': isSelected
    });
    console.log(isPinned, isSelected);
    return (
      <div
        key={type}
        className={className}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onMouseClick}>
        {type === 'CPU' ? 'Latency' : 'BandWidth'}
        {isPinned && <span className="fa fa-thumb-tack" />}
        {isAlerted && isPinned && <textarea
          style={{ width: 360, height: 30, backgroundColor: 'red', borderColor: 'darkred'}}
          value={messageToUser} name="data" />}
        <br />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedMetricType: selectedMetricTypeSelector(state),
    pinnedMetricType: state.get('pinnedMetricType'),
  };
}

export default connect(
  mapStateToProps,
  { hoverMetric, pinMetric, unpinMetric }
)(MetricSelectorItem);
