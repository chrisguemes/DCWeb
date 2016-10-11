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
		res.write('Enviando Respuesta.');
		res.end('Whatever you wish to send \n');
		console.log(req.body);
		
		//var dashbrd = require('/home/DCWeb/public/tables/dashboard');
		var file = fs.readFileSync('/home/DCWeb/public/tables/dashboard.json', 'utf8');
		var dashbrd = JSON.parse(file);
		var obj = JSON.parse(JSON.stringify(req.body, null, 2));
		console.log(obj);
		console.log(obj["0"].lnxcmd);
		
		/* Send Command to WEB client : receive event in wscli.js */
		if (obj["0"].lnxcmd == 64) {
			//console.log(dashbrd["0"].net_cov);
			io.sockets.emit('upddashboard', dashbrd);
		}
		
		
	});

    return router;
}

module.exports = returnRouter;