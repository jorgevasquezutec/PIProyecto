$(function mensajes(){
    var UM = "/messages"; //confirmando los mensajes json
    var UU = "/users";//confirmando los users con json
    var lookupDataSource = {
        store: new DevExpress.data.CustomStore({
            key: "id",
            load: function(loadOptions) {
                var d = $.Deferred(),
                    params = {};
                [
                    "sort",
                ].forEach(function(i) {
                    if(i in loadOptions && isNotEmpty(loadOptions[i]))
                        params[i] = JSON.stringify(loadOptions[i]);
                });
                $.getJSON(UU, params)
                    .done(function(result) {
                        d.resolve(result)
                    });
                return d.promise();
            }
        }),
        sort: "username"
    }


    $("#grid").dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            insertUrl: UM,
            updateUrl: UM,
            deleteUrl: UM,
            loadUrl: UM,
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        }),
        editing: {
            allowUpdating: true,    
            allowDeleting: true,
            allowAdding: true
        },
        paging: {
            pageSize: 12
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [8, 12, 20]
        },
        columns: [{
            dataField: "id",
            dataType: "number",
            allowEditing: false
        },
        {
            dataField: "content"
        },
        {
            dataField: "sent_on",
            dataType: "date",
            format: "MM/dd/yyy hh:mm",
            allowUpdating: false,  
        },
        {
            dataField: "user_from_id",
            lookup:{
                    dataSource: lookupDataSource,
                valueExpr: "id",
                displayExpr: "username"
            }
        },
        {
            dataField: "user_to_id",
            lookup:{
                dataSource:lookupDataSource,
                valueExpr: "id",
                displayExpr: "username"
            }
        }],
    }).dxDataGrid("instance");



});

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== "";
}