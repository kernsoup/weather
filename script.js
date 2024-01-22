const API_key = "b8dc8baac4615efab383da371c281d1c";

const fetchWeatherData = async() => {
    try {
        const LAT = 61.51;
        const LON = 23.79;
        const currentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_key}&units=metric`);
        const currentData = await currentWeather.json();
        console.log(currentData);

        const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_key}&units=metric`)
        const data = await forecast.json();
        console.log(data.list[0]);
        
        const twentyFourContainer = document.getElementById("twenty-four-weather");        
        
        showMainData(currentData.name, currentData.main.temp, currentData.main.feels_like, currentData.weather[0].description, currentData.weather[0].icon);
        showWind(currentData.wind.speed, currentData.wind.deg);
        showHumidity(currentData.main.humidity);
        showPressure(currentData.main.pressure);
        setBackground(currentData.weather[0].id, currentData.weather[0].icon);
        data.list.slice(0, 8).map((item) => {
            const hourlyWeather = show24Hours(item.dt, item.main.temp, item.weather[0].icon, data.city.timezone);
            twentyFourContainer.append(hourlyWeather);
        });
        
    } catch (error) {
        console.error(error);
    }
}


const showMainData = (city, temp, feels_like, description, icon) => {
    document.title = "Weather in " + city;
    document.getElementById("city").innerText = "Weather in " + city;
    document.getElementById("current-temp").innerHTML = `<strong>${modifyTemp(Math.round(temp))}°</strong>`;
    document.getElementById("feels-like").innerText = `Feels like ${modifyTemp(Math.round(temp))}°`;
    document.getElementById("description").innerText = description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementById("current-icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

const showWind = (wind_strength, wind_deg) => {
    var letterDeg = "";
    var symbDeg = ""
    if (wind_deg < 45 & wind_deg >= 315) {
        letterDeg = "N"
        symbDeg = "⮛"
    } else if (45 <= wind_deg & wind_deg < 135) {
        letterDeg = "E";
        symbDeg = "⮘"
    } else if (135 <= wind_deg & wind_deg < 225) {
        letterDeg = "S";
        symbDeg = "⮙"
    } else {
        letterDeg = "W";
        symbDeg = "⮚"
    }
    document.getElementById("wind").innerHTML = `Wind <strong>${Math.round(wind_strength * 10) / 10}</strong> m/s, ${letterDeg} ${symbDeg}`;
}

const showHumidity = (humidity) => {
    document.getElementById("humidity").innerHTML = `Humidity <strong>${humidity}%</strong>`;
}

const showPressure = (pressure) => {
    document.getElementById("pressure").innerHTML = `Pressure <strong>${pressure}</strong>mbar`;
}

const show24Hours = (unix_timestamp, temp, icon, time_diff) => {
    const hourlyContainer = document.createElement("div");
    hourlyContainer.className = "hourly-container";

    const tempContainer = document.createElement("div");
    tempContainer.className = "temp-container";
    hourlyContainer.append(tempContainer);

    const img24Container = document.createElement("div");
    img24Container.className = "img-24-container";
    hourlyContainer.append(img24Container);

    const img = document.createElement("img");
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
    img24Container.append(img);

    const timeContainer = document.createElement("div");
    timeContainer.className = "time-container";
    hourlyContainer.append(timeContainer);

    
    
    var date = new Date((unix_timestamp + time_diff) * 1000);
    var hours = date.getUTCHours();
    var formattedTime = hours + ':00';
    console.log(formattedTime);
    timeContainer.innerText = formattedTime;
    tempContainer.innerText = modifyTemp(Math.round(temp)) + "°";

    return hourlyContainer;
}

const setBackground = (id, icon) => {
    const link = document.getElementById("main-or-so");
    if (id == 800) {
        if (icon.includes("n")) {
            link.style.backgroundImage = "url(images/clear_night.jpg)";
        } else {
            link.style.backgroundImage = "url(images/clear_day.jpg)";
        }
    } else if (id == 801 | id == 802) {
        if (icon.includes("n")) {
            link.style.backgroundImage = "url(images/cloudy_night.jpg)";
        } else {
            link.style.backgroundImage = "url(images/cloudy_day.jpg)";
        }
    } else if (id == 803 | id == 804) {
        link.style.backgroundImage = "url(images/cloudy_night.jpg)";
    } else {
        link.style.backgroundImage = "url(images/rainy_sky.jpg)";
    }
}

const modifyTemp = (temp) => {
    if (temp > 0) {
        return `+${temp}`;
    } else {
        return temp;
    }
}

fetchWeatherData();