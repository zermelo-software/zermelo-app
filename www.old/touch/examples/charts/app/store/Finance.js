Ext.define('Charts.store.Finance', {
    alias: 'store.Finance',
    extend: 'Ext.data.Store',
    config: {
        fields: ['catagory', 'amount', 'pct'],
        data: [
            {catagory: 'Mortgage', amount: '-$2,247', pct: 15},
            {catagory: 'Lean', amount: '-$2,083', pct: 14},
            {catagory: 'Travel', amount: '-$1,700', pct: 11},
            {catagory: 'Online Services', amount: '-$1,640', pct: 11},
            {catagory: 'Service Charges', amount: '-$1,365', pct: 9},
            {catagory: 'ATM Withdrawals', amount: '-$1,100', pct: 7},
            {catagory: 'Other', amount: '-$5,042', pct: 33}
        ]
    }
});