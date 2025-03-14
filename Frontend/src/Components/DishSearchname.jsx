import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ListGroup from 'react-bootstrap/ListGroup';

function DishSearchName ({ meals }) {

    const [dishName, setDishName] = useState("");

    // const dishes = [...meals];

    const handleDish = (e) => {
        let { name, value } = e.target;
        console.log({
            field: name, 
            val: value 
        });
        
        setDishName(()=>value);
    }
    
    const navigate = useNavigate();
    const navToDish = (nameq) => {
        // dish/name?dishname=" + dish.dish_name
        navigate(`/dish/name?dishname=${nameq}`)
    }

    return(
        <Form className="text-center">
            <h3 className="bg-secondary py-2 text-light fw-bold display-6">Dish Name Search</h3>
            <br />
        <FloatingLabel className="mb-3" controlId="dishName"
        label="Dish Name">
          <Form.Control 
          type="text" placeholder="Dish Name" 
          name="dishName"
          value={dishName}
          onChange={handleDish}
          />
          <Form.Text className="text-muted fst-italic">
        Type at least 4 characters in order to find a dish.
          </Form.Text>
        </FloatingLabel>
        <br />
        {
            dishName.length > 3 && <ListGroup variant="flush">
            <div className="h6 py-2 mb-2 border border-secondary bg-secondary text-light" style={{width: '25%', fontSize: '1.15em', textIndent: '1em'}}>Results Found {':'}</div>
            { 
                meals.filter((dish)=>dish.dish_name.toLowerCase().includes(dishName.toLowerCase())).length > 0 ? (
                meals.filter((dish)=>dish.dish_name.toLowerCase().includes(dishName.toLowerCase())).map((dish, _ind)=><ListGroup.Item 
                className="border border-success fw-bold text-dark text-center"
                style={{fontSize: '1.25em'}}
                key={dish.dish_id + _ind} 
                action 
                onClick={()=>navToDish(dish.dish_link)}>
                {dish.dish_name}
              </ListGroup.Item>)
                ) : (
            <ListGroup.Item disabled><b>0</b> <span>Dish Found.</span>
            <br />
            <small className="text-muted fst-italic">Make sure you entered the correct characters.</small>
            </ListGroup.Item>
               )
            }
            </ListGroup>
        }
        </Form>

    )
}

export default DishSearchName;