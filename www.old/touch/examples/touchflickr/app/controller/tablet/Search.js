Ext.define('Flickr.controller.tablet.Search', {
    extend: 'Flickr.controller.Search',
    
    /**
     * Called when the searchesStore has been loaded from localStorage. If it is NOT a phone, it will select one of the searches
     * from the list, now that it is loaded.
     * We don't want to select a search when it is loaded on a phone, as it would trigger the flickrList view to display.
     */
    onSearchesStoreLoad: function() {
        this.callParent();
        
        var search = Ext.getStore('Searches').getAt(0);
        
        if (search) {
            this.getSearchList().select(search);
        }
    },
    
    doDestroy: function(search, button) {
        var store    = Ext.getStore('Searches'),
            previous = store.getAt(store.indexOf(search) - 1);
            
        this.callParent(arguments);
        
        previous = previous || store.getAt(0);
        
        if (previous) {
            this.getSearchList().select(previous);
        } else {
            //hide the search list if there is no other searches to select (so FlickrImagess for
            //the current search don't continue to display)
            this.getFlickrList().hide();
        }
    },
    
    onSearchSelect: function() {
        this.callParent(arguments);
        
        //if we had previously deleted all of the searches this should be hidden so make sure it's visible
        this.getFlickrList().show();
    }
});