Ext.define('Zermelo.model.Announcement', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id', isUnique: true,		type: 'int'},
            {name: 'start', 					type: 'int'},
            {name: 'end', 						type: 'int'},
            {name: 'title', 					type: 'string'},
            {name: 'text', 						type: 'string'},
            {name: 'read', 						type: 'string'},
            {name: 'valid', 					type: 'bool'}
        ]
    }
});