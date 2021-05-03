var totalCardCounter = 0;
function generateURLS(){
    var urls = [];
    var apiStockImages = 'https://api.pexels.com/v1/search?query=coffee&orientation=square&per_page=80';
    var stockImages = new XMLHttpRequest();
    stockImages.open('GET', apiStockImages, true);
    stockImages.setRequestHeader("Authorization", '563492ad6f917000010000014046f39edfd340a095a45054c08529e4'); // Authenticate
    stockImages.onload = function () {
    // Parse API response into JSON object
        var images = JSON.parse(this.response);
        console.log(images)
        // For each place in data, create a coffee shop information card
        var ctr = 0;
        if (stockImages.status >= 200 && stockImages.status < 400) { // Check status
            images.photos.forEach(photo => {
                urls.push(photo.src.original);
                if (urls[urls.length - 1] ==  undefined && totalCardCounter > ctr){
                    urls.pop();
                }
                ctr = ctr + 1;
            });
        }
    }
    stockImages.send();
    return urls;
}
var urls = generateURLS();
var photocounter = 0;
function clearWeather(){
    document.getElementById("weather-forecast").innerHTML = "";
}
var photoIndexer = 0;
function weatherAPI(lat, lon){
    clearWeather();
    const page = document.getElementById('weather-forecast');
    const weather = document.createElement('div');
    weather.setAttribute('class', 'weather');
    page.appendChild(weather);

    // Open Weather API key
    const weatherKey = '99ec418d5e9256f401c64d567c44852c';

    // User info

    // Get weather for user's zipcode
    var apiWeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=imperial&appid=99ec418d5e9256f401c64d567c44852c';
    var weatherRequest = new XMLHttpRequest();
    weatherRequest.open('GET', apiWeatherRequest, true);
    weatherRequest.onload = function() {
    if (weatherRequest.status >= 200 && weatherRequest.status < 400) { // Check status
        var info = JSON.parse(this.response);

        var name = document.createElement('h2');
        name.setAttribute('class', 'h2');
        name.textContent = info.name;

        // var description = document.createElement('h2');
        // description.setAttribute('class', 'h2');
        // description.textContent = info.weather[0].description;
        
        var feelsLike = document.createElement('h2');
        feelsLike.setAttribute('class', 'h2');
        feelsLike.textContent = info.main.feels_like + " degrees  -  " + info.weather[0].description;

        // container.appendChild(description);
        weather.appendChild(name);
        // weather.appendChild(description);
        weather.appendChild(feelsLike);

    } else {
        console.log('help');
    }
    }
    weatherRequest.send();
}

