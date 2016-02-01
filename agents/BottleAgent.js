var Promise = require('bluebird');
var eve = require('evejs');

function BottleAgent(args) {
  // execute super constructor
  eve.Agent.call(this, args.id);

  // load the RPC module
  this.rpc = this.loadModule('rpc', this.rpcFunctions);

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
BottleAgent.prototype = Object.create(eve.Agent.prototype);
BottleAgent.prototype.constructor = BottleAgent;

// create an object containing all RPC functions.
BottleAgent.prototype.rpcFunctions = {};
// create an RPC function
BottleAgent.prototype.rpcFunctions.dummy = function(params, from) {
  console.log('#getFillerLevel - RPC from:', from);

  return this._fillerLevel;
};

module.exports = BottleAgent;