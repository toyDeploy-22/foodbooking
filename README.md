
# Foodbooking #

### Purpose ###

_This app is a restaurant booking platform with two parts, one related to the reservations and the other one to dishes:_

###### Booking ######

- Save a booking for you only (or for you and some guests) through a form and get a reservation number at the end of the registration
- Look for your booking details with this registration number, edit some data or delete your booking
<br/>
<img alt="Homepage And Search" src="Frontend/src/gifs/Foodbooking_(Home-Search).gif" width="800" height="600" />

###### Dishes ######

- Look for a dish by a key word
- Check the different details of this dish (presentation, ingredients, price, etc.)

### Technologies used ###

- React (used for the Frontend)
- NodeJS (used for the backend)
- MongoDB (used to store reservation details sent by the user)

### Characteristics ###

- Form with a very strong validation check before confirming the booking (duplicate emails, telephone format, past date, sundays, time, number of guests, dish not listed, special characters on comments, etc.)
- Select a dish for each guest if the user is not coming alone
<br />
<img alt="Form" src="Frontend/src/gifs/Foodbooking_(Form).gif" width="800" height="600" />

