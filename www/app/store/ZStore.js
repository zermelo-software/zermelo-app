Ext.define('Zermelo.store.ZStore', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.LocalStorage'],
    config: {
        proxy: {
            type: 'localstorage',
        },
        autoSort: false
    },

    loadFromLocalStorage: function (storeId) {
        this.load(function() {
            var entries = localStorage.getItem(storeId);
            entries = entries ? entries.split(',') : [];
            for (var key in entries) {
                // setTimeout(0) to prevent long waits for the UI
                setTimeout(function () {
                    localStorage.removeItem(storeId + '-' + key)
                }, 0);
            }
            // The order of above removes and this one doesn't matter, so don't worry about the race condition
            localStorage.removeItem(storeId);
        });
    },

    loadFromLocalForage: function () {
        this.suspendEvents();
        this.clearFilter();
        var successCallback = function (err, result) {
            if(result) {
                var decoded = JSON.parse(result);
                decoded.forEach(function(record) {
                    record.start = new Date(record.start);
                    record.end = new Date(record.end);
                });
                console.log(decoded[0], decoded[1]);
                this.add(decoded);
            }
            console.log(Zermelo.UserManager.getUser(), this.getCount());
            this.resetFilters();
            this.resumeEvents();
            this.fireEvent('refresh');
            if(this.getCount() == 0) {
                this.fetch();
            }
        };
        successCallback = successCallback.bind(this);
        localforage.getItem(Ext.getClassName(this), successCallback);
    },


    loadFromLocalForageOrStorage: function() {
        var storeId = this.getProxy().getId();
        // One time transition from localStorage to localforage
        if (localStorage.getItem(storeId)) {
            this.loadFromLocalStorage(storeId);
        }
        else {
            this.loadFromLocalForage();
        }
    },

    saveToLocalForage: function(dataArray) {
        console.log('saveToLocalForage ' + Ext.getClassName(this));
        dataArray = [];
        this.each(function(record) {
            var dateCleaned = record.getData();
            dateCleaned.start = dateCleaned.start.valueOf();
            dateCleaned.end = dateCleaned.end.valueOf();
            dataArray.push(dateCleaned);
        });
        var toSave = JSON.stringify(dataArray, this.getModel().getFields().keys);
        localforage.setItem(Ext.getClassName(this), toSave, function() {dataArray.length = 0;});
    }
});