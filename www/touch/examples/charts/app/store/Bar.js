Ext.define('Charts.store.Bar', {
    alias: 'store.Bar',
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'amount', 'name'],
        data: [
            {id: 1, amount: 100, name: 'Other'},
            {id: 2, amount: 250, name: 'Pharmacology'},
            {id: 3, amount: 275, name: 'Energy'},
            {id: 4, amount: 500, name: 'Textiles'},
            {id: 5, amount: 750, name: 'Agriculture'},
            {id: 6, amount: 900, name: 'Technology'}
        ]
    }
});