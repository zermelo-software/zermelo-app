Ext.application({
    name : 'Direct',

    requires: [
        'Ext.form.Panel',
        'Ext.field.Email',
        'Ext.Button',
        'Ext.MessageBox',
        'Ext.direct.*'
    ],

    launch: function() {
        Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

        Ext.Viewport.add({
            xtype: 'formpanel',
            scrollable: null,
            defaultType: 'textfield',
            paramOrder: ['uid', 'foo'],
            api: {
                load: 'Profile.getBasicInfo',
                submit: 'Profile.updateBasicInfo'
            },
            items: [
                {
                    label: 'Name',
                    name: 'name'
                },
                {
                    xtype: 'emailfield',
                    label: 'Email',
                    name: 'email'
                },
                {
                    label: 'Company',
                    name: 'company'
                },
                {
                    xtype: 'container',
                    defaultType: 'button',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 1,
                            text: 'Load',
                            ui: 'action',
                            handler: function(button) {
                                var form = button.up('formpanel');

                                form.load({
                                    params: {
                                        uid: 5
                                    },
                                    success: function() {
                                        Ext.Msg.alert('Success', 'Form loaded successfully');
                                    },
                                    failure: function(form, result, response) {
                                        var errors = response.errors,
                                            ret = [],
                                            name, error;

                                        for (name in errors) {
                                            if (errors.hasOwnProperty(name)) {
                                                error = errors[name];

                                                ret.push(name + ': ' + error);
                                            }
                                        }

                                        Ext.Msg.alert('Failure', ret.join('<br />'));
                                    }
                                });
                            }
                        },
                        {
                            flex: 1,
                            text: 'Submit',
                            ui: 'confirm',
                            handler: function(button) {
                                var form = button.up('formpanel');

                                form.submit({
                                    success: function() {
                                        Ext.Msg.alert('Success', 'Form submit successful');
                                    },
                                    failure: function(form, result, response) {
                                        var errors = response.errors,
                                            ret = [],
                                            name, error;

                                        for (name in errors) {
                                            if (errors.hasOwnProperty(name)) {
                                                error = errors[name];

                                                ret.push(name + ': ' + error);
                                            }
                                        }

                                        Ext.Msg.alert('Failure', ret.join('<br />'));
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        });
    }
});
