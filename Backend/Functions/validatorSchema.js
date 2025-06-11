import allDishes from '../Src/All_Dishes.js';

const d = new Date();
const currentDate = d.toISOString().substring(0,10);
const currentTime = d.getHours() + 1;

const noSpecial = new RegExp(/[`~@#\$%\^&\*\(\)\=_+\\\[\]{}\<\>\"\|\"]/gi);

export const verifyDishes = (d) => {
	let unknown = []; 
	const allIdDishes = allDishes.map((alld) => alld.dish_id);
	d.forEach(function (dish) {
		if(allIdDishes.indexOf(dish.id) < 0){
			unknown.push(dish.name || "an unknown dish")
	}});
	return unknown;	
}

// note: validators should be truthy to be bypassed, otherwise will throw the message

const validator_legalAge = {
	validator: (age) => age === true,
	messgae: "You need to be 18 or older to book a table in our platform."
}

const validator_email = {
	validator: (email) => email.match(/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/g) !== null,
	message: "Your email must contain both '@' and '.' symbols, but cannot start with it. Ex: '@email.com' is for instance not allowed."
}

let validator_dishesChecks = [
	{validator: (dishes) => dishes.length >= 1 && dishes.length <= 11, 
	// up to 10 dishes + 1 dish (from the user) 
	message: "You must add from 1 to 10 dish(es) in order for your booking to be confirmed."},
	
	{validator: (dishes) => verifyDishes(dishes).length === 0,
	message: (dishes) => `It seems that ${verifyDishes(dishes).join(",")} appear in our list and is not recognized.`}
]

const validator_ExtraComment = {
validator: (msg) => msg.length > 3 && msg.length <= 80 && msg.match(noSpecial) === null,
message: (msg) => `You typed ${msg.value.length} characters in extra comment section. This field must contain between 4 and 80 non-special characters if field not empty.`
};

const validator_bookDate = {
	validator: (day) => currentDate.split("-").map((date, _ind)=>Number(day.split("-")[_ind]) >= Number(date)).map((bool)=>bool.toString()).indexOf("false") === -1,
	message: 'The booking date must be from monday to saturday from 11:00 am to 09:00 pm and cannot be a past date.'
}

// export as function because will add 2 parameters
export const validator_bookTime =(day, time)=> {
	// check if same month
	const currMonth = currentDate.split("-")[1];
	const newMonth = day.split("-")[1];
	
	// check if same day
	const currDay = currentDate.split("-")[2];
	const newDay = day.split("-")[2];
	
	// if same month && same day, check if booking for at least one hour later and before booking closing, 9pm
	if(currMonth === newMonth && currDay === newDay){
	const validator = Number(time.split(":")[0]) >= currentTime + 1 && Number(time.split(":")[0] < 21) ? "valid" : "invalid" 
	return validator
	} else {
		return "valid"
	}
}

export const legalAge = [validator_legalAge.validator, validator_legalAge.message];
export const validEmail = [validator_email.validator, validator_email.message]; 
export const validDish = validator_dishesChecks; 
export const extraComment = [validator_ExtraComment.validator, validator_ExtraComment.message];
export const valiDate = [validator_bookDate.validator, validator_bookDate.message];
