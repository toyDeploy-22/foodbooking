// import { useState } from 'react';
// import dishSchema from '../Functions/dishSchema';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import NoImage from "../Cover/No_Picture.jpg";

function Homepage({ meals }) { 

    // const [dishes, setDishes] = useState([dishSchema])
    // const [position, setPosition] = useState(0); 

    /*
    useEffect(() => {
    Array.isArray(meals) && meals[0].dish_id ? setDishes([...meals]) : setDishes([]);
    }, [])
    */

    const setLink = (e) => {
        e.target.src = NoImage
    }

    /*
    const changePosition=(p)=> { 
        setPosition(() => p + 1 > dishes.length - 1 ? 0 : p + 1);
    }
    */

    // const FRhost = "http://localhost:3000";
    // const BKhost = "http://localhost:5000";

    const FRhost = "https://foodbooking-frontend.vercel.app";
    const BKhost = "https://foodbooking-backend.vercel.app";

return(
    <Container>
                <Row className="d-flex justify-content-center">
                { 
                meals.length > 0 ? 
                <Col className='text-center' sm={12} md={8}>
                <h1 className='bg-secondary text-light'>Book & Food</h1>
                <span id="slogan"><i>Need to eat? Just save and go!</i></span>
                <br /><br />
                <Carousel>
                {meals.map((dish) => (
                <Carousel.Item
                 key={"dish-n" + dish.dish_id}>
				 <a href={`${FRhost}/dish/id?dishid=${dish.dish_id}`}>
                <img className="d-block w-100"
                src={BKhost + '/dish-illustration/' + dish.dish_id} 
                alt={dish.dish_name + " picture"}
                onError={setLink} />
				</a>
                <Carousel.Caption>
                <h3 className='text-center'><span className='bg-dark p-1'>{dish.dish_name}</span></h3>
                <p>{''}</p>
                <p><i className='bg-success p-1'>{dish.dish_description}</i></p>
                </Carousel.Caption>
                </Carousel.Item>))
                }
                </Carousel>
                </Col>
                :
                <Col className='text-center' sm={12} md={8}>
                <h1 className='bg-secondary text-light'>Book & Food</h1>
                <span id="slogan"><i>Need to eat? Just save and go!</i></span>
                <br /><br />
                <div className="text-center bg-dark text-danger">
                <h3>Cannot Show Images</h3>
                </div>
                </Col>}
                </Row>
            </Container>
    )
}

export default Homepage;