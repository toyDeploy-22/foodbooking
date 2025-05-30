
import Express from 'express';
import allDishes from '../Src/All_Dishes.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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
});

dishRoute.options('/dish-illustration/:dishid')
dishRoute.get('/dish-illustration/:dishid', (req, res) => {
	try {
		const imgFolder = join(dirname(fileURLToPath(import.meta.url)), '..', 'Src', 'dishes_Pictures');
		const id = req.params.dishid;
		const file = allDishes.filter((dish) => dish.dish_id === id.toUpperCase());
		
		if(file.length > 0) {
		res.sendFile(join(imgFolder, file[0].dish_link + '.jpg'))			
		} else {
		res.sendFile(join(imgFolder,'no-image-available.jpg'))		
		}		
		
	} catch(err) {
		
	const obj = {
		code: 500,
		title: 'Cannot generate image',
		msg: err.message
	}
	res.status(obj.code).json(obj)	
	}
})


export default dishRoute;