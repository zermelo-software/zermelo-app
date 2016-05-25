Ext.define('Charts.store.PieLabel', {
    alias: 'store.PieLabel',
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'amount', 'name'],
        sorters: ['amount'],
        data: [
            {id: 1, amount: 100, name: 'Other'},
            {id: 2, amount: 250, name: 'Pharmacology'},
            {id: 3, amount: 275, name: 'Energy'},
            {id: 4, amount: 500, name: 'Textiles'},
            {id: 5, amount: 750, name: 'Agriculture'},
            {id: 6, amount: 333, name: 'Technology'},
            {id: 7, amount: 200, name: 'Farming'},
            {id: 8, amount: 600, name: 'Real Estate'},
            {id: 9, amount: 700, name: 'Commodities'},
            {id: 10, amount: 900, name: 'Energy'}
        ]
    }
});