import axios from 'axios';
import { getResaSchema } from './resaSchema.js';
/* 
axios is useful for response handling, including response code 404,
as basic fetch does not handle 404 response and returns undefined instead.
*/

// findOne return Array & find return Array of obj 

const findSearch = async(id) => {
let result = {};

try {
// const url = `http://localhost:5000/reservation/search/${id}`;
const url = `https://foodbooking-backend.vercel.app/reservation/search/${id}`;

const fetcher = await axios.get(url);

let status = fetcher.status;

if(status < 200 || status >= 300) {
    result.ok = false;
    result.code = status;
    result.data = [];
    return result
} else {
     const data = getResaSchema(fetcher.data);
    result.ok = true;
    result.code = status;
    result.data = [data] // array of obj
    console.log(result);
    return result }
} catch(err) {
    if(err.hasOwnProperty("status")){
    if(err.status === 404){
    result.ok = false;
    result.code = 404;
    result.data = [];
    } else {
    result.ok = false;
    result.code = 500;
    result.data = [] 
    }} else {
    result.ok = false;
    result.code = 505;
    result.data = []
    }
    console.error(err);
    return result;
    }
}

const notFoundError = (id) => {
        return {
        err: true,
        code: 404,
        title: "Not found :(",
        msg: "The booking number " + id + " is not found. Please make sure that the characters are correctly entered and that you don't have deleted your booking."
        }
}

const internalServerError = (error) => {
     return { 
        err: true,
        code: 500,
        title: error,
        msg: "Ooops an error occured. Please try again or contact your administrator if the issue persists."
     }
}

export { findSearch, notFoundError, internalServerError };