Ext.define('Zermelo.store.ZStore', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.LocalStorage'],
    config: {
        proxy: {
            type: 'localstorage',
            id: 'AnnouncementStore',
            reader: {
                type: 'array'
            }
        }
    },

    /**
     * Sets the date to the current week during object creation
     * Loads date from localforage/localStorage. If data was stored in localStorage, it is moved to localforage
     *
     * @param:
     * @return:
     */
    initialize: function () {
        var storeId = this.getProxy().getId();
        console.log('storeId', storeId);
        // One time transition from localStorage to localforage
        if (localStorage.getItem(storeId))
            this.load(function () {
                this.pruneLocalStorage();
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
        else
            this.loadFromLocalForage();
    },

    // add: console.log,

    loadFromLocalForage: function () {
        this.suspendEvents();
        this.clearFilter();
        var successCallback = function (err, result) {
            if(result) {
                console.log('result ' + Ext.getClassName(this), result, JSON.parse(result));
                // JSON.parse(result).forEach(this.add, this);
                // this.setData(JSON.parse(result));
                var decoded = JSON.parse(result) || [];
                console.log(decoded);
                this.addData.apply(this, decoded);
            }
            this.resetFilters();
            this.resumeEvents();
            this.fireEvent('refresh');
        };
        successCallback = successCallback.bind(this);
        localforage.getItem(Ext.getClassName(this), successCallback);
    },

    saveToLocalForage: function(dataArray) {
        if(!dataArray) {
            dataArray = [];
            this.each(function(record) {
                dataArray.push(record.getData());
            });
        }
        var toSave = JSON.stringify(dataArray, this.getModel().getFields().keys);
        localforage.setItem(Ext.getClassName(this), toSave, function() {dataArray.length = 0;});
    }
});