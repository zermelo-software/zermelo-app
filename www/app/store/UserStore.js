Ext.define('Zermelo.store.UserStore', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.LocalStorage', 'Zermelo.model.User'],
    config: {
        model: 'Zermelo.model.User',
        storeId: 'Users',
        // proxy: {
        //     type: 'localstorage',
        //     id: 'UserStore'
        // },
        autoLoad: false,
        autoSync: true
    },

    loadOrFetch: function() {
        // this.load();
        if(this.getCount() == 0) 
            Zermelo.AjaxManager.getUsers();
    }
});