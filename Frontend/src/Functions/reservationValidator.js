
import reasons from "./reasons.js";
import { dateVal, timeVal } from "./dateValidation.js";
const exceptions = reasons;

const isTrue = (arr, label) => {
        const obj = {
        id: '', status: true, section: label, title: '', msg: ''
        };
        arr.push(obj)
    }

const isFalse = (arr, label, err) => {
    const obj = {section: label}
    arr.push({...obj, ...err})
}
    
    const labels = ["Legal-Age", "First-Name", "Last-Name", "Email", "phone", "Guests", "Smoking", "Booking-Day", "Booking-Time", "Comments", "Dish" ];

    export const errSchema = {ok: "init", title: ''}; // "msg: []" separated
    export const msgSchema = [
        {id: '', status: true, section: '', msg: ''}
        ];

export function reservationValidator(newSeat, arrDishes) {

    const results = [];
    
    console.log(newSeat);
    console.log(arrDishes);

    const { fname, lname, email, phone, guests, smoking, bookDay, bookTime, legalAge } = newSeat;

    // legalAge
    legalAge === true ? isTrue(results, labels[0]) : isFalse(results, labels[0], exceptions[0]);

    // fname
    fname.length > 0 && fname !== '' ? isTrue(results, labels[1]) : isFalse(results, labels[1], exceptions[1]); 

    // lname
    lname.length > 0 && lname !== '' ? isTrue(results, labels[2]) : isFalse(results, labels[2], exceptions[2]); 

    // email
    email.match(/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/g) !== null ? isTrue(results, labels[3]) : isFalse(results, labels[3], exceptions[3]);

    // phone
    phone.match(/[^0-9+() -.]/g) === null ? isTrue(results, labels[4]) : isFalse(results, labels[4], exceptions[4]);

    // guests
    guests >= 0 || guests <= 10 ? isTrue(results, labels[5]) : isFalse(results, labels[5], exceptions[5]);

    // dishes
    arrDishes.filter((ud) => ud.id === '').length === 0 ? isTrue(results, labels[10]) : isFalse(results, labels[10], exceptions[10]);

    // dishes
    guests > 0 && arrDishes.map((d) => d.id).length === (guests + 1) || guests === 0 && arrDishes.map((d) => d.id).length > 0 ? isTrue(results, labels[10]) : isFalse(results, labels[11], exceptions[11]);

    // smoking
    typeof smoking === 'boolean' ? isTrue(results, labels[6]) : isFalse(results, labels[6], exceptions[6]);

    // bookDay
    dateVal(bookDay, bookTime) ? isTrue(results, labels[7]) : isFalse(results, labels[7], exceptions[7]);

    // bookTime
    timeVal(bookTime) ? isTrue(results, labels[8]) : isFalse(results, labels[8], exceptions[8]);

    // extra comments
    if(newSeat.hasOwnProperty('extra')){
   newSeat.extra.match(/[`~@#\$%\^&\*\(\)\=_+\\\[\]{}\<\>\"\|\"]/gi) === null && newSeat.extra.length > 3 && newSeat.extra.length <= 80 ? isTrue(results, labels[9]) : isFalse(results, labels[9], exceptions[9]);
    }

   return results
}
