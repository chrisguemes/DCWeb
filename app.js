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

	socket.on('upd_configuration_req', function(data) {
		console.log('Node: upd_configuration_req req');
		
		var config = []
		
		/* Get all configuration from home/cfg files */
		var file = fs.readFileSync('/home/cfg/sysname', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/sysnodename', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/sysrelease', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/sysversion', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/sysmachine', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/startuptime', 'utf8');
		config.push(file)

		var file = fs.readFileSync('/home/cfg/appname', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/appversion', 'utf8');
		config.push(file)

		var file = fs.readFileSync('/home/cfg/pppmacdaddress', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/pppula', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/ppplla', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/routeppp', 'utf8');
		config.push(file)

		var file = fs.readFileSync('/home/cfg/plcula', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/plclla', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/plcprefix', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/routeplc', 'utf8');
		config.push(file)

		var file = fs.readFileSync('/home/cfg/panid', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/secpsk', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/secgmk', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/maxhops', 'utf8');
		config.push(file)
		var file = fs.readFileSync('/home/cfg/maxjoinwaittime', 'utf8');
		config.push(file)

		/* Send info to dashboard through wscli.js */
		io.sockets.emit('upd_configuration_rsp', config);
	});

	socket.on('upd_gprs_status_req', function(data) {
		console.log('Node: upd_gprs_status_req req');
		
		console.log("WHAT TO DO NOW???????????");
		console.log(data)
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
