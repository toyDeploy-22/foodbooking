
import Express from 'express';
import allDishes from '../Src/All_Dishes.js';

const dishRoute = Express.Router();

dishRoute.get("/alldishes", (req, res)=>{
	try {
		res.json(allDishes)
	} catch(err) {
		console.error(err);
		res.status(500).send({
		ok: false, 
		title: 'Server Error',
		msg: 'A server error occured. Please try again and contact your administratror if the issue still persists.'
		})	
	}
})

dishRoute.get('/id', (req, res)=>{
	// dish/id?dishid=...
	try {
	const dishId = req.query.dishid;
	const dish_Select = allDishes.filter((dish)=> dish.dish_id.toLowerCase() === dishId.toLowerCase());
	if(dish_Select.length > 0) {
	res.json(dish_Select[0])
	} else {
	console.error("ID" + " " + dishId + " " + "not found");
	res.status(404).send({
		ok: false, 
		title: 'Dish not found',
		msg: 'The dish you are looking for is not found. Please check again the dish id.'
	})	
		}
 	} catch(err) {
	console.error(err);
	res.status(500).send({
		ok: false, 
		title: 'Server Error',
		msg: 'A server error occured. Please try again and contact your administratror if the issue still persists.'
		})	
	}
})


dishRoute.get("/name", (req, res)=>{
	// dish/name?dishname=...
	try {
	const dishName = req.query.dishname;
	const dishFound = allDishes.filter((dish)=>dish.dish_link.includes(dishName.toLowerCase()));
	if(dishFound.length > 0) {
		res.json(dishFound)[0]
	} else {
	console.error("Name" + " " + dishName + " " + "not found");
	res.status(404).send({
		ok: false, 
		title: 'Dish not found',
		msg: 'The dish you are looking for is not found. Please check again the dish name characters have typed.'
	})
		}
	} catch(err) {
		console.error(err);
	res.status(500).send({
		ok: false, 
		title: 'Server Error',
		msg: 'A server error occured. Please try again and contact your administratror if the issue still persists.'
		})	
	}
})


export default dishRoute;