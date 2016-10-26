Ext.define("Zermelo.view.UserSelect", {
	xtype: 'UserSelect',
	extend: 'Ext.dataview.List',
	config: {
		layout: 'fit',
		infinite: true,
		striped: true,
		minimumHeight: '57px',
		itemMinHeight: '57px',
		variableHeights: true,
		selectedCls: '',
		itemTpl: new Ext.XTemplate('<div class="z-calendar-list-parent">\
			<span width="70%" style="display:inline-flex; overflow: hidden;" class="">{[values.firstName || values.extendedName || values.name]} {prefix} {lastName}</span>\
			<span width="25%" style="display:inline-flex; float: right;" class="">{code}</span>\
		</div>'),
		store: {
			xtype: 'UserStore'
		},
		listeners: {
			itemtap: function(dataview, ix, target, record, event, options) {
				Zermelo.UserManager.setUser(record);
				this.up('home').selectItem('lastView');
			},
			refresh: {
				fn: function() {
					this.getScrollable().getScroller().scrollToTop();
				},
				order: 'before'
			}
		}
	}
});