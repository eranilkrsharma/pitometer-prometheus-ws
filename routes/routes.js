var express = require('express');
var router = express.Router();



const Pitometer = require('@keptn/pitometer').Pitometer;
const DynatraceSource = require('@keptn/pitometer-source-dynatrace').Source;
const PrometheusSource = require('@keptn/pitometer-source-prometheus').Source;
const ThresholdGrader = require('@keptn/pitometer-grader-threshold').Grader;

const pitometer = new Pitometer();


  router.use(function(req, res, next) {
		console.log('Processing request');
		next();
	});
  
  router.get('/', function(req, res) {
    res.status(400).json({ status: 'error', message: 'Please, use pitometer calling /api/pitometer' }); 
  });

  router.post('/pitometer', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var perfSpec = req.body.perfSpec;
    var timeStart = req.body.timeStart;
    var timeEnd = req.body.timeEnd;

    // if don't find environment variables, then look to see if they are defined
    // in a local .env file
 // Register a Prometheus source that will be used if the source ID in your
 // Perfspec matches 'Prometheus'
    pitometer.addSource('Prometheus', new PrometheusSource({
    	queryUrl: '<<          XXXXX                  >>',
    }));

    // configure the ThresholdGrader
    pitometer.addGrader('Threshold', new ThresholdGrader());

    // debug output
    var perfSpecString = JSON.stringify(perfSpec);
    console.log("Passed in timeStart: " + timeStart + "  timeEnd: " + timeEnd)
    console.log("Passed in perfSpecString: " + perfSpecString)

    // make the pitometer request
    var telemetryErr ="";
    await pitometer.run(perfSpec, {context:"application/json", timeStart: timeStart, timeEnd: timeEnd} )
    .then((results) => telemetryResult = results)
    .catch((err) => telemetryErr = err);

    if(telemetryErr)
    {
      console.error("Result Error: " + telemetryErr.stack)
      res.status(500).json({ result: 'error', message: telemetryErr.message });
    }
    else
    {
      console.log("Result Sucess: " + JSON.stringify(telemetryResult.result))
      res.send(JSON.stringify(telemetryResult));
    }
});  

module.exports.router = router;
