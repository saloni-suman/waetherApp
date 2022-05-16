import mongoose from "mongoose";
const Schema = mongoose.Schema;

const forecasteWeatherSchema = new Schema({
    city:{
        type: String,
        required: true
    },
    country: String,
    region: String,
    condition: String,
    minTempC: String,
    maxTempC: String,
    sunRise: String,
    sunSet: String,
    chanceRain: String,
    chanceSnow: String,
    updatedOn: String,
    forecasteURI: String
}, { timestamps : true})

const weatherForeCastes = mongoose.model("weather_forecaste", forecasteWeatherSchema);
export default weatherForeCastes;