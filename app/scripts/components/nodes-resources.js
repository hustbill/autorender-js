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

export function getUserData() {
  return influx.query(`
           select * from concurrentuser
           order by time desc
           limit 3
         `).then((rows) => {
           console.log(rows);
         });
}

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
    const q = 'q=SELECT appname, value from cpu_usage limit 5';
    const cmd = host.concat(q);
    // fetch('http://localhost:8086/ping')
    fetch(cmd)
    .then(result => result.json())
    .then(items => this.setState({items}));
    /* influx.query(`
       select * from concurrentuser
       order by time desc
       limit 3`)
     .then(result => result.json())
     .then(items => this.setState({items})); */
  }


  handleMouseEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.enterEdge(ev.currentTarget.id);
  }

  querydb(ev) {
    const result = `${this.state.appname} : ${this.state.value}`;
    console.log(result);
    influx.query(`
       select * from concurrentuser
       order by time desc
       limit 3
     `).then((rows) => {
       this.setState({state: rows.value});
       console.log(rows);
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

    const dbresult = {
      results: [
        {
          statement_id: 0,
          series: [
            {
              name: 'cpu_usage',
              columns: [
                'time',
                'appname',
                'value'
              ],
              values: [
                [
                  '2017-05-05T01:51:01.23080652Z',
                  'mysql',
                  32
                ],
                [
                  '2017-05-05T01:51:01.29018857Z',
                  'mysql',
                  32
                ],
                [
                  '2017-05-05T01:51:03.41623435Z',
                  'mysql',
                  3
                ],
                [
                  '2017-05-05T01:51:03.514798957Z',
                  'mysql',
                  3
                ],
                [
                  '2017-05-05T01:51:06.511885971Z',
                  'mysql',
                  1
                ]
              ]
            }
          ]
        }
      ]};

      const data2 = [
        {
          color: 'green',
          points: [{x: 2, y: 3}, {x: 4, y: 7}, {x: 9, y: 3}, {x: 11, y: 2},
                    {x: 13, y: 2}, {x: 15, y: 3}]
        }
      ];

        const secondObj = JSON.parse(JSON.stringify(dbresult), (key, value) => {
            if (key === 'values') {
              console.log(value);
              cpuUsage.push(value);
            }

            // console.log(key);
            // log the current property name, the last is "".
            // console.log(value);
            return value;     // return the unchanged property value.
          });


    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const cpuUsage = [];



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
        <div style={{width: '20%', height: '%15', display: 'flex', justifyContent: 'center', position: 'relative', top: 80, left: 280}}>
          <BarChart
            title={'Usage per Core'}
            data={bardata}
            width={480}
            height={320}
            margin={margin}
            onClick={this.handleMouseEnter}
           />
        </div>
        <div>
          <textarea
            style={{width: 400, height: 20, borderColor: 'gray', borderWidth: 2}}
            value={JSON.stringify(dbresult)} name="monitor" onChange={this.handleChange} />
          <br />
          <br />
          <textarea
            style={{width: 480, height: 20, borderColor: 'gray', borderWidth: 2}}
            value={cpuUsage[0][1]} name="monitor1" onChange={this.handleChange} />
          <br />
          <textarea
            style={{width: 480, height: 50, borderColor: 'gray', borderWidth: 2}}
            value={secondObj} name="monitor2" onChange={this.handleChange} />
          <br />
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
