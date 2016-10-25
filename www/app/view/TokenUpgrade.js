Ext.define('Zermelo.view.TokenUpgrade', {
	extend: 'Ext.MessageBox',
	xtype: 'tokenupgrade',
	config: {
		baseCls: 'z-msgbox',
		itemCls: 'z-msgbox-item',
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
			baseCls: '',
			inputCls: 'z-msgbox-field',
			clearIcon: false,
			locales: {
				placeHolder: 'login.upgrade.code'
			},
			listeners: {
				keyup: function (thisField, e) {
					this.up('tokenupgrade').code = (thisField.getValue() || 0).toString();
					if (e.browserEvent.keyCode == 13) 
						this.up('tokenupgrade').authenticate();
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
		if (code.length == 0) {
			return;
		}
		while(code.length < 12)
			code = '0' + code;
		Zermelo.AjaxManager.getLogin(Zermelo.UserManager.getInstitution(), code);
		this.destroy();
	}
});