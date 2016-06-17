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
	extend: 'Ext.dataview.List',
	xtype: 'CalendarList',
	config: {
		itemId: 'calendarList',
		store: 'Appointments',
		cls: 'zermelo-message-list',
        // css class resources/css/app.css list items
        itemCls: 'zermelo-message-list-item',
        // css class resources/css/app.css selected items
        selectedCls: 'zermelo-menu-list-item-select',
        useSimpleItems: false,
		itemTpl: new Ext.XTemplate(
			'<div class={[this.getClass(values)]} style="padding:0px;">',
				'<div>',
					'<b>{subjects}</b> {teachers}',
				'</div>',
				'<div>',
					'{start:date("H:i")} - {end:date("H:i")}',
				'</div>',
			'</div>',
			{
				getClass: function(event) {
					if (event.type == 'lesson')
	                    return ('fc-event-skin-lesson ');
	                if (event.type == 'exam')
	                    return ('fc-event-skin-exam ');
	                if (event.type == 'activity')
	                    return ('fc-event-skin-activity ');
	                if (event.type == 'choice')
	                    return ('fc-event-skin-unknown ');
	                if (event.type == 'unknown' || event.type == 'other')
	                    return ('fc-event-skin-unknown ');
	                return '';
				},
				compiled: true
			}
		),
		handlers: {
			show: {
				fn: function() {
					console.log(this.getStore());
				},
				scope: this
			}
		}
	}
});