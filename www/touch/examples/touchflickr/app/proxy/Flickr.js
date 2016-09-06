/**
 * @class Ext.data.FlickrProxy
 * @extends Ext.data.proxy.JsonP
 *
 * This simple proxy allows us to use Flickr's JSON-P API to search for images. All we're really doing in this
 * class is setting a few defaults (such as the number of imagess per page and a simple JSON Reader), and using
 * any Filters attached to the read Operation to modify the request url (see buildRequest).
 *
 */
Ext.define('Flickr.proxy.Flickr', {
    extend: 'Ext.data.proxy.JsonP',
    alias: 'proxy.twitter',

    config: {
        // This is the url we always query when searching for imagess
        url: 'http://api.flickr.com/services/rest/',
        callbackKey:"jsoncallback",
        extraParams: {
            method: "flickr.photos.search",
            format: "json",
            api_key:"910f7c27aea52eda41c567c1e42a7b0f",
            extras: "description"
        },
        filterParam: "text",
        limitParam: "per_page",

        reader: {
            type: 'json',
            rootProperty: 'photos.photo'
        }
    },
    encodeFilters: function(filters) {
        if(Ext.isArray(filters) && filters.length > 0) return filters[0].getValue();
        return "";
    }
});