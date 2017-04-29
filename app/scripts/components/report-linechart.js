import React from 'react';
import { connect } from 'react-redux';
import LineChart from 'react-linechart';
import '../../styles/styles.css';

import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';

class ReportChart extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClickReset = this.handleClickReset.bind(this);
  }

  handleClickReset(ev) {
    ev.preventDefault();
    this.props.resetLocalViewState();
  }

  render() {
    const data = [
      {
        color: 'steelblue',
        points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}, {x: 9, y: -4},
                  {x: 11, y: 0}, {x: 12, y: -1}]
      }
    ];
    return (
      <div>
        <div className="App">
          <h1>Demo Chart</h1>
          <LineChart
            width={600}
            height={400}
            data={data}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
})(ReportChart);
