import React from 'react';
import { connect } from 'react-redux';
import LineChart from 'react-linechart';
import BarChart from 'react-bar-chart';
import Influx from 'influx';
import '../../styles/BarChart.css';
import '../../styles/styles.css';

import Logo from './logo';
// import ZoomWrapper from './zoom-wrapper';
import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';


const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'workload',
  schema: [
    {
      measurement: 'concurrentuser',
      fields: {
        appname: Influx.FieldType.STRING,
        value: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
});

class NodesResources extends React.Component {
  constructor(props, context) {
    super(props, context);
    // this.state = {appname: 'mysql', value: 10};
    this.state = { items: [] };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.querydb = this.querydb.bind(this);
  }

  componentDidMount() {
    const host = 'http://localhost:8086/query?pretty=true&p=root&u=root&db=workload&rpovh=&';
    const q = 'q=SELECT appname, value from cpu_usage limit 8';
    const cmd = host.concat(q);
    // fetch('http://localhost:8086/ping')
    fetch(cmd)
    .then(result => result.json())
    .then(items => this.setState({items}));
  }


  handleMouseEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.enterEdge(ev.currentTarget.id);
  }


  querydb(ev) {
    // const result = `${this.state.appname} : ${this.state.value}`;
    influx.query(`
       select * from concurrentuser
       order by time desc
       limit 5
     `).then((rows) => {
       this.setState({state: rows.value});
     });
    ev.preventDefault();
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
    /*
    const bardata = [
      {text: 'core1', value: 340},
      {text: 'core2', value: 280}
    ]; */

    const data2 = [
      {
        color: 'green',
        points: [{x: 2, y: 3}, {x: 4, y: 7}, {x: 9, y: 3}, {x: 11, y: 2},
                  {x: 13, y: 2}, {x: 15, y: 3}]
      }
    ];

    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    // Using the reviver parameter
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    function transform(result) {
      const parseData = [];
      JSON.parse(JSON.stringify(result), (key, value) => {
        if (key === 'values') {
          parseData.push(value);
        }
        // console.log(key); // log the current property name, the last is "".
        return value;     // return the unchanged property value.
      });
      return parseData;
    }


    function convert(cpuData) {
      const convertResult = [];
      let hhmmss;
      if (cpuData !== null && cpuData.length !== 0) {
        let row = {};
        let i = 0;
        for (; i < cpuData[0].length; i += 1) {
          hhmmss = cpuData[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
          row = {text: hhmmss, value: cpuData[0][i][2]};
          // { text: '2017-05-05T01:51:03.514798957Z', value: 3 }
          convertResult.push(row);
        }
      }

      return convertResult;
    }
    return (
      <div className="nodes-resources" style={{ display: 'flex', justifyContent: 'center', position: 'relative', top: 200, left: 1 }}>
        <Logo transform="translate(24,24) scale(0.25)" />
        <div style={{width: '20%', height: '%15'}}>
          <LineChart
            title={'Concurrent User'}
            width={480}
            height={320}
            data={data}
          />
          <LineChart
            width={480}
            height={320}
            data={data2}
          />
        </div>
        <div style={{width: '20%', height: '%15', display: 'flex', justifyContent: 'center', position: 'relative', top: 80, left: 380}}>
          <label htmlFor="cpu-usage">
            CPU Usage
          </label>
          <BarChart
            title={'CPU Usage'}
            data={convert(transform(this.state.items))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div style={{width: '20%', height: '%15', display: 'flex', justifyContent: 'center', position: 'relative', top: 380, left: 0}}>
          <label htmlFor="cpu-cores">
            CPU Cores
          </label>
          <BarChart
            title={'Usage per Core'}
            data={convert(transform(this.state.items))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div>
          <textarea
            style={{width: 360, height: 20, borderColor: 'gray', borderWidth: 2}}
            value={JSON.stringify(convert(transform(this.state.items))[0])} name="monitor" onChange={this.handleChange} />
          <br />
        </div>
      </div>
    );
  }
}
//

export default connect(null, {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
})(NodesResources);
