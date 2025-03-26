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

const mongoStats = (connection) => {
	const foundData = {dbService: 'MongoDB'};
	const unknownData = {
		dbName: 'Db Name unknown',
		dbHost: 'Db Host unknown',
		dbPort: 'Port unknown'
		};
	const resultData = {};

const statement = connection.hasOwnProperty('db') && connection.db.hasOwnProperty('s') && connection.db['s'].hasOwnProperty('namespace') && connection.db.s['namespace'].hasOwnProperty('db');

if(statement) {
	const finalData = {
		dbName: dbData.db.s.namespace.db || 'Db Name Not Found',
		dbHost: connection.host.substring(27) || 'Db Host Not Found',
		dbPort: connection.port || 'Port Not Found'
		};
	Object.assign(resultData, foundData, finalData) 
} else {
	Object.assign(resultData, foundData, unknownData)
	}
	return resultData
}


export { mongoConnect, successMsg, failureMsg, mongoStats };