// ///////////////////////////////////////////////////////
// // DISPLAY CENTER POINT NEARBY LOCATIONS
// ///////////////////////////////////////////////////////

const apiKey = `APIKEY`;
const placesBtn = document.getElementById("places-btn");
const displayPlaces = document.getElementById("display-places");
const newSearchBtn = document.getElementById("new-search-btn");

// Reset search option

const init = function () {
  address1Textbox.value = address2Textbox.value = "";
  displayPlaces.innerHTML = "";
};
init();

// Radius Selection for displaying results
let selectedRadius = document.getElementById("radiusSelector");
const radiusDisplay = document.getElementById("radiusDisplay");

radiusDisplay.innerHTML = `${selectedRadius.value} miles`;

selectedRadius.addEventListener("input", function () {
  radiusDisplay.innerHTML = `${selectedRadius.value} miles`;
});

var service = new google.maps.places.PlacesService(displayPlaces);
const results = [];

// Show and remove progress bar
const progressBar = document.querySelector(".progress");

const showProgressBar = function () {
  progressBar.classList.remove("hidden");
};

const removeProgressBar = function () {
  progressBar.classList.add("hidden");
};

// Requesting search results
placesBtn.addEventListener("click", function () {
  init();
  showProgressBar();
  displayPlaces.innerHTML = `<h1><div class="alert alert-danger" role="alert">
  <strong>Oh snap!</strong>
  Your search did not return any results,
  enter a new address and again.
</div></h1>`;
  const request = {
    location: new google.maps.LatLng(midpoint.midLat, midpoint.midLng),
    radius: `${selectedRadius.value * 1609.34}`,
    type: ["restaurant"],
  };

  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + "%";
    }
  }
  service.nearbySearch(request, callback);
  displayResults();
});

function callback(response, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    results.push(...response);
  }
  if (pagination.hasNextPage) {
    setTimeout(() => pagination.nextPage(), 2000);
  } else {
    displayResults();
  }
}
function displayResults() {
  results
    .sort((a, b) => (a.rating > b.rating ? -1 : 1))
    .forEach((result, index) => {
      if (result.photos) {
        displayPlaces.innerHTML += `<div class="card display-items">
        <img class="display-images"
        src="${
          result.photos[0].getUrl({ maxWidth: 300 }) ?? "images/google.png"
        }" />
        <div class="card-body display-card-body">${result.name} <br> Rating:
        ${result.rating ?? "No Ratings"}
        </div>
        <li><p class="text-capitalize">${result.types[0].replaceAll(
          "_",
          " "
        )}</p></li>
          <button type="button" id="moreDetails" class="btn btn-outline-dark" data-toggle="modal" data-target="#exampleModalCentered" onClick="getDetails(${index})">More Information</button>
        `;
        console.log(result);
      } else {
        displayPlaces.innerHTML += `<div class="card display-items">
        <img class="display-images"
        src="images/google.png"/>
        <div class="card-body display-card-body">${result.name}<br> Rating:
        ${result.rating ?? "No Ratings"}
        </div>
        <li><p class="text-capitalize">${result.types[0].replaceAll(
          "_",
          " "
        )}</p></li>
          <button type="button" id="moreDetails" class="btn btn-outline-dark" data-toggle="modal" data-target="#exampleModalCentered" onClick="getDetails('${
            result.rating
          }')">More Information</button>
 
        `;
        console.log(result);
        removeProgressBar();
      }
    });
}

// placesBtn.addEventListener("click", init);

// //////////////////////////////////////////////////////
// // OPEN AND CLOSE POP UP WINDOW
// //////////////////////////////////////////////////////

const modalHeading = document.getElementById("exampleModalCenteredLabel");
const modalBody = document.getElementById("modal-body");
const modalFooter = document.getElementById("modal-footer");
const displayMiles = document.getElementById("display-miles");
const displayMilesTwo = document.getElementById("display-miles-two");

