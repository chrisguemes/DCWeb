var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var fs = require('fs');
var pusage = require('pidusage')
var os = require('os-utils');

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



var formatBytes = function(bytes, precision) {
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;
  var terabyte = gigabyte * 1024;

  if ((bytes >= 0) && (bytes < kilobyte)) {
    return bytes + ' B   ';
  } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
    return (bytes / kilobyte).toFixed(precision) + ' KB  ';
  } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
    return (bytes / megabyte).toFixed(precision) + ' MB  ';
  } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
    return (bytes / gigabyte).toFixed(precision) + ' GB  ';
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + ' TB  ';
  } else {
    return bytes + ' B   ';
  }
};



io.on('connection', function(socket) {  
	console.log('Alguien se ha conectado con Sockets');
	socket.emit('welcome');
	
	socket.on('upd_statistics_req', function(data) {
		console.log('Node: upd_statistics_info req');
		
		var stats = []
		
		/* Get all statistics from system files */
		/* ETH0 IFACE */
		var file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_packets', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_dropped', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_over_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_frame_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_packets', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_dropped', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_fifo_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_carrier_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/collisions', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/rx_bytes', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/eth0/statistics/tx_bytes', 'utf8');
		stats.push(file)
		/* PPP0 IFACE */
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_packets', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_dropped', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_over_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_frame_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_packets', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_dropped', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_fifo_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_carrier_errors', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/collisions', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/rx_bytes', 'utf8');
		stats.push(file)
		file = fs.readFileSync('/sys/class/net/ppp0/statistics/tx_bytes', 'utf8');
		stats.push(file)
		
		//console.log(stats);
		
		/* Send info to dashboard through wscli.js */
		io.sockets.emit('upd_statistics_rsp', stats);
				
		// /* PLC Manager PID */
		// var pid = 1256
		// pusage.stat(pid, function(err, stat) {
			
			// var pid_stats = []
			// //console.log('PLCManager Pcpu: %s', stat.cpu)
			// //console.log('PLCManager Mem: %s', stat.memory) //those are bytes
			// /* PLCManager PID stats */
			// pid_stats.push(stat.cpu)
			// pid_stats.push(stat.memory)
			
			// /* Send info to dashboard through wscli.js */
			// io.sockets.emit('upd_statistics_plcmng_rsp', pid_stats);
		// })
		// pusage.unmonitor(pid);
		
		/* System info */
		var sys_stats = []
		os.cpuFree(function(v){
			// console.log( 'CPU Free:' + v );
			sys_stats.push(v);
			// console.log('totalmem:' + os.totalmem()*1024);
			sys_stats.push(os.totalmem()*1024);
			// console.log('freemem:' + os.freemem()*1024);
			sys_stats.push(os.freemem()*1024);
			// console.log('sysUptime:' + os.sysUptime());
			sys_stats.push(os.sysUptime());
			//console.log('Load Average (5m):' + os.loadavg(5));
			sys_stats.push(os.loadavg(5));
			
			/* Send info to dashboard through wscli.js */
			io.sockets.emit('upd_statistics_sys_rsp', sys_stats);
		});	
	});
	
	// socket.on('upd_dashboard_info', function(data) {
		// console.log('Node: upd_dashboard_info req');
		
		// /* Send info to dashboard trhough wscli.js */
		// var file = fs.readFileSync('/home/DCWeb/public/tables/dashboard.json', 'utf8');
		// var data = JSON.parse(file);
		// io.sockets.emit('upddashboard', data);
		
		// /* Read file to obtain ICMP data graph */
		// var filegraph = fs.readFileSync('/home/DCWeb/public/tables/roundtimegraph.json', 'utf8');
		// var datagraph = JSON.parse(filegraph);
		// io.sockets.emit('initroundtime', datagraph);
		
		// /* Read file to obtain ICMP data graph */
		// var filegraph = fs.readFileSync('/home/DCWeb/public/tables/throughputgraph.json', 'utf8');
		// var datagraph = JSON.parse(filegraph);
		// io.sockets.emit('initdatathroughput', datagraph);
	// });

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
