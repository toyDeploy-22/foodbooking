import mongoose from "mongoose";

async function mongoConnect(url) { 
  
  try {
	  
	 const mongoStatus = {};
	 
	 if (mongoose.connection.readyState === 1) {
	/*
	testing:
	console.log("Already connected to MongoDB");
    return;
	*/
	mongoStatus = 'Already connected to FoodBooking database';
	
	return mongoStatus
		
  } else {
	const opts = {dbName: 'restaurant', autoIndex: false, serverSelectionTimeoutMS: 5000, bufferCommands: false
	};
	const conn = await mongoose.connect(url, opts);
	
	mongoStatus = 'FoodBooking database successful';
	
	return mongoStatus
	
  }} catch(err) {
	  console.error(err);
	  return {nok: true, error: err.message}
  }
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
		dbName: 'Foodbooking Db',
		dbHost: 'cluster0...mongodb.net',
		dbPort: 27017
		};

export { mongoConnect, successMsg, failureMsg, mongoStats };