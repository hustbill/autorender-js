import React from 'react';
import { connect } from 'react-redux';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import '../../styles/report.css';

const margin = {top: 5, right: 30, left: 20, bottom: 5};
const host = 'http://10.145.240.216:8086/query?pretty=true&p=root&u=root&db=workload&rpovh=&';
const alertQuantity = Math.floor(Math.random() * 6) + 2;

/*
* Using the reviver parameter
* ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
* values =[
  [
      "2015-01-29T21:55:43.702900257Z",rr
      2
  ],
  [
      "2015-01-29T21:55:43.702900257Z",
      0.55
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
        'latency_99%(ms)': (latencyValues[0][i][2] * 1000).toFixed(1),
        'latency_50%(ms)': (latencyFiftyValues[0][i][2] * 1000).toFixed(1)
      };
      rows.push(row);
    }
  }
  return rows;
}

function getAlertArray(values) {
  console.log('values');
  console.log(values);
  const rows = [];
  if (values !== null && values.length !== 0) {
    let row = {};
    let i = 0;
    for (; i < values[0].length; i += 1) {
      row = values[0][i][2];
      rows.push(row);
    }
  }
  return rows;
}

// qpsSeries
function addAlerts(eqps, qps, latency, quantity) {
  const alerts = [];
  const eqpsArr = getAlertArray(eqps);
  const qpsArr = getAlertArray(qps);
  const latencyArr = getAlertArray(latency);
  const startId = alerts.length;
  for (let i = 1; i < quantity; i += 1) {
    const id = startId + i;
    const type = (Math.floor((Math.random() * 50) + 1) % 2) === 0 ? 'Latency' : 'QPS';
    alerts.push({
      id,
      alertType: type,
      qpsReq: eqpsArr[i],
      qpsCur: qpsArr[i],
      latencyReq: 210,
      latencyCur: (latencyArr[i] * 1000).toFixed(1)
    });
  }
  return alerts;
}

/*
*  cpuCores: { text: '01:51:03', value: 3 }
*/
class NodesResources extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      eqps: [],
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
    // cpu_usage
    const q = 'q=SELECT appname, value from cpu_usage limit 12';
    const cmd = host.concat(q);
    fetch(cmd)
    .then(result => result.json())
    .then(cpuUsage => this.setState({cpuUsage}));

    // cpu_cores
    const q1 = 'q=SELECT appname, value from cpu_cores limit 12';
    const cmd1 = host.concat(q1);
    fetch(cmd1)
    .then(result => result.json())
    .then(cpuCores => this.setState({cpuCores}));


    // latency99
    const q2 = 'q=SELECT appname, value from latency_99spercentile WHERE time > now() - 1h limit 12';
    const cmd2 = host.concat(q2);
    fetch(cmd2)
        .then(result => result.json())
        .then(latency => this.setState({latency}));

    // latency99
    const q3 = 'q=SELECT appname, value from latency_50percentile WHERE time > now() - 1h limit 12';
    const cmd3 = host.concat(q3);
    fetch(cmd3)
        .then(result => result.json())
        .then(latencyFifty => this.setState({latencyFifty}));

    // qps
    const q5 = 'q=SELECT appname, value from qps WHERE time > now() - 1h limit 12';
    const cmd5 = host.concat(q5);
    fetch(cmd5)
        .then(result => result.json())
        .then(qps => this.setState({qps}));

    // net_rx_bw
    const q6 = 'q=SELECT appname, value from net_rx_bw limit 12';
    const cmd6 = host.concat(q6);
    fetch(cmd6)
        .then(result => result.json())
        .then(netRxBw => this.setState({netRxBw}));

    // net_tx_bw
    const q7 = 'q=SELECT appname, value from net_tx_bw limit 12';
    const cmd7 = host.concat(q7);
    fetch(cmd7)
        .then(result => result.json())
        .then(netTxBw => this.setState({netTxBw}));

    // eqps
    const q8 = 'q=SELECT appname, value from eqps order by time desc limit 12';
    const cmd8 = host.concat(q8);
    fetch(cmd8)
        .then(result => result.json())
        .then(eqps => this.setState({eqps}));
  }

  handleMouseEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.enterEdge(ev.currentTarget.id);
  }

  render() {
    const {eqps, cpuUsage, cpuCores, qps, latency, latencyFifty, netRxBw, netTxBw} = this.state;
    const cpuUsageSeries = getCPUSeries(getValues(cpuUsage));
    const cpuCoresSeries = getCPUCoresSeries(getValues(cpuCores));
    const qpsSeries = getQpsSeries(getValues(qps));

    const latencySeries = getTwoSeries(getValues(latency), getValues(latencyFifty));
    const netRxTxSeries = getNetSeries(getValues(netRxBw), getValues(netTxBw));

    const alerts = addAlerts(getValues(eqps), getValues(qps), getValues(latency), alertQuantity);
    const tableStyle = {
      border: '1px solid black'
    };
    return (
      <div id="container">
        { /* <div className="gridster">
          <ul>
            <li data-row="1" data-col="1" data-sizex="1" data-sizey="1">
              <div data-id="karma" data-view="Number"
               data-title="Karma" style={{backgroundColor: '#96bf48'}} />
            </li>
            <li data-row="1" data-col="1" data-sizex="1" data-sizey="1">
              <div data-id="valuation"
                data-view="Number" data-title="Current Valuation" data-prefix="$" />
            </li>
          </ul>
        </div> */ }
        <h1> Network Dashboard </h1>
        <br />
        <div className="col-md-offset-1 col-md-8">
          <div className="panel panel-default">
            <div className="panel-heading">Alert List [ QPS | Latency ]</div>
            <br />
            <div className="panel-body">
              <BootstrapTable
                rowStyle={{display: 'table-row'}}
                tbodyStyle={{height: '14px'}}
                headerStyle={{background: '#00ff00'}}
                tableStyle={tableStyle} data={alerts}>
                <TableHeaderColumn dataField="id" isKey>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="alertType">Alert Type</TableHeaderColumn>
                <TableHeaderColumn dataField="qpsReq">QPS Req</TableHeaderColumn>
                <TableHeaderColumn dataField="qpsCur">QPS Current</TableHeaderColumn>
                <TableHeaderColumn dataField="latencyReq">Latency Req</TableHeaderColumn>
                <TableHeaderColumn dataField="latencyCur">Latency Current</TableHeaderColumn>
              </BootstrapTable>
              <br />
            </div>
          </div>
        </div>
        <br />
        <LineChart width={960} height={300} data={qpsSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="QPS" stroke="blue" activeDot={{r: 8}} />
        </LineChart>
        <br />
        <LineChart width={960} height={300} data={latencySeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="latency_99%(ms)" stroke="blueviolet" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="latency_50%(ms)" stroke="crimson" />
        </LineChart>
        <br />
        <LineChart width={960} height={300} data={netRxTxSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Net_Rx_BW" stroke="darkmagenta" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="Net_Tx_BW" stroke="darkred" />
        </LineChart>
        <br />
        <LineChart width={960} height={300} data={cpuUsageSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="CPU_Usage" stroke="fuchsia" activeDot={{r: 8}} />
        </LineChart>
        <br />
        <BarChart width={960} height={300} data={cpuCoresSeries} margin={margin}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="CPU_Cores" fill="#82ca9d" />
        </BarChart>
        <br />
      </div>
    );
  }
}

export default connect(null)(NodesResources);
