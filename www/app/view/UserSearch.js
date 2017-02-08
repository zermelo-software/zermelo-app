Ext.define("Zermelo.view.UserSearch", {
	xtype: 'UserSearch',
	extend: 'Ext.Container',
	requires: ['Ext.field.Search', 'Zermelo.view.UserSelect', 'Zermelo.model.User', 'Zermelo.store.UserStore'],
	config: {
		layout: 'vbox',
		items: [
			{
				xtype: 'searchfield',
				placeHolder: 'Zoeken...',

				config: {
					docked: 'bottom',
					height: '42px',
					width: '100%',
					autoCapitalize: false,
					autoComplete: false,
					autoCorrect: false
				}
			},
			{
				xtype: 'UserSelect',
				flex: 1,
				config: {
					docked: 'top'
				}
			}
		],
		listeners: {
			initialize: function() {
				Zermelo.AjaxManager.loadOrGetUsers();
				this.down('searchfield').on({
					action: {
						fn: Ext.getStore('Users').onAction,
						scope: Ext.getStore('Users')
					}
				});
				Ext.getStore('Users').on('clear', this.clear, this);
			}
		}
	},

	clear: function() {
		this.down('searchfield').setValue('');
		Ext.getStore('Users').search('');
	}
});