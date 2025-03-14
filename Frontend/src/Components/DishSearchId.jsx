import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ListGroup from 'react-bootstrap/ListGroup';

function DishSearchId ({ meals }) {

    const [dishId, setDishId] = useState("");

    // const dishes = [...meals];

    const handleDish = (e) => {
        let { name, value } = e.target;
        console.log({
            field: name, 
            val: value 
        });
        
        setDishId(()=>value);
    }
    
    const navigate = useNavigate();
    const navToDish = (idq) => {
        // dish/name?dishId=" + dish.dish_name
        navigate(`/dish/id?dishid=${idq}`)
    }

    return(
        <Stack className="text-center">
            <h3 className="bg-dark py-2 text-info fw-bold display-6">Dish ID Search</h3>
            <br />
        <FloatingLabel className="mb-3" controlId="dishId"
        label="Dish Id">
          <Form.Control 
          type="text" placeholder="Dish ID" 
          name="dishId"
          value={dishId}
          onChange={handleDish}
          />
          <Form.Text className="text-muted fst-italic">
        In order to find a dish type its ID.
          </Form.Text>
        </FloatingLabel>
        <br />
        {
            dishId.length > 3 && <ListGroup variant="flush">
            {
                meals.filter((dish)=>dish.dish_id === dishId.toUpperCase()).length > 0 ? (
                meals.filter((dish)=>dish.dish_id === dishId.toUpperCase()).map((dish, _ind)=><ListGroup.Item 
                className="border border-success fw-bold text-dark"
                key={dish.dish_id + _ind} 
                action 
                onClick={()=>navToDish(dish.dish_id)}>
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
        </Stack>

    )
}

export default DishSearchId;