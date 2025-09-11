'use strict';
'require view';
'require dom';
'require poll';
'require uci';
'require rpc';
'require form';
'require network';

return view.extend({
	load: function() {
		return Promise.all([
			uci.changes(),
			uci.load('fakemesh'),
			uci.load('fakemeshac'),
			uci.load('wireless')
		]);
	},

	render: function(data) {

		var m, s, o;

		m = new form.Map('fakemesh', [_('Fake Mesh Setup')],
			_('Basic settings for your fake mesh overlay network'));

		s = m.section(form.NamedSection, 'default', 'fakemesh');
		s.addremove = false;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.enabled = '1';
		o.disabled = '0';
		o.default = o.disabled;

		o = s.option(form.Value, 'id', _('Mesh ID'));
		o.datatype = 'maxlength(32)';

		o = s.option(form.Value, 'key', _('Key'), _('Leave empty if encryption is not required.'));
		o.rmempty = true;
		o.password = true;
		o.datatype = 'wpakey';

		o = s.option(form.ListValue, 'band', _('Band'));
		o.value('2g5g6g', _('2G+5G+6G'));
		o.value('5g6g', _('5G+6G'));
		o.value('2g5g', _('2G+5G'));
		o.value('6g', _('6G'));
		o.value('5g', _('5G'));
		o.value('2g', _('2G'));
		o.default = '2g5g6g';

		o = s.option(form.ListValue, 'role', _('Role'), _('Set the gateway router as controller, others as agent.'));
		o.value('wap', _('Wired AP (ethernet as backhaul)'));
		o.value('agent', _('Agent (wifi as backhaul)'));
		o.value('controller', _('Controller (AC)'));
		o.default = 'agent';

		o = s.option(form.Value, 'access_ip', _('Access IP address'), _('The simple ip address to access the controller.'));
		o.depends('role', 'controller');
		o.placeholder = '10.10.10.1'
		o.rmempty = true;
		o.datatype = 'ip4addr';

		o = s.option(form.Flag, 'sync_ac', _('Sync Config'), _('Sync config from the Controller.'));
		o.enabled = '1';
		o.disabled = '0';
		o.default = o.enabled;

		o = s.option(form.ListValue, 'band_steer_helper', _('Band Steer Helper'));
		o.value('none', _('None'));
		o.value('usteer', _('usteer'));
		o.value('dawn', _('DAWN'));
		o.default = 'usteer';

		o = s.option(form.Flag, 'fronthaul_disabled', _('Fronthaul Disabled'), _('Disable fronthaul Wi-Fi signal on this node.'));
		o.enabled = '1';
		o.disabled = '0';
		o.default = o.disabled;

		var current_role = uci.get('fakemesh', 'default', 'role');
		var enabled = uci.get('fakemesh', 'default', 'enabled');

		// Add mesh interface status section
		if (enabled === '1') {
			s = m.section(form.NamedSection, 'mesh_status', 'fakemesh', _('Mesh Interface Status'));
			s.addremove = false;
			s.anonymous = true;

			// Check and display mesh interfaces
			var meshInterfaces = ['meshx0', 'meshx1', 'meshx2'];
			var interfaceStatus = [];
			
			meshInterfaces.forEach(function(iface) {
				var ifaceConfig = uci.get('wireless', iface);
				if (ifaceConfig) {
					var device = uci.get('wireless', iface, 'device') || _('Unknown');
					var ssid = uci.get('wireless', iface, 'ssid') || _('Unknown');
					var disabled = uci.get('wireless', iface, 'disabled');
					var status = disabled === '1' ? _('Disabled') : _('Enabled');
					var bandMap = {'meshx0': '2G', 'meshx1': '5G', 'meshx2': '6G'};
					
					interfaceStatus.push({
						name: iface,
						band: bandMap[iface] || _('Unknown'),
						device: device,
						ssid: ssid,
						status: status
					});
				}
			});

			if (interfaceStatus.length > 0) {
				o = s.option(form.DummyValue, '_mesh_interfaces', _('Active Mesh Interfaces'));
				o.rawhtml = true;
				o.cfgvalue = function() {
					var html = '<table class="table">';
					html += '<tr><th>' + _('Interface') + '</th><th>' + _('Band') + '</th><th>' + _('Device') + '</th><th>' + _('SSID') + '</th><th>' + _('Status') + '</th></tr>';
					interfaceStatus.forEach(function(iface) {
						html += '<tr>';
						html += '<td>' + iface.name + '</td>';
						html += '<td>' + iface.band + '</td>';
						html += '<td>' + iface.device + '</td>';
						html += '<td>' + iface.ssid + '</td>';
						html += '<td>' + iface.status + '</td>';
						html += '</tr>';
					});
					html += '</table>';
					return html;
				};
			} else {
				o = s.option(form.DummyValue, '_no_interfaces', _('Mesh Interfaces'));
				o.cfgvalue = function() {
					return _('No mesh interfaces configured');
				};
			}
		}

		s = m.section(form.GridSection, 'wifim', _('Wireless Management'), current_role != 'controller' ? _('Not available on AP') : '');
		s.addremove = true;
		s.anonymous = true;
		s.nodescriptions = true;
		s.sortable = false;
		if (current_role != 'controller') {
			s.addremove = false;
			s.uciconfig = 'fakemeshac';
			s.renderRowActions = function (section_id) {
				return E('td', { 'class': 'td middle cbi-section-actions' }, E('div', ''));
			};
		}

		o = s.option(form.Value, 'ssid', _('<abbr title="Extended Service Set Identifier">ESSID</abbr>'));
		o.datatype = 'maxlength(32)';
		o.rmempty = false;
		if (current_role != 'controller') o.readonly = true;

		o = s.option(form.ListValue, 'encryption', _('Encryption'));
		o.value('none', _('No Encryption'));
		o.value('psk', _('WPA-PSK'));
		o.value('psk2', _('WPA2-PSK'));
		o.value('psk-mixed', _('WPA-PSK/WPA2-PSK Mixed Mode'));
		o.value('sae', _('WPA3-SAE'));
		o.value('sae-mixed', _('WPA2-PSK/WPA3-SAE Mixed Mode'));
		o.value('wpa', _('WPA-EAP (medium security)'));
		o.value('wpa2', _('WPA2-EAP (strong security)'));
		o.value('wpa3', _('WPA3-EAP (strong security)'));
		o.value('owe', _('OWE (open network)'));
		o.value('eap192', _('WPA2-EAP 192-bit Mode (strong security)'));
		o.value('eap-mixed', _('WPA2-EAP/WPA3-EAP Mixed Mode (strong security)'));
		o.value('psk-eap-mixed', _('WPA-PSK/WPA-EAP Mixed Mode (medium security)'))		
		if (current_role != 'controller') o.readonly = true;

		o = s.option(form.Value, 'key', _('Key'));
		o.depends('encryption', 'psk');
		o.depends('encryption', 'psk2');
		o.depends('encryption', 'psk-mixed');
		o.depends('encryption', 'sae');
		o.depends('encryption', 'sae-mixed');
		o.depends('encryption', 'psk-eap-mixed');
		o.rmempty = false;
		o.password = true;
		o.datatype = 'wpakey';
		if (current_role != 'controller') o.readonly = true;

		o = s.option(form.ListValue, 'band', _('Band'));
		o.value('2g5g6g', _('2G+5G+6G'));
		o.value('5g6g', _('5G+6G'));
		o.value('2g5g', _('2G+5G'));
		o.value('6g', _('6G'));
		o.value('5g', _('5G'));
		o.value('2g', _('2G'));
		o.default = '2g5g6g';		
		if (current_role != 'controller') o.readonly = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.default = o.enabled;
		if (current_role != 'controller') o.readonly = true;

		return m.render();
	}
});
