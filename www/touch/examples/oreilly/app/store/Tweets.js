/*
 Twitter has deprecated the public Search. This application will simulate tweet data using schematic-ipsum.
 until an oauth solution is developed.
*/

Ext.define('Oreilly.store.Tweets', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['from_user', 'profile_image_url', 'text', 'created_at'],
        listeners: {
            beforeload: function(){
                var proxy = this.getProxy();
                proxy.getMethod = function() { return "POST" }
            }
        },

        pageSize: 10,
        proxy: {
            type: 'rest',
            url: 'http://schematic-ipsum.herokuapp.com/?n=15',

            extraParams: {
                "type": "object",
                "properties[id][type]":"string",
                "properties[id][ipsum]":"id",
                "properties[from_user][type]":"string",
                "properties[from_user][ipsum]":"first name",
                "properties[profile_image_url][type]":"string",
                "properties[profile_image_url][ipsum]":"small image",
                "properties[text][type]":"string",
                "properties[text][ipsum]":"sentence",
                "properties[created_at][type]":"string",
                "properties[created_at][format]":"date-time"
            }
        }
    }
});
