var websocket = io.connect('http://'+window.location.host, { 'forceNew': true });

websocket.on('welcome', function(data) { 
  console.log('WSCLI: Welcome message');
})

websocket.on('updrefreshdevlist', function(data) {  
  console.log('WSCLI: Refresh Device List');
  //console.log(data);
  refreshDeviceTable();
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

function upd_statistics_req(data) {
	console.log("WSCLI: Update statistics request");
	websocket.emit('upd_statistics_req');
}



function updateDashboard(data) {
	var obj = jQuery.parseJSON(JSON.stringify(data));
	
	/* Update dash board params */
	console.log("WSCLI: Update dashboard");
	$('#num_devs').html(obj["0"].numdevs);
	$('#num_msgs').html(obj["0"].nummsgs);
	$('#num_pings').html(obj["0"].numpings);
	$('#num_paths').html(obj["0"].numpaths);
	
	/* Update dash board pie charts */
	console.log("WSCLI: Update pie charts");
	updatePieChartB(obj["0"].net_cov);
	updatePieChartO(obj["0"].data_cov);
	updatePieChartT(obj["0"].ping_cov);
	updatePieChartR(obj["0"].route_errors);
	
	/* Update D3 force */
	console.log("WSCLI: Update d3 force");
	//update_graph();
	d3forceRestart();
}

// function updateD3force(data) {
	// var obj = jQuery.parseJSON(JSON.stringify(data));
	
	// /* Add nodes */
	// for (node in obj.nodes) {		
		// if (d3forceFindNode(obj.nodes[node].u64Addr) == undefined) {
			// /* Add node to d3Force graph */
			// d3forceAddNode(obj.nodes[node].u16Addr, obj.nodes[node].u64Addr, obj.nodes[node].hops);
		// }
	// }
	
	// /* Add links */
	// for (link in obj.links) {
		// if (d3forceFindLink(obj.links[link].source, obj.links[link].target) == undefined) {
			// /* Add node to d3Force graph */
			// d3forceAddLink(obj.links[link].source, obj.links[link].target, obj.links[link].value);
		// }
	// }
	
// }

function upd_dashboard_info_req(e) {
  console.log('WSCLI: Sending message to Node: upd_dashboard_info');
  websocket.emit('upd_dashboard_info');
  
  // var cmd = 0
  	
  // var message = {
	// webcmd : cmd
  // };
    
  // console.log(message);
  // websocket.emit('upd_dashboard_info', message);
  
}