var express = require('express');
var fs = require('fs');
var router = express.Router();

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

router.get('/cmd', function(req, res) {
	console.log('Comando Recibido...');
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write('Enviando Respuesta.');
    res.end('Whatever you wish to send \n');
});

module.exports = router;
