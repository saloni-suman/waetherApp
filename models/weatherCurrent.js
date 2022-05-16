
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const currentWeatherSchema = new Schema({
    city:{
        type: String,
        required: true
    },
    country: String,
    region: String,
    condition: String,
    tempC: String,
    feelsLikeC: String,
    windKmphValue: String,
    updatedOn: String,
    currentURI: String
}, { timestamps : true})

const weatherCurrent = mongoose.model("weather_current", currentWeatherSchema);
export default weatherCurrent;