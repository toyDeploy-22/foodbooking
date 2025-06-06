//local
import reservationModel from '../Functions/reservationSchema.js';
import {validator_bookTime, verifyDishes} from '../Functions/validatorSchema.js';
import { mongoConnect } from '../Functions/mongoConnect.js';
// 3rd party
import Express from 'express';
import cors from "cors";
// import mongoose from 'mongoose';

const { MONGO_URI_VERCEL } = process.env;

const bookatable = Express.Router();
bookatable.use(cors());

let result;

bookatable.options('/new-table', cors())
bookatable.post('/new-table', cors(), async(req, res) => {
	result = new Object();
	try {
		
		const conn = await mongoConnect(MONGO_URI_VERCEL);
		
		const requiredProps = ["fname", "lname", "email", "phone", "guests", "dishes", "smoking", "bookDay", "bookTime", "legalAge"];
		const missProps = requiredProps.filter((key) => !req.body.hasOwnProperty(key));
		
		if(missProps.length > 0) {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unauthorized";
		result.msg = "Some properties are missing. Pleake make sure that all required fields have been completed.";
		
		res.setHeader("Object", "Booking Failed");
		return res.status(result.code).json(result);
		
		} else {
		
		const { fname, lname, email, phone, guests, dishes, smoking, bookDay, bookTime, legalAge } = req.body;
		const newData = {
		first_name: fname,
		last_name: lname,
		email: email.toLowerCase(),
        phone: phone,
        guests: guests,
		dishes_selected: dishes,
        smoking: smoking,
        bookDay: bookDay,
		bookTime: bookTime,
		legalAge: legalAge,
		checkExtra: req.body.hasOwnProperty("extra") ? true : false,
		booking_id: 'new'
		};
		
		// Check if comments
		if(newData.checkExtra && req.body.extra.length > 3 && req.body.extra.length <= 80) { 
		delete newData.checkExtra;
		newData.extra = req.body.extra;
		} else {
		delete newData.checkExtra; 	
		};
		
		// Check time
		if(validator_bookTime(newData['bookDay'], newData['bookTime']) === "invalid"){
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unauthorized";
		result.msg = "For organization purpose, your booking has to be made minimum 1 hour before arriving.";
		
		res.setHeader("Object", "Booking Failed");
		return res.status(result.code).json(result);
		}
		
		const finder = await reservationModel({"email": newData['email']});
		
		if(finder.length > 0) {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = 'Duplicate Email Booking';
		result.msg = ("Booking cannot be saved because there is already a pending booking under '" + email + "' email.");
		
		res.setHeader("Object", "Booking Failed");
		return res.status(result.code).json(result);
		} else {
			
		const conn_2 = await mongoConnect(MONGO_URI_VERCEL, res);
		
		const newBooking = new reservationModel(newData);
		const countBooking = await reservationModel.estimatedDocumentCount({});
		const saveId = await newBooking.save();	
		const newId = await saveId.id;
		// const new_id = await saveId._id;
		// saveId._id returns "new ObjectId('objectid')"
		// saveId.id returns directly 'objectId'
		
		const partName1 = "B" + (newId.split("").slice(0,9).reduce((pre, next)=>pre + next));
		const partName2 = countBooking;
		const bookingId = partName1 + "-" + partName2;
		
		
		await reservationModel.findByIdAndUpdate(newId, {booking_id: bookingId}); // $set will be done by mongoose automatically 

		// result
		result.dbStatus = conn_2.mongoStatus;
		result.code = 201;
		result.id = bookingId;
		result.title = "A table is booked!";
		result.msg = "Bon appétit!";

		res.setHeader("Object", "Booking Accepted");
		return res.status(result.code).json(result);
		
		}} 
	} catch(err) {

		// result
		console.error(err);
		result.code = (err.message.substring(1,18).includes("validation failed")) || (err.message.includes("duplicate")) ? 401 : 500;
		result.title = "Database Creation Failed";
		result.msg = err.message;
		
		res.setHeader("Object", "Booking Failed");
		return res.status(result.code).json(result);
	}	
});

bookatable.options('/search/:booking_id', cors())
bookatable.get('/search/:booking_id', cors(), async(req, res)=>{
	result = new Object();
	try {
	
	const conn = await mongoConnect(MONGO_URI_VERCEL);
	
	const searchId = req.params.booking_id;
	// const bookingId = await reservationModel.findOne({"booking_id": {$regex: searchId, $options: "i"}}); 
	// findOne unsuccessful throws null
	// find unsuccessful throws empty array
	// issues with findOne on vercel
	const bookingId = await reservationModel.find({"booking_id": new RegExp(searchId, "i")});
	if(bookingId.length === 0){	// === 0 throws timeout
		return res.status(404).json({
			dbStatus: conn['mongoStatus'],
			code: 404, 
			title: "Unknown Booking ID", 
			msg: `Booking id ${searchId} not found.`});
		}else{	
		res.write(conn);
		return res.json(bookingId[0])	
		}
	} catch (err) {
		console.error(err);
		result.code = 500;
		result.title = "Database Search Issue";
		result.msg = err.message;

		res.setHeader("Object", "Db Query Failed");
		return res.status(result.code).json(result);	
	}
	
})

