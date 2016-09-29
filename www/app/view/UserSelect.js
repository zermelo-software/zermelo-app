Ext.define("Zermelo.view.UserSelect", {
	xtype: 'UserSelect',
	extend: 'Ext.Container',
	config: {
		layout: 'fit',
		items: [
			{
				xtype: 'spacer',
				height: '15px'
			},
			{
				xtype: 'list',
				config: {
					itemTpl: '{firstName} {lastName}<br>{code}',
					cls: 'zermelo-calendar-list',
					itemCls: 'zermelo-calendar-list-item fc-event fc-event-vert fc-event-content z-calendar-list-parent',
					selectedCls: 'zermelo-menu-list-item-select',
					data: [
						{
							firstName: Ux.locale.Manager.get('own_schedule'),
							lastName: '',
							code: Zermelo.UserManager.getOwnCode()
						}
					]
				},
				listeners: {
					itemtap: function(dataview, ix, target, record, event, options) {
						Zermelo.UserManager.setUser(record.get('code'), record.get('firstName'));
						this.parent.destroy();
					},
					initialize: {
						fn: function() {
							Zermelo.AjaxManager.getUsers(this)
						},
						order: 'before'
					}
				}
			}
		]
	}
});