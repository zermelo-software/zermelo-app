Ext.define('Zermelo.view.UserCodeInput', {
	extend: 'Ext.MessageBox',
	xtype: 'userCodeInput',
	config: {
		cls: 'zermelo-error-messagebox',
		style: {
			'padding': '1em 1em 0.5em 1em'
		},
		items: [
			{
				cls: 'zermelo-error-messagebox',
				xtype: 'textfield',
				label: '',
				name: 'new_user_code',
				locales: {
					placeHolder: 'enter_user_code'
				}
			},
			{
				xtype: 'toolbar',
				items: [
				{
					cls: 'zermelo-error-messagebox',
					xtype: 'button',
					itemId: 'ok',
					locales: {
						text: 'ok'
					},
					ui: 'normal',
					handler: function() {
						Zermelo.UserManager.setUser(this.parent.parent.down('textfield').getValue());
						this.parent.parent.destroy();
					}
				},
				{
					xtype: 'spacer'
				},
				{
					cls: 'zermelo-error-messagebox',
					xtype: 'button',
					itemId: 'cancel',
					locales: {
						text: 'cancel'
					},
					ui: 'normal',
					handler: function() {
						this.parent.parent.destroy();
					}
				}]
			}
		]
	}
});