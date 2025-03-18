
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// or can be import {useParams} from 'react-router-dom';
import Figure from 'react-bootstrap/Figure';
import Stack from 'react-bootstrap/Stack';
import LoadingElement from "./loadingElement.jsx";
import ErrorElement from "./errorElement";
import dishSchema from '../Functions/dishSchema';
import Image from "../Cover/No_Picture.jpg";

function DishProfileId ({ meals }) {

    const [dishSelected, setDishSelected] = useState({
        ...dishSchema
    });
    const [loader, setLoader] = useState(false);
    const [dishSearch, setDishSearch] = useSearchParams(); 
    // useSearchParams does not have initial state because comes from URL
    const [noLink, setNoLink] =  useState(false);
    const [Error, setError] = useState(false);
    // const host = "http://localhost:5000";
    const host = "https://foodbooking-backend.vercel.app";

    // or const { dishId } = useParams(); 

/**
let dishSelected = meals.filter((dish)=> dish.dish_link.includes(dishSearch.get('dishname').toLowerCase()))[0];
**/

useEffect(()=>{
    try {
    setLoader(true);
    let dishid = dishSearch.get('dishid').toLowerCase();
    setDishSelected(()=>meals.filter((dish)=>dish.dish_id === dishid.toUpperCase())[0]);
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
        <Stack gap={2} className="text-center">
<h3 className="bg-success p-2 text-light">{dishSelected.dish_name ? dishSelected.dish_name : "Dish Card"}</h3>
            { loader === true &&
                <LoadingElement />
            }

            {
            !loader &&
             dishSelected.dish_id ?
               <Figure className="w-100">
               <Figure.Image 
                 className={!noLink ? "w-75" : "w-50"}
                 rounded={!noLink ? false : true}
                 alt={dishSelected.dish_name}
                 src={ !noLink ? `${host}/${dishSelected.dish_file}` : Image }
                 onError={() => setNoLink(true)}
               />
               <Figure.Caption>
               <p className="bg-secondary py-2 text-light h6 fst-italic">{dishSelected.dish_description}</p>
               <br/>
               <ul className="ingredients d-flex flex-column align-items-center" >
                <li 
                style={{listStyle: 'none', fontFamily: 'tahoma, arial, courrier new', letterSpacing: '2px', fontSize: '2em'}}
                className="bg-light p-2 border border-primary text-primary fw-bold">Ingredients:</li>
                <br /><div className="border border-dark dishMenuColor pt-3" >
                {
                    dishSelected.dish_ingredients.map((igr, _ind)=><li 
                    className="text-light pt-1 pb-3 px-2 h5"
                    key={'dish-N0' + _ind}>{igr}</li>)
                }
                </div>
               </ul>
               <br />
               <h4 className="bg-dark text-light display-4 p-2" style={{width: '60%', borderRadius: '2px 15px', margin: 'auto'}}>{dishSelected.dish_price.toFixed(2)}{dishSelected.dish_symbol}</h4>
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

export default DishProfileId;