var bunyan = require('bunyan');
var bunyanOptions = {
	name: 'logger',
	streams: [
		{
			level: 'info',
			path:'./info.log'
		},
		{
			level: 'error',
			path: './error.log'
		}
	]
};

var logger = bunyan.createLogger(bunyanOptions);
module.exports = logger;