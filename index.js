var request = require('request');

var getMetadata = function() {
	return new Promise(function(resolve, reject) {
		request('http://169.254.169.254/metadata/v1.json', {timeout: 100}, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				resolve(JSON.parse(body));
			}
			else {
				reject(error);
			}
		});
	});
};

var defaultPromise = function(transformer) {
	return new Promise(function(resolve, reject) {
		getMetadata().then(function(data) {
			resolve(transformer(data));
		}).catch(function(error) {
			reject(error);
		});
	});
};

var getID = function() {
	return defaultPromise(function(data) {
		return data.droplet_id;
	});
};

var getHostName = function() {
	return defaultPromise(function(data) {
		return data.hostname;
	});
};

var getVendorData = function() {
	return defaultPromise(function(data) {
		return data.vendor_data || '';
	});
};

var getPublicKeys = function() {
	return defaultPromise(function(data) {
		return data.public_keys;
	});
};

var getRegion = function() {
	return defaultPromise(function(data) {
		return data.region;
	});
};

var getAuthKey = function() {
	return defaultPromise(function(data) {
		return data.auth_key || '';
	});
};

var getInterfaces = function() {
	return defaultPromise(function(data) {
		return data.interfaces;
	});
};

var getPrivateInterfaces = function() {
	return defaultPromise(function(data) {
		return data.interfaces.private || [];
	});
};

var getPrivateIP4Addresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.private) {
			return [];
		}
		return data.interfaces.private.filter(function(x) {
			return x.ipv4;
		}).map(function(x) {
			return x.ipv4.ip_address;
		});
	});
};

var getPrivateIP6Addresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.private) {
			return [];
		}
		return data.interfaces.private.filter(function(x) {
			return x.ipv6;
		}).map(function(x) {
			return x.ipv6.ip_address;
		});
	});
};

var getPrivateMacAddresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.private) {
			return [];
		}
		return data.interfaces.private.map(function(x) {
			return x.mac;
		});
	});
};

var getPublicInterfaces = function() {
	return defaultPromise(function(data) {
		return data.interfaces.public || [];
	});
};

var getPublicIP4Addresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.public) {
			return [];
		}
		return data.interfaces.public.filter(function(x) {
			return x.ipv4;
		}).map(function(x) {
			return x.ipv4.ip_address;
		});
	});
};

var getPublicIP6Addresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.public) {
			return [];
		}
		return data.interfaces.public.filter(function(x) {
			return x.ipv6;
		}).map(function(x) {
			return x.ipv6.ip_address;
		});
	});
};

var getPublicMacAddresses = function() {
	return defaultPromise(function(data) {
		if (!data.interfaces.public) {
			return [];
		}
		return data.interfaces.public.map(function(x) {
			return x.mac;
		});
	});
};

var hasFloatingIP = function() {
	return defaultPromise(function(data) {
		return data.floating_ip.ipv4.active;
	});
};

var getFloatingIP = function() {
	return defaultPromise(function(data) {
		return data.floating_ip.ipv4.ip_address || '';
	});
};

var getNameServers = function() {
	return defaultPromise(function(data) {
		if (!data.dns || !data.dns.nameservers) {
			return [];
		}
		return data.dns.nameservers;
	});
};

var getTags = function() {
	return defaultPromise(function(data) {
		return data.tags || [];
	});
};

module.exports = {
	getMetadata: getMetadata,
	getID: getID,
	getVendorData: getVendorData,
	getAuthKey: getAuthKey,
	getHostName: getHostName,
	getName: getHostName,
	getPublicKeys: getPublicKeys,
	getRegion: getRegion,
	getInterfaces: getInterfaces,
	getPrivateInterfaces: getPrivateInterfaces,
	getPrivateIP4Addresses: getPrivateIP4Addresses,
	getPrivateIP6Addresses: getPrivateIP6Addresses,
	getPrivateMacAddresses: getPrivateMacAddresses,
	getPublicInterfaces: getPublicInterfaces,
	getPublicIP4Addresses: getPublicIP4Addresses,
	getPublicIP6Addresses: getPublicIP6Addresses,
	getPublicMacAddresses: getPublicMacAddresses,
	hasFloatingIP: hasFloatingIP,
	getFloatingIP: getFloatingIP,
	getDNS: getNameServers,
	getNameServers: getNameServers,
	getTags: getTags,
};
