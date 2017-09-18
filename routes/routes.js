var express = require('express');
var fs = require('fs');
var router = express.Router();

var returnRouter = function(io) {
	// GET home page
	router.get('/', function(req, res) {
		res.render('devices', { title: 'G3' });
	});
	router.get('/index.html', function(req, res) {
		res.render('devices', { title: 'G3' });
	});

	// Devices page
	router.get('/devices.html', function(req, res) {
		res.render('devices', { title: 'G3' });
	});

	// Statistics page
	router.get('/statistics.html', function(req, res) {
		res.render('statistics', { title: 'G3' });
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
		/* LNXCMD_REFRESH_DEVLIST */
		if (obj["0"].lnxcmd == 0x40) {
			console.log("ROUTES: LNXCMD_REFRESH_DEVLIST");
			var file = fs.readFileSync('/home/DCWeb/public/tables/devlist.json', 'utf8');
			var data = JSON.parse(file);
			io.sockets.emit('updrefreshdevlist', data);
		}	

		/* LNXCMD_REFRESH_GRPS */
		if (obj["0"].lnxcmd == 0x41) {
			console.log("ROUTES: LNXCMD_REFRESH_GPRS");
			var data = fs.readFileSync('/home/cfg/gprs_en', 'utf8');
			io.sockets.emit('refreshGPRSstatus', data);
		}

		/* LNXCMD_REFRESH_SNIFFER */
		if (obj["0"].lnxcmd == 0x42) {
			console.log("ROUTES: LNXCMD_REFRESH_SNIFFER");
			var data = fs.readFileSync('/home/cfg/sniffer_en', 'utf8');
			io.sockets.emit('refreshSnifferstatus', data);
		}			
	});

    return router;
}

module.exports = returnRouter;