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

influx.query(`
    select * from concurrentuser
    order by time desc
    limit 1
  `).then(rows => {
  result = rows;
})

console.log(result);

function fetchData() {
  var res = {};
  influx.query('select * from concurrentuser limit 1').then(results => {
    // console.log(results);
    res = results;
    return res;
  });

};

var data = fetchData();
console.log(data);
