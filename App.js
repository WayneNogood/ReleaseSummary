
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [{
        xtype: 'container',
        itemId: 'releaseFilter',
        componentCls: 'combobox'
    }, {
        xtype: 'container',
        itemId: 'storyGridTitle',
        componentCls: 'gridTitle'
    }, {
        xtype: 'container',
        itemId: 'storyGrid',
        componentCls: 'grid'
    }, {
        xtype: 'container',
        itemId: 'defectGridTitle',
        componentCls: 'gridTitle'
    }, {
        xtype: 'container',
        itemId: 'defectGrid',
        componentCls: 'grid'
    }, {
        xtype: 'container',
        itemId: 'releaseInfo',
        componentCls: 'releaseInfo'
    }],

    launch: function () {
        this.down('#releaseFilter').add({
            xtype: 'rallyreleasecombobox',
            itemId: 'releaseComboBox',
            listeners: {
                change: this._query,
                ready: this._query,
                scope: this
            }
        });
    },

    _query: function () {
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'UserStory',
            autoLoad: true,
            fetch: ['FormattedID', 'Name'],
            filters: [{
                property: 'Release.Name',
                operator: '=',
                value: this.down('#releaseComboBox').getRawValue()
            }, {
                property: 'ScheduleState',
                operator: '=',
                value: 'Accepted'
            }],
            sorters: [{
                property: 'FormattedID',
                direction: 'ASC'
            }],
            listeners: {
                load: this._onStoriesDataLoaded,
                scope: this
            }
        });

        this.down('#releaseInfo').update('<p><b>About this release: </b><br />' + 'Additional information is available <a href="' + Rally.util.Navigation.createRallyDetailUrl(this.down('#releaseComboBox').getValue()) + '" target="_top">here.</a></p>');


        Ext.create('Rally.data.WsapiDataStore', {
            model: 'Defect',
            autoLoad: true,
            fetch: ['FormattedID', 'Name'],
            filters: [{
                property: 'Release.Name',
                operator: '=',
                value: this.down('#releaseComboBox').getRawValue()
            }, {
                property: 'ScheduleState',
                operator: '=',
                value: 'Accepted'
            }],
            sorters: [{
                property: 'FormattedID',
                direction: 'ASC'
            }],
            listeners: {
                load: this._onDefectsDataLoaded,
                scope: this
            }
        });
    },

    _onStoriesDataLoaded: function (store, data) {
        var records = [],
            rankIndex = 1;
        Ext.Array.each(data, function (record) {
            records.push({
                FormattedID: '<a href="' + Rally.util.Navigation.createRallyDetailUrl(record.get('_ref')) + '" target="_top">' + record.get('FormattedID') + '</a>',
                Name: record.get('Name')
            });
        });

        var customStore = Ext.create('Rally.data.custom.Store', {
            data: records,
            pageSize: 25
        });

        this.down('#storyGridTitle').update('<p><b>Stories: ' + records.length + '</b><br /></p>');

        if (!this.storyGrid) {
            this.storyGrid = this.down('#storyGrid').add({
                xtype: 'rallygrid',
                store: customStore,
                columnCfgs: [{
                    text: 'ID',
                    dataIndex: 'FormattedID'
                }, {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex: 1
                }]
            });
        } else {
            this.storyGrid.reconfigure(customStore);
        }
    },

    _onDefectsDataLoaded: function (store, data) {
        var records = [],
            rankIndex = 1;
        Ext.Array.each(data, function (record) {
            records.push({
                FormattedID: '<a href="' + Rally.util.Navigation.createRallyDetailUrl(record.get('_ref')) + '" target="_top">' + record.get('FormattedID') + '</a>',
                Name: record.get('Name')
            });
        });

        var customStore = Ext.create('Rally.data.custom.Store', {
            data: records,
            pageSize: 25
        });

        this.down('#defectGridTitle').update('<p><b>Defects: ' + records.length + '</b><br /></p>');

        if (!this.defectGrid) {
            this.defectGrid = this.down('#defectGrid').add({
                xtype: 'rallygrid',
                store: customStore,
                columnCfgs: [{
                    text: 'ID',
                    dataIndex: 'FormattedID'
                }, {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex: 1
                }]
            });
        } else {
            this.defectGrid.reconfigure(customStore);
        }
    }
});