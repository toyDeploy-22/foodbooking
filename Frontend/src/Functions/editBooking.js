
import { reservationValidator } from "./reservationValidator.js";

/** 
A link that leads to  edition with elements disabled and once button edition pushed, disabled is false. Once edition done, button confirm to send edition of id resa.
**/

/** 
resa Schema should be :

first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, required: true },
        phone: { type: String, required: true },
        if 0, guests = false

        guests: { type: Number, default:0, max: 10, required: true },
        smoking: { type: Boolean, default: false, required: true },
        bookDay: { type: String, validate: valiDate, required: true }, 
		// We choose String type for bookDay because date & time are separated. 
		// Date type are for createdAt & updatedAt
		bookTime: { type: String, required: true },
        extra: { type: String, validate: extraComment, required: false }, 
		legalAge: { type: Boolean, required: true, validate: legalAge },
		booking_id: {type: String, required: true}
**/
function getNewObj(obj) {

        const newObj = {};

        for(let[k, v] of Object.entries(obj)) {
                if(k !== 'extra') {
                newObj[k] = v;
                }
        }

        return newObj;
}


function firstLaunchCheck(seat, dishes) { 

try {   

        const schema = ["legalAge", "booking_id", "first_name", "last_name", "email", "phone", "smoking", "bookDay", "bookTime"].sort();
        
        const seatKeys = Object.keys(seat).sort();
        
        const mandatoryKeys = schema.filter((k) => seatKeys.indexOf(k) === -1);

        if(mandatoryKeys.length > 0) {
        
        result.err = true;
        result.code = 401;
        result.title = 'Incomplete data';
        result.msg = 'Some required fields are empty. Please make sure that all required fields are completed in order to save the data.';
        
        return result;

        } else {
        const result = {};
        const newSeat = getNewObj(seat);
        const requiredKeys = Object.values(newSeat);

        const { legalAge, booking_id, first_name, last_name, email, phone, guests, smoking, bookDay, bookTime } = newSeat;

        const reservation = {};

        if(requiredKeys.indexOf('') > -1) {
        
        result.err = true;
        result.code = 401;
        result.title = 'Incomplete Form';
        result.msg = 'Some required fields are empty. Please make sure that all required fields are completed in order to save the data.';
        
        return result;
        } else {        
        
        reservation.legalAge = legalAge; 
        reservation.booking_id = booking_id
        reservation.fname = first_name; 
        reservation.lname = last_name; 
        reservation.email = email; 
        reservation.phone = phone; 
        reservation.guests = guests;
        reservation.dishes_selected = dishes; 
        reservation.smoking = smoking; 
        reservation.bookDay = bookDay;
        reservation.bookTime = bookTime;
        reservation.extra = !seat.hasOwnProperty('extra') ? '' : seat.extra;

        if(reservation.extra === '') {
                delete reservation.extra;
        } else if (reservation.extra.length < 3 || reservation.extra.length > 80) {
                result.err = true;
                result.code = 401;
                result.title = 'Invalid Comment Section';
                result.msg = 'If you want to fill in the "extra" section, please make sure to type between 4 and 80 non-extra characters.';
                return result;
                }

                result.err = false;
                result.code = 202;
                result.title = 'First Step Validation Success';
                result.msg = 'Request accepted';
                result.resa = reservation;
                return result;

        }}} catch (err) {
        
        const catchSchema = {
        err: true,
        code: 500,
        title: 'Booking Request Error',
        msg: "An error occured during the first booking validation step. Please try again or contact your administrator if the issue persists."
        }
        console.error(err);  
        return catchSchema;
                }
        }

// Check with validation        
function secondLaunchCheck(seat, dishes) {
        
        const result = {};
        
        try {
        const checker = reservationValidator(seat, dishes);
        // console.log('checker: \n' + JSON.stringify(checker))
        if(checker.filter((truSet) => !truSet.status).length > 0) {
                result.err = true;
                result.code = 401;
                result.title = 'Unauthorized';
                result.msg = checker.filter((truSet) => !truSet.status).map((err) => err.msg)[0];
        } else { 
                result.err = false;
                result.code = 202;
                result.title = 'Second Step Validation Success';
                result.resa = seat;
                result.msg = 'Request Accepted'
                }

        return result;

        } catch(err) {
        
        const catchSchema = {
        err: true,
        code: 500,
        title: 'Booking Request Error',
        msg: "An error occured during the second booking validation step. Please try again or contact your administrator if the issue persists."
        };
        console.error(err);  
        
        return catchSchema; 
        }
}

// status: true, id: '', section: '', title: '', msg: ''


const result = {}

const editBooking = async(editable, editDish) => {
    try {
        // Checks:
        const firstCheck = firstLaunchCheck(editable, editDish);

        if(firstCheck.err) {
        Object.assign(result, firstCheck);
        return result
        } else {
        const secondCheck = secondLaunchCheck(firstCheck.resa, firstCheck.resa.dishes_selected);

        if(secondCheck.err) {
        Object.assign(result, secondCheck);
        return result
        } else {
        
    // const url = `http://localhost:5000/reservation/new-table-edition/${secondCheck.resa.booking_id}`;

    console.log(secondCheck.resa);

    const url = `https://foodbooking-backend.vercel.app/reservation/new-table-edition/${secondCheck.resa.booking_id}`;

    const launcher = await fetch(url, {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(secondCheck.resa)
    });
    console.log(launcher.ok);
    
    const errorsObj = [{
        err: true, 
        code: 401, 
        title: "Unauthorized", 
        msg: "Some properties cannot be editable. Please change it as default in order to proceed."},
        {
        err: true,
        code: 404,
        title: "Booking ID Not Found", 
        msg: "The edition failed because the booking ID is not found. Please makle sure that the booking ID is correct in order for the edition to complete."
        },
        {
        err: true, 
        code: 500, 
        title: "Unidentified Status", 
        msg: "An unidentified error occured during status checking. Please try again or contact your administrator if the issue persists."
        }, 
        {
        err: false, 
        code: 201, 
        title: "Booking Edited!", 
        msg: "Your booking has been successfully edited. If changes are not visible yet, please refresh the page."}];

        const newStatus = launcher.status >= 200 && launcher.status > 300 ? 201 : launcher.status;

        console.log(newStatus)

        switch(newStatus) {
                case 401:
                case 404:
                case 201:
                Object.assign(result, errorsObj.filter((err) => err.code === newStatus)[0]);
                break;

                default: 
                if(launcher.ok === true) {
                Object.assign(result, errorsObj.filter((err) => err.code === 201)[0]);
                } else {
                Object.assign(result, errorsObj.filter((err) => err.code === 500)[0]);
                                }
                        }
                }
                console.log(result)
                return result;
            }
    } catch(err) { 
    console.error("Oooops:", err);
    result.err = true;
    result.code = 500;
    result.title = "Internal Server Error";
    result.msg = "The edition failed due to an error. Please try again. Please contact the administrator if the issue persists.";

    return result
        }
    }

export default editBooking;