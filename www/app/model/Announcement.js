Ext.define('Zermelo.model.Announcement', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id',						type: 'int',		isUnique: 'true'},
			{name: 'start', 					type: 'date',		dateFormat: "l, F d, Y g:i:s A"},
			{name: 'end', 						type: 'date',		dateFormat: "l, F d, Y g:i:s A"},
			{name: 'title', 					type: 'string'},
			{name: 'text', 						type: 'string'},
			{name: 'read', 						type: 'bool'}
		]
	},
	/**
	 * Determines whether a given announcement should be displayed
	 * 
	 * @return: boolean
	 */
	valid: function() {
		if(this.get('start') <= Date.now() && this.get('end') >= Date.now())
			return true;
		// If a user does not have permission to view announcements we create a dummy announcement with id 0 which is always valid
		if(this.get('id') == '0')
			return true;
		return false;
	}
});