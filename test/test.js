var http = require('http'),
    chai = require('chai'),    
    should = chai.should(),
    dropletSDK = require('../index'),
    chaiAsPromised = require("chai-as-promised");
 
chai.use(chaiAsPromised);

var exampleDroplet = {
	
}

var server = http.createServer(function(req, res) {       
	res.end(JSON.stringify({
        	id: 123456,
        }));
});

describe('#droplet-api', function() {
	before(function() {
		process.env.HOST = '127.0.0.1';
		process.env.PORT = '7997';
		server.listen(7997, '127.0.0.1', function() {
			console.log('testing');
		});			
	});

	after(function() {
		server.close();
	});

	it('gets metadata', function() {
		return dropletSDK.getMetadata().should.eventually.equal(JSON.stringify({
			id: 123456,
		}));
	});
});
