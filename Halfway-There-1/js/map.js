// function getUserPos(centerMapCallback) {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (pos) {
//       let lat = pos.coords.latitude;
//       let lng = pos.coords.longitude;
//       let position = { lat, lng };
//       centerMapCallback(position);
//     });
//   }
// }

// function centerMap(position) {
//   var map = L.map("map").setView([position.lat, position.lng], 9);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   }).addTo(map);
/// }

let marker1 = null;
let marker2 = null;
let markerMid = null;
let circle = null;

var map = L.map("map").setView([37.0902, -95.7129], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

google.maps.event.addListener(
  address1Autocomplete,
  "place_changed",
  function () {
    if (marker1 != null) {
      map.removeLayer(marker1);
    }
    getLocation(address1.value, function (location) {
      // do something with location
      let location1 = location;
      console.log(location1);
      addMarker1();
      if (markerMid != null) {
        map.removeLayer(markerMid);
        map.removeLayer(circle);
      }
      if (marker2 != null) {
        addMarkerMid();
      }
    });
  }
);

google.maps.event.addListener(
  address2Autocomplete,
  "place_changed",
  function () {
    if (marker2 != null) {
      map.removeLayer(marker2);
    }
    getLocation(address2.value, function (location) {
      // do something with location
      let location2 = location;
      console.log(location2);
      addMarker2();
      if (markerMid != null) {
        map.removeLayer(markerMid);
        map.removeLayer(circle);
      }
      if (marker1 != null) {
        addMarkerMid();
      }
    });
  }
);

function addMarker1() {
  marker1 = L.marker([location1.lat, location1.lng])
    .addTo(map)
    .bindPopup("Location 1")
    .openPopup();
  map.panTo([location1.lat, location1.lng]);
}

function addMarker2() {
  marker2 = L.marker([location2.lat, location2.lng])
    .addTo(map)
    .bindPopup("Location 2")
    .openPopup();
  map.panTo([location2.lat, location2.lng]);
}

function addMarkerMid() {
  markerMid = L.marker([midLat, midLng])
    .addTo(map)
    .bindPopup("Midpoint")
    .openPopup();
  circle = L.circle([midLat, midLng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.3,
    radius: selectedRadius.value * 1609.34,
  }).addTo(map);
  map.panTo([midLat, midLng]);
}

selectedRadius.addEventListener("change", function () {
  console.log("radius changed");
  if (circle != null) {
    map.removeLayer(circle);
  }

  circle = L.circle([midLat, midLng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.3,
    radius: selectedRadius.value * 1609.34,
  }).addTo(map);
});
