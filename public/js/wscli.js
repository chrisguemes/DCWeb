var websocket = io.connect('http://'+window.location.host, { 'forceNew': true });

websocket.on('welcome', function(data) { 
  console.log('WSCLI: Welcome message');
})

websocket.on('upd_refreshdevlist', function(data) {  
  console.log("WSCLI: Refresh Device List");
  console.log(data);
  refreshDeviceTable(data);
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

websocket.on('upd_gprs_refresh_rsp', function(data) {  
  console.log("WSCLI: Update GPRS module response");
  console.log(data);
  refreshGPRSstatus(data);
})

websocket.on('upd_sniffer_refresh_rsp', function(data) {  
  console.log("WSCLI: Update SNIFFER module response");
  console.log(data);
  refreshSnifferstatus(data);
})

websocket.on('upd_fu_refresh_rsp', function(data) {  
  console.log("WSCLI: Update Firmware Upgrade status");
  console.log(data);
  refreshFUstatus(data);
})

function upd_statistics_req(data) {
	console.log("WSCLI: Update statistics request");
	websocket.emit('upd_statistics_req');
}

function upd_configuration_req(data) {
	console.log("WSCLI: Update configuration request");
	websocket.emit('upd_configuration_req');
}

function swap_gprs_status_req(data) {
	console.log("WSCLI: Swap GPRS status request");
	websocket.emit('swap_gprs_status_req', data.checked);
}

function swap_sniffer_status_req(data) {
	console.log("WSCLI: Swap PLC Sniffer status request");
	websocket.emit('swap_sniffer_status_req', data.checked);
}
