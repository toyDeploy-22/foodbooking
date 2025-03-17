import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Image from "../Cover/No_Picture.jpg";

function Homepage({ meals }) { 

    const [position, setPosition] = useState(0); 
    const [noLinks, setNoLinks] = useState([]) ; // filters duplicates

    const dishes = [...meals];

    const changePosition=(p)=> { 
        setPosition(() => p + 1 > dishes.length - 1 ? 0 : p + 1);
    }

    // const FRhost = "http://localhost:3000";
    // const BKhost = "http://localhost:5000";

    const FRhost = "https://foodbooking-frontend.vercel.app";
    const BKhost = "https://foodbooking-backend.vercel.app";

return(
    <Container>
                <Row className="d-flex justify-content-center">
                <Col className='text-center' sm={12} md={8}>
                <h1 className='bg-secondary text-light'>Book & Food</h1>
                <span id="slogan"><i>Need to eat? Just save and go!</i></span>
                <br /><br />
                <Carousel>
                { 
                dishes.length > 0 ? 
                dishes.map((dish) => (
                <Carousel.Item
                 key={"dish-n" + dish.dish_id}
                 onClick={()=>changePosition(position)}>
				 <a href={`${BKhost}/dish/id?dishid=${dish.dish_id}`}>
                <img className="d-block w-100" 
                src={[...noLinks].filter((link) => link === dish.dish_id).length === 0 ? `${BKhost}/dish/picture/${dish['dish_link']}.jpg` : Image} 
                alt={dish.dish_name + " picture"}
                onError={()=>setNoLinks(new Set([...noLinks, dish.dish_id]))}/>
				</a>
                <Carousel.Caption>
                <h3 className='text-center'><span className='bg-dark p-1'>{dish.dish_name}</span></h3>
                <p>{''}</p>
                <p><i className='bg-success p-1'>{dish.dish_description}</i></p>
                </Carousel.Caption>
                </Carousel.Item>))
                :
                <div className="bg-dark text-danger">
                <h3>Cannot Show Images</h3>
                </div>
                }
                </Carousel>
                </Col>
                </Row>
            </Container>
    )
}

export default Homepage;