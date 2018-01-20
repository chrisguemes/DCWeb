var express = require('express');
var fs = require('fs');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');

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
	
	router.post('/upload', function(req, res){
		console.log('POST Upload Recibido...');
		var form = new formidable.IncomingForm();

		form.parse(req);

		form.on('fileBegin', function (name, file){		
			file.path = "./uploads/"+file.name;
			console.log('Start upload... ' + file.path);
			fs.unlink("/home/cfg/fu_en", function (err) {
			  	if(err) {
			        return console.log('Fu_en file not exist');
			    }
			  	console.log('fu_en deleted!');
			});
		});

		form.on('file', function (name, file){
			console.log('Uploaded ' + file.name);
			// Update cfg file to enable FU
			var filepath = '/home/DCWeb/uploads/' + file.name;
			console.log(filepath);

			fs.writeFile("/home/cfg/fu_en", filepath, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    fs.chmod("/home/cfg/fu_en", 0777, function(err) {
			    	if(err) {
				        console.log('Fu_en file: ERROR in file permissions');
				    }
                    console.log('Fu_en file: Changed file permissions');
                });

			    console.log("The file was saved!");
			}); 
		});

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
			io.sockets.emit('upd_refreshdevlist', data);
		}	

		/* LNXCMD_REFRESH_GRPS */
		if (obj["0"].lnxcmd == 0x41) {
			console.log("ROUTES: LNXCMD_REFRESH_GPRS");
			var data = fs.readFileSync('/home/cfg/gprs_en', 'utf8');
			io.sockets.emit('upd_gprs_refresh_rsp', data);
		}

		/* LNXCMD_REFRESH_SNIFFER */
		if (obj["0"].lnxcmd == 0x42) {
			console.log("ROUTES: LNXCMD_REFRESH_SNIFFER");
			var data = fs.readFileSync('/home/cfg/sniffer_en', 'utf8');
			io.sockets.emit('upd_sniffer_refresh_rsp', data);
		}

		/* LNXCMD_REFRESH_FU */
		if (obj["0"].lnxcmd == 0x43) {
			console.log("ROUTES: LNXCMD_REFRESH_FU");
			var data = fs.readFileSync('/home/cfg/fu_st', 'utf8');
			io.sockets.emit('upd_fu_refresh_rsp', data);
		}			
	});

    return router;
}

module.exports = returnRouter;