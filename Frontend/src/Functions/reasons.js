
// { legalAge, fname, lname, phone, guests, smoking, bookFor, extra };
const reasons = [
    { 
        id: '001',
        status: false,
        section: 'Legal Age Unauthorized',
        msg: 'You must be 18 years old or more in order to book in our platform.'   
    },
    {
        id: '002',
        status: false,
        section: 'first Name Invalid',
        msg: 'Please make sure that the first name field is not empty and does not contain numbers.'
    },
    {
        id: '003',
        status: false,
        section: 'last Name Invalid',
        msg: 'Please make sure that the last name field is not empty and does not contain numbers.'
    },
    {
        id: '004',
        status: false,
        section: 'Email Invalid',
        msg: 'Please make sure that your email contains "@" and "." symbols, and does not start with it. Ex: emails starting with "@youremail.com" are not allowed.'
    },
    {
        id: '005',
        status: false,
        section: 'Phone Number Invalid',
        msg: 'Please make sure that your phone number contain only numbers.'
    },
    {
        id: '006',
        status: false,
        section: 'Guests Number Invalid',
        msg: 'If you are going with guests, please select an appropriate number of participants in the list ( from "1" to "more than 9"). If you are coming alone, please choose "no" to the "Are you going with guests" above question.'
    }, 
    {
        id: '007',
        status: false,
        section: 'Smoking Answer Invalid',
        msg: 'If you are smoking, please select "yes" and we will find an appropriate seat for you. Otherwise, please select "no" if you do not smoke.'
    },
    {
        id: '008',
        status: false,
        section: 'Booking Day Invalid',
        msg: 'The booking date can only be confirmed for weekdays (Monday to Saturday) from 11am to 9pm because booking has to be made at least 1 hour before restaurant opens/closes.'
    },
    {
        id: '009',
        status: false,
        section: 'Booking Time Invalid',
        msg: 'For organization purpose, your booking has to be made minimum 1 hour before arriving.'
    },
    {
        id: '010',
        status: false,
        section: 'Extra Comments Invalid',
        msg: 'If you want to write in the "extra" section, please make sure to type between 4 and 80 non-extra characters.'
    },
        {
        id: '011',
        status: false,
        section: 'Unknown Dish',
        msg: 'One of the dishes is unknown. Please make sure that you select the specified dishes of the list.'
    },
    {
        id: '012',
        status: false,
        section: 'Incorrect Dishes Number',
        msg: 'The number of dishes should be at least equal to the number of guests. If you come alone, please choose at least one dish.'
    },
];

export default reasons;