// import { todayIs } from './dateValidation.js';

const initResaSchema = {
       first_name: '', 
       last_name: '', 
       email: '', 
       phone: '', 
       guests: 0, 
       smoking: false, 
       bookDay: new Date().toISOString().substring(0, 10), 
       bookTime: '',
       hasExtra: false, // key only for frontend
       extra: '', 
       legalAge: true, 
       booking_id: '', 
       createdAt: '' 
}

// Get response data obj without _id format and checkes if 'extra' property exists 
const getResaSchema = (data) => {
const {first_name, last_name, email, phone, guests, smoking, bookDay, bookTime, legalAge, booking_id, createdAt, updatedAt} = data;

const newObj = {
        first_name: first_name, 
        last_name: last_name, 
        email: email, 
        phone: phone, 
        guests: guests, 
        smoking: smoking, 
        bookDay: bookDay, 
        bookTime: bookTime, 
        legalAge: legalAge, 
        booking_id: booking_id, 
        createdAt: createdAt, 
        updatedAt: updatedAt
}

if(data.hasOwnProperty('extra')) {
        newObj.hasExtra = true;
        newObj.extra = data.extra
} else {
        newObj.hasExtra = false;
        newObj.extra = ''
        }
return newObj
}

/**
const postResaSchema = {
        
        client_fname: '',
        client_lname: '',
        client_email: '',
        client_phone: '',
        hasGuests: false,
        client_guests: 0,
        client_smoking: false,
        client_bookDay: todayIs().toString(),
        client_bookTime: '',
        client_extra: '',
        client_legalAge: ''
};
**/

export { initResaSchema, getResaSchema }