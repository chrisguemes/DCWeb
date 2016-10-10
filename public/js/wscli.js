//var socket = io.connect('http://localhost:3000', { 'forceNew': true });
var socket = io.connect('http://10.140.21.50:3000', { 'forceNew': true });

socket.on('welcome', function(data) { 
  console.log('Welcome message');
  console.log(data);
  render(data);
})

socket.on('render', function(data) {  
  console.log('Render new command');
  console.log(data);
  render(data);
})

function render (data) {  
  var html = data.map(function(elem, index) {
    return(`<div>
              <strong>${elem.user}</strong>:
              <em>${elem.cmd}</em>
            </div>`);
  }).join(" ");

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {  
  var message = {
    user: document.getElementById('user').value,
    cmd: document.getElementById('command').value
  };

  console.log('addMessage Form');
  console.log(message);
  socket.emit('new-cmd', message);
  return false;
}

function sendPLCCmd(e) {  
  var message = {
    getpib: document.getElementById('PibReqId').value
  };
  
  console.log('Sending message to PLC...');
  console.log(message);
  socket.emit('new-plc-cmd', message);
  return false;
}