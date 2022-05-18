import fetch from 'node-fetch';
import express from 'express';
import mongoose from 'mongoose';
import weatherCurrents from './models/weatherCurrent.js'
import weatherForeCastes from './models/weatherForeCaste.js';
import bodyParser from 'body-parser';
import objectMapper from 'object-mapper';
;

const app = express();

const dbURI = "mongodb+srv://ninja_turtle:ninja184@cluster0.zdlqe.mongodb.net/weather?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000, () => console.log("port 3000")))
    .catch((err) => console.log(err))

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/',(req,res) =>{
    res.render('index')
})
app.get('/currentWeather',(req,res) =>{
    res.render('currentIndex')
})
app.get('/forecastweather',(req,res) =>{
    res.render('forecasteIndex')
})

app.post('/current', (req,res) => {
        var currentURI = `http://api.weatherapi.com/v1/current.json?key=07e2076ac22b4bf0a24144325221305&q=${req.body.city}&aqi=no`;
        fetch(currentURI)
        .then(response => response.json())
        .then(data => { 
            console.log(data.current['temp_c'])
            const current = new weatherCurrents({
                city: data.location['name'],
                country: data.location['country'],
                region: data.location['region'],
                condition: data.current.condition['text'],
                tempC: data.current['temp_c'],
                feelsLikeC: data.current['feelslike_c'],
                windKmphValue: data.current['wind_kph'],
                updatedOn: data.current['last_updated'],
                currentURI: currentURI
            })

            const map = {
                city: req.body.town || "town",
                country: req.body.country || "nation",
                region: req.body.region || "state",
                condition: req.body.condition || "weather condition",
                tempC: req.body.tempC || "temperature(celcius)",
                feelsLikeC: req.body.feelsLikeC || "feels like(celcius)",
                windKmphValue: req.body.windKmphValue || "wind speed(KMPH)",
                updatedOn: req.body.updatedOn || "last updated on",
                currentURI: req.body.currentURI || "URI(current)",
            }

            var dest = objectMapper(current, map);
            
            current.save()
                .then((result) => {
                    res.send(dest)
                })
                .catch((err) => res.send(err))
        
        })
        .catch((err) => console.log(err))
})


app.post('/forecaste' , (req,res) => {
    var forecasteURI = `http://api.weatherapi.com/v1/forecast.json?key=07e2076ac22b4bf0a24144325221305&q=${req.body.city}&days=1&aqi=no&alerts=no`;
    fetch(forecasteURI)
    .then(response => response.json())
    .then(data => { 
        const forecaste = new weatherForeCastes({
            city: data.location['name'],
            country: data.location['country'],
            region: data.location['region'],
            minTempC: data.forecast.forecastday[0].day['mintemp_c'],
            maxTempC: data.forecast.forecastday[0].day['maxtemp_c'],
            sunRise: data.forecast.forecastday[0].astro['sunrise'],
            sunSet: data.forecast.forecastday[0].astro['sunset'],
            chanceRain: data.forecast.forecastday[0].day['daily_chance_of_rain'],
            chanceSnow: data.forecast.forecastday[0].day['daily_chance_of_snow'],
            updatedOn: data.current['last_updated'],
            forecasteURI:forecasteURI
            
        })

        const map = {
            city: req.body.town || "town",
            country: req.body.country || "nation",
            region: req.body.region || "state",
            condition: req.body.condition|| "weather condition",
            minTempC: req.body.minTempC || " Minimum temperature(celcius)",
            maxTempC: req.body.maxTempC || "Maximum temperatre(celcius)",
            sunRise: req.body.sunRise || "Sunrise At",
            sunSet: req.body.sunSet || "Sunset At",
            chanceRain: req.body.chanceRain || "chances of Rain",
            chanceSnow: req.body.chanceSnow || "chances of Snow",
            updatedOn: req.body.updatedOn || "last Updated on",
            forecasteURI: req.body.forecasteURI || "URI(Forecast)",
        }
        var dest = objectMapper(forecaste, map);

        forecaste.save()
            .then((result) => {
                res.send(dest)
            })
            .catch((err) => res.send(err))
    })
    .catch((err) => res.send("error, please try again"))
    
})





