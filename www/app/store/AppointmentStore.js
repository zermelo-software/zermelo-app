Ext.define('Zermelo.store.AppointmentStore', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	uses: 'Zermelo.model.Appointment',
	config: {
		model: 'Zermelo.model.Appointment',
		storeId: 'Appointments',
		autoLoad: true,
		autoSync: true,
		proxy: {
			type: 'localstorage',
			id: 'AppointmentStore'
		},
		sorters: [
			{
				property: 'start',
				direction: 'ASC'
			},
			{
				property: 'end',
				direction: 'DESC'
			}
		]
	},

	getAsArray: function() {
		var appointmentArray = [];
        this.each(function(record) {
            appointmentArray.push(record.getData());
        });
        return appointmentArray;
	},

	detectCollisions: function() {
		if(!this.isSorted())
			this.sort();

		this.each(function(record, index, length) {
			if (index != 0) {
				var prev_collisions = this.getAt(index - 1).get('collidingIds');
				if (prev_collisions.length > 1) {
					record.set('collidingIds', prev_collisions);
					return;
				}
			}

			// NB: This works because the store is already sorted by start time
			var collidingIds = [record.getId()];
			var overlap = true;
			for(var i = index + 1; i < length && overlap; i++) {
				var next = this.getAt(i);

				if(next.get('start') < record.get('end')) {
					collidingIds.push(next.getId());
				}
				else {
					overlap = false;
				}
			}
			record.set('collidingIds', collidingIds);
		}, this);
	},

	getAppointmentCountInInterval: function(start, end) {
		this.suspendEvents();
		this.filterBy(function(record) {
            return record.get('start') >= start && record.get('end') <= end;
        });

        var count = this.getCount();

        this.clearFilter();
        this.resumeEvents(true);

        return count;
	},

	getWeekIfNeeded: function(schedule, calendar, target) {
		var monday = new Date(target.valueOf());
		monday = monday.setDate(monday.getDate() + (1 - monday.getDay()));
		var saturday = new Date(monday.valueOf());
	    saturday.setDate(saturday.getDate() + 5);

	    if (this.getAppointmentCountInInterval(monday, saturday) == 0) {
	        Zermelo.AjaxManager.getAppointment(schedule, calendar, monday.valueOf(), saturday.valueOf());
	    }
	}
});