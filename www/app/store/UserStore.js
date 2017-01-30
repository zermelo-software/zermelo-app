Ext.define('Zermelo.store.UserStore', {
	extend: 'Ext.data.Store',
	xtype: 'UserStore',
	requires: ['Zermelo.model.User'],
	config: {
		autoSort: false,
		autoSync: false,
		autoLoad: false,
		remoteSort: true,
		model: 'Zermelo.model.User',
		storeId: 'Users'
	},

	search: function(searchString) {
		this.suspendEvents();
		searchString = searchString.toLowerCase();

		if(!searchString.startsWith(this.currentSearchString)) {
			this.clearFilter();
			this.resumeEvents();
		}

		this.currentSearchString = searchString;

		if(searchString == '')
			return;

		var searchComponents = searchString.split(' ');
		this.filterBy(function(record) {
			// if (record.get('prefix') == 'Eigen rooster')
			// 	return true;
			// Yes, it should be every() not some() because \ForAll searchComponents \Exists field : field.contains(searchComponent)
			return searchComponents.every(function(searchComponent) {
				if((record.get('firstName') || '').toLowerCase().startsWith(searchComponent))
					return true;
				if((record.get('code') || '').toLowerCase().includes(searchComponent))
					return true;
				if((record.get('lastName') || '').toLowerCase().includes(searchComponent))
					return true;
				if((record.get('prefix') || '').toLowerCase().includes(searchComponent))
					return true;
				return false;
			}, this);
		});
		this.resumeEvents(true);
		this.fireEvent('refresh');
	},

	onAction: function(searchField) {
		this.search(searchField.getValue());
	},

	launch: function() {
		// This entry will always be first because nothing < something.
		// Setting user to '' will set the user to '~me' in UserManager.
		this.add({firstName: '', prefix: 'Eigen rooster', lastName: '', code: ''});
	}
});