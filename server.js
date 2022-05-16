import fetch from 'node-fetch';
import express from 'express';
import mongoose from 'mongoose';
import weatherCurrents from './models/weatherCurrent.js'
import weatherForeCastes from './models/weatherForeCaste.js';
import bodyParser from 'body-parser';

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

            const current = new weatherCurrents({
                city: data.location['name'],
                country: data.location['country'],
                region: data.location['region'],
                condition: data.current.condition['text'],
                tempc: data.current['temp_c'],
                feelsLikeC: data.current['feelslike_c'],
                windKmphValue: data.current['wind_kph'],
                updatedOn: data.current['last_updated'],
                currentURI: currentURI
            })
    
            current.save()
                .then((result) => {
                    res.send(result)
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

        forecaste.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => res.send(err))
    })
})





