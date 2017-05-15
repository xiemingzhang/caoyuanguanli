//
// map Base clss
//
define(["dijit/layout/LayoutContainer", "dijit/layout/ContentPane", "dijit/Toolbar", "esri/toolbars/navigation", "dijit/form/Button","dijit/registry",
    "dojo/dom-construct", "dojo/on", "dojo/dom", "dojo/query", "dojo/_base/array", "esri/map", "esri/basemaps", "esri/layers/ArcGISTiledMapServiceLayer"],
 function (LayoutContainer, ContentPane, Toolbar, Navigation, Button, registry, domConst, on,sdom, query, array, map, esriBasemaps,
     ArcGISTiledMapServiceLayer) {
     _consLayout();

    var BaseMap = {
        CreateNew: function () {
            var _BaseMap = {
                FeatureLayer:null,
                InfoTemplate:null
            };
            _BaseMap.Dom = sdom;
            _BaseMap.domConstruct = domConst;

            //create a new esriMap object
            _BaseMap.Map = new map("mapDiv", {
                showLabels: true,
                autoResize: true,
                logo: false,
                slider: true
            });
            
            _BaseMap.LoadBaseMap = function (BaseMapUrl) {

                esriBasemaps.bmap = {
                    baseMapLayers: [{ url: BaseMapUrl }],
                    title: "bmap"
                };
                //initiate the esriMap object newly created
                with (_BaseMap.Map) {
                    setBasemap("bmap"),
                    showLabels = true
                }

                //attach map "mouse-move" event with function
                _BaseMap.Map.on("mouse-move", function (evt) {
                    try {
                        var mapPoint = evt.mapPoint;
                        var strHtml = "X:" + mapPoint.x.toFixed(8) + "<br/>";
                        strHtml += "Y:" + mapPoint.y.toFixed(8) + "<br/>";
                        sdom.byId("CurCoor").innerHTML = strHtml;
                    } catch (e) {

                    }
                });
                _initToolbar(_BaseMap.Map, _BaseMap.FeatureLayer, _BaseMap.InfoTemplate);
            };

            _BaseMap.addLayer = function (pLayer) {
                _BaseMap.Map.addLayer(pLayer);
            };

            _BaseMap.SetToolbarInfoTemplate=function(pLayer,pInfoTemp)
            {
                _BaseMap.FeatureLayer = pLayer;
                _BaseMap.InfoTemplate = pInfoTemp;

                _initToolbar(_BaseMap.Map, _BaseMap.FeatureLayer, _BaseMap.InfoTemplate);
            }

            return _BaseMap;
        }
    };

    return BaseMap;

    function _consLayout() {
        // create a LayoutContainer as the top widget in the hierarchy
        lc = new LayoutContainer({
            style: "height: 100%; width: 100%;"
        }, "Layout");

        // create a ContentPane as the left pane in the LayoutContainer
        var cpTop = new ContentPane({
            region: "top",
            style: "padding:0px;"
        });

        cpTop.addChild(_creatToolBar());
        lc.addChild(cpTop);

        // create a ContentPane as the center pane in the LayoutContainer
        var cpCenter = new ContentPane({
            region: "center",
            content: "<div id='mapDiv' style='width: 100%; height: 100%'></div>",
            style: "padding:0px;"
        });


        //create a ContentPane for displaying current coordinate of the cursor
        var cpDispCoordinate = new ContentPane({
            id: "CpCoordinate",
            content: "<div id='CurCoor'></div>",
            style: "padding:0px; position:absolute;right:6px;bottom:4px;"
        });

        cpCenter.addChild(cpDispCoordinate);

        lc.addChild(cpCenter);


        // put the top level widget into the document, and then call startup() 
        lc.placeAt(document.body);
        lc.startup();
    };

    function _initToolbar(map, oLyrMonitorSite, oInfoTemplate) {
        var navToolbar = new Navigation(map);
        on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);

        registry.byId("zoomin").on("click", function () {
            if (oLyrMonitorSite != null)
            {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.activate(Navigation.ZOOM_IN);
        });

        registry.byId("zoomout").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.activate(Navigation.ZOOM_OUT);
        });

        registry.byId("zoomfullext").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.zoomToFullExtent();
        });

        registry.byId("zoomprev").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.zoomToPrevExtent();
        });

        registry.byId("zoomnext").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.zoomToNextExtent();
        });

        registry.byId("pan").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
            navToolbar.activate(Navigation.PAN);
        });

        registry.byId("dinfo").on("click", function () {
            if (oLyrMonitorSite != null && oInfoTemplate !=null) {
                oLyrMonitorSite.setInfoTemplate(oInfoTemplate);
            }
        });
        registry.byId("print").on("click", function () {
            if (oLyrMonitorSite != null) {
                oLyrMonitorSite.setInfoTemplate(null);
            }
        });

        function extentHistoryChangeHandler() {
            registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
            registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
        }
    }

    function _creatToolBar() {
        var toolbar = new Toolbar({
            style: "padding:0px;"
        });

        var btnZoomIn = new Button({
            id: "zoomin",
            showLabel: true,
            label: "放大",
            tooltip: "放大",
            iconClass: "zoominIcon",
            type: "button"
        });
        var btnZoomOut = new Button({
            id: "zoomout",
            showLabel: true,
            label: "缩小",
            tooltip: "缩小",
            iconClass: "zoomoutIcon",
            type: "button"
        });
        var btnZoomFullScreen = new Button({
            id: "zoomfullext",
            showLabel: true,
            label: "全图",
            tooltip: "全图",
            iconClass: "zoomfullextIcon",
            type: "button"
        });
        var btnZoomPrevious = new Button({
            id: "zoomprev",
            showLabel: true,
            label: "前一视图",
            tooltip: "前一视图",
            iconClass: "zoomprevIcon",
            type: "button"
        });
        var btnZoomNext = new Button({
            id: "zoomnext",
            showLabel: true,
            label: "下一视图",
            tooltip: "下一视图",
            iconClass: "zoomnextIcon",
            type: "button"
        });
        var btnZoomPan = new Button({
            id: "pan",
            showLabel: true,
            label: "平移",
            tooltip: "平移",
            iconClass: "panIcon",
            type: "button"
        });
        var btnZoomInfo = new Button({
            id: "dinfo",
            showLabel: true,
            label: "信息",
            tooltip: "信息",
            iconClass: "infoIcon",
            type: "button"
        });
        var btnZoomPrint = new Button({
            id: "print",
            showLabel: true,
            label: "打印",
            tooltip: "打印",
            iconClass: "printIcon",
            type: "button"
        });

        toolbar.addChild(btnZoomIn);
        toolbar.addChild(btnZoomOut);
        toolbar.addChild(btnZoomFullScreen);
        toolbar.addChild(btnZoomPrevious);
        toolbar.addChild(btnZoomNext);
        toolbar.addChild(btnZoomPan);
        toolbar.addChild(btnZoomInfo);
        toolbar.addChild(btnZoomPrint);

        return toolbar;
    }
});