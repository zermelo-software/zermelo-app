Ext.define('Zermelo.model.Announcement', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id',						type: 'auto'},
			{name: 'announcement_id',			type: 'int'},
			{name: 'start', 					type: 'int'},
			{name: 'end', 						type: 'int'},
			{name: 'title', 					type: 'string'},
			{name: 'text', 						type: 'string'},
			{name: 'read', 						type: 'string'}
		]
	},

	valid: function() {
		return this.get('start') * 1000 <= Date.now() && this.get('end') * 1000 >= Date.now();
	}
});