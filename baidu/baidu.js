function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i< 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function calculateCenter(pointArray) {
    var total = pointArray.length;
    var X = 0, Y = 0, Z = 0;
    pointArray.forEach(function (lnglat) {
        var lng = lnglat.lng * Math.PI / 180;
        var lat = lnglat.lat * Math.PI / 180;
        var x, y, z;
        x = Math.cos(lat) * Math.cos(lng);
        y = Math.cos(lat) * Math.sin(lng);
        z = Math.sin(lat);
        X += x;
        Y += y;
        Z += z;
    });
    X = X / total;
    Y = Y / total;
    Z = Z / total;

    var Lng = Math.atan2(Y, X);
    var Hyp = Math.sqrt(X * X + Y * Y);
    var Lat = Math.atan2(Z, Hyp);
    console.log(Lng, Lat, Hyp);
    var c_lng=Lng * 180 / Math.PI;
    var c_lat=Lat * 180 / Math.PI;
    return new BMapGL.Point(c_lng,c_lat);
 }

function parsePointArray(pointArrayString){
    var pointArray=pointArrayString;
    console.log("pointArray length:" + pointArray.length);
    var bMapGLPointArray=[];
    $.each(pointArray,function(k,v){
        var pointLptArray=v.split(",");
        var lng=pointLptArray[0];
        var lat=pointLptArray[1];
        bMapGLPointArray.push(new BMapGL.Point(lng,lat));
    });
    return bMapGLPointArray;
}

function createPolygonByPointArrayString(pointArrayString,map){
    var pointArray=parsePointArray(pointArrayString);
    createPolygonByPointArray(pointArray,map);
}

function createPolygonByPointArray(pointArray,map){
    var polygon = new BMapGL.Polygon(pointArray, {
        strokeColor: "red",
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: 'blue',
        fillOpacity: 0.2
    }); //创建多边形
    map.addOverlay(polygon);
}

function createMarker(iconUrl,point,id,map){
    var centterPointMarker = new BMapGL.Marker(point,{id:id});
    var centterPointMarkerIcon = new BMapGL.Icon(iconUrl, new BMapGL.Size(52, 26));
    map.addOverlay(centterPointMarker,{icon: centterPointMarkerIcon});
}

function createPolygon(pointArray,opts,id,map){
    var polygon = new BMapGL.Polygon(pointArray, {
        strokeColor: "red",
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: opts.fillColor,
        fillOpacity: 0.2,
        id:id
    });
    // polygon.enableEditing();
    map.addOverlay(polygon);
}

function createLabel(point,text,id,map){
    var label = new BMapGL.Label(text, {
        position: point,
        offset: new BMapGL.Size(20, -20),
        id:id
    });
    label.setStyle({
        color: 'blue',
        borderRadius: '5px',
        borderColor: '#ccc',
        padding: '1px',
        fontSize: '14px',
        height: '20px',
        lineHeight: '20px',
        fontFamily: '微软雅黑'
    });
    map.addOverlay(label);
}

function createPolygonByPointJson(pointJson,map){
    pointJson.pointArray=parsePointArray(pointJson.raw);
    pointJson.centerPoint=calculateCenter(pointJson.pointArray);
    console.log(pointJson.label +" centerPoint lng :"+pointJson.centerPoint.lng+ ", lat : "+pointJson.centerPoint.lat);
    createPolygon(pointJson.pointArray,pointJson.polygonOpts,pointJson.id,map);
    createMarker("https://weBMapGL0.bdimg.com/image/api/marker_red.png",pointJson.centerPoint,pointJson.id,map);
    createLabel(pointJson.centerPoint,pointJson.label,pointJson.id,map);
}

function createPolygonByPointJsonArray(pointJsonArray,map){
    $.each(pointJsonArray,function(k,v){
        createPolygonByPointJson(v,map);
    });
}