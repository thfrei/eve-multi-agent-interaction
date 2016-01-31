var Promise = require('bluebird');
var eve = require('evejs');

function RPCAgent(id, props) {
  // execute super constructor
  eve.Agent.call(this, id);

  this.props = props;

  // load the RPC module
  this.rpc = this.loadModule('rpc', this.rpcFunctions, {timeout:10*1000});

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());

  //setTimeout(function(){
  //  console.log('i believe we are just listeining to any kind of timeout things');
  //},1337);
}

// extend the eve.Agent prototype
RPCAgent.prototype = Object.create(eve.Agent.prototype);
RPCAgent.prototype.constructor = RPCAgent;

RPCAgent.prototype.receive = function(from, message) {
  console.log(this.id, from + ' said: ' + JSON.stringify(message));
};

// create an object containing all RPC functions.
RPCAgent.prototype.rpcFunctions = {};
// create an RPC function
RPCAgent.prototype.rpcFunctions.add = function(params, from) {
  console.log('Received a remote procedure call from:', from);

  this.send(from, 'Thank you for your request. Please wait 5s');

  var sum = params.a + params.b;

  return new Promise(function(resolve){
    setTimeout(function(){
      resolve(sum);
    }, 5000);
  }).bind(this);
};



module.exports = RPCAgent;