var websocket = io.connect('http://'+window.location.host, { 'forceNew': true });

websocket.on('welcome', function(data) { 
  console.log('WSCLI: Welcome message');
})

websocket.on('upd_statistics_rsp', function(data) {  
  console.log("WSCLI: Update statistics response");
  console.log(data);
  refreshStatistics(data);
})

websocket.on('upd_statistics_plcmng_rsp', function(data) {  
  console.log("WSCLI: Update PLCManager statistics response");
  console.log(data);
  refreshPLCManaherStatistics(data);
})

websocket.on('upd_statistics_sys_rsp', function(data) {  
  console.log("WSCLI: Update System statistics response");
  console.log(data);
  refreshSystemStatistics(data);
})

websocket.on('upd_configuration_rsp', function(data) {  
  console.log("WSCLI: Update Configuration response");
  console.log(data);
  refreshConfiguration(data);
})

websocket.on('updrefreshgprsstatus', function(data) {  
  console.log("WSCLI: Update GPRS module response");
  console.log(data);
  refreshGPRSstatus(data);
})

function upd_statistics_req(data) {
	console.log("WSCLI: Update statistics request");
	websocket.emit('upd_statistics_req');
}

function upd_configuration_req(data) {
	console.log("WSCLI: Update configuration request");
	websocket.emit('upd_configuration_req');
}

function upd_gprs_status_req(data) {
	console.log("WSCLI: Update GPRS status request");
	websocket.emit('upd_gprs_status_req', data);
}
