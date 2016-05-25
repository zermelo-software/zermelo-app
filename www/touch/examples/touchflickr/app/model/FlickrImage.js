/**
 * @class Flickr.model.FlickrImage
 * @extends Ext.data.Model
 *
 * The FlickrImage model uses a custom Flickr proxy (defined in proxy/Flickr.js).
 * The Flickr application doesn't use this model directly very much, relying instead on the hasMany association with
 * the Search model to load the Flickr Images for a given Search.
 */
Ext.define('Flickr.model.FlickrImage', {
    extend: 'Ext.data.Model',
    requires: 'Flickr.proxy.Flickr',

    config: {
        fields: [
            {name: "id", type: "int"},
            {name: "owner", type: "string"},
            {name: "secret", type: "string"},
            {name: "server", type: "string"},
            {name: "farm", type: "string"},
            {name: "title", type: "string"},
            {name: "description", type: "string",
                convert:function(v, record){
                    return record.raw.description._content;
                }
            },
            {name: "thumbnail_url",
                convert: function(v, record) {
                    return "http://farm" +record.data.farm + ".staticflickr.com/" + record.data.server + "/" + record.data.id + "_" + record.data.secret + "_s.jpg";
                }
            },
            {name: "image_url",
                convert: function(v, record) {
                    return "http://farm" +record.data.farm + ".staticflickr.com/" + record.data.server + "/" + record.data.id + "_" + record.data.secret + "_b.jpg";
                }
            }
        ],



        proxy: {
            type: 'twitter'
        }
    }
});
