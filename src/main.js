import './scss/style.scss'; // Import main style file


// Getting elements from document
const apiKey = import.meta.env.VITE_API_KEY;
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const mainInput = document.getElementById('input');
const searchButton = document.getElementById('search-btn');
let cityOutput = document.getElementById('city');
let temperature = document.getElementById('temperature');
let wind = document.getElementById('wind');
let humidity = document.getElementById('humidity');
let sunrise = document.getElementById('sunrise');
let sunset = document.getElementById('sunset');
let airQuality = document.getElementById('air-quality');
let uvIndex = document.getElementById('uv-index');
let mainImg = document.getElementById('main-img');
let weatherTitle = document.getElementById('weather-text');
let todayData = document.getElementById('todays-data');
let weatherData;

// This function capitalize first letter every's word
function capitalizeEachWord(string) {
    return string
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}



function formatTimeWithOffset(unixTime, timezoneOffsetInSeconds) {
    const localUnixTime = unixTime + timezoneOffsetInSeconds;
    const date = new Date(localUnixTime * 1000);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}



async function fetchWeather(city) {
    const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
    let data = await response.json();
    weatherData = data;
    console.log(weatherData);

    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;
    fetchAirQuality(lat, lon);
    fetchUVindex(lat, lon);
    // getTimeZone(lat, lon);

    const localTime = await getTimeZone(lat, lon);
    fetchWeatherHourly(city, localTime);
    if (data.cod === '404') {
        alert('Error, please enter a correct city name');
        return;
    }

    console.log(`Пользователь ввёл город: ${mainInput.value}`);
    if (city && isNaN(city)) {
        const correctCityString = capitalizeEachWord(city.trim());
        cityOutput.textContent = `${correctCityString}, ${weatherData.sys.country}`;
    } else {
        mainInput.value = 'Invalid value';
    }

    temperature.textContent = Math.round(weatherData.main.temp) + '°C';
    sunrise.textContent = `Sunrise - ${formatTimeWithOffset(weatherData.sys.sunrise, weatherData.timezone)}`;
    sunset.textContent = `Sunset - ${formatTimeWithOffset(weatherData.sys.sunset, weatherData.timezone)}`;
    wind.textContent = `Wind speed - ${Math.round(weatherData.wind.speed)} km/h`;
    humidity.textContent = `Humidity - ${weatherData.main.humidity}%`;
    weatherTitle.textContent = `${capitalizeEachWord(weatherData.weather[0].description)}`;

    mainImg.src = `public/images/${getMainWeatherIcon(data.weather[0].main)}`;
    // if (data.weather[0].main === 'Clear') {
    //     mainImg.src = 'public/images/sun-img.svg';
    // } else if (data.weather[0].main === 'Clouds') {
    //     mainImg.src = 'public/images/clouds-img.svg';
    // } else if (data.weather[0].main === 'Rain') {
    //     mainImg.src = 'public/images/rain-img.svg';
    // } else if (data.weather[0].main === 'Haze' || data.weather[0].main === 'Fog') {
    //     mainImg.src = 'public/images/fog-img.svg';
    // }

}


function getMainWeatherIcon(main) {
    switch (main) {
        case 'Clear': return 'sun-img.svg';
        case 'Clouds': return 'clouds-img.svg';
        case 'Rain': return 'rain-img.svg';
        case 'Haze':
        case 'Fog': return 'fog-img.svg';
        default: return 'sun-img.svg';
    }
}




async function fetchCityCoordinates(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    if (!data || data.length === 0) {
        throw new Error('City not found');
    }
    return { lat: data[0].lat, lon: data[0].lon };
}



async function getTimeZone(lat, lon) {
    const timezoneUrl = `https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lon}`;
    const response = await fetch(timezoneUrl);
    const data = await response.json();


    if (data.dateTime) {
        const localTime = new Date(data.dateTime);
        todayData.textContent = `${data.dayOfWeek}, ${data.date} - ${data.time}`;
        return localTime;
    } else {
        throw new Error('Error fetching timezone data');
    }

    // if (data.dateTime) {
    //     const date = new Date(data.dateTime);

    //     const formattedDate = new Intl.DateTimeFormat('en-US', {
    //         weekday: 'long',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric'
    //     }).format(date);

    //     const formattedTime = date.toLocaleTimeString('en-GB', {
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });

    //     todayData.textContent = `${formattedDate} - ${formattedTime}`;
    //     // todayData.textContent = `${data.dayOfWeek} - ${data.time}`;
    //     // console.log('Текущее время в городе: ', data.time);
    //     return new Date(data.dateTime);
    // } else {
    //     throw new Error('Error fetching timezone data');
    // }

}

