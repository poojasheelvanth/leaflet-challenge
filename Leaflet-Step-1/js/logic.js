// Create the tile layer that will be the background of our map
var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 6,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 6,
  id: "mapbox.light",
  accessToken: API_KEY
});

const baseMaps = {
  lightmap: lightmap,
  Satellite: Satellite
};

// Initialize all of the LayerGroups we'll be using
var layers = {
  layer01: new L.LayerGroup(),
  layer12: new L.LayerGroup(),
  layer23: new L.LayerGroup(),
  layer34: new L.LayerGroup(),
  layer45: new L.LayerGroup(),
  layer5plus: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [39.876019, -117.224121],
  zoom: 12,
  layers: [
    layers.layer01,
    layers.layer12,
    layers.layer23,
    layers.layer34,
    layers.layer45,
    layers.layer5plus
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0-1": layers.layer01,
  "1-2": layers.layer12,
  "2-3": layers.layer23,
  "3-4": layers.layer34,
  "4-5": layers.layer45,
  "5+":layers.layer5plus
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var color = {
  layer01:  "green",
  layer12: "black",
  layer23: "pink",
  layer34: "yellow",
  layer45:"orange",
  layer5plus:"red"
};

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(EarthquakeData) {
  EarthquakeDataArray = EarthquakeData.features

    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    // var stationStatusCode;
    var EarthquakeRange;
          
    // Loop through the stations (they're the same size and have partially matching data)
    for (var i = 0; i < EarthquakeDataArray.length; i++) {
      var latitude =EarthquakeDataArray[i].geometry.coordinates[1];
      var longitude =EarthquakeDataArray[i].geometry.coordinates[0];
      var magnitude = EarthquakeDataArray[i].properties.mag;
   
      if (magnitude > 5)
      {
        EarthquakeRange="layer5plus";
      }
      else if (magnitude > 4)
      {
        EarthquakeRange="layer45";
      }
      else if(magnitude > 3)
      {
        EarthquakeRange="layer34";
      }
      else if(magnitude > 2)
      {
        EarthquakeRange="layer23";
      }
      else if(magnitude >1)
      {
        EarthquakeRange="layer12";
      }
      else
      {
        EarthquakeRange="layer01";
      }
      
    
    var newMarker = L.circleMarker([latitude, longitude],
      {radius: magnitude*10,
        fillOpacity: 0.75,
        fillColor: color[EarthquakeRange]});//  ,
      // {}
      // );

    newMarker.addTo(map);
  };

});
      
    

 
      //   // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    //   newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    // }

    // // Call the updateLegend function, which will... update the legend!
    // updateLegend(updatedAt, stationCount);



// Update the legend's innerHTML with the last updated time and station count
// function updateLegend(time, stationCount) {
//   document.querySelector(".legend").innerHTML = [
//     "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//     "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//     "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//     "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//     "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//     "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
//   ].join("");
// }
