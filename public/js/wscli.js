//var websocket = io.connect('http://localhost:3000', { 'forceNew': true });
var websocket = io.connect('http://10.140.21.50:3000', { 'forceNew': true });

websocket.on('welcome', function(data) { 
  console.log('Welcome message');
  //console.log(data);
  //render(data);
})

websocket.on('render', function(data) {  
  console.log('Render new command');
  console.log(data);
  //render(data);
})

websocket.on('upddashboard', function(data) {  
  console.log('Update dash board');
  console.log(data);
  updateDashboard(data);
})

websocket.on('updd3force', function(data) {  
  console.log('Update d3 force');
  console.log(data);
  updateD3force(data);
})

function updateDashboard(data) {
	var obj = jQuery.parseJSON(JSON.stringify(data));
	
	console.log(obj["0"].numdevs);
	$('#num_devs').html(obj["0"].numdevs);
	$('#num_msgs').html(obj["0"].nummsgs);
	$('#num_pings').html(obj["0"].numpings);
	$('#num_paths').html(obj["0"].numpaths);
	
	updatePieChartB(obj["0"].net_cov);
	updatePieChartO(obj["0"].data_cov);
	updatePieChartT(obj["0"].ping_cov);
	updatePieChartR(obj["0"].route_errors);
}

function updateD3force(data) {
	var obj = jQuery.parseJSON(JSON.stringify(data));
	
	/* Add nodes */
	for (node in obj.nodes) {		
		if (findNode(obj.nodes[node].u16Addr) == 0xFFFF) {
			/* Add node to d3Force graph */
			graph.addNode(obj.nodes[node].u16Addr, obj.nodes[node].u64Addr, obj.nodes[node].hops);
		}
	}
	
	/* Add links */
	for (link in obj.links) {
		if (findLink(obj.links[link].source, obj.links[link].target) == 0xFFFF) {
			/* Add node to d3Force graph */
			graph.addLink(obj.links[link].source, obj.links[link].target, obj.links[link].value);
		}
	}
	
}

// function render (data) {  
  // var html = data.map(function(elem, index) {
    // return(`<div>
              // <strong>${elem.user}</strong>:
              // <em>${elem.cmd}</em>
            // </div>`);
  // }).join(" ");

  // document.getElementById('messages').innerHTML = html;
// }

// function addMessage(e) {  
  // var message = {
    // user: document.getElementById('user').value,
    // cmd: document.getElementById('command').value
  // };

  // console.log('addMessage Form');
  // console.log(message);
  // websocket.emit('new-cmd', message);
  // return false;
// }

// function sendPLCCmd(e) {  
  // var message = {
    // getpib: document.getElementById('PibReqId').value
  // };
  
  // console.log('Sending message to PLC...');
  // console.log(message);
  // websocket.emit('new-plc-cmd', message);
  // return false;
// }

function updndev(e) {
  //var x = $('#num_devs').html();
  
  var cmd = 0
  	
  var message = {
	webcmd : cmd
  };
  
  console.log('Sending message to PLC...update num devices');
  console.log(message);
  websocket.emit('web-cmd', message);
}