/*
bookatable.options('/allreservation_email/:email')
bookatable.get('/allreservation_email/:email', async(req, res)=>{
	result = new Object();
	try {
		const client_email = req.params.email;
		const duplicate = await reservationModel.findOne({ "email": client_email});
		// findOne by default returns a single document not array
		
		if(!duplicate) {
			res.json([])
		} else {
			res.json([duplicate])
		}
	}
	catch(err){
		
		result.code = 500;
		result.title = "Database Search Issue";
		result.msg = err.message;

		res.setHeader("Object", "Db Query Failed");
		res.status(result.code).json(result);	
	}
})
*/


bookatable.options('/new-table-edition/:booking_id', cors())
bookatable.patch('/new-table-edition/:booking_id', cors(), async(req, res) => {
	result = new Object();
	try {
		const conn = await mongoConnect(MONGO_URI_VERCEL);
		
		// 1 - Get body and params
		const bookingId = req.params.booking_id;
		
		const { fname, lname, email, phone, guests, dishes, smoking, bookDay, bookTime, extra, legalAge } = req.body;
		
		const editable = {
		first_name: fname,
		last_name: lname, 
        phone: phone,
        smoking: smoking,
        bookDay: bookDay,
		bookTime: bookTime,
		extra: extra
		};
		
		const no_userEditable = {
			booking_id: bookingId,
			dishes_selected: dishes,
			guests: guests,
			email: email,
			legalAge: legalAge
		};
		
		// 2 - Find booking to grab non modificable data and check if has been modified
		
		const data = await reservationModel.find({"booking_id": new RegExp(bookingId, "i")});
		// if no result finder will be null datatype
		if(data.length === 0){ // === 0 throws timeout
			return res.status(404).json({
			dbStatus: conn['mongoStatus'],
			code: 404, 
			title: "Unknown Booking ID", 
			msg: `Booking is not editable because it does not exist.`});
		} else {
		
		const finder = data[0];
		
		const checkEdit = {
		booking_id: finder.booking_id, // value will always be a set of string numbers
		guests: finder.guests, // Has to be the same number
		email: finder.email, // will always be a string with '@'
		legalAge: finder.legalAge // will always be a true boolean type
		// So values will never interfere between them
		}
		const checkEdit2 = { dishes_selected: finder.dishes_selected, // Dishes modification must be done in the other route 
		}
		
		/* if(Object.values(nonEditable).map((val, _ind)=>val === Object.values(checkEdit)[_ind]).map((v)=>v.toString()).indexOf("false") > -1){*/
		
		const occurences = Object.values(checkEdit).filter((occ, _ind) => occ !== Object.values(no_userEditable)[_ind]); // Check if a non editable value changed
		
		const dishOccurences = {
			occurences: 0,
			dishKeys_user: no_userEditable.dishes_selected.map((dsh) => Object.keys(dsh))[0],
			dishNames_user: no_userEditable.dishes_selected.map((dsh) => Object.values(dsh))[0],
			
			dishKeys_default: checkEdit2.dishes_selected.map((dsh) => Object.keys(dsh))[0],
			dishNames_default: checkEdit2.dishes_selected.map((dsh) => Object.values(dsh))[0]
		}
		
		const {dishKeys_user, dishNames_user, dishKeys_default, dishNames_default} = dishOccurences;
		
		for(let i = 0; i< dishKeys_default.length; i++) {
			if(dishKeys_default.indexOf(dishKeys_user)[i] === -1 || dishNames_default.indexOf(dishNames_user)[i] === -1) {
				dishOccurences.occurences = dishOccurences.occurences + 1;
			}
		}
		
		if(occurences.length > 0) {
			const getKeys = (obj, arr) => { // incorrect because of order
			const keys = [];
			let i = 0;
				for(i; i < arr.length; i++) {
				for(let [k, v] of Object.entries(obj)) {
					if(v === arr[i]) {
						keys.push(k)
						}
					}
				}
				return keys;
			}
			
		const no_editableKey = getKeys(checkEdit, occurences);
		console.log(no_editableKey)
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unautorized";
		result.msg = no_editableKey.length > 1 ? `The values of the ${no_editableKey.join(", ")} cannot be edited. Please change these as default in order to proceed.` : `The property ${no_editableKey} cannot be modified. Please change it as it was previously to confirm your edition.` ;
		
		res.setHeader("Object", "Db Edition Failed");
		return res.status(result.code).json(result);	
		
		} else if (dishOccurences.occurences > 0) {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unautorized";
		result.msg = "Cannot change your dishes selection here. Please go to the dishes field list if you want to change your menu or the guest one." 
		
		res.setHeader("Object", "Db Edition Failed");
		return res.status(result.code).json(result);
			
		} else {
		
		const conn_2 = await mongoConnect(MONGO_URI_VERCEL);
		
		const updater = await reservationModel.findOneAndUpdate({booking_id: new RegExp(no_userEditable['booking_id'], "i")}, {...editable})
		
		if(!updater) {
		result.dbStatus = conn_2.mongoStatus;
		result.code = 404;
		result.title = "Edition Exception";
		result.msg = `An error occured during booking edition. The booking may not exist anymore.`;

		res.setHeader("Object", "Edition Exception");
		return res.status(result.code).json(result);	
		
		} else {
			
		result.dbStatus = conn_2.mongoStatus;
		result.code = 201;
		result.title = "Edition Successful";
		result.msg = `Booking ${no_userEditable.booking_id} successfully modified.`;

		res.setHeader("Object", "Edition Accepted");
		return res.status(result.code).json(result);
		
			}
		  }
		}
	}
	catch(err) {
		console.error(err);
		result.code = 500;
		result.title = "Database Edition Issue";
		result.msg = err.message;

		res.setHeader("Object", "Db Edition Failed");
		return res.status(result.code).json(result);	
	}
});

