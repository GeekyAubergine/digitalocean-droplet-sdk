var chai = require('chai'),
    should = chai.should(), // eslint-disable-line no-unused-vars
    dropletSDK = require('../index'),
    chaiAsPromised = require('chai-as-promised'),
	mockery = require('mockery'),
	sinon = require('sinon');

chai.use(chaiAsPromised);

var exampleDroplet = {
	'droplet_id':2756294,
	'hostname':'sample-droplet',
	'vendor_data':'#cloud-config\ndisable_root: false\nmanage_etc_hosts: true\n\ncloud_config_modules:\n - ssh\n - set_hostname\n - [ update_etc_hosts, once-per-instance ]\n\ncloud_final_modules:\n - scripts-vendor\n - scripts-per-once\n - scripts-per-boot\n - scripts-per-instance\n - scripts-user\n',
	'public_keys':['ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCcbi6cygCUmuNlB0KqzBpHXf7CFYb3VE4pDOf/RLJ8OFDjOM+fjF83a24QktSVIpQnHYpJJT2pQMBxD+ZmnhTbKv+OjwHSHwAfkBullAojgZKzz+oN35P4Ea4J78AvMrHw0zp5MknS+WKEDCA2c6iDRCq6/hZ13Mn64f6c372JK99X29lj/B4VQpKCQyG8PUSTFkb5DXTETGbzuiVft+vM6SF+0XZH9J6dQ7b4yD3sOder+M0Q7I7CJD4VpdVD/JFa2ycOS4A4dZhjKXzabLQXdkWHvYGgNPGA5lI73TcLUAueUYqdq3RrDRfaQ5Z0PEw0mDllCzhk5dQpkmmqNi0F sammy@digitalocean.com'],
	'region':'nyc3',
	'interfaces':{
		'private':[
			{
				'ipv4':{
					'ip_address':'10.132.255.113',
					'netmask':'255.255.0.0',
					'gateway':'10.132.0.1',
				},
				'mac':'04:01:2a:0f:2a:02',
				'type':'private',
			}, {
				'ipv4':{
					'ip_address':'10.132.255.114',
					'netmask':'255.255.0.0',
					'gateway':'10.132.0.1',
				},
				'ipv6':{
					'ip_address':'2604:A880:0800:0010:0000:0000:017D:2001',
					'cidr':64,
					'gateway':'2604:A880:0800:0010:0000:0000:0000:0001',
				},
				'mac':'04:01:2a:0f:2a:02',
				'type':'private',
			},
		],
		'public':[
			{
				'ipv4':{
					'ip_address':'104.131.20.105',
					'netmask':'255.255.192.0',
					'gateway':'104.131.0.1',
				},
				'ipv6':{
					'ip_address':'2604:A880:0800:0010:0000:0000:017D:2001',
					'cidr':64,
					'gateway':'2604:A880:0800:0010:0000:0000:0000:0001',
				},
				'mac':'04:01:2a:0f:2a:01',
				'type':'public',
			},
		],
	},
	'floating_ip': {
		'ipv4': {
			'active': true,
			'ip_address': '127.0.0.1',
		},
	},
	'dns':{
		'nameservers':[
			'2001:4860:4860::8844',
			'2001:4860:4860::8888',
			'8.8.8.8',
		],
	},
};

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
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(exampleDroplet));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets metadata', function() {
		return dropletSDK.getMetadata().should.eventually.deep.equal(exampleDroplet);
	});

	it('gets hostname', function() {
		return dropletSDK.getHostName().should.eventually.equal(exampleDroplet.hostname);
	});

	it('gets name', function() {
		return dropletSDK.getName().should.eventually.equal(exampleDroplet.hostname);
	});

	it('gets public keys', function() {
		return dropletSDK.getPublicKeys().should.eventually.deep.equal(exampleDroplet.public_keys);
	});

	it('gets region', function() {
		return dropletSDK.getRegion().should.eventually.equal(exampleDroplet.region);
	});

	it('gets interfaces', function() {
		return dropletSDK.getInterfaces().should.eventually.deep.equal(exampleDroplet.interfaces);
	});

	it('gets private interfaces', function() {
		return dropletSDK.getPrivateInterfaces().should.eventually.deep.equal(exampleDroplet.interfaces.private);
	});

	it('gets private IP4 address', function() {
		return dropletSDK.getPrivateIP4Addresses().should.eventually.deep.equal([exampleDroplet.interfaces.private[0].ipv4.ip_address,
			exampleDroplet.interfaces.private[1].ipv4.ip_address]);
	});

	it('gets private IP6 address', function() {
		return dropletSDK.getPrivateIP6Addresses().should.eventually.deep.equal([exampleDroplet.interfaces.private[1].ipv6.ip_address]);
	});

	it('gets public interfaces', function() {
		return dropletSDK.getPublicInterfaces().should.eventually.deep.equal(exampleDroplet.interfaces.public);
	});

	it('gets public IP4 address', function() {
		return dropletSDK.getPublicIP4Addresses().should.eventually.deep.equal([exampleDroplet.interfaces.public[0].ipv4.ip_address]);
	});

	it('gets public IP6 address', function() {
		return dropletSDK.getPublicIP6Addresses().should.eventually.deep.equal([exampleDroplet.interfaces.public[0].ipv6.ip_address]);
	});

	it('determines if has floating ip', function() {
		return dropletSDK.hasFloatingIP().should.eventually.equal(exampleDroplet.floating_ip.ipv4.active);
	});

	it('gets floating ip', function() {
		return dropletSDK.getFloatingIP().should.eventually.equal(exampleDroplet.floating_ip.ipv4.ip_address);
	});
});

describe('#droplet-api-with-no-floating-ip', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		exampleDroplet.floating_ip.ipv4.active = false;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(exampleDroplet));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('returns empty string for floating ip if not active', function() {
		exampleDroplet.floating_ip.ipv4.active = false;
		return dropletSDK.getFloatingIP().should.eventually.equal('');
	});
});
