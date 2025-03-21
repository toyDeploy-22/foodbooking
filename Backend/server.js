// core
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// local
import { mongoConnect, successMsg, failureMsg } from './Functions/mongoConnect.js';
import bookatable from './Routes/bookatable.js';
import dishRoute from './Routes/dishesRoutes.js';
// 3rd party
import Express from 'express';
import cors from "cors";

// variables
const myServer = Express();
const htmlSuccessPage = join(dirname(fileURLToPath(import.meta.url)), 'htmlSuccessPage.html');
// destructuring
const { MY_PORT, MONGO_URI, MONGO_URI_VERCEL } = process.env;
// MONGO_URI for testing purpose

/*

S E C U R I T Y

const whitelist = ['http://localhost:5000',
'https://foodbooking-frontend.vercel.app'];

const corsOpts = {
  origin: function (origin, callback) {
	if (whitelist.indexOf(origin) > -1) {
	  callback(null, true)
	} else {
	  callback(new Error('Request not allowed by CORS'))
	}
  }};
*/

const routes = [
{route: "/reservation", path: bookatable}, 
{route: "/dish", path: dishRoute} 
// ,{route: "/dish/picture", path: Express.static('Src/dishes_Pictures', {extensions: ['jpeg', 'jpg', 'png']})}
];

// middlewares
myServer.use(Express.json());
myServer.use(cors());
myServer.use(Express.static(join(dirname(fileURLToPath(import.meta.url)), "Src", "dishes_Pictures")));
myServer.get("/", (req, res) => {
	const details = mongoConnect(MONGO_URI_VERCEL);
	
	details.then((data) => {
		res.setHeader('db-Service', 'MongoDB');
		res.setHeader('db-Host', details.host);
		res.setHeader('db-Name', details.database)
		}).res.json(details.connection)
		//.then(() => res.sendFile(htmlSuccessPage))
		.catch((err) => { 
			console.error(err);
			res.status(500).json(err)
			/*
			res.status(500).send("Ooops, something wrong occurs. Please open again this page. Contact your administrator if you see again this page.")*/
			})
});

routes.forEach((r) => myServer.use(r.route, r.path));

// do

myServer.listen(MY_PORT, ()=>{
	// prefer createConnection() if the URI is custom:
	// const connection = mongoConnect(MONGO_URI);
	const connection = mongoConnect(MONGO_URI_VERCEL);
	console.log("Step 1: Server connection success on port " + MY_PORT + " !");
	connection.then((data)=>{ 
		console.log("Step 2: ", successMsg)
	})
	.catch((err)=>console.error(JSON.stringify(failureMsg(err))))
	});

myServer.on("error", (err)=>{
	const result = { 
		title: 'Server Connection NOK', 
		msg: err.message
	};
	console.error(JSON.stringify(result));
})