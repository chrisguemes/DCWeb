var websocket = io.connect('http://'+window.location.host, { 'forceNew': true });

websocket.on('welcome', function(data) { 
  console.log('WSCLI: Welcome message');
})

// websocket.on('render', function(data) {  
  // console.log('Render new command');
  // console.log(data);
// })

websocket.on('upddashboard', function(data) {  
  console.log('WSCLI: Update dash board');
  //console.log(data);
  updateDashboard(data);
})

websocket.on('updroundtime', function(data) {  
  console.log('WSCLI: Update ICMP round time');
  //console.log(data);
  updateICMPRoundTime(data);
  updateDashboard(data);
})

websocket.on('updd3force', function(data) {  
  console.log('WSCLI: Update d3 force');
  //console.log(data);
  //updateD3force(data);
  //update_graph();
  d3forceRestart();
})

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