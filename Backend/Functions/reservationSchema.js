// Local
import { legalAge, validEmail, validDish, extraComment, valiDate } from './validatorSchema.js';
// 3rd party
import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
	id: {type: String},
	name: {type: String}
});

const reservationClient = {
        first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		// if database is dropped, use .init to sync database in order for unique to work
        phone: { type: String, required: true },
        guests: { type: Number, default:0, max: 10, required: true },
		dishes_selected: {type: [dishSchema], validate: validDish, required: true },
        smoking: { type: Boolean, default: false, required: true },
        bookDay: { type: String, validate: valiDate, required: true }, 
		// We choose String type for bookDay because date & time are separated. 
		// Date type are for createdAt & updatedAt
		bookTime: { type: String, required: true },
        extra: { type: String, validate: extraComment, required: false }, 
		legalAge: { type: Boolean, required: true, validate: legalAge },
		booking_id: {type: String, required: true}
}

const reservationSchema = new mongoose.Schema(reservationClient, {collection: 'booking', timestamps: true });
// timestamps accessible with properties .createdAt & model.updatedAt;

const reservationModel = mongoose.model('', reservationSchema);

export default reservationModel; 