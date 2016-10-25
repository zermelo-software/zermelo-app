Ext.define('Zermelo.view.OldUserSelect', {
	extend: 'Ext.MessageBox',
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
			locales: {
				placeHolder: 'enter_user_code'
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
					var user_code = Ext.getCmp('new_user_code').getValue();
					if (user_code.length == 0) {
						this.parent.parent.destroy();
						Zermelo.ErrorManager.showErrorBox('enter_user_code');
					} else {
						Zermelo.UserManager.setUser(user_code);
						this.parent.parent.destroy();
					}
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