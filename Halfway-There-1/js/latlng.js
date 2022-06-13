// //////////////////////////////////////////////////////
// // GET LATITUDE AND LONGITUDE
// ///////////////////////////////////////////////////////
let address1Textbox = document.getElementById("address1");
let address2Textbox = document.getElementById("address2");
const apikey = `APIKEY`;

//Links the Google Places autocomplete API to the corresponding input text field

let address1Autocomplete = new google.maps.places.Autocomplete(
  document.getElementById("address1")
);

let address2Autocomplete = new google.maps.places.Autocomplete(
  document.getElementById("address2")
);

let location1 = null;
let location2 = null;
let midpoint = null;
let midLat = null;
let midLng = null;

let location1Lat = null;
let location1Lng = null;
let location2Lat = null;
let location2Lng = null;

google.maps.event.addListener(
  address1Autocomplete,
  "place_changed",
  function () {
    getLocation(address1.value, function (location) {
      // do something with location
      location1 = location;
      if (location2 != null) {
        midpoint = findMid(
          location1.lat,
          location1.lng,
          location2.lat,
          location2.lng
        );
      }
      location1Lat = location1.lat;
      location1Lng = location1.lng;
    });
  }
);

google.maps.event.addListener(
  address2Autocomplete,
  "place_changed",
  function () {
    getLocation(address2.value, function (location) {
      // do something with location
      location2 = location;
      if (location1 != null) {
        midpoint = findMid(
          location1.lat,
          location1.lng,
          location2.lat,
          location2.lng
        );
      }
      location2Lat = location2.lat;
      location2Lng = location2.lng;
    });
  }
);

// Promise.all- Will fire when multiple promises are completed

function getLocation(address, locationCallback) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result.results[0].geometry.location);
      locationCallback(result.results[0].geometry.location);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//Calculate the midpoint given the coordinates from 2 locations

function findMid(lat1, lng1, lat2, lng2) {
  midLat = (lat1 + lat2) / 2;
  midLng = (lng1 + lng2) / 2;
  // console.log({ midLat, midLng });
  return { midLat, midLng };
}
