var request = require('request');

module.exports = {
	getMetadata: function() {
		return new Promise(function(resolve, reject) {
			var host = process.env.HOST || '169.254.169.254';
			var port = process.env.PORT ? (':' + process.env.PORT) : '';
			request('http://' + host + port + '/metadata/v1.json', function(error, response, body) {
				if (!error && response.statusCode === 200) {
					resolve(body);
				}
				else {
					reject(error);
				}
			});
		});
	}
};
