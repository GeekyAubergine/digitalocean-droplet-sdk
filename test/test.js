var http = require('http'),
    chai = require('chai'),    
    should = chai.should(),
    dropletSDK = require('../index'),
    chaiAsPromised = require("chai-as-promised");
 
chai.use(chaiAsPromised);

var exampleDroplet = {
	"droplet_id":2756294,
	"hostname":"sample-droplet",
	"vendor_data":"#cloud-config\ndisable_root: false\nmanage_etc_hosts: true\n\ncloud_config_modules:\n - ssh\n - set_hostname\n - [ update_etc_hosts, once-per-instance ]\n\ncloud_final_modules:\n - scripts-vendor\n - scripts-per-once\n - scripts-per-boot\n - scripts-per-instance\n - scripts-user\n",
	"public_keys":["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCcbi6cygCUmuNlB0KqzBpHXf7CFYb3VE4pDOf/RLJ8OFDjOM+fjF83a24QktSVIpQnHYpJJT2pQMBxD+ZmnhTbKv+OjwHSHwAfkBullAojgZKzz+oN35P4Ea4J78AvMrHw0zp5MknS+WKEDCA2c6iDRCq6/hZ13Mn64f6c372JK99X29lj/B4VQpKCQyG8PUSTFkb5DXTETGbzuiVft+vM6SF+0XZH9J6dQ7b4yD3sOder+M0Q7I7CJD4VpdVD/JFa2ycOS4A4dZhjKXzabLQXdkWHvYGgNPGA5lI73TcLUAueUYqdq3RrDRfaQ5Z0PEw0mDllCzhk5dQpkmmqNi0F sammy@digitalocean.com"],
	"region":"nyc3",
	"interfaces":{
		"private":[
			{
				"ipv4":{
					"ip_address":"10.132.255.113",
					"netmask":"255.255.0.0",
					"gateway":"10.132.0.1"
				},
				"mac":"04:01:2a:0f:2a:02",
				"type":"private"
			}
		],
		"public":[
			{
				"ipv4":{
					"ip_address":"104.131.20.105",
					"netmask":"255.255.192.0",
					"gateway":"104.131.0.1"
				},
				"ipv6":{
					"ip_address":"2604:A880:0800:0010:0000:0000:017D:2001",
					"cidr":64,
					"gateway":"2604:A880:0800:0010:0000:0000:0000:0001"
				},
				"mac":"04:01:2a:0f:2a:01",
				"type":"public"}
		]
	},
	"floating_ip": {
		"ipv4": {
			"active": true,
			"address": '127.0.0.1',
		}
	},
	"dns":{
		"nameservers":[
			"2001:4860:4860::8844",
			"2001:4860:4860::8888",
			"8.8.8.8"
		]
	}
};

var server = http.createServer(function(req, res) {       
	res.end(JSON.stringify(exampleDroplet));
});

describe('#droplet-api-reject', function() {
	it('should reject getMetadata as no api available', function() {
		return dropletSDK.getMetadata().should.be.rejected;
	});

	it('should reject getName as no api available', function() {
		return dropletSDK.getName().should.be.rejected;
	});
});
describe('#droplet-api', function() {
	before(function() {
		process.env.HOST = '127.0.0.1';
		process.env.PORT = '7997';
		server.listen(7997, '127.0.0.1');
	});

	after(function() {
		server.close();
	});

	it('gets metadata', function() {
		return dropletSDK.getMetadata().should.eventually.equal(JSON.stringify(exampleDroplet));
	});
});