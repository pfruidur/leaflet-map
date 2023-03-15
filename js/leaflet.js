/*
HACER ATRIBUCIONES A IGN PNOA Y OSM. 

INTENTAR AÑADIR CAPA PARQUES DESDE OVERLAYS.
 */

var map = L.map('map', {
    center: [37.3834527494921, -5.969965399261345],
    zoom: 13
});

//ESTILOS
var iconoBici = L.icon({
    iconUrl: './img/marker-sevici.png',
    iconSize: [27, 35],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30]
});

function createCustomIcon(feature, latlng) {
    var iconoParque = L.icon({
        iconUrl: './img/marker-parque.png',
        iconSize: [27, 40],
        iconAnchor: [13, 34],
        popupAnchor: [0, -30]
    })
    return L.marker(latlng, { icon: iconoParque })
};

 
var omnivoreStyleHelper = L.geoJSON(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: iconoBici });
    }
});

//CAPAS

var baseIGN = L.tileLayer('https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg', {
    maxZoom: 17,
    attribution: 'PENDIENTE https://www.idee.es/web/idee/segun-tipo-de-servicio IGN'
}).addTo(map);

var pnoa = L.tileLayer('https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg', {
    maxZoom: 19,
    attribution: 'PENDIENTE https://www.idee.es/web/idee/segun-tipo-de-servicio PNOA'
});

var zonasVerdes = L.tileLayer.wms("http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Zonas_Verdes_Publicas?", {
    layers: 'zonas_verdes',
    format: 'image/png',
    transparent: true,
    attribution: 'Consejería de Agricultura, Ganadería, Pesca y Desarrollo Sostenible. IDEAndalucia',
    maxZoom: 17
});

var capaEdicion = new L.FeatureGroup().addTo(map);
map.on('draw:created', function (evento) {
    var layer = evento.layer;
    capaEdicion.addLayer(layer);
});

var osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 0, maxZoom: 10, attribution: 'osmAttrib' });

console.log('falta por cargar parques')

var parques = L.geoJSON(parquesjson, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            '<b>Nombre: </b>' + feature.properties.nombre + '<br><b>Categoría: </b>' + feature.properties.categoria + '<br><b>Superficie: </b>' + feature.properties.superficie);
    },
    pointToLayer: createCustomIcon
}).addTo(map);

console.log('cargadas todas menos omnivore')

var estacionesSevici = omnivore.kml('datos/estaciones_sevici.kml', null, omnivoreStyleHelper)
    .on('ready', function () {
        estacionesSevici.eachLayer(function (layer) {
            layer.bindPopup(layer.feature.properties.Direccion);
        });
    });

console.log('todas las capas cargadas')


//Controles

L.control.scale({
    position: 'bottomleft',
    imperial: false
}).addTo(map);

var baseMaps = {
    "Mapa Base del IGN": baseIGN,
    "PNOA (máxima actualidad)": pnoa
}

var overlays = {
    "Zonas verdes públicas (2005)": zonasVerdes,
    "Estaciones SEVICI": estacionesSevici
    /* "Parques urbanos y Jardines históricos": parquesjson */
};

console.log('Cargado overlays');

L.control.layers(baseMaps, overlays).addTo(map);

console.log('Cargado control');

var drawControl = new L.Control.Draw({
    position: 'bottomleft',
    draw: {
        circle: false,
        rectangle: false,
        polygon: {
            shapeOptions: {
                color: '#007a33',
                weight: 10,
            }
        }
    },
    edit: {
        featureGroup: capaEdicion
    }
});
console.log('Cargado draw control')

L.control.locate().addTo(map);

var miniMap = new L.Control.MiniMap(osm).addTo(map);

map.addControl(drawControl);

