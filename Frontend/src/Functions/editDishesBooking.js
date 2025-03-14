import axios from "axios";

const result = {};
let newSignal;

async function editDishesBooking(id, dishes) {
    try {
        if(newSignal) { 
            newSignal.abort() 
        }

        const noId = dishes.filter((ud) => ud.id === '').length > 0 
        
        if(noId) {
        result.code = 401;
        result.title = 'Unknown Dish';
        result.msg = 'One of the dishes is unknown. Please make sure that you select the specified dishes of the list.'

        return result;
        } else {      
        newSignal = new AbortController();

        const route = {
            url: `http://localhost:5000/reservation/dishes-selected-edition/${id}`,
            method: 'patch'
        };
            
        const postData = {
            dishes_selected: dishes 
            // only value after "data:" is sent, not the key "data:", so can get the data with req.body.dishes_selected, and not req.body.data.dishes_selected.
            };

            const postOptions = {
           headers: { 
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*"
           },
            signal: newSignal.signal
            };

        const sender = await axios({...route, data: {...postData}, postOptions});
        console.log(sender)

        if(sender.status >= 200 && sender.status < 300) {
            result.code = 201;
            result.title = "Success";
            result.msg = "The dishes of your guests have been successfully edited."
        } else {
            result.code = 404;
            result.title = "Guests Dishes Edition Failed";
            result.msg = "The edition of your guest dishes failed. Please make sure that your booking still exists and try again."
            }
            return result
        }
    } catch(err) {
        console.error(JSON.stringify(err));
       // can check with err.name === 'AbortError' if without axios
        if(axios.isCancel(err)) {

            result.code = 408; // Error 408 is Timeout error
            result.title = "Connection Aborted";
            result.message = "The connection has been aborted due to an error. Please try again."
        } else {
            
            result.code = 500;
            result.title = "Internal Server Error";
            result.message = "Please try again and contact your administrator if the issue persists."
        }
            return result;
    }
}

export default editDishesBooking;