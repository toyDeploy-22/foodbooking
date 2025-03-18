import allIngredients from './ingredients.js';

const returnIngredients = (dishid) => {
	return allIngredients.filter((ingredient)=>dishid === ingredient.forId).map((ingr)=>ingr.ingredients)[0]
}

const allDishes = [
    {
        "id": "01",
        "dish_id": "D001",
        "dish_name": "Dessert Salad",
		"dish_link": "dessert-salad",
        "dish_img": "https://foodbooking-backend.vercel.app/dish_images/dessert-salad.jpg",
        "dish_description": "A succulent, sweet and healthy fresh dessert to charge energy!",
		"dish_ingredients": returnIngredients("D001"),
        "dish_price": 7.50,
        "dish_devise": "euros",
        "dish_symbol": "€",
        "dish_averageReview": '' 
    },
    {
        "id": "02",
        "dish_id": "D002",
        "dish_name": "Skew Mix",
		"dish_link": "skew-mix",
        "dish_img": "https://foodbooking-backend.vercel.app/dish_images/skew-mix.jpg",
        "dish_description": "Our tasty and handmade grilled skewered chicken with sea food combo.",
		"dish_ingredients": returnIngredients("D002"),
        "dish_price": 15.00,
        "dish_devise": "euros",
        "dish_symbol": "€",
        "dish_averageReview": '' 
    },
    {
        "id": "03",
        "dish_id": "D003",
        "dish_name": "Vegetables Fresh Salad",
		"dish_link": "vegetables-fresh-salad",
        "dish_img": "https://foodbooking-backend.vercel.app/dish_images/vegetables-fresh-salad.jpg",
        "dish_description": "A nutritive fresh salad to maintain weight loss.",
		"dish_ingredients": returnIngredients("D003"),
        "dish_price": 8.00,
        "dish_devise": "euros",
        "dish_symbol": "€",
        "dish_averageReview": '' 
    },

];

export default allDishes;