let placeAddressLat = null;
let placeAddressLng = null;

function getDetails(index) {
  let place = results[index];

  placeAddressLat = place.geometry.viewport.Ab.h;
  placeAddressLng = place.geometry.viewport.Ua.h;

  console.log(
    `${placeAddressLat}, ${placeAddressLng} are the lat and long of locaiton`
  );
  getDistance1(location1Lat, location1Lng, placeAddressLat, placeAddressLng);
  getDistance2(location2Lat, location2Lng, placeAddressLat, placeAddressLng);

  modalHeading.innerHTML = `${place.name}<br>
            
            ${place.rating ?? "No Ratings"}`;

  modalBody.innerHTML = `<li><img src="${
    place.photos[0].getUrl({
      maxWidth: 300,
    }) ?? ""
  }" /></li>
              <p>${place.business_status.replaceAll("_", " ")}</p>
            <li>
              <p class="text-capitalize">${place.types[0].replaceAll(
                "_",
                " "
              )}</p>
            <li><b id="vicinity">${place.vicinity}<b/></li>
            `;
  modalFooter.innerHTML = `<div class="toolTip"><button type="button" class="btn btn-primary" onClick="copyLink('${place.vicinity}')">Copy Address</button></div>
  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;

  // STAR RATING SYSTEM
  const ratings = `${place.rating}`;
  // Total Stars
  const starsTotal = 5;
  // Run getRatings when DOM loads
  document.addEventListener("DOMContentLoaded", getRatings);
  getRatings();
  // Get ratings
  function getRatings() {
    for (let rating in ratings) {
      // Get percentage
      const starPercentage = (ratings / starsTotal) * 100;
      const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
      console.log(starPercentageRounded);

      document.querySelector(`.stars-inner`).style.width =
        starPercentageRounded;
    }
  }
}

function getDistance1(
  location1Lat,
  location1Lng,
  placeAddressLat,
  placeAddressLng
) {
  lon1 = (location1Lng * Math.PI) / 180;
  lon2 = (placeAddressLng * Math.PI) / 180;
  lat1 = (location1Lat * Math.PI) / 180;
  lat2 = (placeAddressLat * Math.PI) / 180;

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;

  console.log(`${dlon} is the dlon`);
  console.log(`${dlat} is the dlat`);

  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));
  let r = 3956;
  var abc = c * r;
  var roundABC = Math.round(abc * 10) / 10;

  console.log(`${roundABC} these are the miles`);
  return (displayMiles.innerHTML = `${roundABC} miles away from Location 1`);
}

function getDistance2(
  location2Lat,
  location2Lng,
  placeAddressLat,
  placeAddressLng
) {
  lon3 = (location2Lng * Math.PI) / 180;
  lon4 = (placeAddressLng * Math.PI) / 180;
  lat3 = (location2Lat * Math.PI) / 180;
  lat4 = (placeAddressLat * Math.PI) / 180;

  let dlon2 = lon4 - lon3;
  let dlat2 = lat4 - lat3;

  console.log(`${dlon2} is the dlon2`);
  console.log(`${dlat2} is the dlat2`);

  let b =
    Math.pow(Math.sin(dlat2 / 2), 2) +
    Math.cos(lat3) * Math.cos(lat4) * Math.pow(Math.sin(dlon2 / 2), 2);

  let d = 2 * Math.asin(Math.sqrt(b));
  let q = 3956;
  var efg = d * q;
  var roundEFG = Math.round(efg * 10) / 10;

  console.log(`${roundEFG} these are the miles`);
  return (displayMilesTwo.innerHTML = `${roundEFG} miles away from Location 2`);
}

// COPY ADDRESS TO CLIPBOARD
const copied = document.getElementById("copied");

function copyLink() {
  console.log(vicinity);
  let myToolTip = vicinity[0].outerText;
  navigator.clipboard.writeText(myToolTip);
  copied.innerHTML = "The address is copied to your clipboard";
}
