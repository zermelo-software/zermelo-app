Ext.define('Zermelo.store.AppointmentStore', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	uses: 'Zermelo.model.Appointment',
	config: {
		model: 'Zermelo.model.Appointment',
		storeId: 'Appointments',
		autoLoad: true,
		autoSync: false,
		autoSort: false,
		proxy: {
			type: 'localstorage',
			id: 'AppointmentStore'
		}
	},

	getAsArray: function() {
		var appointmentArray = [];
		this.each(function(record) {
			appointmentArray.push(record.getData());
		});
		return appointmentArray;
	},

	detectCollisions: function() {
		if(this.getCount() <= 1)
			return;
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

				if(next && next.get('start') < record.get('end')) {
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
	},

	queueDelayedEvents: function(delay) {
		if (delay === undefined)
			delay = 5 * 1000;
		Ext.defer(this.pruneLocalStorage, delay, this);
		Ext.defer(this.sync, delay, this);
	},

	pruneLocalStorage: function() {
		var lowerBound = new Date(Math.min(this.windowStart.valueOf(), Date.now()));
		lowerBound = lowerBound.setDate(lowerBound.getDate() - 7);
		var upperBound = new Date(Math.max(this.windowEnd.valueOf(), Date.now()));
		upperBound = upperBound.setDate(upperBound.getDate() + 7);

		this.suspendEvents();
		this.clearFilter()
		this.each(function(record) {
			if (record.get('end') < lowerBound || record.get('start') > upperBound) {
				this.remove(record);
			}
		}, this);
		this.resetFilters();
		this.resumeEvents();
	},

	resetFilters: function() {
		this.clearFilter();
		this.filter('user', Zermelo.UserManager.getUser());
		this.filterBy(function(record) {
			var start = record.get('start');
			return (start > this.windowStart && start < this.windowEnd);
		});
	},

	initialize: function() {
		this.setWindowWeek(new Date());
	},

	fetchWeek: function() {
		var monday = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + (1 - this.windowStart.getDay()));
		var saturday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5);
		Zermelo.AjaxManager.getAppointment(monday.valueOf(), saturday.valueOf());
	},

	setWindowWeek: function(target) {
		if(target === undefined)
			target = this.windowStart;
		this.windowStart = new Date(target.getFullYear(), target.getMonth(), target.getDate() + (1 - target.getDay()));
		this.windowEnd = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + 5);
		this.resetFilters();
		return this.windowStart;
	},

	setWindowDay: function() {
		this.windowStart.setDate(this.windowStart.getDate() + (new Date().getDay() - 1));
		this.windowEnd = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + 1);
		this.resetFilters();
	},

	setWindow: function(direction) {
		// Jump over weekends
		if((this.windowStart.getDay() == 5 && direction == 1) || (this.windowStart.getDay() == 1 && direction == -1)) {
			direction *= 3;
		}

		this.windowStart.setDate(this.windowStart.getDate() + direction);
		this.windowEnd.setDate(this.windowEnd.getDate() + direction);

		this.resetFilters();
		if(this.getCount() == 0) {
			console.log('fetchWeek');
			this.fetchWeek();
		}
	}
});