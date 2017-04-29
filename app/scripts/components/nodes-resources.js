import React from 'react';
import { connect } from 'react-redux';
import LineChart from 'react-linechart';
import '../../styles/styles.css';

import Logo from './logo';
// import ZoomWrapper from './zoom-wrapper';
import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';

class NodesResources extends React.Component {
  render() {
    const data = [
      {
        color: 'steelblue',
        points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}, {x: 9, y: -4},
                  {x: 11, y: 0}, {x: 12, y: -1}]
      }
    ];

    const data2 = [
      {
        color: 'green',
        points: [{x: 2, y: 2}, {x: 4, y: 5}, {x: 9, y: -3}, {x: 11, y: -4},
                  {x: 13, y: 0}, {x: 15, y: -1}]
      }
    ];

    return (
      <div className="nodes-resources" style={{display: 'flex', justifyContent: 'center'}}>
        <Logo transform="translate(24,24) scale(0.25)" />
        <h2>
          <LineChart
            width={640}
            height={480}
            data={data}
          />
          <LineChart
            width={640}
            height={480}
            data={data2}
          />
        </h2>
      </div>
    );
  }
}

export default connect(null, {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
})(NodesResources);
