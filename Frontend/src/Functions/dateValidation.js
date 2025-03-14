
let result;
const openHour = 10;
const closeHour = 21;
const currentDate = new Date();
const currentHour = new Date().getHours();

function dateVal(day, time){
    try {
    const bookingFor = new Date(day);
    const bookingDates = {
     bookingYear: bookingFor.getFullYear(),
     bookingMonth: bookingFor.getMonth(),
     bookingDay: bookingFor.getDay() + 1, // Start from zero (Sunday)
     bookingDate: bookingFor.getDate(), // return the day number so will never be zero
     bookingTime: Number(time.split(':')[0])
    }
    /**
    const date = (new Date(day).toISOString().substring(0, 10).split("-")).map((d)=>Number(d));
    const today = booking.getDay();
    const days = ["Closed", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    **/

    // due of internationalization (ex: Monday === Lunes en español), should prefer using numbers
    
    // All conditions need to be false to be valid:
    // if occurence, check the below

    const validation = {
    year: bookingDates.bookingYear < currentDate.getFullYear(),
    sameYear: bookingDates.bookingYear === currentDate.getFullYear(),  
    month: (bookingDates.bookingMonth + 1) < (currentDate.getMonth() + 1),
    sameMonth: (bookingDates.bookingMonth + 1) === (currentDate.getMonth() + 1),
    date: bookingDates.bookingDate < currentDate.getDate(),
    sameDate: bookingDates.bookingDate === currentDate.getDate(),
    // day: bookingDates.bookingDay < (currentDate.getDay() + 1),
    isSunday: bookingDates.bookingDay === 1, // index starts from Sunday (by default index 0)
    time: bookingDates.bookingTime <= currentHour,
    timeOff: bookingDates.bookingTime <= openHour || bookingDates.bookingTime >= closeHour
    }

    if(validation.year) {
        console.log("Booking Year is not valid anymore.");
        result = false;
    } else if(validation.sameYear && validation.month) {
        console.log("Booking Month is not valid anymore.");
        result = false;
    } else if(validation.sameYear && validation.sameMonth && validation.date) {
        result = false;
        console.log("Booking Date is not valid anymore.")
    } else if(validation.sameYear && validation.sameMonth && validation.sameDate && validation.time) {
        console.log("Booking Time is too late.");
        result = false;
    } else if(validation.isSunday) {
       console.log("Restaurant is closed on sundays.");
       result = false;  
    } else if(validation.timeOff) {
        console.log("Booking Reception will be closed at that time.");
        result = false;
    } else {
        result = true;
    }

    return result
    
    } catch(err) {
        const result = false;
        console.error("Error data value: ", err);
        return result;
    }
}


function timeVal(time) {
    try {
    let result;
    const timeSet = Number(time.split(":")[0]);
   
    switch(timeSet < openHour || timeSet > closeHour) {
        case true: 
        result = false
        break;

        case false: 
        result = true
        break;

        default: 
        result = false;
        console.error("Time value checking failed ")
    }
    return result
    } catch(err) {
        const result = false;
        console.error("Error time value: ", err);
        return result;
    }
}

let todayIs = currentDate.toISOString().substring(0, 10)

export { dateVal, timeVal, todayIs };