
var map = L.map('mapid').setView([46.4, 3], 6);
var osmLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '(c) <a href="http://osm.org/copyright">OSM</a> contributors',
    maxZoom: 19
});
osmLayer.addTo(map);



var markers = L.markerClusterGroup({
    maxClusterRadius: function (zoom) {
        if (zoom <= 8) return 120;   
        if (zoom < 15) return 60;   
        return 0;                     
    },
    iconCreateFunction: function(cluster) {
        var childCount = cluster.getChildCount();
        return L.divIcon({
            html: `<div><span>${childCount}</span></div>`,
            className: 'marker-cluster',
            iconSize: L.point(40, 40)
        });
    }
});
map.addLayer(markers);
fetch("autoecoles_simplifiees.json")
.then(res => res.json())
.then(data => {
    data.forEach(school => {
        if (!school.location) return;
        let m = L.marker([school.location.lat, school.location.lon]);
        m.bindTooltip(school.name, { direction: "top" });
        let popup = `<strong>${school.name}</strong><br>${school.address}<br>${school.postalCode} ${school.city}`;
        m.bindPopup(popup);
        markers.addLayer(m);
    });
})
.catch(console.error);

map.addLayer(osmLayer);
fetch("regions.geojson")
    .then(response => response.json())
    .then(geojsonData => {
        const geojsonLayer = L.geoJSON(geojsonData, {
            style: {
                color: "green",        
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.1     
            },
            onEachFeature: function (feature, layer) {
                const regionName = feature.properties?.nom || "Région inconnue";
                layer.bindPopup(`<strong>${regionName}</strong>`);
                layer.bindTooltip(regionName, {
                    permanent: false,
                    direction: "center"
                });
            }
        }).addTo(map);

       
        
    })
    .catch(error => console.error("Erreur de chargement du GeoJSON :", error));

