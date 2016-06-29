Ext.define("Zermelo.view.CalendarList", {
	extend: 'Ext.dataview.List',
	xtype: 'CalendarList',
	config: {
		itemId: 'calendarList',
		store: 'Appointments',
		cls: 'zermelo-calendar-list',
        // css class resources/css/app.css list items
        itemCls: 'zermelo-calendar-list-item',
        // css class resources/css/app.css selected items
        selectedCls: 'zermelo-menu-list-item-select',
        useSimpleItems: true,
        padding: 0,
        scrollable: false,
		itemTpl: new Ext.XTemplate(
			'<div class={[this.getClass(values)]}>',
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
		listeners: {
			painted: function() {
				console.log('show');
				var today = new Date();
				today.setHours(0,0,0,0);
				var tomorrow = new Date(today.valueOf());
				tomorrow.setDate(tomorrow.getDate() + 1);

				this.getStore().filterBy(function(record) {
					var start = record.get('start');
					return (start > today && start < tomorrow);
				});
			}
		}
	}
});