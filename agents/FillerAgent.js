var Promise = require('bluebird');
var eve = require('evejs');

function FillerAgent(args) {
  // execute super constructor
  eve.Agent.call(this, args.id);

  // Set initial filler level
  this._fillerLevel = (args.initial.fillerLevel)? args.initial.fillerLevel : 100;

  // load the RPC module
  this.rpc = this.loadModule('rpc', this.rpcFunctions, {timeout:2*1000});

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
FillerAgent.prototype = Object.create(eve.Agent.prototype);
FillerAgent.prototype.constructor = FillerAgent;

// create an object containing all RPC functions.
FillerAgent.prototype.rpcFunctions = {};
// create an RPC function
FillerAgent.prototype.rpcFunctions.getFillerLevel = function(params, from) {
  console.log('#getFillerLevel - RPC from:', from);

  return this._fillerLevel;
};

module.exports = FillerAgent;