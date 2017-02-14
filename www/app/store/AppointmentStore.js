Ext.define('Zermelo.store.AppointmentStore', {
	extend: 'Zermelo.store.ZStore',
	requires: ['Zermelo.model.Appointment'],
	config: {
		model: 'Zermelo.model.Appointment',
		storeId: 'Appointments'
	},

	initialize: function() {
		this.windowStart = this.getMonday(new Date());
		this.windowEnd = this.getSaturday(new Date());
        this.callParent();
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
			if(record.get('collidingIds').startsWith(record.get('id'))) {
				appointmentArray.push(record.getData());
			}
		});
		return appointmentArray;
	},

	/**
	 * Counts the number of non-cancelled, valid appointments in window
	 *
	 * @return: The number of valid, non-cancelled appointments
	 */
	getValidCount: function() {
		var count = 0;
		this.each(function(record) {
			count += (record.get('valid') && !record.get('cancelled'))
		});
		return count;
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
		Ext.defer(function() {this.prune()}, delay, this);
	},

	/**
	 * Deletes appointments that are more than a week outside of the current scope and the current week
	 *
	 * @param:
	 * @return:
	 */
	prune: function() {
        var lowerBound = new Date(Math.min(this.windowStart.valueOf(), Date.now()));
        lowerBound = lowerBound.setDate(lowerBound.getDate() - 14 + (1 - lowerBound.getDay()));
        var upperBound = new Date(Math.max(this.windowEnd.valueOf(), Date.now()));
        upperBound = upperBound.setDate(upperBound.getDate() + 14 + (6 - upperBound.getDay()));

        this.suspendEvents();
        this.clearFilter();
        this.each(function (record) {
            if (record.get('end') < lowerBound || record.get('start') > upperBound) {
                this.remove(record);
            }
        }, this);
		this.saveToLocalForage();
		this.resetFilters();
		this.resumeEvents(true);
	},

	/**
	 * Filters the items in the store by the current user and the current window
	 *
	 * @param:
	 * @return:
	 */
	resetFilters: function() {
		this.clearFilter();
		var user = Zermelo.UserManager.getUserSuffix();
		this.filterBy(function(record) {
			var start = record.get('start');
			if(record.get('user') == user && start > this.windowStart && start < this.windowEnd)
				return true;
			else {
				console.log('deze gaat er uit ', start);
				return false;
			}
		});
	},

	/**
	 * Fetches events for the week that contains the current view
	 *
	 * @param:
	 * @return:
	 */
	fetch: function() {
		var monday = this.getMonday();
		var saturday = this.getSaturday();
		Zermelo.AjaxManager.getAppointment(monday.valueOf(), saturday.valueOf());
	},

	/**
	 * Clears events for the week that contains the current view
	 *
	 * @param:
	 * @return:
	 */
	clearWeek: function() {
		var monday = this.getMonday();
		var saturday = this.getSaturday();
		var currentUser = Zermelo.UserManager.getUser();
		this.clearFilter();
		this.filterBy(function(record) {
			if(record.get('start') < monday)
				return false;
			if(record.get('start') > saturday)
				return false;
			if(record.get('user') != currentUser)
				return false;
			return true;
		});
		this.remove(this.getRange());
	},

	/**
	 * Calculates the start of the week that contains the given date
     * If no date is provided, the start of the current view is used
	 *
	 * @param:
	 * @return: A Date object containing monday 00:00:00
	 */
	getMonday: function(date) {
		date = date || this.windowStart;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (1 - date.getDay()));
	},

	/**
	 * Calculates the end of the week that contains the given date
	 * If no date is provided, the start of the current view is used
	 *
	 * @param:
	 * @return: A Date object containing saturday 00:00:00
	 */
	getSaturday: function(date) {
        date = date || this.windowStart;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()));
	},

	/**
	 * Ensures that we have data for the current view and that it is correctly sorted and filtered
	 *
	 * @param:
	 * @return:
	 */
	prepareData: function() {
		this.resetFilters();
		if(this.getCount() == 0)
			this.fetch();
	},

	getView: function() {
		return this.windowEnd.getDay() - this.windowStart.getDay() > 2 ? 'week' : 'day';
	},

	/**
	 * Determines whether a given date is inside the current week
	 *
	 * +2 to ensure saturday and sunday don't cause issues
	 *
	 * @param: The date check
	 * @return: true or false
	 */
	inScope: function(date) {
		return (date >= this.windowStart) && date < new Date(this.windowEnd.getFullYear(), this.windowEnd.getMonth(), this.windowEnd.getDate() + 2);
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
		// Check if we're already in the correct week view
		if(this.windowStart 
			&& this.windowEnd 
			&& this.windowStart == this.getMonday() 
			&& this.windowEnd == this.getSaturday() 
			&& this.windowStart < target 
			&& target < this.windowEnd
		)
			return false;
		this.windowStart = new Date(target.getFullYear(), target.getMonth(), target.getDate() + (1 - target.getDay()));
		this.windowEnd = new Date(this.windowStart.getFullYear(), this.windowStart.getMonth(), this.windowStart.getDate() + 5);
		this.prepareData();
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
		this.prepareData();
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

		this.suspendEvents();
		this.prepareData();
		this.resumeEvents();
	}
});