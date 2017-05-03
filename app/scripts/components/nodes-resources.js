import React from 'react';
import { connect } from 'react-redux';
import LineChart from 'react-linechart';
import BarChart from 'react-bar-chart';
import '../../styles/BarChart.css';
import '../../styles/styles.css';

import Logo from './logo';
// import ZoomWrapper from './zoom-wrapper';
import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';

class NodesResources extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  handleMouseEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.enterEdge(ev.currentTarget.id);
    console.log(ev.currentTarget.id);
  }

  render() {
    const data = [
      {
        color: 'steelblue',
        label: 'ConcurrentUser',
        points: [{x: 2, y: 4}, {x: 3, y: 6}, {x: 7, y: 1}, {x: 9, y: 0},
                  {x: 11, y: 2}, {x: 12, y: 1}]
      }
    ];

    const data2 = [
      {
        color: 'green',
        points: [{x: 2, y: 3}, {x: 4, y: 7}, {x: 9, y: 3}, {x: 11, y: 2},
                  {x: 13, y: 2}, {x: 15, y: 3}]
      }
    ];

    const bardata = [
      {text: 'core1', value: 340},
      {text: 'core2', value: 280},
      {text: 'core3', value: 200},
      {text: 'core4', value: 360},
      {text: 'core5', value: 400},
      {text: 'core6', value: 420},
      {text: 'core7', value: 300},
      {text: 'core8', value: 450}
    ];
    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    return (
      <div className="nodes-resources" style={{ display: 'flex', justifyContent: 'center', position: 'relative', top: 200, left: 1 }}>
        <Logo transform="translate(24,24) scale(0.25)" />
        <div style={{width: '20%', height: '%15'}}>
          <LineChart
            title={'Concurrent User'}
            width={600}
            height={400}
            data={data}
          />
          <LineChart
            width={600}
            height={400}
            data={data2}
          />
        </div>
        <div style={{width: '20%', height: '%15', display: 'flex', justifyContent: 'center', position: 'relative', top: 80, left: 280}}>
          <BarChart
            title={'Usage per Core'}
            data={bardata}
            width={480}
            height={340}
            margin={margin}
            onClick={this.handleMouseEnter}
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
})(NodesResources);
