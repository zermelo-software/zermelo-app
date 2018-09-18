/* 
 * This file is part of the Zermelo App.
 * 
 * Copyright (c) Zermelo Software B.V. and contributors
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

Ext.define('Zermelo.view.SlideView', {
    extend: 'Ext.Container',

    requires: [
        'Ext.Button',
        'Ext.Container',
        'Ext.Function',
        'Ext.Toolbar',
        'Ext.data.Model',
        'Ext.data.ModelManager',
        'Ext.data.Store',
        'Ext.dataview.List',
        'Ext.MessageBox'
    ],
    xtype: 'slidenavigationview',

    /**
     * @event close
     * @preventable moveContainer
     * Fires whenever the container is closed
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Number} position The x-coordinate to which the container will be moved to
     * @param {Number} duration The duration of the slide event
     */

    /**
     * @event open
     * @preventable moveContainer
     * Fires whenever the container is opened
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Number} position The x-coordinate to which the container will be moved to
     * @param {Number} duration The duration of the slide event
     */

    /**
     * @event select
     * @preventable setContainerItem
     * Fires whenever an item in the menu is selected
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Ext.Component} item The selected item
     * @param {Integer} index The index of the selected item
     */

    /**
     * @event slideend
     * Fires whenever the user has finished sliding the container.  This is fired once the
     * animation is complete.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event slidestart
     * Fires whenever the user has started sliding the container.  This is fired once the
     * animation is complete.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event opened
     * Fires after the container is fully opened.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event closed
     * Fires after the container is fully closed.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    config: {

        /**
         * @cfg {Object} list Configuration for the navigation list.
         * The maxDrag property is not supported when the list is on the right.
         */
        list: {
            width: 100,
            maxDrag: null,
            itemTpl: new Ext.XTemplate("<tpl for='.'>",
                "<div style='text-align: center'>" +
                "<input type='image' src='{urlLogo}' name='{title}' style='padding:3px;'>" +
                "<tpl if='title == \"Messages\"'>" +
                "<span class='circle' id='messageCount' style=\"display: none;\"></span>",
                "</tpl>",
                "</div>",
                "</tpl>"),
            grouped: true
        },

        /**
         * @cfg {Object} container Configuration for the container
         */
        container: {},

        /**
         * @cfg {Object/Boolean} itemMask Configuration for the mask used to mask
         * items when the container is opened.  Set to false to disable masking of
         * items.
         */
        itemMask: false,

        /**
         * @cfg {Array} items An array of items to put into the navigation list.
         * The items can either be Ext components or special objects with a "handler"
         * key, which should be a function to execute when selected.  Additionally, you
         * can define the order of the items by defining an 'order' parameter.
         */
        items: [],

        /**
         * @cfg {Object} groups Mapping of group name to order.  For example,
         * say you have defined two groups; "Group 1" and "Group 2".  By default
         * these will be presented in the list in that order, since
         * 'Group 1' > 'Group 2'.  This option allows you to change the ordering,
         * like so:
         *
         *  groups: {
         *    'Group 1': 2
         *    'Group 2': 1
         *  }
         *
         *  You should use integers, starting with 1, as the ordering value.
         *  By default groups are ordered by their name.
         */
        groups: {},

        /**
         * @cfg {Object} defaults An object of default values to apply to any Ext
         * components created from those listed in ``items``.
         */
        defaults: {
            layout: 'card'
        },

        /**
         * @cfg {String} listPosition Position of the list menu, left or right.
         * Defaults to 'left'.
         */
        listPosition: 'left',

        /**
         * @cfg {String} slideSelector Class selector of object (or parent)
         * of which dragging should be allowed.  Defaults to the entire container.
         * For example, this could be set to something like 'x-toolbar' to restrict
         * dragging only to a toolbar.
         */
        slideSelector: '',

        /**
         * @cfg {Integer} containerSlideDelay Pixel offset that must be dragged before
         * allowing the underlying container to be dragged.
         * Defaults to -1, which is disabled.  Setting this to 10 will very closely mimic
         * the behavior of the FB version.
         */
        containerSlideDelay: -1,

        /**
         * @cfg {Integer} slideDuration Number of miliseconds to animate the sliding
         * of the container when "flicked".  By default the animation is disable on
         * Android.
         */
        slideDuration: Ext.os.is('Android') ? 0 : 100,

        /**
         * @cfg {Integer} selectSlideDuration Number of miliseconds to animate the sliding
         * of the container when list item is selected (if closeOnSelect = true). The default
         * value here of 300 gives a much nicer feel.  By default the animation is disable on
         * Android.
         */
        selectSlideDuration: Ext.os.is('Android') ? 0 : 100,

        /**
         * @cfg {Boolean} closeOnSelect Whether or not to automatically close the container
         * when an item in the list is selected.  Default is true.
         */
        closeOnSelect: true,

        /**
         * @cfg {String} shadowStyle CSS to use for styling the shadow when the container is
         * open.  This should be a valid CSS 'box-shadow' argument.  Set to false to disable
         * it.
         */
        shadowStyle: '0 0 4px 1px #999',


        slideButtonDefaults: {}
    },
    // The ids listed here are assigned by the order these items have in Home.js
    // If you change that list this list needs to be updated as well to ensure your buttons do the right thing
    itemIds: {
        'fullCalendarView': 0,
        'calendarList': 1,
        'messageList': 2,
        'userChange': 3,
        'logout': 4
    },

    initConfig: function() {
        var me = this;

        me._indexCount = 0;

        // Create the store.
        me.store = Ext.create('Ext.data.Store', {
            model: me.getModel(),
            sorters: 'order',
            grouper: {
                property: 'group',
                sortProperty: 'groupOrder'
            }
        });

        // Add the items into the list.
        me.addItems(me.config.items || []);
        delete me.config.items;

        me.callParent(arguments);

        /**
         *  @private
         *
         *  This stores the instances of the components created.
         *  TODO: Support 'autoDestroy'.
         */
        me._cache = {};


        // Default config values used for creating a slideButton.
        me._slideButtonConfig = new Ext.create('Ext.Button', {
            xtype: 'button',
            iconMask: true,
            ref: '../menuButton',
            docked: 'left',
            iconCls: 'zermelo-menu-button-' + imageType,
            align: this.getListPosition(),
            name: 'slidebutton',
            style: {
                'padding-left': '0px'
            },
            ui: 'plain',
            listeners: {
                release: me.toggleContainer,
                tap: function(button, e) {
                    // Need this to stop auto-selecting any component
                    // hidden beneath the container.
                    e.preventDefault();

                    Ext.getCmp('home').list.addCls('zermelo-menu-list');
                },
                scope: me
            }

            /**
             *  To add the button into a toolbar, you can add the following
             *  to any item in your navigation list.
             */
            //selector: ['toolbar']
        });

        /**
         *  Default config for masked items.
         */
        me.itemMaskDefaults = {
            xtype: 'mask',
            transparent: true
        };
    },

    initialize: function() {
        this.__init = false;

        this.callParent();

        this.addCls('x-slidenavigation');

        this.list = this.createNavigationList();
        this.container = this.createContainer();

        this.add([
            this.list,
            this.container
        ]);

        this.createContainerCSS();
        var selectedItemIndex = this.itemIds[localStorage.getItem('lastView')] || 0;

        Ext.each(this.list.getStore().getRange(), function(item, index) {
            if (item.get('selected') === true) {
                selectedItemIndex = index;
            }
        });
        this.list.select(selectedItemIndex);

        this.updateToolbar();

        this.__init = true;

    },

    /**
     *  @private
     *
     *  Adds an array of items (or a single item) into the list.
     */
    addItems: function(items) {
        var me = this,
            items = Ext.isArray(items) ? items : [items],
            groups = me.config.groups;

        Ext.each(items, function(item, index) {
            if (!Ext.isDefined(item.index)) {
                item.index = me._indexCount;
                me._indexCount++;
            }
            me.store.add(item);
        });
    },

    /**
     *  @private
     *
     *  Construct style element for container shadow and insert into the DOM.
     */
    createContainerCSS: function() {
        var shadowStyle = this.getShadowStyle(),
            id = this.getId();

        if (shadowStyle) {
            if (!document.getElementById(id)) {
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '.x-slidenavigation-container.x-dragging, ' +
                    '.x-slidenavigation-container.open { ' +
                    'box-shadow: ' + shadowStyle + ';' +
                    '-webkit-box-shadow:' + shadowStyle + ';';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }
    },

    /**
     *  @private
     *
     *  Gets the configuration for masking items.  If masking items is disabled
     *  this returns false.
     */
    getMask: function() {
        var mask = this.getItemMask();
        if (mask != false) {
            if (Ext.isBoolean(mask)) {
                mask = this.itemMaskDefaults;
            }
        }
        return mask;
    },

    /**
     *  @private
     *
     *  If item masking is enabled, this method will mask any containers that have
     *  a ``maskOnOpen`` configuration variable set to ``true``.  If masking is
     *  disabled, this method does nothing.
     */
    doMaskItem: function(item, mask) {
        return;
        var maskConfig = this.getMask(),
            mask = Ext.isDefined(mask) ? mask : true;

        Ext.each(item.query('component[maskOnOpen=true]'), function(el) {
            if (mask) {
                el.setMasked(maskConfig);

                // This is needed to allow dragging on the mask, which is disabled
                // by the default Ext.Mask class.
                el.getMasked().onEvent = Ext.emptyFn;
            } else {
                el.setMasked(false);
            }
        });
    },

    /**
     * @private
     *
     * Always called when item in the list is tapped.
     */
    onItemTap: function(list, index, target, item, event, eOpts) {
        this.closeContainer();
        if (index == this.itemIds.logout) {
            // Create 'are you sure you want to log out?' box
            Ext.Msg.show({
                items: [{
                    xtype: 'label',
                    cls: 'zermelo-error-messagebox',
                    locales: {
                        html: 'menu.logout_message'
                    }
                }],
                buttons: [{
                    itemId: 'ok',
                    locales: {
                        text: 'ok'
                    },
                    ui: 'normal',
                    handler: function() {
                        Zermelo.UserManager.logout();
                        this.destroy();
                    }
                }, {
                    xtype: 'spacer'
                }, {
                    itemId: 'cancel',
                    locales: {
                        text: 'cancel'
                    },
                    ui: 'normal',
                    handler: function() {
                        this.destroy();
                    }

                }]
            });

        } else if(index == this.itemIds.userChange) {
            if(!Zermelo.UserManager.needsTokenUpgrade())
                return true;
            else if(localStorage.getItem('skipTokenUpgrade') == 'true')
                Ext.create('Zermelo.view.OldUserSelect').show();
            else 
                Ext.create('Zermelo.view.NewOrOldUserSelect').show();
            return false;
        }
    },

    /**
     *  @private
     *
     *  Called when an item in the list is tapped if item is not selected.
     */
    onSelect: function(list, item, eOpts) {
        var me = this,
            store = list.getStore(),
            index = item.raw.index,
            container = me.container,
            func = Ext.emptyFn;
        if (index != this.itemIds.logout) {
            if (me._cache[index] == undefined) {
                // If the object has a handler defined, then we don't need to
                // create an Ext object
                if (Ext.isFunction(item.raw.handler)) {
                    me._cache[index] = item.raw.handler;
                } else {
                    me._cache[index] = container.add(Ext.merge({}, me.config.defaults, item.raw));

                    me.doMaskItem(me._cache[index], true);

                    // Wait until the component is painted before closing the container.  This makes
                    // the initial animation much smoother.
                    // if (me.config.closeOnSelect) {
                        // me._cache[index].addListener('painted', function() {
                            // The slight delay here gives the component enough time to update before
                            // the close animation starts.
                            me.closeContainer();
                        // });
                    // }

                    // Add a button for controlling the slide, if desired
                }
            }
            if (Ext.isFunction(me._cache[index])) {
                func = me._cache[index];
            } else {
                func = me.setContainerItem;
            }

            if (me.__init) {
                me.fireAction('select', [me, me._cache[index], index], func, me);
            }
            if (index == this.itemIds.fullCalendarView) {
                Ext.getCmp('fullCalendarView').prepareToShow();
            }
            else if (index == this.itemIds.calendarList) {
                this.down('CalendarList').prepareToShow();
            }
        }
        this.updateToolbar();
    },


	getAppointmentsTitle: function() {
		var key_suffix = Zermelo.UserManager.userIsSelf() ? 'self' : 'other';
		var suffix = Zermelo.UserManager.userIsSelf() ? '' : Zermelo.UserManager.getName();
		return Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix;
	},

	updateToolbar: function() {
        var index = this.getActiveItem().internalId;
        var title = '';
        var store = null;
        if (this.itemIds.fullCalendarView === index || this.itemIds.calendarList === index) {
			title = this.getAppointmentsTitle();
			store = Ext.getStore('Appointments');
			store.setRetrievalDate();
        }
        else if (this.itemIds.messageList === index) {
            title = Ux.locale.Manager.get('menu.announcement_self');
            store = Ext.getStore('Announcements');
			store.setRetrievalDate();
        }
        else if (this.itemIds.userChange === index) {
			Ext.getCmp('refresh_time_label').setHtml('');
			title = Ux.locale.Manager.get('menu.user_select');
		}
		var header = Ext.getCmp('user_label');
		if (header) {
			header.setHtml(
				'<div style="font-size: 1em;">' +
				title +
				'</div>'
			);
		}
	},

    /**
     *  @private
     *
     *  Set the active item in the container.
     */
    setContainerItem: function(nav, item) {
        var container = nav.container;
        container.setActiveItem(item);
    },

    /**
     *  @private
     *
     *  Callback function for when the container has started being dragged.
     */
    onContainerDragstart: function(draggable, e, offset, eOpts) {
        var slideSelector = this.getSlideSelector(),
            containerSlideDelay = this.config.containerSlideDelay;

        if (slideSelector == false && containerSlideDelay < 0) {
            return false;
        }

        if (this.container.dragAllowed) {
            // TODO: "value", This doesn't work as is, but I'd like to disable the underlying component
            //       once dragging has started...
            //this.doMaskItem(this.container.getActiveItem(), true);
            return false;
        }

        if (slideSelector) {
            node = e.target;
            while (node = node.parentNode) {
                if (node.classList && node.classList.contains(slideSelector)) {
                    this.fireEvent('dragstart', this);
                    return true;
                }
            }
            return false;
        }
        return false;
    },

    /**
     *  @private
     *
     *  Callback function for when the container has finished being dragged.  This determines
     *  which direction to finish moving the container based on its current position and velocity.
     */
    onContainerDragend: function(draggable, e, eOpts) {
        var velocity = Math.abs(e.deltaX / e.deltaTime),
            listPosition = this.getListPosition()
        direction = (e.deltaX > 0) ? "right" : "left",
            offset = Ext.clone(draggable.offset),
            threshold = parseInt(this.config.list.minWidth * .70);

        // XXX: This is ugly
        if (listPosition == "right") {
            if (direction == "right") {
                direction = "left";
            } else {
                direction = "right";
            }
        }

        switch (direction) {
            case "right":
                offset.x = (velocity > 0.75 || offset.x > threshold) ? this.config.list.minWidth : 0;
                break;
            case "left":
                offset.x = (velocity > 0.75 || offset.x < threshold) ? 0 : this.config.list.minWidth;
                break;
        }

        this.fireEvent('dragend', this);

        this.moveContainer(this, offset.x);
    },

    /**
     *  @private
     *
     *  Registers the model with Ext.ModelManager, if it hasn't been
     *  already, and returns the name of the model for use in the store.
     */
    getModel: function() {
        var model = 'SlideNavigationPanelItem',
            groups = this.config.groups;

        if (!Ext.ModelManager.get(model)) {
            Ext.define(model, {
                extend: 'Ext.data.Model',
                config: {
                    idProperty: 'index',
                    fields: [
                        'index', 'title', 'group', 'selected', 'urlLogo', {
                            name: 'order',
                            defaultValue: 1
                        }, {
                            name: 'groupOrder',
                            convert: function(value, record) {
                                // By default we group and order by group name.
                                group = record.get('group');
                                return groups[group] || group;
                            }
                        }
                    ]
                }
            });
        }

        return model;
    },

    /**
     *  Closes the container.  See {@link #moveContainer} for more details.
     */
    closeContainer: function(duration) {
        Ext.getCmp('home').list.addCls('zermelo-menu-list');
        var me = this,
            duration = duration || this.config.slideDuration;

        if (me.__init) {
            me.fireAction('close', [me, 0, duration], 'moveContainer', me);
        }
    },

    /**
     *  Opens the container.  See {@link #moveContainer} for more details.
     */
    openContainer: function(duration) {
        Ext.getCmp('home').list.addCls('zermelo-menu-list');
        var me = this,
            duration = duration || this.config.slideDuration,
            offsetX = this.config.list.minWidth;

        if (me.__init) {
            me.fireAction('open', [me, offsetX, duration], 'moveContainer', me);
        }
    },

    /**
     *  Toggles the container open or close.
     */
    toggleContainer: function(duration) {
        var duration = Ext.isNumber(duration) ? duration : this.config.slideDuration;
        if (this.isClosed()) {
            this.openContainer(duration);
        } else {
            this.closeContainer(duration);
        }
    },

    /**
     *  @private
     *
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     */
    moveContainer: function(nav, offsetX, duration) {
        var duration = duration || this.config.slideDuration,
            draggable = this.container.draggableBehavior.draggable;
        listPosition = this.getListPosition();

        // Invert the direction of the side movement
        if (listPosition == "right") {
            offsetX = -offsetX;
        }

        this.container.addCls('open');
        draggable.setOffset(offsetX, 0, {
            duration: duration
        });
    },

    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     *
     *  @return {Boolean} Whether or not the container is fully closed.
     */
    isClosed: function() {
        return (this.container.draggableBehavior.draggable.offset.x == 0);
    },


    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     *
     *  @return {Boolean} Whether or not the container is fully open.
     */
    isOpened: function() {
        var listPosition = this.getListPosition();
        offset = (listPosition == "left") ? this.config.list.minWidth : -this.config.list.minWidth;

        return (this.container.draggableBehavior.draggable.offset.x == offset);
    },

    /**
     *  @private
     *
     *  Sets the container as being closed.  This shouldn't ever be called
     *  directly as it is automatically called by the ``translatable``
     *  "animationend" event after the container has stopped moving.  All this
     *  really does is set the CSS class for the container.
     */
    setClosed: function(closed) {
        if (closed) {
            this.container.removeCls('open');
        } else {
            this.container.addCls('open');
        }
    },

    /**
     *  @private
     *
     *  Generates a new Ext.dataview.List object to be used for displaying
     *  the navigation items.
     */
    createNavigationList: function(store) {
        var listConfig = this.getList(),
            listPosition = this.getListPosition();

        // The menu can be dragged further than the width
        if (listConfig.width) {
            listConfig.minWidth = listConfig.width;

            if (listPosition == "left") {
                // The actual width of the list is determined by maxDrag
                listConfig.width = listConfig.maxDrag || listConfig.width;
            }
        }

        return Ext.create('Ext.dataview.List', Ext.merge({}, listConfig, {
            store: this.store,
            docked: listPosition,
            scrollable: false,
            height: '100%',
            cls: 'zermelo-menu-list',
            itemCls: 'zermelo-menu-list-item',
            pressedCls: 'zermelo-menu-list-item-pressed',
            selectedCls: 'zermelo-menu-list-item-select',
            style: 'position: absolute; top: 0; ' + listPosition + ': 0; height: 100%;' +
                'z-index: 2',
            listeners: {
                select: this.onSelect,
                itemtap: this.onItemTap,
                scope: this
            }
        }));
    },

    /**
     *  @private
     *
     *  Generates and returns the Ext.Container to be used for displaying
     *  content.  This is the "slideable" container that is positioned above
     *  the navigation list.
     */
    createContainer: function() {
        var me = this,
            listPosition = this.getListPosition(),
            containerSlideDelay = this.getContainerSlideDelay(),
            containerConstraint;

        if (listPosition == "left") {
            containerConstraint = {
                min: {
                    x: 0,
                    y: 0
                },
                max: {
                    x: me.config.list.maxDrag || Math.max(screen.width, screen.height),
                    y: 0
                }
            }
        } else {
            containerConstraint = {
                // TODO: The sliding menu does not currently support maxDrag when positioned on the right,
                //       because it would require adding padding to every element in the list.
                min: {
                    x: -me.config.list.width,
                    y: 0
                },
                max: {
                    x: 0,
                    y: 0
                }
            }
        }

        var container = Ext.create('Ext.Container', Ext.merge({}, me.config.container, {
            // docked: 'left',
            cls: 'x-slidenavigation-container',
            style: 'width: 100%; height: 100%; position: relative;  z-index: 3',
            layout: 'card',
            dragAllowed: false,
            dragAllowedForced: false,
            draggable: {
                direction: 'horizontal',
                constraint: containerConstraint,
                listeners: {
                    dragstart: {
                        fn: me.onContainerDragstart,
                        order: 'before',
                        scope: me
                    },
                    dragend: me.onContainerDragend,
                    scope: me
                },
                translatable: {
                    listeners: {
                        animationstart: function() {
                            me.fireEvent('slidestart', me);
                        },
                        animationend: function(translatable, b, c) {
                            // Fire the event now that the animation is done.
                            if (me.__init) {
                                me.fireEvent('slideend', me);
                            }

                            if (me.isOpened()) {
                                me.fireEvent('opened', me);

                                me.doMaskItem(me.container.getActiveItem(), true);
                            } else if (me.isClosed()) {
                                me.fireEvent('closed', me);

                                me.doMaskItem(me.container.getActiveItem(), false);
                            }

                            // Remove the class when the animation is finished, but only
                            // if we're "closed"
                            me.setClosed(me.isClosed());
                        },
                        scope: me // The "x-slidenavigation" container
                    }
                }
            }
        }));
        return container;
    },

    /**
     *  Override the default method so that we actually return the active item in the list,
     *  otherwise this will always return the same thing (the main container, not the
     *  selected item).
     *
     *  @return {Ext.Component/null} The currently active component.
     */
    getActiveItem: function() {
        var selection = this.list.getSelection();
        if (selection) {
            return selection[0];
        }
    },

    selectItem: function(itemName) {
        if(itemName == 'lastView')
            itemName = localStorage.getItem('lastView') || 'fullCalendarView';
        if(this.itemIds[itemName] === undefined)
            console.log('Unknown view', itemName, this.itemIds);
        this.list.select(this.itemIds[itemName]);
    },

    getActiveItemName: function() {
        var activeItem = this.getActiveItem().internalId;
        for(var key in this.itemIds) {
            if(this.itemIds[key] == activeItem)
                return key;
        }
    }
});
