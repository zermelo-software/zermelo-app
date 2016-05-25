/**
 * The Search model uses localStorage to save the user's searches. As each Search consists of a number of FlickrImages, we
 * set up a hasMany association between this and the FlickrImage model. Even though the FlickrImage model uses a different proxy
 * (loading its data from twitter.com instead of localStorage), the hasMany association to FlickrImage still works. See the
 * 'show' action in app/controllers/search.js to see the association in use.
 */
Ext.define('Flickr.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Flickr.model.FlickrImage', 'Ext.data.identifier.Uuid'],

    config: {
        identifier: 'uuid',

        fields: [
            { name: "id" },
            { name: "query", type: "string" }
        ],

        hasMany: {
            model: "Flickr.model.FlickrImage",
            name : 'flickrimages',
            filterProperty: 'query',
            store: {
                pageSize       : 10,
                remoteFilter   : true,
                clearOnPageLoad: false
            }
        },

        proxy: {
            type: 'localstorage',
            id  : 'flickr-searches'
        }
    }
});