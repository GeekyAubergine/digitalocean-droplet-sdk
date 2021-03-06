var chai = require('chai'),
    should = chai.should(), // eslint-disable-line no-unused-vars
    dropletSDK = require('../index'),
    chaiAsPromised = require('chai-as-promised'),
	mockery = require('mockery'),
	sinon = require('sinon');

chai.use(chaiAsPromised);

var exampleDroplet = {
	'droplet_id': 2756294,
	'hostname':'sample-droplet',
	'vendor_data':'#cloud-config\ndisable_root: false\nmanage_etc_hosts: true\n\ncloud_config_modules:\n - ssh\n - set_hostname\n - [ update_etc_hosts, once-per-instance ]\n\ncloud_final_modules:\n - scripts-vendor\n - scripts-per-once\n - scripts-per-boot\n - scripts-per-instance\n - scripts-user\n',
	'public_keys':['ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCcbi6cygCUmuNlB0KqzBpHXf7CFYb3VE4pDOf/RLJ8OFDjOM+fjF83a24QktSVIpQnHYpJJT2pQMBxD+ZmnhTbKv+OjwHSHwAfkBullAojgZKzz+oN35P4Ea4J78AvMrHw0zp5MknS+WKEDCA2c6iDRCq6/hZ13Mn64f6c372JK99X29lj/B4VQpKCQyG8PUSTFkb5DXTETGbzuiVft+vM6SF+0XZH9J6dQ7b4yD3sOder+M0Q7I7CJD4VpdVD/JFa2ycOS4A4dZhjKXzabLQXdkWHvYGgNPGA5lI73TcLUAueUYqdq3RrDRfaQ5Z0PEw0mDllCzhk5dQpkmmqNi0F sammy@digitalocean.com'],
	'region':'nyc3',
	'auth_key': '123456789',
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
				'mac':'04:01:2a:0f:2a:08',
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
	'tags': ['1', '2'],
};

describe('#droplet-api-reject', function() {
	it('should reject getMetadata as no api available', function() {
		return dropletSDK.getMetadata().should.be.rejected;
	});

	it('should reject getName as no api available', function() {
		return dropletSDK.getName().should.be.rejected;
	});
});

describe('#droplet-api-standard', function() {
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

	it('gets id', function() {
		return dropletSDK.getID().should.eventually.equal(exampleDroplet.droplet_id);
	});

	it('gets vendor data', function() {
		return dropletSDK.getVendorData().should.eventually.equal(exampleDroplet.vendor_data);
	});

	it('gets auth key', function() {
		return dropletSDK.getAuthKey().should.eventually.equal(exampleDroplet.auth_key);
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

	it('gets private mac address', function() {
		return dropletSDK.getPrivateMacAddresses().should.eventually.deep.equal([exampleDroplet.interfaces.private[0].mac,
			exampleDroplet.interfaces.private[1].mac]);
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

	it('gets public mac address', function() {
		return dropletSDK.getPublicMacAddresses().should.eventually.deep.equal([exampleDroplet.interfaces.public[0].mac]);
	});

	it('determines if has floating ip', function() {
		return dropletSDK.hasFloatingIP().should.eventually.equal(exampleDroplet.floating_ip.ipv4.active);
	});

	it('gets floating ip', function() {
		return dropletSDK.getFloatingIP().should.eventually.equal(exampleDroplet.floating_ip.ipv4.ip_address);
	});

	it('gets dns', function() {
		return dropletSDK.getDNS().should.eventually.deep.equal(exampleDroplet.dns.nameservers);
	});

	it('gets name servers', function() {
		return dropletSDK.getNameServers().should.eventually.deep.equal(exampleDroplet.dns.nameservers);
	});
	
	it('gets tags', function() {
		return dropletSDK.getTags().should.eventually.deep.equal(exampleDroplet.tags);
	});
});

describe('#droplet-api-with-no-vendor-data', function() {
	var dropletCopy;

	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.vendor_data;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets vendor data', function() {
		return dropletSDK.getVendorData().should.eventually.equal('');
	});
});

describe('#droplet-api-with-no-auth-key', function() {
	var dropletCopy;

	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.auth_key;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets vendor data', function() {
		return dropletSDK.getAuthKey().should.eventually.equal('');
	});
});

