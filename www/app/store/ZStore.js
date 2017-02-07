Ext.define('Zermelo.store.ZStore', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.LocalStorage'],
    config: {
        proxy: {
            type: 'localstorage',
            id: 'AnnouncementStore'
        },
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
        // One time transition from localStorage to localforage
        if (localStorage.getItem(storeId))
            this.load(function () {
                this.pruneLocalStorage();
                var entries = localStorage.getItem(storeId);
                entries = entries ? entries.split(',') : [];
                for (var key in entries) {
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

    loadFromLocalForage: function () {
        this.suspendEvents();
        this.clearFilter();
        var successCallback = function (err, result) {
            this.setData(result);
            this.resetFilters();
            this.resumeEvents();
        };
        successCallback = successCallback.bind(this);
        localforage.getItem(Ext.getClassName(this), successCallback);
    }
});