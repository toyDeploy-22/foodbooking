
const noNumber = RegExp(/[-0-9]/gm); // matches any "-" and number

export const getDishes = (meals, dish) => {
    // meal is the API , dish is the string dish

    const numbers = dish.match(noNumber);
    const newDish = dish.replace(numbers.join(""), "");

    const getId = (dsh) => {
        return meals.filter((meal) => meal.dish_name === dsh).map((dsh) => dsh.dish_id)
    }

// dish
    const userDish = {
        id: getId(newDish).length < 1 ? '' : getId(newDish)[0], 
        name: newDish
        };
    
    const userDishes = [userDish];
    
    return userDishes

}

export const getGuestDishes = (meals, dish) => { 

/* 
- meals is the meals API list, dish should be the dishes values with "-" + number 
- dish is the selected dishes string values array
*/
        
        const guestsDishes_Selected = [];

        // WE SUGGEST THAT DSH PLACEHOLDER IS SUPPOSED TO BE THE OBJECT VALUES OF THE DISHES SELECTION FOR THE GUESTS
        
        for(let i = 0; i < dish.length; i++) {
        const dish_selected = {};
        // Step 1 : remove the "-" and "number" at the end of the dish name
        const extraChar = dish[i].match(noNumber); // returns an array
        // const index = Number(extraChar.filter((noDash) => noDash !== "-").reduce((a,b) => a+b));
        const newValue = dish[i].replace(extraChar.join(""), "");
        // Step 2 : Find the dish id of the dish name
        const idFound = meals.filter((meal) => meal.dish_name.toLowerCase() === newValue.toLowerCase()).map((dsh) => {return {id: dsh.dish_id, name: dsh.dish_name}});

        if(idFound.length < 1) {
            dish_selected.id = '';
            dish_selected.name = dish[i];
            } else {
            dish_selected.id = idFound[0].id;
            dish_selected.name = idFound[0].name
            }

            guestsDishes_Selected.push(dish_selected)
        }
        return guestsDishes_Selected; // should be array of object dish_selected schema
    }
