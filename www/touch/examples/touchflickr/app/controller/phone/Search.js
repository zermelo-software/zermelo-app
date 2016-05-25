Ext.define('Flickr.controller.phone.Search', {
    extend: 'Flickr.controller.Search',

    config: {
        refs: {
            flickrToolbar: 'flickrlist toolbar',
            searchContainer: 'mainview #searchcontainer'
        },

        control: {
            'flickrlist toolbar button': {
                tap: 'onBackButtonTap'
            }
        }
    },

    launch: function() {
        this.callParent(arguments);

        this.getFlickrToolbar().show();
    },

    /**
     * Called when the back button is tapped in the toolbar at the top of the flickrsList. Just switches back to the
     * list of saved searches
     */
    onBackButtonTap: function() {
        this.getMain().setActiveItem(this.getSearchContainer());
    },

    onSearchSelect: function(list, search) {
        this.callParent(arguments);

        this.getMain().setActiveItem(this.getFlickrList());

        var searchList = this.getSearchList();

        // hack to deselect an item.
        setTimeout(function() {
            searchList.deselect(search);
        }, 500);
    }
});
