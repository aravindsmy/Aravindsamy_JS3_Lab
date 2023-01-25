// declaring DOM elements
const iconElement = document.querySelector(".weahter-icon")
const tempElement = document.querySelector(".temparature-value")
const descElement = document.querySelector(".temparature-description p")
const hiLowElement = document.querySelector(".temparature-description span")
const locationElement = document.querySelector(".location p")
const currentDateElement = document.querySelector(".location span")
const notificationElement = document.querySelector(".notification")
var input = document.getElementById("search")

// weather object
const weather = {}
weather.temparature = {
    unit: "celsius"
}

// common variables
const date = new Date()
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const KELVIN = 273
const key = '57579b675fed232741edba555ca1e34a'

let city = ""
let latitude = 0.0
let longitude = 0.0
let day = days[date.getDay()]
let month = months[date.getMonth()]

// screen update delay function
function delay(callback, ms) {
    var timer = 0;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }

// search box input listener
input.addEventListener( "keyup", delay( function( event ) {

    if(event.isComposing) {
        event.preventDefault();
        return;
    }

    // search box main function to read city and display weather
    city = input.value
    if ( city === "" ) {
        if ( latitude === 0.0 || longitude === 0.0 ) {
            runWeather()
        } else {
            getWeather( latitude, longitude )
        }
    } else {
        getSearchWeather( city )
        console.log( city )
    }
    
}, 300))

// main function of the application
function runWeather() {

    if ( input.value !== "") {
        return;
    }

    if ( 'geolocation' in navigator ) {
        navigator.geolocation.getCurrentPosition( setPostion, showError )
        
    } else {
        notificationElement.style.display = 'block'
        notificationElement.innerHtml = '<p> Browser doesn\'t support Geolocation</p>'

    }
}

// sub function of the runWeather function
function setPostion( position ) {

    latitude = position.coords.latitude
    longitude = position.coords.longitude

    getWeather( latitude, longitude )
}

// apply error message to the DOM
function showError( error ) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`
}

// function to fetch the weather data when a city name is entered in the search box
function getSearchWeather( city ) {
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`

    fetch( api )
    .then( function( response ) {
        let data = response.json();
        return data;
    })
    .then( function( data ) {
            weather.temparature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description
            weather.city = data.name;
            weather.country = data.sys.country
            weather.min = Math.floor( data.main.temp_min - KELVIN );
            weather.max = Math.floor( data.main.temp_max - KELVIN );
    })
    .then(function() {
            displayWeather();
    })
}

// function to fetch the local weather data based the the user's location
function getWeather( latitude, longitude ) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch( api )
    .then( function( response ) {
        let data = response.json();
        return data;
    })
    .then( function( data ) {
            weather.temparature.value = Math.floor( data.main.temp - KELVIN );
            weather.description = data.weather[0].description
            weather.city = data.name;
            weather.country = data.sys.country
            weather.min = Math.floor( data.main.temp_min - KELVIN );
            weather.max = Math.floor( data.main.temp_max - KELVIN );
    })
    .then( function() {
            displayWeather();
    })
}

// function to display weather information in the UI
function displayWeather() {
    tempElement.innerHTML = `<p>${weather.temparature.value} °<span>C</span></p>`
    descElement.innerHTML = weather.description
    currentDateElement.innerHTML = `${day} ${date.getDate()} ${month} ${date.getFullYear()}`
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
    hiLowElement.innerHTML = `${weather.min}°C / ${weather.max}°C`
}

runWeather() // main function call // initial function