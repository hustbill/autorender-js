import React from 'react';
import { connect } from 'react-redux';
import LineChart from 'react-linechart';
import BarChart from 'react-bar-chart';
import Influx from 'influx';
import '../../styles/BarChart.css';
import '../../styles/styles.css';
import '../../styles/div.css';


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


const totalValues = Math.random() * 50;

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */

function getRandomSeriesData(total) {
  const points = [];
  let lastY = (Math.random() * 40) - 20;
  let y;
  const firstY = lastY;
  for (let i = 0; i < total; i += 1) {
    y = ((Math.random() * firstY) - (firstY / 2)) + lastY;
    points.push({
      x: i,
      y: Math.abs(y)
    });
    lastY = Math.abs(y);
  }
  console.log(points);

  return points;
}

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
  console.log(convertResult);
  return convertResult;
}

/*
function getLatencyData(latency) {
  const points = [];
  let y;
  for (let i = 0; i < latency; i += 1) {
    points.push({
      x: i,
      y: Math.abs(y)
    });
  }
  console.log(points);
  return points;
} */

/*
*  items: { text: '01:51:03', value: 3 }
*/
class NodesResources extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [],
      cpuCores: [],
      latency: [],
      latencyFifty: [],
      qps: [],
      series: [
        {
          title: 'Apples',
          disabled: false,
          data: [
            {
              color: 'steelblue',
              label: 'ConcurrentUser',
              points: getRandomSeriesData(totalValues)
            }
          ]
        },
        {
          title: 'Bananas',
          disabled: false,
          data: [
            {
              color: 'green',
              label: 'ConcurrentUser',
              points: getRandomSeriesData(totalValues)
            }
          ]
        }
      ]
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.querydb = this.querydb.bind(this);
  }

  componentDidMount() {
    const host = 'http://localhost:8086/query?pretty=true&p=root&u=root&db=workload&rpovh=&';
    // const q = 'q=SELECT appname, value from cpu_usage limit 7';
    // cpu_usage
    const q = 'q=SELECT appname, value from cpu_usage limit 7';
    const cmd = host.concat(q);
    fetch(cmd)
    .then(result => result.json())
    .then(items => this.setState({items}));

    // cpu_cores
    const q1 = 'q=SELECT appname, value from cpu_cores limit 7';
    const cmd1 = host.concat(q1);
    fetch(cmd1)
    .then(result => result.json())
    .then(cpuCores => this.setState({cpuCores}));


    // latency99
    const q2 = 'q=SELECT appname, value from latency_99spercentile limit 6';
    const cmd2 = host.concat(q2);
    fetch(cmd2)
        .then(result => result.json())
        .then(latency => this.setState({latency}));

    // latency99
    const q3 = 'q=SELECT appname, value from latency_50percentile limit 7';
    const cmd3 = host.concat(q3);
    fetch(cmd3)
        .then(result => result.json())
        .then(latencyFifty => this.setState({latencyFifty}));

    // latency99
    const q4 = 'q=SELECT appname, value from qps limit 7';
    const cmd4 = host.concat(q4);
    fetch(cmd4)
        .then(result => result.json())
        .then(qps => this.setState({qps}));

    const q5 = 'q=SELECT appname, value from latency_50percentile limit 7';
    const cmd5 = host.concat(q5);
    fetch(cmd5)
      .then(result => result.json())
      .then(series => this.setState({series}));
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
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const {series} = this.state;

    return (
      <div className="nodes-resources">
        <Logo transform="translate(24,24) scale(0.25)" />
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 640, height: 400, top: 150, left: 100, border: 3}}>
          <label htmlFor="cpu-usage" style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 120, height: 40, top: 10, left: 250, border: 3}} >
            Concurrent User
          </label>
          <LineChart
            title={'Concurrent User'}
            width={600}
            height={400}
            data={this.state.series[0].data}
          />
          <LineChart
            width={600}
            height={400}
            data={this.state.series[1].data}
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 240, top: 350, left: 350, border: 3}}>
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
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 240, top: 500, left: 350, border: 3}}>
          <label htmlFor="latency-99">
            Latency 99%
          </label>
          <BarChart
            title={'Latency Ninty Nine'}
            data={convert(transform(this.state.latency))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 240, top: -130, left: 850, border: 3}}>
          <label htmlFor="cpu-cores">
            CPU Usage per Core
          </label>
          <BarChart
            title={'CPU Usage per Core'}
            data={convert(transform(this.state.cpuCores))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 340, top: 20, left: 850, border: 3}}>
          <label htmlFor="latency-fiftypercent">
            Latency 50%
          </label>
          <BarChart
            title={'Latency Fifty Percentage'}
            data={convert(transform(this.state.latencyFifty))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 240, top: 30, left: 350, border: 3}}>
          <label htmlFor="qps">
            QPS
          </label>
          <BarChart
            title={'QPS'}
            data={convert(transform(this.state.qps))}
            width={420}
            height={240}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: 420, height: 240, top: 150, left: 450, border: 3}}>
          <textarea
            value={series[0].data.points} name="monitor" onChange={this.handleChange} />
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
