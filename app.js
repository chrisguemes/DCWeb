var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var routes = require('./routes/routes');

var app = express();

// VIEWS --------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// WebSockets ---------------------------------------------
var server = require('http').Server(app);  
var io = require('socket.io')(server);
// Linux Sockets
var unirest = require('unirest');

var cmds = [{  
  id: 1,
  cmd: "cmd 1",
  user: "server"
}];

io.on('connection', function(socket) {  
	console.log('Alguien se ha conectado con Sockets');
	socket.emit('welcome', cmds);

	socket.on('new-cmd', function(data) {
		console.log('New-cmd received...');
		cmds.push(data);
		io.sockets.emit('render', cmds);
	});

	socket.on('new-plc-cmd', function(data) {
		console.log('New-plc-cmd received... sending to PLC');
		console.log(data);
		unirest.post('http://127.0.0.1:9060')
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.send({ "user": "NODE", "cmd": "CMD1" })
		.end(function (response) {
			console.log(response.body);
		});

		/*unirest.post('http://127.0.0.1:9060')
		.header('Accept', 'application/json')
		.send({ "Hello": "World!" })
		.end(function (response) {
			console.log(response.body);
		});*/
	});
});

// ERRORS -------------------------------------------------
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
		console.log(err);
        /*res.render('error', {
            message: err.message,
            error: err
        });*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
	console.log(err);
    /*res.render('error', {
        message: err.message,
        error: {}
    });*/
});

server.listen(3000, function() {  
  console.log("Servidor corriendo en http://localhost:3000");
});
