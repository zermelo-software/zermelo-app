Ext.define('Zermelo.view.OldUserSelect', {
	extend: 'Ext.MessageBox',
	xtype: 'userselect',
	config: {
		baseCls: 'z-msgbox',
		showAnimation: false,
		hideAnimation: false,
		items: [
		{
			xtype: 'button',
			cls: 'z-msgbox-button',
			locales: {
				text: 'own_schedule'
			},
			ui: 'normal',
			handler: function() {
				Zermelo.UserManager.setUser();
				this.parent.parent.destroy();
			}
		},
		{
			xtype: 'textfield',
			baseCls: '',
			inputCls: 'z-msgbox-field',
			clearIcon: false,
			locales: {
				placeHolder: 'enter_user_code'
			},
			listeners: {
				keyup: function() {
					this.up('userselect').code = (this.getValue() || '').trim().toLowerCase();
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
				cls: '',
				width: '40%',
				itemId: 'ok',
				locales: {
					text: 'ok'
				},
				ui: 'normal',
				handler: function() {
					var user_code = this.up('userselect').code;
					if(user_code.length == 0)
						Zermelo.ErrorManager.showErrorBox('enter_user_code');
					else
						Zermelo.UserManager.setUser(user_code);
					
					this.parent.parent.destroy();
				}
			},
			{
				xtype: 'spacer'
			}, 
			{
				xtype: 'button',
				cls: '',
				width: '40%',
				itemId: 'cancel',
				locales: {
					text: 'cancel'
				},
				ui: 'normal',
				handler: function() {
					this.parent.parent.destroy();
				}

			}]
		}]
	}
});