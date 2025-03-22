import mongoose from "mongoose";

function mongoConnect(url) { 
	const opts = {dbName: 'restaurant'};
	const conn = mongoose.createConnection(url, opts).asPromise();
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

export { mongoConnect, successMsg, failureMsg };