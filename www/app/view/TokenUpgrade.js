Ext.define('Zermelo.view.TokenUpgrade', {
	extend: 'Ext.MessageBox',
	xtype: 'tokenupgrade',
	config: {
		baseCls: 'z-msgbox',
		showAnimation: false,
		hideAnimation: false,
		items: [
		{
			xtype: 'label',
			baseCls: 'z-msgbox-text',
			locales: {
				html: 'login.upgrade.new_code_message'
			}
		},
			{
				xtype: 'numberfield',
				cls: 'z-msgbox-field-low-padding',
				inputCls: 'z-msgbox-bg',
				anchor: '100%',
				id: 'hoi',
				labelWidth: '500px',
				clearIcon: false,
				locales: {
					placeHolder: 'login.upgrade.code'
				},
				listeners: {
					keyup: function (thisField, e) {
						this.up('tokenupgrade').code = (thisField.getValue() || 0).toString();
						if (e.browserEvent.keyCode == 13) 
							this.up('tokenupgrade').authenticate();
					},
					initialize: function() {

					}
				}
			},
		{
			xtype: 'container',
			layout: 'hbox',
			cls: 'z-msgbox-button',
			items: [
				{
					xtype: 'button',
					itemId: 'ok',
					width: '40%',
					locales: {
						text: 'ok'
					},
					handler: function() {
						this.up('tokenupgrade').authenticate()
					}
				},
				{
					xtype: 'spacer'
				},
				{
					xtype: 'button',
					itemId: 'cancel',
					width: '40%',
					locales: {
						text: 'cancel'
					},
					handler: function() {
						this.up('tokenupgrade').destroy();
					}
				}
			]
		}]
	},

	authenticate: function() {
		var code = this.code;
		var code_regex = /^[0-9]*$/;
		if (!code_regex.test(this.code) || this.code.length == 0) {
			Zermelo.ErrorManager.showErrorBox('login.code_error_msg');
			return;
		}
		while(code.length < 12)
			code = '0' + code;

		Zermelo.AjaxManager.getLogin(Zermelo.UserManager.getInstitution(), code);
		this.destroy();
	}
});