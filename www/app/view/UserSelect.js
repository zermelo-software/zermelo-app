Ext.define("Zermelo.view.UserSelect", {
	xtype: 'UserSelect',
	extend: 'Ext.dataview.List',
	config: {
		layout: 'fit',
		// indexBar: true,
		cls: 'zermelo-calendar-list',
		itemCls: 'zermelo-calendar-list-item',
		selectedCls: 'zermelo-menu-list-item-select',
		itemTpl: new Ext.XTemplate('<div style="display:\"\" !important color: #999999 !important">{firstName} {prefix} {lastName}<br>{code}</div>'),
		data: [
			{
				firstName: Ux.locale.Manager.get('own_schedule'),
				lastName: '',
				code: Zermelo.UserManager.getOwnCode()
			}
		],
		listeners: {
			itemtap: function(dataview, ix, target, record, event, options) {
				Zermelo.UserManager.setUser(record.get('code'), record.get('firstName'));
				this.parent.destroy();
			},
			initialize: {
				fn: function() {
					Zermelo.AjaxManager.getUsers(this);
					window.store = this.getStore();
				},
				order: 'before'
			}
		}
	}
});