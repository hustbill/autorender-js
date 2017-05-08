const Influx = require('influx');
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
})

var result = {};
 const dbresult = {
      results: [
        {
          statement_id: 0,
          series: [
            {
              name: 'cpuUsage',
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
//var myObj = JSON.parse('{"p": 5}');
//var firstObj = JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}', (key, value) => {
//                 console.log(key); // log the current property name, the last is "".
//                 return value;     // return the unchanged property value.
//               });
//
//console.log('firstObj : ', firstObj);

// Using the reviver parameter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
var cpuUsage = [];
function transform(dbresult) {
  var secondObj = JSON.parse(JSON.stringify(dbresult), (key, value) => {
    if (key === 'values') {
      cpuUsage.push(value);
    }
    // console.log(key); // log the current property name, the last is "".
    return value;     // return the unchanged property value.
  });
  return cpuUsage;
}

function convert(cpuUsage) {
  var transformData = [];
  for (var i  = 0; i < cpuUsage[0].length; i++){
    var row = {text: cpuUsage[0][i][0],  value: cpuUsage[0][i][2]};
    // { text: '2017-05-05T01:51:03.514798957Z', value: 3 }
    transformData.push(row);
  }
  return transformData;
}

cpuUsage = transform(dbresult);
var barData = convert(cpuUsage);
// console.log(cpuUsage);
console.log(barData);
//var getTweetData = function() {
//	var str = JSON.stringify(dbresult);
//	var parsedJSON = JSON.parse(str);
//	console.log(parsedJSON.result);
//	var values = parsedJSON.values;
//	return {
//	   parsedJSON
//	}
//};
//
//var numTweets = 1;
//var ts = {tweets:getTweetData()}
//console.log({tweets:getTweetData()})

const str = '2017-05-05T01:51:03.514798957Z';

var hms = str.substring('2017-05-05T'.length, '2017-05-05T'.length + '01:51:03'.length);
console.log(hms);
