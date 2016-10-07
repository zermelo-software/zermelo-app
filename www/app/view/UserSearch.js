Ext.define("Zermelo.view.UserSearch", {
	xtype: 'UserSearch',
	extend: 'Ext.Container',
	requires: ['Ext.field.Search', 'Zermelo.view.UserSelect', 'Zermelo.model.User', 'Zermelo.store.UserStore'],
	config: {
		layout: 'vbox',
		items: [
			{
				xtype: 'UserSelect',
				flex: 1,
				config: {
					docked: 'top'
				}
			},
			{
				xtype: 'searchfield',
				value: localStorage.getItem('searchString'),
				config: {
					docked: 'bottom',
					height: '47px',
					width: '100%',
					autoCapitalize: false,
					autoComplete: false,
					autoCorrect: false
				}
			}
		],
		listeners: {
			initialize: function() {
				Zermelo.AjaxManager.getUsers();
				this.down('searchfield').on('keyup', Ext.getStore('Users').onKeyup, Ext.getStore('Users'));
			}
			// ,
			// painted: function() {
			// 	if(this.getStore().getCount() == 0)
			// 		Zermelo.AjaxManager.getUsers();
			// }
		}
	}
});