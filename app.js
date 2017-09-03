var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var fs = require('fs');

// Create Express application -----------------------------
var app = express();

// WebSockets ---------------------------------------------
var server = require('http').Server(app);  
var io = require('socket.io')(server);

// Linux Sockets
var unirest = require('unirest');

// Set ROUTES ---------------------------------------------
var routes = require('./routes/routes')(io);

// VIEWS EJS ----------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set PUBLIC static links --------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Enable ROUTES ------------------------------------------
app.use('/', routes);

io.on('connection', function(socket) {  
	console.log('Alguien se ha conectado con Sockets');
	socket.emit('welcome');
	
	socket.on('upd_dashboard_info', function(data) {
		console.log('Node: upd_dashboard_info req');
		
		/* Send info to dashboard trhough wscli.js */
		var file = fs.readFileSync('/home/DCWeb/public/tables/dashboard.json', 'utf8');
		var data = JSON.parse(file);
		io.sockets.emit('upddashboard', data);
		
		/* Read file to obtain ICMP data graph */
		var filegraph = fs.readFileSync('/home/DCWeb/public/tables/roundtimegraph.json', 'utf8');
		var datagraph = JSON.parse(filegraph);
		io.sockets.emit('initroundtime', datagraph);
		
		/* Read file to obtain ICMP data graph */
		var filegraph = fs.readFileSync('/home/DCWeb/public/tables/throughputgraph.json', 'utf8');
		var datagraph = JSON.parse(filegraph);
		io.sockets.emit('initdatathroughput', datagraph);
	});

	socket.on('client-req-lnx', function(data) {
		console.log('Node: client-req-lnx');
		console.log(data);
		
		/* Send Command to Linux : receive event in PLCManager application */
		unirest.post('http://127.0.0.1:9060')
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.send(data)
		.end(function (response) {
			console.log(response.body);
		});
	});
});

// ERRORS -------------------------------------------------
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

server.listen(4000, function() {  
  console.log("Servidor corriendo en http://localhost:4000");
});
