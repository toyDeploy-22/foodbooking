import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

function DishList({ meals }) {

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const navigate = useNavigate();

return(
    <React.Fragment>
    <h1 className='text-center'>Our Dishes</h1>
    {
        meals.length > 0 ? letters.map((letter, _ind)=>
    <div key={_ind + 2}>
    <h2 style={{fontSize: '3rem'}}>
    <Badge bg="secondary">{letter}</Badge>
    </h2>
     <ListGroup>
    {
        meals.filter((meal)=>meal.dish_name[0] === letter).map((meal)=><ListGroup.Item 
        key={meal.dish_id}
        variant="light"
        action
        onClick={()=>navigate(`name?dishname=${meal.dish_name}`)}
        >{meal}</ListGroup.Item>)
    }
    </ListGroup>
    </div>)
    :
    <div 
      id="spinnerContainer" 
      className="text-center">
      <h2>Loading...</h2>
      <div>
      <Spinner animation="border" variant="primary" />
      <Spinner animation="grow" variant="dark" />
      </div>
    </div>
    }
    </React.Fragment>
    )
}

export default DishList;