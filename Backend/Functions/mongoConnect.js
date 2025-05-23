import mongoose from "mongoose";

async function mongoConnect(url) { 
	const opts = {dbName: 'restaurant'};
	const conn = await mongoose.connect(url, opts);
	return conn
}

const successMsg = {
	ok: true,
	code: 200,
	msg: 'Restaurant database connection successful !'
	};

const failureMsg = (error) => {
		return {
		ok: false,
		code: 500,
		title: 'DB connection failed',
		msg: error.message || 'database connection failed. Please try again later.'
		}
}

const mongoStats = {
		dbService: 'MongoDB',
		dbName: 'Db Name unknown',
		dbHost: 'cluster0...mongodb.net',
		dbPort: 27017
		};

export { mongoConnect, successMsg, failureMsg, mongoStats };