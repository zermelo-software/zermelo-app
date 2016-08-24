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

	/**
	 * Exports the items in the current scope to an array
	 *
	 * @param:
	 * @return: An array of event objects
	 */
	getAsArray: function() {
		var appointmentArray = [];
		this.each(function(record) {
			appointmentArray.push(record.getData());
		});
		return appointmentArray;
	},

	/**
	 * Determines which appointments in the current scope overlap
	 *
	 * @param:
	 * @return:
	 */
	detectCollisions: function() {
		if(this.getCount() <= 1) {
			var first = this.getAt(0);
			if(first)
				first.set('collidingIds', '' + first.id);
			return;
		}
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

	/**
	 * Delays cleaning and syncing localStorage
	 *
	 * @param: optional delay in milliseconds
	 * @return:
	 */
	queueDelayedEvents: function(delay) {
		if (delay === undefined)
			delay = 5 * 1000;
		Ext.defer(this.pruneLocalStorage, delay, this);
		Ext.defer(this.sync, delay, this);
	},

	/**
	 * Deletes appointments that are more than a week outside of the current scope and the current week
	 *
	 * @param:
	 * @return:
	 */
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

	/**
	 * Filters the items in the store by the current user and the current window
	 *
	 * @param:
	 * @return:
	 */
	resetFilters: function() {
		this.clearFilter();
		this.filter('user', Zermelo.UserManager.getUser());
		this.filterBy(function(record) {
			var start = record.get('start');
			return (start > this.windowStart && start < this.windowEnd);
		});
	},

	/**
	 * Filters items for the new user and fetches events if none are known
	 *
	 * @param:
	 * @return:
	 */
	changeUser: function() {
		this.resetFilters();
		if(this.getCount() == 0) {
			this.fetchWeek();
		}
	},

	/**
	 * Sets the date to the current week during object creation
	 *
	 * @param:
	 * @return:
	 */
	initialize: function() {
		this.setWindowWeek(new Date());
	},

	/**
	 * Fetches events for the week that contains the current view
	 *
	 * @param:
	 * @return:
	 */
	fetchWeek: function() {
		var monday = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + (1 - this.windowStart.getDay()));
		var saturday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5);
		Zermelo.AjaxManager.getAppointment(monday.valueOf(), saturday.valueOf());
	},

	/**
	 * Sets the window to an optionally specified week
	 *
	 * @param: The date to target the window on
	 * @return: First monday <= the target date
	 */
	setWindowWeek: function(target) {
		if(target === undefined)
			target = this.windowStart;
		this.windowStart = new Date(target.getFullYear(), target.getMonth(), target.getDate() + (1 - target.getDay()));
		this.windowEnd = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + 5);
		this.resetFilters();
		this.detectCollisions();
		return this.windowStart;
	},

	/**
	 * Sets the window to day mode
	 *
	 * @param:
	 * @return:
	 */
	setWindowDay: function() {
		// Check if store is already in day mode
		if(this.windowStart.getDay() != 1 || this.windowEnd.getDay() != 6) {
			return;
		}

		this.windowStart.setDate(this.windowStart.getDate() + (new Date().getDay() - 1));
		this.windowEnd = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + 1);
		this.resetFilters();
	},

	/**
	 * Shifts the window forward or backward
	 *
	 * @param: direction: the number of days (possibly negative) to shift to the future
	 * @return:
	 */
	setWindow: function(direction) {
		// Jump over weekends
		if((this.windowStart.getDay() == 5 && direction == 1) || (this.windowStart.getDay() == 1 && direction == -1)) {
			direction *= 3;
		}

		this.windowStart.setDate(this.windowStart.getDate() + direction);
		this.windowEnd.setDate(this.windowEnd.getDate() + direction);
		this.resetFilters();
		if(this.getCount() == 0) {
			this.fetchWeek();
		}
		else {
			this.detectCollisions();
		}
	}
});