describe('#droplet-api-with-no-private-interfaces', function() {
	var dropletCopy;

	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.interfaces.private;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets interfaces', function() {
		return dropletSDK.getInterfaces().should.eventually.deep.equal(dropletCopy.interfaces);
	});

	it('gets private interfaces', function() {
		return dropletSDK.getPrivateInterfaces().should.eventually.deep.equal([]);
	});

	it('gets private IP4 address', function() {
		return dropletSDK.getPrivateIP4Addresses().should.eventually.deep.equal([]);
	});

	it('gets private IP6 address', function() {
		return dropletSDK.getPrivateIP6Addresses().should.eventually.deep.equal([]);
	});

	it('gets private mac address', function() {
		return dropletSDK.getPrivateMacAddresses().should.eventually.deep.equal([]);
	});

	it('gets public interfaces', function() {
		return dropletSDK.getPublicInterfaces().should.eventually.deep.equal(dropletCopy.interfaces.public);
	});

	it('gets public IP4 address', function() {
		return dropletSDK.getPublicIP4Addresses().should.eventually.deep.equal([dropletCopy.interfaces.public[0].ipv4.ip_address]);
	});

	it('gets public IP6 address', function() {
		return dropletSDK.getPublicIP6Addresses().should.eventually.deep.equal([dropletCopy.interfaces.public[0].ipv6.ip_address]);
	});

	it('gets public mac address', function() {
		return dropletSDK.getPublicMacAddresses().should.eventually.deep.equal([exampleDroplet.interfaces.public[0].mac]);
	});
});

describe('#droplet-api-with-no-public-interfaces', function() {
	var dropletCopy;

	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.interfaces.public;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets interfaces', function() {
		return dropletSDK.getInterfaces().should.eventually.deep.equal(dropletCopy.interfaces);
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

	it('gets private mac address', function() {
		return dropletSDK.getPrivateMacAddresses().should.eventually.deep.equal([exampleDroplet.interfaces.private[0].mac,
			exampleDroplet.interfaces.private[1].mac]);
	});

	it('gets public interfaces', function() {
		return dropletSDK.getPublicInterfaces().should.eventually.deep.equal([]);
	});

	it('gets public IP4 address', function() {
		return dropletSDK.getPublicIP4Addresses().should.eventually.deep.equal([]);
	});

	it('gets public IP6 address', function() {
		return dropletSDK.getPublicIP6Addresses().should.eventually.deep.equal([]);
	});

	it('gets public mac address', function() {
		return dropletSDK.getPublicMacAddresses().should.eventually.deep.equal([]);
	});
});

describe('#droplet-api-with-no-floating-ip', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.floating_ip.ipv4.ip_address;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('returns empty string for floating ip if not active', function() {
		return dropletSDK.getFloatingIP().should.eventually.equal('');
	});
});

describe('#droplet-api-with-no-dns', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.dns;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets dns', function() {
		return dropletSDK.getDNS().should.eventually.deep.equal([]);
	});

	it('gets name servers', function() {
		return dropletSDK.getNameServers().should.eventually.deep.equal([]);
	});
});

describe('#droplet-api-with-no-name-servers', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.dns.nameservers;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets dns', function() {
		return dropletSDK.getDNS().should.eventually.deep.equal([]);
	});

	it('gets name servers', function() {
		return dropletSDK.getNameServers().should.eventually.deep.equal([]);
	});
});

describe('#droplet-api-with-null-tags', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		dropletCopy.tags = null;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets tags', function() {
		return dropletSDK.getTags().should.eventually.deep.equal([]);
	});
});


describe('#droplet-api-with-no-tags', function() {
	before(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true,
		});

		const dropletCopy = JSON.parse(JSON.stringify(exampleDroplet));
		delete dropletCopy.tags;
		const requestStub = sinon.stub().yields(null, {statusCode: 200}, JSON.stringify(dropletCopy));

		mockery.registerMock('request', requestStub);

		//Reload so get newly mocked request
		dropletSDK = require('../index');
	});

	after(function() {
		mockery.disable();
	});

	it('gets tags', function() {
		return dropletSDK.getTags().should.eventually.deep.equal([]);
	});
});

