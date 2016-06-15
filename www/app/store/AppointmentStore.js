Ext.define('Zermelo.store.AppointmentStore', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	uses: 'Zermelo.model.Appointment',
	config: {
		model: 'Zermelo.model.Appointment',
		storeId: 'Appointments',
		autoLoad: true,
		autoSync: true,
		autoSort: false,
		proxy: {
			type: 'localstorage',
			id: 'AppointmentStore'
		}
	},
	currentStartDate: new Date(),

	getAsArray: function() {
		var appointmentArray = [];
        this.each(function(record) {
            appointmentArray.push(record.getData());
        });
        return appointmentArray;
	},

	detectCollisions: function() {
		this.sort([
			{
				property: 'start',
				direction: 'ASC'
			},
			{
				property: 'end',
				direction: 'ASC'
			}
		]);

		this.suspendEvents();
		var currentCollision;
		var collisionEnd = 0;
		this.getData().each(function(record, index, length) {
			if (record.get('start') < collisionEnd) {
				record.set('collidingIds', currentCollision);
				return true;
			}

			// NB: The loop below works because the store is already sorted by 'start'
			currentCollision = [record.get('id')];
			collisionEnd = record.get('end');
			var overlap = true;
			for(var i = index + 1; i < length && overlap; i++) {
				var next = this.getAt(i);

				if(next.get('start') < record.get('end')) {
					currentCollision.push(next.get('id'));
				}
				else {
					overlap = false;
				}
			}
			currentCollision = currentCollision.join(',');
			record.set('collidingIds', currentCollision);			
			return true;
		}, this);
		this.resumeEvents(true);
	},

	getAppointmentCountInInterval: function(start, end) {
		var count = 0;

		this.each(function(record) {
            if (record.get('start') >= start && record.get('end') <= end)
            	count++;
            return true;
        });

        return count;
	},

	getWeekIfNeeded: function(schedule, calendar, target) {
		var monday = new Date(target.getFullYear(), target.getMonth(), target.getDate() + (1 - target.getDay()));
		var saturday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5);

		this.currentStartDate = new Date(monday.valueOf());

	    if (this.getAppointmentCountInInterval(monday, saturday) == 0) {
	        Zermelo.AjaxManager.getAppointment(schedule, calendar, monday.valueOf(), saturday.valueOf());
	    }
	},

	pruneLocalStorageWithDelay: function(delay) {
		if (delay === undefined)
			delay = 10 * 1000;
		Ext.defer(this.pruneLocalStorage, delay, this);
	},

	pruneLocalStorage: function() {
		var cutoff = new Date(Math.min(this.currentStartDate.valueOf(), Date.now()));
		cutoff = cutoff.setDate(cutoff.getDate() - 14).valueOf() / 1000;

		this.suspendEvents();

		this.each(function(record) {
			if (record.get('end') < cutoff)
				this.remove(record);
		}, this);

		this.resumeEvents();
	},

	changeUser: function(user) {
		this.clearFilter();
		this.filter('user', user);
	}
});