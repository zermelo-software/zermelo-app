Ext.define('Zermelo.store.UserStore', {
	extend: 'Ext.data.Store',
	xtype: 'UserStore',
	requires: ['Zermelo.model.User'],
	config: {
		model: 'Zermelo.model.User',
		storeId: 'Users'
	},
	currentSearchString: localStorage.getItem('searchString') || '',

	setCurrentSearchString: function(searchString) {
		this.currentSearchString = searchString;
		localStorage.setItem('searchString', searchString);
	},

	search: function(searchString) {
		this.suspendEvents();
		var timer = Date.now();
		searchString = searchString.toLowerCase();

		if(!searchString.startsWith(this.currentSearchString)) {
			console.log('hoi');
			this.clearFilter();
			this.resumeEvents();
		}

		this.setCurrentSearchString(searchString);

		if(searchString == '')
			return;

		searchString.split(' ').forEach(function(searchComponent) {
			this.filterBy(function(record) {
				if((record.get('firstName') || '').toLowerCase().startsWith(searchComponent))
					return true;
				if(record.get('code').toLowerCase().startsWith(searchComponent))
					return true;
				if((record.get('lastName') || '').toLowerCase().includes(searchComponent))
					return true;
				if((record.get('prefix') || '').toLowerCase().includes(searchComponent))
					return true;
				return false;
			});
		}, this);
		console.log('time spent', Date.now() - timer);
		this.resumeEvents();
	},

	initSearch: function() {
		this.search(this.currentSearchString);
	},

	onKeyup: function(searchField) {
		this.search(searchField.getValue());
	}
});