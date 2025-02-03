
const bookingSchema = {
        first_name: '',
	last_name: '',
	email: '',
        phone: '',
        guests: '',
        dishes_selected: [{id:'', name: ''}],
        smoking: false,
        bookDay: '',
        bookTime: '',
        extra: '',
        legalAge: false,
        booking_id: ''
}


const bookingSchema2 = {

        client_fname: '',
        client_lname: '',
        client_email: '',
        client_phone: '',
        hasGuests: false,
        // dishes: { guestDishes_0: ''},
        client_guests: 0,
        client_smoking: "false",
        client_bookDay: '',
        client_bookTime: '11:00',
        client_extra: '',
        client_legalAge: false
}


/** 
req.body has to be:

fname: client_fname,
	lname: client_lname,
        email: client_email,
        phone: client_phone,
        guests: client_guests,
        smoking: client_smoking,
        bookDay: client_bookDay,
	bookTime: client_bookTime,
        extra: !client_extra ? '' : client_extra.length,
        legalAge: true,
**/
export { bookingSchema, bookingSchema2 };