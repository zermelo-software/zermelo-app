// Ext.define('Zermelo.view.CalendarList', {
// 	extend: 'Ext.dataview.List',
// 	xtype: 'calendarList',
// 	config: {
// 		listeners: {
// 			show: {
// 				fn: function() {
// 					var appointmentStore = Ext.getStore('Appointments');
// 					var events = appointmentStore.getAsArray();
// 					events.forEach(function(event) {
// 						this.add(Ext.create('Ext.panel', {

// 						}));
// 					});
// 				},
// 				scope: this
// 			}
// 		}
// 	},
// 	items: {

// 	}
// });

Ext.define("Zermelo.view.CalendarList", {
	extend: 'Ext.dataview.List'
	itemId: 'calendarList',
	store: 'Appointments',
	itemTpl: new Ext.XTemplate("<tpl for='.'>", "<tpl if='read == 0'>{title} <img src='resources/images/new."+imageType+"' class='zermelo-message-list-read-unread-icon'>", "<tpl else>{title}", "</tpl>", "</tpl>")
	
	// config: {
	// 	listeners: {
	// 		show: function () {
	// 			messageShow=true;
	// 			if (Ext.getStore('Announcements').getCount() == 0) {
	// 				Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
	// 			}
	// 		}
	// 	},
	// 	layout: 'fit',
	// 	style: {
	// 		'background': '#F0F0F0'
	// 	},
	// 	items: [{
	// 		// list view
	// 		xtype: 'list',
	// 		// padding top left bottom right
	// 		margin: '10 10 10 10',
	// 		style:{
	// 			'top': '-50px',
	// 			'padding-bottom': '50px'
	// 		},
	// 		id: 'calendarlist',
	// 		// css class resources/css/app.css
	// 		cls: 'zermelo-message-list',
	// 		// css class resources/css/app.css list items
	// 		itemCls: 'zermelo-message-list-item',
	// 		// css class resources/css/app.css selected items
	// 		selectedCls: 'zermelo-menu-list-item-select',
	// 		grouped: false,
	// 		store: 'Appointments',
	// 		itemTpl: new Ext.XTemplate("<tpl for='.'>", "<tpl if='read == 0'>{title} <img src='resources/images/new."+imageType+"' class='zermelo-message-list-read-unread-icon'>", "<tpl else>{title}", "</tpl>", "</tpl>")
	// 	}]
	// }
});