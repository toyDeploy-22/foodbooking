// import React, { useState } from 'react';
import axios from "axios";
import { reservationValidator } from "./reservationValidator.js";

function getNewObj(obj) {

        const newObj = {};

        for(let[k, v] of Object.entries(obj)) {
                if(k !== 'client_extra') {
                newObj[k] = v;
                }
        }

        return newObj;
}

function firstLaunchCheck(seat) { 

        const result = {};
        const newSeat = getNewObj(seat);
        const requiredKeys = Object.values(newSeat);

        const { client_legalAge, client_fname, client_lname, client_email, client_phone, client_guests, client_smoking, client_bookDay, client_bookTime } = newSeat;
        
        console.log(requiredKeys)

        try { 
        const reservation = {};
        const totalGuests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        if(requiredKeys.indexOf('') > -1) {
        
        result.ok = "false";
        result.title = 'Incomplete Form';
        result.msg = [{
        status: false,
        id: '020',
        section: "Required Fields",
        msg: 'Some required fields are empty. Please make sure that all required fields are completed in order to save the data.'}];
        
        return result;
        } else {        
        
        // client_legalAge is boolean
        if(client_legalAge) {
        
        if(seat.hasGuests && totalGuests.indexOf(client_guests) > -1 || !seat.hasGuests && client_guests === 0 ) {

        reservation.fname = client_fname;
	reservation.lname = client_lname;
        reservation.email = client_email;
        reservation.phone = client_phone;
        reservation.guests = client_guests;
        reservation.smoking = client_smoking;
        reservation.bookDay = client_bookDay;
	reservation.bookTime = client_bookTime;
        reservation.extra = !seat.hasOwnProperty('client_extra') ? '' : seat.client_extra;
        reservation.legalAge = client_legalAge;

        if(reservation.extra === '') {
                delete reservation.extra;
        } else if (reservation.extra.length < 3 || reservation.extra.length > 80) {
                result.ok = "false";
                result.title = 'Invalid Comment Section';
                result.msg = [{
                status: false,
                id: '013',
                section: "Comments",
                msg: 'If you want to fill in the "extra" section, please make sure to type between 4 and 80 non-extra characters.'}]
                return result;
                }

                result.ok = "true";
                result.title = 'First Step Validation Success';
                result.resa = reservation;
                return result;

                } else {
                result.ok = "false";
                result.title = "Incorrect Guests Details";
                result.msg = [{
                id: '006',
                status: false,
                section: 'Guests Number Invalid',
                msg: 'If you are going with guests, please select an appropriate number of participants in the list ( from "1" to "more than 9"). If you are coming alone, please choose "no" to the "Are you going with guests" above question.'
                }];
                
                return result
                }} else {

                result.ok = "false";
                result.title = 'Legal Age Unauthorized';
                result.msg = [{
                status: false,
                id: '012',
                section: "Legal-Age",
                msg: "You need to confirm that you are 18 or more in order to book in our platform"}];
                return result;
                }
        }} catch (err) {
        
        const catchSchema = [{
        status: false,
        id: 'Err500',
        section: 'Booking Request Error',
        msg: "An error occured during the first booking validation step. Please try again or contact your administrator if the issue persists."
                }];

        result.ok = "false";
        result.title = 'Invalid Comment Section';
        result.msg = catchSchema;
        console.error(err);  
        return result;
                }
        }

// Check with validation        
function secondLaunchCheck(seat, dishes) {
        
        const result = {};
        
        try {
        const checker = reservationValidator(seat, dishes);
        
        if(checker.filter((truSet) => !truSet.status).length > 0) {
                result.ok = "false";
                result.title = 'Unauthorized';
                result.msg = checker.filter((truSet) => !truSet.status);
        } else { 
                result.ok = "true";
                result.title = 'Authorized';
                result.msg = 'Second Step Validation Success'
                }

        return result;

        } catch(err) {
        
        const catchSchema = [{
        status: false,
        id: 'Err500',
        section: 'Booking Request Error',
        msg: "An error occured during the second booking validation step. Please try again or contact your administrator if the issue persists."
        }];

        result.ok = "false";
        result.title = 'Internal Server Error';
        result.msg = catchSchema;
        console.error(err);  
        
        return result; 
        }
}

// status: true, id: '', section: '', title: '', msg: ''


async function sendBooking(obj, arr) {

try {
        const firstCheck = firstLaunchCheck(obj);
        console.log(firstCheck)
        if(firstCheck.ok === "false") {
                return firstCheck
        } else {
        const secondCheck = secondLaunchCheck(firstCheck.resa, arr);
        console.log(secondCheck);

        if(secondCheck.ok === "false") {
                return secondCheck;
        } else {

        const result = {};

        /* const finder = await fetch(`http://localhost:5000/reservation/allreservation_email/${firstCheck.resa['email']}`);
       const findMail = await finder.json();

        /*
        const findMail = await axios({
                method: 'get',
                url: `https://foodbooking-backend.vercel.app/reservation/allreservation_email/${firstCheck.resa['email']}`});
        */

        firstCheck.resa.dishes = arr;

        // const url = 'http://localhost:5000/reservation/new-table';

        const table_URL = 'https://foodbooking-backend.vercel.app/reservation/new-table'; 


        /*
        const booker = await fetch(url, { 
                        headers: {"Content-Type": "application/json"}, 
                        method: 'POST', 
                        body: JSON.stringify(firstCheck.resa) });
                
        const bookerData = await booker.json();
        console.log(bookerData)
        */

        const bookerData = await axios({
                method: 'post',
                url: table_URL,
                data: firstCheck.resa
               // timeout: 5000
        });

        console.log(bookerData)

        if(bookerData.status >= 200 && bookerData.status < 300) {

                result.ok = 'true';
                result.title = bookerData.data.id;
                result.msg = 
                [{
                status: true,
                id: '200',
                section: "Success",
                msg: 'Your booking has been successfully sent !'
                }]
        } else if(bookerData.data.title === 'Duplicate Email Booking') {
                result.ok = "false";
                result.title = 'Duplicate Email';
                result.msg = [{
                status: false,
                id: '034',
                section: "Email Already Exists",
                msg: `The booking request cannot be sent because there is already a pending booking under the email address '${client_email}'. You can modify or delete your pending booking before confirming a new one.`}];
        } else {
                result.ok = "false";
                result.title = 'Unauthorized';
                result.msg = [{
                status: false,
                id: '013-1',
                section: 'Data Not Valid',
                msg: "The booking request has not been validated because some fields may not have been properly filled in. Please check the data you provided and try again."
                }]   
                }

                return result;

                        }}
         } catch(err) {

        const catchSchema = [{
        status: false,
        id: 'Err500',
        section: 'Internal Checking Error',
        msg: "An Internal error occured during data saving. Please try again or contact your administrator if the issue persists."
        }];

        const catchResult = {
        ok: "false",
        title: 'Internal Server Error',
        msg: catchSchema
        };
        console.error(err);

        return catchResult; 
        }
}

export default sendBooking;