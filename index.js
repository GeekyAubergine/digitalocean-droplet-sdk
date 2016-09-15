var request = require('request');

module.exports = {
	getMetadata: function() {
		return new Promise(function(resolve, reject) {
			var host = process.env.HOST || '169.254.169.254';
			var port = process.env.PORT ? (':' + process.env.PORT) : '';
			console.log('http://' + host + port + '/metadata/v1.json');
			request('http://' + host + port + '/metadata/v1.json', {timeout: 1500}, function(error, response, body) {
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
