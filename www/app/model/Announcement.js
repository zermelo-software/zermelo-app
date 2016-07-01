Ext.define('Zermelo.model.Announcement', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id',						type: 'auto'},
			{name: 'announcement_id',			type: 'int'},
			{name: 'start', 					type: 'date',		dateFormat: "l, F d, Y g:i:s A"},
			{name: 'end', 						type: 'date',		dateFormat: "l, F d, Y g:i:s A"},
			{name: 'title', 					type: 'string'},
			{name: 'text', 						type: 'string'},
			{name: 'read', 						type: 'bool'}
		]
	},

	valid: function() {
		return this.get('start') <= Date.now() && this.get('end') >= Date.now();
	}
});