bookatable.options('/dishes-selected-edition/:booking_id', cors())
bookatable.patch('/dishes-selected-edition/:booking_id', cors(), async(req, res)=>{
	result = new Object();
	try {
		
		const conn = await mongoConnect(MONGO_URI_VERCEL);
		
		const bookingId = req.params.booking_id;
		const newDishes = req.body.dishes_selected; // array of objects
		const checker1 = newDishes.length >= 1 && newDishes.length <= 10;
		const checker2 = verifyDishes(newDishes) // array of unknown dish names
		
		if(newDishes.map((dsh) => dsh.id).filter((id) => id === '' || typeof id === 'undefined').length > 0) {
		
		result.dbStatus = conn.mongoStatus;		
		result.code = 401;
		result.title = "Unautorized";
		result.msg = "Cannot proceed further. Please make sure that a dish is selected in each list";
		
		res.setHeader("Object", "Dishes Edition Stopped");
		return res.status(result.code).json(result)	
		
		} else if(!checker1) {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unautorized";
		result.msg = "You must add from 1 to 10 dish(es) in order for your booking to be confirmed.";
		
		res.setHeader("Object", "Dishes Edition Unauthorized");
		return res.status(result.code).json(result)
		
		} else if(checker2.length > 0) {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 401;
		result.title = "Unautorized";
		result.msg = `It seems that ${checker2.join(",")} appear in our list and is not recognized.`;
		
		res.setHeader("Object", "Dishes Edition Unauthorized");
		return res.status(result.code).json(result)
		
		} else {
			
		const conn_2 = await mongoConnect(MONGO_URI_VERCEL);
		
		const mongoQuery = await reservationModel.findOneAndUpdate({booking_id: bookingId}, {$set: {dishes_selected: newDishes}}); // if not found, returns null
		
		if(!mongoQuery) {
		result.dbStatus = conn_2.mongoStatus;
		result.code = 404;
		result.title = "Dishes Edition Error";
		result.msg = `The dishes selected cannot be edited because it was not found. The booking may have been deleted`;

		res.setHeader("Object", "Dishes Edition Error");
		return res.status(result.code).json(result)
		
		} else {
		
		result.dbStatus = conn_2.mongoStatus;
		result.title = "Dishes Edition Success";
		result.msg = 'The dishes selection has been successfully edited.'
		return res.status(201).json(result)
			}
		}		
	}
	catch(err){
		console.error(err);
		result.code = 500;
		result.title = "Database Dishes Edition Issue";
		result.msg = err.message;
		
		res.setHeader("Object", "Db Edition Failure");
		return res.status(result.code).json(result);	
	}
})

bookatable.options('/new-table-deletion/:booking_id', cors())
bookatable.delete('/new-table-deletion/:booking_id', cors(), async(req, res) => {
	result = new Object();
	try {
		
		const conn = await mongoConnect(MONGO_URI_VERCEL);
		
		const bookingId = req.params.booking_id;
		const finder = await reservationModel.findOneAndDelete({"booking_id": bookingId});
		if(!finder) {
			return res.status(404).json({
			dbStatus: conn['mongoStatus'],
			code: 404, 
			title: "Unknown Booking ID", 
			msg: `Booking ${bookingId} cannot be deleted because it does not exist.`
			})
		} else {
		
		result.dbStatus = conn.mongoStatus;
		result.code = 200;
		result.title = "Deletion Successful";
		result.msg = `Booking ${bookingId} successfully deleted.`;

		res.setHeader("Object", "Deletion success");
		return res.status(result.code).json(result);
		}
	} catch(err) {
		console.error(err);
		result.code = 500;
		result.title = "Database Edition Issue";
		result.msg = err.message;
		res.setHeader("Object", "Db Edition Failed");
		return res.status(result.code).json(result);	
		}
})

export default bookatable;