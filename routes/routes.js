var express = require('express');
var fs = require('fs');
var router = express.Router();

var returnRouter = function(io) {
	// GET home page
	router.get('/', function(req, res) {
		res.render('index', { title: 'G3' });
	});
	router.get('/index.html', function(req, res) {
		res.render('index', { title: 'G3' });
	});

	// Devices page
	router.get('/devices.html', function(req, res) {
		res.render('devices', { title: 'G3' });
	});

	// Network page
	router.get('/network.html', function(req, res) {
		res.render('network', { title: 'G3' });
	});

	// Events page
	router.get('/events.html', function(req, res) {
		res.render('events', { title: 'G3' });
	});

	// Configuration page
	router.get('/configuration.html', function(req, res) {
		res.render('configuration', { title: 'G3' });
	});

	// POST REST-API from linux application
	router.post('/', function(req, res) {
		console.log('POST Comando Recibido...');
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(' ');
		res.end('\n');
		
		var obj = JSON.parse(JSON.stringify(req.body, null, 2));
		
		/* Send Commands to WEB client : receive events in wscli.js */
		/* LNXCMS_UPDATE_DASHBOARD */
		if (obj["0"].lnxcmd == 0x40) {
			console.log("ROUTES: LNXCMS_UPDATE_DASHBOARD");
			var file = fs.readFileSync('/home/DCWeb/public/tables/dashboard.json', 'utf8');
			var data = JSON.parse(file);
			io.sockets.emit('upddashboard', data);
		}
		
		/* LNXCMS_UPDATE_PATHLIST */
		if (obj["0"].lnxcmd == 0x41) {
			console.log("ROUTES: LNXCMS_UPDATE_PATHLIST");
			var file = fs.readFileSync('/home/DCWeb/public/tables/pathlist.json', 'utf8');
			var data = JSON.parse(file);
			io.sockets.emit('updd3force', data);
		}
		
		/* LNXCMS_UPDATE_ROUNDTIME */
		if (obj["0"].lnxcmd == 0x42) {
			console.log("ROUTES: LNXCMS_UPDATE_ROUNDTIME");
			var data = getRoundTimeDataGraph();
			io.sockets.emit('updroundtime', data);
		}
		
		
	});

    return router;
}

// /* Add new sample to ICMP data graph */
function getRoundTimeDataGraph() {
	console.log("getRoundTimeDataGraph");
	
	/* Read file to obtain new sample */
	var file = fs.readFileSync('/home/DCWeb/public/tables/roundtime.json', 'utf8');
	var newdata = JSON.parse(file);
	
	/* Read file to obtain ICMP data graph */
	var filegraph = fs.readFileSync('/home/DCWeb/public/tables/roundtimegraph.json', 'utf8');
	var datagraph = JSON.parse(filegraph);
	
	datagraph.push(newdata);
	
	while (datagraph.length > 7) {
		datagraph.shift();
	}
	
	/* update filegraph */
	fs.unlinkSync('/home/DCWeb/public/tables/roundtimegraph.json');
	var contents = fs.writeFileSync('/home/DCWeb/public/tables/roundtimegraph.json', JSON.stringify(datagraph));	
		
	return datagraph;
}

module.exports = returnRouter;