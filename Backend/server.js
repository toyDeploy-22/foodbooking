// core
// local
import { mongoConnect, successMsg, failureMsg } from './Functions/mongoConnect.js';
import bookatable from './Routes/bookatable.js';
import dishRoute from './Routes/dishesRoutes.js';
import htmlSuccessMsg from './htmlSuccessString.js';
// 3rd party
import Express from 'express';

// variables
const myServer = Express();
// destructuring
const { MY_PORT, MONGO_URL } = process.env;

// const corsOptions = {origin: "*"}
const routes = [
{route: "/reservation", path: bookatable}, 
{route: "/dish", path: dishRoute}, 
{route: "/dish/picture", path: Express.static('Src/dishes_Pictures', {extensions: ['jpeg', 'jpg', 'png']})}];

// middlewares
myServer.use(Express.json());
// myServer.use(cors(corsOptions));

myServer.use("/", (req, res) => {
 res.send(htmlSuccessMsg)
})
routes.forEach((r) => myServer.use(r.route, r.path));

// do

myServer.listen(MY_PORT, ()=>{
	const connection = mongoConnect(MONGO_URL);
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