function clearFunction(){
    document.getElementById("Coffee-Shop-Cards").innerHTML = "";
}
var user_input = false;
const apiKey1 = 'prj_live_pk_32283390146f458ed6a90d2499e7bff510911e0f';
const apiKey2 = 'prj_live_pk_23df5458b5a74786d198439bd07c5eec73988360';
var zip;
const cow = document.getElementById('location');
const loc = document.createElement('input');
loc.setAttribute('class', 'zipcode');
var ctr =0;
function myFunction() {
    clearFunction();

    var zip = document.getElementById("zipcode").value;

    var apiForwardGeocode = "https://api.radar.io/v1/geocode/forward?query=" + zip;
    var forwardGeocodeRequest = new XMLHttpRequest();
    forwardGeocodeRequest.open('GET', apiForwardGeocode, true);
    forwardGeocodeRequest.setRequestHeader("Authorization", apiKey1); // Authenticate
 
    // Get name and location of each shop
    forwardGeocodeRequest.onload = function () {

        // Parse API response into JSON object
        var data = JSON.parse(this.response);

        // For each place in data, create a coffee shop information card
        if (forwardGeocodeRequest.status >= 200 && forwardGeocodeRequest.status < 400) { // Check status
            // console.log("lat: " + data.addresses[0].latitude)
            var manualLatitude = data.addresses[0].latitude;
            // console.log("long: " + data.addresses[0].longitude)
            var manualLongitude = data.addresses[0].longitude;
            weatherAPI(manualLatitude, manualLongitude);
            var user_inputted_location = manualLatitude + "%2C" + manualLongitude;
            user_input = true;
            myFunction2(user_inputted_location, user_input);
        }else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Search API is not working!`;
            document.body.appendChild(errorMessage);
        }
    }
    forwardGeocodeRequest.send();
}

function myFunction2(user_inputted_location){
// Unsplash API request stores images in urls array
// var urls = [];
// var apiStockImages = 'https://api.pexels.com/v1/search?query=cafe&orientation=square&per_page=80';
// var stockImages = new XMLHttpRequest();
// stockImages.open('GET', apiStockImages, true);
// stockImages.setRequestHeader("Authorization", '563492ad6f917000010000014046f39edfd340a095a45054c08529e4'); // Authenticate
// stockImages.onload = function () {
// // Parse API response into JSON object
//     var images = JSON.parse(this.response);
//     console.log(images)
//     // For each place in data, create a coffee shop information card
//     var ctr = 0;
//     if (stockImages.status >= 200 && stockImages.status < 400) { // Check status
//         images.photos.forEach(photo => {
//             urls.push(photo.src.original);
//             if (urls[urls.length - 1] ==  undefined && totalCardCounter > ctr){
//                 urls.pop();
//             }
//             ctr = ctr + 1;
//         });
//     }
// }
// stockImages.send();

// Build HTML page
const app = document.getElementById('Coffee-Shop-Cards');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

// User information
// var user_loc = '29.707437%2C-95.550975';

// Radar API key
const apiKey1 = 'prj_live_pk_32283390146f458ed6a90d2499e7bff510911e0f';
const apiKey2 = 'prj_live_pk_23df5458b5a74786d198439bd07c5eec73988360';

// Build 'Search Places' API request
var apiSearchRequest = 'https://api.radar.io/v1/search/places?chains=starbucks%2Cdunkin-donuts%2Cdutch-bros-coffee&categories=cafe%2Cdessert-restaurant%2Ccoffee-shop%2Cirish-pub%2Cbubble-tea-shop%2Cdonut-shop&near=' + user_inputted_location;
var searchRequest = new XMLHttpRequest();
searchRequest.open('GET', apiSearchRequest, true);
searchRequest.setRequestHeader("Authorization", apiKey1); // Authenticate
// Get name and location of each shop
searchRequest.onload = function () {
    // Parse API response into JSON object
    var data = JSON.parse(this.response);
    var index = 0;

    // For each place in data, create a coffee shop information card
    if (searchRequest.status >= 200 && searchRequest.status < 400) { // Check status
        data.places.forEach(place => {
            // Create post
            totalCardCounter = totalCardCounter + 1;
            const post = document.createElement('div');
            post.setAttribute('class', 'post');
            // Put name of shop in h2
            const h2 = document.createElement('h2');
            h2.textContent = place.name;
            const h3 = document.createElement('h3');

            // Create content of post dropdown
            const content1 = document.createElement('content1');
            content1.setAttribute('class', 'content');
            const content2 = document.createElement('content2');
            content2.setAttribute('class', 'content');
            // Set text content for card dropdown
            content1.textContent = "Categories: " + place.categories;
            // If shop has a domain
            if (place.hasOwnProperty('chain')) {
                content2.textContent = "Website: " + place.chain.domain;
            }

            // Request address of shop location
            // apiAddressRequest = 'https://api.radar.io/v1/geocode/reverse?coordinates=40.7039%2C-73.9867';
            apiAddressRequest = 'https://api.radar.io/v1/geocode/reverse?coordinates=' + place.location.coordinates[1] + '%2C' + place.location.coordinates[0];
            var addressRequest = new XMLHttpRequest();
            addressRequest.open('GET', apiAddressRequest, true);
            addressRequest.setRequestHeader("Authorization", apiKey2); // Authenticate
            addressRequest.onload = function() {
                if (distRequest.status >= 200 && distRequest.status < 400) { // Check status
                    var address = JSON.parse(this.response);
                    h3.textContent = address.addresses[0].addressLabel;
                } else {
                    h3.textContent = 'Loading...';
                }
            }
            addressRequest.send();

            // Request distance from user_loc to current shop location
            apiDistRequest = 'https://api.radar.io/v1/route/distance?origin=' + user_inputted_location + '&destination='+ 
            place.location.coordinates[1] + '%2C+' + place.location.coordinates[0] +'&modes=car&units=imperial';
            var distRequest = new XMLHttpRequest();
            distRequest.open('GET', apiDistRequest, true);
            distRequest.setRequestHeader("Authorization", apiKey1); // Authenticate
            // Get distance with API distance request
            distRequest.onload = function () {
                var data = JSON.parse(this.response);
                if (distRequest.status >= 200 && distRequest.status < 400) { // Check status
                    const span = document.createElement('span'); //fills span with the distance
                    span.setAttribute('class', 'span'); //fills span with the distance
                    span.textContent = data.routes.car.distance.text; //fills span with the distance
                    post.appendChild(span);

                    // 1. Creates button
                    var button = document.createElement("button");
                    button.innerHTML = "Read more...";
                    button.setAttribute('class', 'collapsible');
                    button.appendChild(content1);
                    button.appendChild(content2);

                    // 2. Add event listener
                    button.addEventListener("click",function(){
                        if (content1.style.display === "block") {
                            content1.style.display = "none";
                            content2.style.display = "none";
                        } else {
                            content1.style.display = "block";
                            content2.style.display = "block";
                        }
                    })
                    // 3. Append somewhere
                    var body = document.getElementsByClassName("collapsible");
                    post.appendChild(button);
                } else {
                    const span = document.createElement('span'); //fills span with the distance
                    span.setAttribute('class', 'span'); //fills span with the distance
                    span.textContent = '0.8 mi'; //fills span with the distance
                    post.appendChild(span);

                    // 1. Creates button
                    var button = document.createElement("button");
                    button.innerHTML = "Read more...";
                    button.setAttribute('class', 'collapsible');
                    button.appendChild(content1);
                    button.appendChild(content2);

                    // 2. Add event listener
                    button.addEventListener("click",function(){
                        if (content1.style.display === "block") {
                            content1.style.display = "none";
                            content2.style.display = "none";
                        } else {
                            content1.style.display = "block";
                            content2.style.display = "block";
                        }
                    })
                    // 3. Append somewhere
                    var body = document.getElementsByClassName("collapsible");
                    post.appendChild(button);
                }
            }
            distRequest.send();

            var asadad = 0
            while (asadad < urls.length ){
            console.log (asadad + " : " + urls[asadad])
            asadad= asadad + 1;
}
            // Get stock images from Unsplash API
            var imgurl = urls[photocounter];
            // console.log(imgurl)
            var oImg = document.createElement("img");
            oImg.setAttribute('src', imgurl);
            oImg.setAttribute('height', '690');
            oImg.style.objectFit = 'cover';
            post.appendChild(oImg);    
            photocounter = photocounter + 1;
            if (photocounter > 40){
                photocounter = 0;
            }

            // Build post
            container.appendChild(post);
            post.appendChild(h2);
            post.appendChild(h3);
            index ++;
            // console.log(totalCardCounter);
        });
    } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Search API is not working!`;
        document.body.appendChild(errorMessage);
    }
} // End of SEARCH API REQUEST
searchRequest.send();
}