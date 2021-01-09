let place_div= document.getElementById("place");
let icon_div= document.getElementById("weather_icon");
let basic_info = document.querySelector(".basic_info");//container with place,icon,temps,description
let extra_info = document.querySelector(".extra_info");//container with place,icon,temps,description
let temp_div= document.querySelector(".temp");
let max_temp= document.querySelector(".max_temp");
let min_temp= document.querySelector(".min_temp");
let descr_div= document.querySelector(".description");
// Grab metriseis
let humidity_div = document.querySelector(".humidity");
let rise_set_div = document.querySelector(".rise_set");
let wind_div = document.querySelector(".wind");
let feels_like_div = document.querySelector(".feels_like");
let pressure_div = document.querySelector(".pressure");
let visibility_div = document.querySelector(".visibility");

let lat;
let long;



// check if browser allows location service
if(navigator.geolocation){
    console.log('ok');
    navigator.geolocation.getCurrentPosition(success,failure);
    // this function works with callbacks functions success and failure
    
}else{
    console.log('There is something wrong with the browser location service')
}
// do that if user allowed location 
function success(pos){
    lat = pos.coords.latitude; // get latitude
    lon = pos.coords.longitude; // get longitude 
    
    console.log(lat);
    console.log(lon);

    // Fetch the API
    API_key = '71a2ed3718cceb5b76eb2275193f9da0'; // this key is provided by Open Weather Map
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`)
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        // Take data i want from response
        console.log(data);
        let place = data.name;
        let country = data.sys.country;
        let icon = data.weather[0].icon; // is a code number i.e 02n or 08d
        let description = data.weather[0].description;
        let humidity = data.main.humidity; // By default in %
        let sunrise = data.sys.sunrise; // By default in Unix which means number of seconds after 00:00 1/1/1970
        let sunset = data.sys.sunset; // By default in Unix which means number of seconds after 00:00 1/1/1970
        let wind = data.wind; // object with speed and degrees
        let pressure = data.main.pressure; // By default in hPa
        let visibility = data.visibility; // By default in hPa

        // Temperatures on Kelvin by default
        let tempK = data.main.temp; 
        let feels_like = data.main.feels_like;
        let maxtempK = data.main.temp_max;
        let mintempK = data.main.temp_min;
        
        // Convert to Celcius from Kelvin
        let tempC = Math.floor(tempK-273.15); 
        let maxtempC = Math.floor(maxtempK-273.15); 
        let mintempC = Math.floor(mintempK-273.15); 
        let feels_like_C = Math.floor(feels_like-273.15);

        // Convert to Farenheit from Celcius
        let tempF = tempC*1.8+32;
        let maxtempF = Math.floor(maxtempC*1.8+32);
        let mintempF = Math.floor(mintempC*1.8+32);
        let feels_like_F = Math.floor(feels_like_C*1.8+32);

        // Attach data to each html div
        place_div.innerHTML = `${place} - ${country}`;
        descr_div.innerHTML = `${description}`;
        temp_div.innerHTML = `${tempC} &#8451`;
        min_temp.innerHTML = `Min: ${mintempC} &#8451`;
        max_temp.innerHTML = `Max: ${maxtempC} &#8451`;
        feels_like_div.firstElementChild.innerHTML = "feels like";
        feels_like_div.lastElementChild.innerHTML = `${feels_like_C} &#8451`;

        flag=0; // begin display with Celcius
        // If user clicks on temperature it will change between Celcius and Farenheit
        temp_div.addEventListener('click',function(e){
            if(flag===0){ // was on Celcius and want Farenheit 
                temp_div.innerHTML = `${tempF} &#8457`;
                min_temp.innerHTML = `Min: ${mintempF} &#8457`;
                max_temp.innerHTML = `Max: ${maxtempF} &#8457`;
                feels_like_div.lastElementChild.innerHTML = `${feels_like_F} &#8457`;
                flag=1; 
            }
            else{
                temp_div.innerHTML = `${tempC} &#8451`;
                min_temp.innerHTML = `Min: ${mintempC} &#8451`;
                max_temp.innerHTML = `Max: ${maxtempC} &#8451`;
                feels_like_div.lastElementChild.innerHTML = `${feels_like_C} &#8451`;
                flag=0; 
            }
        });

        // Add the icon-image obtained from OpenWeatherMap site using custom url:
        let icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`           
        icon_div.innerHTML = `<img src=${icon_url}>`;
        
        // Add a hr element to split main block and extra info
        let grammi = document.createElement('hr');
        grammi.classList.add("line");
        basic_info.appendChild(grammi);


        // Add humidity title and metrisi
        console.log(humidity_div.firstElementChild)
        humidity_div.firstElementChild.innerHTML = "Humidity";
        humidity_div.lastElementChild.innerHTML = `${humidity}%`;

        // Add sunrise and sunset title and metriseis
        // sunrise and sunset are measured in unix time which means the number of seconds passed
        // from 00:00 1/1/1970.
        var date1 = new Date(sunrise * 1000); // turn it to millisecs
        var hours = date1.getHours();// Hours part from the timestamp
        var minutes = "0" + date1.getMinutes();// Minutes part from the timestamp

        // Will display time in 10:30 format
        var SunriseTime = hours + ':' + minutes.substr(-2);
        console.log(SunriseTime);

        var date2 = new Date(sunset * 1000); // turn it to millisecs
        var hours = date2.getHours();// Hours part from the timestamp
        var minutes = "0" + date2.getMinutes();// Minutes part from the timestamp

        // Will display time in 10:30 format
        var SunsetTime = hours + ':' + minutes.substr(-2) ;
        console.log(SunsetTime);

        rise_set_div.firstElementChild.innerHTML = "Sunrise/Sunset";
        rise_set_div.children[1].innerHTML = `${SunriseTime}`;
        rise_set_div.lastElementChild.innerHTML = `${SunsetTime}`;
        
        // Add wind title and metriseis(speed,direction)
        console.log(wind);
        let windDirSymbol = Converter(wind.deg);
        wind_div.firstElementChild.innerHTML = "Wind";
        wind_div.children[1].innerHTML = `${Math.floor(wind.speed*3.6)}km/h`; // By default is on m/s
        wind_div.lastElementChild.innerHTML = `${windDirSymbol}`;  
        
        // Add pressure title and metriseis
        pressure_div.firstElementChild.innerHTML = "Pressure";
        pressure_div.lastElementChild.innerHTML = `${pressure}hPa`;

        // Add visibility title and metriseis
        visibility_div.firstElementChild.innerHTML = "Visibility";
        visibility_div.lastElementChild.innerHTML = `${Math.floor(visibility/1000)}Km`;



        // extra_info.classList.add('myborder');

        // Skycons
        // let skycons = new Skycons({"color": "white"});
        // skycons.add("icon1", Skycons.CLEAR_NIGHT);
        // skycons.play();

    })
}
// Failure function runs when user does not allow location
function failure(){
    console.log('Come on you did not open your location...');
    basic_info.innerHTML = " Weather data can not load because you didn't enable your location. Please try again..."
    basic_info.classList.add("title");  
}

// This function takes the direction(degrees) of the wind and returns the direction in symbols(i.e N/E) 
function Converter(degress){
    let ranges=[ {min:348.75,max:360},
                {min:0,max:11.25},
                {min:11.25,max:33.75},
                {min:33.75,max:56.25},
                {min:56.25,max:78.75},
                {min:78.75,max:101.25},
                {min:101.25,max:123.75},
                {min:123.75,max:146.25},
                {min:146.25,max:168.75},
                {min:168.75,max:191.25},
                {min:191.25,max:213.75},
                {min:213.75,max:236.25},
                {min:236.25,max:258.75},
                {min:258.75,max:281.25},
                {min:281.25,max:303.75},
                {min:303.75,max:326.25},
                {min:326.25,max:348.75}
            ];
    let Characters = ["N","N","N/NE","NE","E/NE","E","E/SE","SE","S/SE","S","S/SW","SW","W/SW",
                        "W","W/NW","NW","N/NW"];
    
    for(let i=0;i<ranges.length;i++){
        if(degress>=ranges[i].min && degress<=ranges[i].max){
            return Characters[i];
        }
    }    
}