const weatherCodeIcons = {
    0: 'sun-img.svg',
    1: 'sun-behind-clouds-img.svg',
    2: 'clouds-img.svg',
    3: 'clouds-img.svg',
    45: 'fog-img.svg',
    48: 'fog-img.svg',
    51: 'drizzle-img.svg',
    53: 'drizzle-img.svg',
    55: 'drizzle-img.svg',
    56: 'drizzle-img.svg',
    57: 'drizzle-img.svg',
    61: 'rain-img.svg',
    63: 'rain-img.svg',
    65: 'rain-img.svg',
    66: 'rain-img.svg',
    67: 'rain-img.svg',
    71: 'snowing-img.svg',
    73: 'snowing-img.svg',
    75: 'snowing-img.svg',
    77: 'snowing-img.svg',
    80: 'rain-img.svg',
    81: 'rain-img.svg',
    82: 'rain-img.svg',
    85: 'snowing-img.svg',
    86: 'snowing-img.svg',
    95: 'thunderstorm-img.svg',
    96: 'thunderstorm-img.svg',
    99: 'thunderstorm-img.svg'
};



async function fetchWeatherHourly(city) {
    const { lat, lon } = await fetchCityCoordinates(city);
    const weatherHourlyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,weathercode&timezone=auto`;
    const response = await fetch(weatherHourlyUrl);
    const weatherHourlyData = await response.json();

    const hours = weatherHourlyData.hourly.time;
    const temps = weatherHourlyData.hourly.temperature_2m;
    const weatherCodes = weatherHourlyData.hourly.weathercode;

    const parent = document.querySelector('.additional__hourly');

    parent.innerHTML = '';


    const now = new Date();
    const startIndex = hours.findIndex(timeStr => new Date(timeStr) > now);    // const currentHour = now.getHours();

    // let startIndex = hours.findIndex(timeStr => {
    //     const time = new Date(timeStr);
    //     return time.getHours() > currentHour && time > now;
    // });

    if (startIndex === -1) {
        console.warn('Нет данных не ближайшие часы');
        return;
    }


    for (let i = startIndex; i < Math.min(startIndex + 6, hours.length); i++) {
        const time = new Date(hours[i]);
        const hour = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        const code = weatherCodes[i];
        const iconFile = weatherCodeIcons[code] || 'sun-img.svg';
        const iconSrc = `/images/${iconFile}`;
        const iconAlt = `weather icon ${code}`;

        new HourlyWeather(
            hour,
            null,
            iconSrc,
            iconAlt,
            Math.round(temps[i]),
            '.additional__hourly',
            'additional__hourly-item'
        ).render();

    }


    console.log(weatherHourlyData.hourly);
}


async function fetchAirQuality(lat, lon) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await response.json();
    let airQualityData = data;
    console.log(airQualityData);
    const aqi = data.list[0].main.aqi;
    const aqiMeaning = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very poor'
    };


    airQuality.textContent = `Air Quality - ${aqi} (${aqiMeaning[aqi]})`;
}


async function fetchUVindex(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`);
    let data = await response.json();
    let uvValue = Math.round(data.current.uv_index);
    const uvMeaning = {
        'Low': [0, 1, 2],
        'Moderate': [3, 4, 5],
        'High': [6, 7],
        'Very High': [8, 9, 10],
        'Extreme': [11, 12, 13, 14, 15]
    };
    let category = 'Unknown';

    for (let key in uvMeaning) {
        if (uvMeaning[key].includes(uvValue)) {
            category = key;
            break;
        }
    }
    console.log(data.current.uv_index);
    uvIndex.textContent = `UV Index - ${Math.round(data.current.uv_index)} (${category})`;
}



class HourlyWeather {
    constructor(hour, img, src, alt, temp, parentSelector, ...classes) {
        this.hour = hour;
        this.img = img;
        this.src = src;
        this.alt = alt;
        this.temp = temp;
        this.parent = document.querySelector(parentSelector);
        this.classes = classes;
    }

    render() {
        const element = document.createElement('div');
        if (this.classes.length === 0) {
            element.classList.add('additional__hourly-item');
        } else {
            this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `
        <p class="additional__hourly-hour">${this.hour}</p>
        <hr class="line">
        <img class="additional__hourly-img" src=${this.src} alt=${this.alt}>
        <p class="additional__hourly-temp">${this.temp}°C</p>
        `;
        this.parent.append(element);
    }
}





searchButton.addEventListener('click', () => {
    const cityName = mainInput.value.trim();
    if (cityName) {
        fetchWeather(cityName);
        fetchWeatherHourly(cityName);
    } else {
        alert('Please enter a city');
    }
});


mainInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const cityName = mainInput.value.trim();
        if (cityName) {
            fetchWeather(cityName);
            fetchWeatherHourly(cityName);
        } else {
            alert('Please enter a city');
        }
    }
});