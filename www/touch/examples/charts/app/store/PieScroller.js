Ext.define('Charts.store.PieScroller', {
    extend: 'Ext.data.Store',

    requires: [
        'Charts.model.PieScroller'
    ],

    config: {
        model: 'Charts.model.PieScroller',

        data: [
            { id: 1, name: 'Aaron Conran', value: 16 },
            { id: 2, name: 'Abraham Elias', value: 10 },
            { id: 3, name: 'Andrea Camarata', value: 15 },
            { id: 4, name: 'Arne Bech', value: 8 },
            { id: 5, name: 'Art Kay', value: 5 },
            { id: 6, name: 'Brandon Donnelson', value: 9 },
            { id: 7, name: 'Colin Alworth', value: 6 },
            { id: 8, name: 'Craig Gering', value: 3 },
            { id: 9, name: 'Dan Yuen', value: 12 },
            { id: 10, name: 'Daniel Gallo', value: 18 },
            { id: 11, name: 'Darell Meyer', value: 12 },
            { id: 12, name: 'David Marsland', value: 5 },
            { id: 13, name: 'Doug Hendricks', value: 3 },
            { id: 14, name: 'Eran Davidov', value: 10 },
            { id: 15, name: 'Fred Moseley', value: 9 },
            { id: 16, name: 'Gary Schlosberg', value: 6 },
            { id: 17, name: 'Greg Barry', value: 11 },
            { id: 18, name: 'Hyle Campbell', value: 30 },
            { id: 19, name: 'Jack Ratcliff', value: 22 },
            { id: 20, name: 'Jamie Avins', value: 15 }
        ]
    }
});