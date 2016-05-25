(function () {
    var seed = 1.3;

    // Controllable random.
    function random() {
        seed *= 7.3;
        seed -= Math.floor(seed);
        return seed;
    }

    Ext.define('Charts.store.Pie', {
        alias        : 'store.Pie',
        extend       : 'Ext.data.Store',
        config       : {
            fields  : ['id', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'name'],
            data    : []
        },
        generateData : function (count) {
            var data = [], i, record = {
                'id'   : i,
                'g1'   : Math.round(700 * random() + 100, 0),
                'g2'   : Math.round(700 * random() + 100, 0),
                'g3'   : 700 * random() + 100,
                'g4'   : 700 * random() + 100,
                'g5'   : 700 * random() + 100,
                'g6'   : 700 * random() + 100,
                'name' : 'Technology'
            };
            data.push(record);
            for (i = 1; i < count; i++) {
                var name = 'Item-' + i;

                switch(i) {
                    case 1:
                        name = 'Agriculture';
                        break;
                    case 2:
                        name = 'Textiles';
                        break;
                    case 3:
                        name = 'Energy';
                        break;
                    case 4:
                        name = 'Pharmacology';
                        break;
                    case 5:
                        name = 'Other';
                        break;
                }
                record = {
                    'id'   : i,
                    'g1'   : Math.round(Math.abs(record.g1 + 300 * random() - 140), 0),
                    'g2'   : Math.round(Math.abs(record.g2 + 300 * random() - 140), 0),
                    'g3'   : Math.abs(record.g3 + 300 * random() - 140),
                    'g4'   : Math.abs(record.g4 + 300 * random() - 140),
                    'g5'   : Math.abs(record.g5 + 300 * random() - 140),
                    'g6'   : Math.abs(record.g6 + 300 * random() - 140),
                    'name' : name
                };
                data.push(record);
            }
            this.setData(data);
        },
        constructor  : function () {
            this.callParent(arguments);
            this.generateData(6);
            return this;
        }
    });
})();