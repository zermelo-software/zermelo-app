Ext.define("Zermelo.view.UserSelect", {
	xtype: 'UserSelect',
	extend: 'Ext.Container',
	config: {
		layout: 'fit',
		items: [
			{
				xtype: 'label',
				cls: 'zermelo-error-messagebox',
				locales: {
					html: 'menu.user_select_message'
				}
			},
			{
				xtype: 'spacer',
				height: '15px'
			},
			{
				xtype: 'list',
				config: {
					itemTpl: '{firstName} {lastName}<br>{code}',
					itemCls: 'z-msgbox-list-item',
					baseCls: 'z-msgbox-list',
					store: 'Users',
				},
				listeners: {
					itemtap: function(dataview, ix, target, record, event, options) {
						Zermelo.UserManager.setUser(record.get('code'), record.get('firstName'));
						this.parent.destroy();
					}
				}
			},
			{
				xtype: 'spacer',
				height: '10px'
			}
		],
		buttons: [
			{
				itemId: 'freeInput',
				locales: {
					text: 'ok'
				},
				ui: 'normal',
				handler: function() {
					Ext.Viewport.add(Ext.create('Zermelo.view.UserCodeInput'));
					this.parent.parent.destroy();
				}
			},
			{
				xtype: 'spacer'
			},
			{
				itemId: 'cancel',
				locales: {
					text: 'cancel'
				},
				ui: 'normal',
				handler: function() {
					this.parent.parent.destroy();
				}
			}
		]
	}
});