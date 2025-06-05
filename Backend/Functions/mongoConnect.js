import mongoose from "mongoose";

async function mongoConnect(url) { 
  
  try {
	 
	 if (mongoose.connection.readyState === 1) {
    console.log("MONGO already connected");
    return;
  } else {
	const opts = {dbName: 'restaurant', autoIndex: false, serverSelectionTimeoutMS: 5000, bufferCommands: false};
	const conn = await mongoose.connect(url, opts);
	return conn
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