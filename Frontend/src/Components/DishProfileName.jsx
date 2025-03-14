
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// or can be import {useParams} from 'react-router-dom';
import Figure from 'react-bootstrap/Figure';
import Stack from 'react-bootstrap/Stack';
import LoadingElement from './loadingElement.jsx';
import ErrorElement from "./errorElement";
import dishSchena from '../Functions/dishSchema';

function DishProfileName ({ meals }) {

    const [dishSelected, setDishSelected] = useState({
        ...dishSchena
    });
    const [loader, setLoader] = useState(false);
    const [dishSearch, setDishSearch] = useSearchParams(); 
    // useSearchParams does not have initial state because comes from URL
    const [Error, setError] = useState(false);

    // or const { dishId } = useParams();

//        const url = `http://localhost:5000/dish/id?dish_id=${dishId}`; 

/**
let dishSelected = meals.filter((dish)=> dish.dish_link.includes(dishSearch.get('dishname').toLowerCase()))[0];
**/

useEffect(()=>{
    try {
    setLoader(true);
    let dishname = dishSearch.get('dishname').toLowerCase();
    setDishSelected(()=>meals.filter((dish)=>dish.dish_link.includes(dishname))[0]);
    setLoader(false);
    } catch(err){
        setLoader(false);
        setError(true);
        console.error(err)
    }
}, [])

if(Error === true) {
    return(ErrorElement)
} else {
return (
        <Stack>
<h3 className="bg-success p-2 text-light">{dishSelected.dish_name ? dishSelected.dish_name : "Dish Card"}</h3>
            { loader === true &&
                <LoadingElement />
            }

            {
            !loader &&
             dishSelected.dish_id ?
               <Figure>
               <Figure.Image
                 alt={dishSelected.dish_name}
                 src={`http://localhost:5000/dish/picture/${dishSelected.dish_link}.jpg`}
               />
               <Figure.Caption>
               <p className="bg-secondary text-light fst-italic">{dishSelected.dish_description}</p>
               <ul className="ingredients" >
                <li 
                style={{listStyle: 'none', fontFamily: 'inherit', fontSize: 'initial'}}
                className="p-2 border border-primary text-primary fw-bold">Ingredients:</li>
                <br /><div className="border border-dark dishMenuColor" >
                {
                    dishSelected.dish_ingredients.map((igr, _ind)=><li 
                    className="text-light pt-1 pb-3"
                    key={'dish-N0' + _ind}>{igr}</li>)
                }
                </div>
               </ul>
               <br />
               <h5 className="bg-dark text-light p-2">{dishSelected.dish_price}{dishSelected.dish_symbol}</h5>
               </Figure.Caption>
             </Figure>
             :
             <div>
            <h5>No Dish Found</h5>
            <p><span className="bg-primary text-light">We did not find any dish with your query...</span></p>
            <p><span className="bg-secondary text-light">Please verify the name or id of the dish you are searching.</span></p>
             </div>
            }
        </Stack>)
    }
}

export default DishProfileName;