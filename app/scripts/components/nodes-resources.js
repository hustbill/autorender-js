import React from 'react';
import { connect } from 'react-redux';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
// import Logo from './logo';
import '../../styles/report.css';

import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';

const margin = {top: 5, right: 30, left: 20, bottom: 5};

//
/*
* Using the reviver parameter
* ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
* values =[
  [
      "2015-01-29T21:55:43.702900257Z",
      2
  ],
  [
      "2015-01-29T21:55:43.702900257Z",
      0.55
  ],
  [
      "2015-06-11T20:46:02Z",
      0.64
  ]
]
*/
function getValues(result) {
  const values = [];
  JSON.parse(JSON.stringify(result), (key, value) => {
    if (key === 'values') {
      values.push(value);
    }
    // console.log(key); // log the current property name, the last is "".
    return value;     // return the unchanged property value.
  });
  // console.log(values);
  return values;
}

/*
*  input:  { '2017-05-05T01:51:03.514798957Z', 3 }
*  output: { name: '01:51:03', value: 3 }
*/
function getNetSeries(rxValues, txValues) {
  const rows = [];
  let hhmmss;
  if (rxValues !== null && rxValues.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < rxValues[0].length; i += 1) {
      hhmmss = rxValues[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
      row = {
        name: hhmmss,
        Net_Rx_BW: rxValues[0][i][2],
        Net_Tx_BW: txValues[0][i][2]
      };
      rows.push(row);
    }
  }
  return rows;
}

function getQpsSeries(values) {
  const rows = [];
  let hhmmss;
  if (values !== null && values.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < values[0].length; i += 1) {
      hhmmss = values[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
      row = {
        name: hhmmss,
        QPS: values[0][i][2]
      };
      rows.push(row);
    }
  }
  // console.log(rows);
  return rows;
}

function getCPUSeries(values) {
  const rows = [];
  let hhmmss;
  if (values !== null && values.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < values[0].length; i += 1) {
      hhmmss = values[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
      row = {
        name: hhmmss,
        CPU_Usage: values[0][i][2]
      };
      rows.push(row);
    }
  }
  // console.log(rows);
  return rows;
}

function getCPUCoresSeries(values) {
  const rows = [];
  let hhmmss;
  if (values !== null && values.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < values[0].length; i += 1) {
      hhmmss = values[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
      row = {
        name: hhmmss,
        CPU_Cores: values[0][i][2]
      };
      rows.push(row);
    }
  }
  // console.log(rows);
  return rows;
}

function getTwoSeries(latencyValues, latencyFiftyValues) {
  const rows = [];
  let hhmmss;
  if (latencyValues !== null && latencyValues.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < latencyValues[0].length; i += 1) {
      hhmmss = latencyValues[0][i][0].substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
      row = {
        name: hhmmss,
        'latency_99%': latencyValues[0][i][2],
        'latency_50%': latencyFiftyValues[0][i][2]
      };
      rows.push(row);
    }
  }
  // console.log(rows);
  return rows;
}

/*
*  cpuCores: { text: '01:51:03', value: 3 }
*/
class NodesResources extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cpuUsage: [],
      cpuCores: [],
      latency: [],
      latencyFifty: [],
      qps: [],
      netRxBw: [],
      netTxBw: []
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  componentDidMount() {
    const host = 'http://localhost:8086/query?pretty=true&p=root&u=root&db=workload&rpovh=&';
    // const q = 'q=SELECT appname, value from cpu_usage limit 7';
    // cpu_usage
    const q = 'q=SELECT appname, value from cpu_usage limit 7';
    const cmd = host.concat(q);
    fetch(cmd)
    .then(result => result.json())
    .then(cpuUsage => this.setState({cpuUsage}));

    // cpu_cores
    const q1 = 'q=SELECT appname, value from cpu_cores limit 7';
    const cmd1 = host.concat(q1);
    fetch(cmd1)
    .then(result => result.json())
    .then(cpuCores => this.setState({cpuCores}));


    // latency99
    const q2 = 'q=SELECT appname, value from latency_99spercentile limit 7';
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

    // qps
    const q5 = 'q=SELECT appname, value from qps limit 7';
    const cmd5 = host.concat(q5);
    fetch(cmd5)
        .then(result => result.json())
        .then(qps => this.setState({qps}));

    // net_rx_bw
    const q6 = 'q=SELECT appname, value from net_rx_bw limit 7';
    const cmd6 = host.concat(q6);
    fetch(cmd6)
        .then(result => result.json())
        .then(netRxBw => this.setState({netRxBw}));

    // net_tx_bw
    const q7 = 'q=SELECT appname, value from net_tx_bw limit 7';
    const cmd7 = host.concat(q7);
    fetch(cmd7)
        .then(result => result.json())
        .then(netTxBw => this.setState({netTxBw}));
  }

  handleMouseEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.enterEdge(ev.currentTarget.id);
  }

  render() {
    const {cpuUsage, cpuCores, qps, latency, latencyFifty, netRxBw, netTxBw} = this.state;
    const cpuUsageSeries = getCPUSeries(getValues(cpuUsage));
    const cpuCoresSeries = getCPUCoresSeries(getValues(cpuCores));
    const qpsSeries = getQpsSeries(getValues(qps));
    const latencySeries = getTwoSeries(getValues(latency), getValues(latencyFifty));
    const netRxTxSeries = getNetSeries(getValues(netRxBw), getValues(netTxBw));
    console.log(JSON.stringify(qpsSeries));

    return (
      <div id="container">
        <LineChart width={600} height={300} data={netRxTxSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Net_Rx_BW" stroke="steelblue" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="Net_Tx_BW" stroke="darkred" />
        </LineChart>
        <br />
        <LineChart width={600} height={300} data={latencySeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="latency_99%" stroke="#8884d8" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="latency_50%" stroke="#82ca9d" />
        </LineChart>
        <br />
        <BarChart width={600} height={300} data={cpuCoresSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="CPU_Cores" fill="#82ca9d" />
        </BarChart>
        <br />
        <LineChart width={600} height={300} data={cpuUsageSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="CPU_Usage" stroke="darkblue" activeDot={{r: 8}} />
        </LineChart>
        <br />
        <LineChart width={600} height={300} data={qpsSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="QPS" stroke="darkorange" activeDot={{r: 8}} />
        </LineChart>
        <br />
      </div>
    );
  }
}

export default connect(null, {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
})(NodesResources);
