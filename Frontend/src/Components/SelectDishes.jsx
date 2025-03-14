import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';


// const labelStyle = 'fw-bold text-primary';

const getIndexes = (ind) => {
  let indexContainer = [];
   if(ind > 0 && ind <= 10) {
    let i = 0;
    for(i; i <= ind; i++) {
      indexContainer[i] = ind - i
    } 
    return indexContainer.sort((a,b)=>a>b ? 1 : -1)
   } else {
    return indexContainer
   }
   }

function LoadingNumber () {

return(
  <div>
  <Spinner animation="border" variant="secondary"/>
  {' '}
  <span className="h3 text-secondary">Loading dishes...</span>
  </div>)
} 


function IncorrectNumber () {

return(
  <div>
  <br />
  <Alert variant="warning">The guest number is not recognized. Please select a correct guest number in the list</Alert>
  </div>)
} 

// R E S E R V A T I O N  P A G E

function ReservationUserDish({ meals, hasGuests, handler }) {
// look for id afterwards
    return(
        <Form.Group controlId='dishes'>
         <Form.Select size="lg"
        disabled={hasGuests ? true : false}
        aria-label='Your Dish'
        name={'guestDishes_0'}
        onChange={handler}>
        <option id="D000" value="D000">Select your first dish</option>
        {
          meals.map((allDishes, _ind) => <option key={`dish-${allDishes.id}`} id={allDishes.dish_id} value={`${allDishes.dish_name}-${_ind + 1}`}>{allDishes.dish_name}</option>)
        }
      </Form.Select>
      <Form.Text>{hasGuests ? 'It seems that you are coming with guests. If that so, please select the number of guests in the field above before the menu selection. If you go alone, modify it in the "Guests" section' : 'Which speciality will you choose ?'}</Form.Text>
      <br /><br />
      </Form.Group>)
  }


function ReservationGuestsDishes({ index, meals, handler }) {

return(
  <React.Fragment>
  { index.map((elemNumber, _ind) =>
  <Form.Group key={`${elemNumber}-${_ind + 1}`} controlId={`guestDishes_${elemNumber}`} >
   <Form.Label>
        { elemNumber === 0 ?
        <Form.Text>Speciality for <b>you</b></Form.Text>
        :
        <Form.Text>Speciality for your <b>{elemNumber}<sup>{(Number(elemNumber)) === 1 ? 'st' : (Number(elemNumber)) === 2 ? 'nd' : (Number(elemNumber)) === 3 ? 'rd' : 'th' }</sup></b> Guest:</Form.Text>
          }
        </Form.Label>
         <Form.Select
        aria-label='Guests Dishes'
        name={`guestDishes_${elemNumber}`}
        defaultValue={meals[0].dish_name}
        /*value={dishes_selected[index === 0 ? 0 : index - 1]}*/
        onChange={handler}>
        <option id="D000" value="D000">Select a guest dish</option>
        {
          meals.map((allDishes, _ind) => <option key={`dish-${allDishes.id}`} id={allDishes.dish_id} value={`${allDishes.dish_name}-${_ind + 1}`}>{allDishes.dish_name}</option>)
        }
      </Form.Select>
      </ Form.Group>
      )}
      </React.Fragment>)
}

export function ReservationSelectDishes ({ guests, meals, hasGuests, handler }) {
  
  const [indexes, setIndexes] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
  setLoader(true);
  setIndexes(() => guests === 0 ? [0] : getIndexes(guests));
  setLoader(false);
}, [guests]);

return(
  <React.Fragment>
    { loader ?
    <LoadingNumber />
    :
    indexes.length === 1 ?
    <ReservationUserDish meals={meals} hasGuests={hasGuests} handler={handler} />
    :
    indexes.length > 1 ?
    <ReservationGuestsDishes index={indexes} meals={meals} handler={handler} />
    :
    <IncorrectNumber />
    }
  </React.Fragment>
  )
}


// B O O K I N G  D E T A I L S


export function UserSelectDish({ guests, meals, dishName, dishes_selected, handler }) {
// look for id afterwards
    return(
      <>
      {guests === 0 ?
        <Form.Group controlId='dishes'>
         <Form.Select size="lg"
        aria-label='Your Dish'
        name={dishName}
        defaultValue={dishes_selected[0].name}
        onChange={handler}>
        <option id="D000" value="D000">Select your first dish</option>
        {
          meals.map((allDishes, _ind) => <option key={`dish-${allDishes.id}`} id={allDishes.dish_id} value={`${allDishes.dish_name}-${_ind + 1}`}>{allDishes.dish_name}</option>)
        }
      </Form.Select>
      <Form.Text>Which speciality will you choose {'?'}</Form.Text>
      <br /><br />
      </Form.Group>
      :
      <IncorrectNumber />
      }
      </>)

}

/*
 function ComponentTemplate ({ meals, dishes_selected, handler, index }) {
  
  return(
   <Form.Group controlId={`guestDishes_${index}`} >
   <Form.Label>
        <Form.Text>Which speciality your <b>{index}<sup>{(Number(index)) === 2 ? 'nd' : (Number(index)) === 3 ? 'rd' : 'th' }</sup></b> guest will choose {'?'}</Form.Text></Form.Label>
         <Form.Select
        aria-label='Guests Dishes'
        name={`guestDishes_${index}`}
        defaultValue={''}
        // value={dishes_selected[index === 0 ? 0 : index - 1]}
        onChange={handler}>
        <option value="" disabled>Select a guest dish</option>
        {
          meals.map((allDishes, _ind) => <option key={`dish-${allDishes.id}`} id={allDishes.dish_id} value={`${allDishes.dish_name}-${index}`}>{allDishes.dish_name}</option>)
        }
      </Form.Select>
      </ Form.Group>
    )
      }
      */

      // for POST
    export function GuestsDishesDetails ({ guests, dishes_selected }) {
      const authorizedGuests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(guests) > - 1 && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(guests) <= 10;
      const authorizedDishes = dishes_selected.length > 1; // at least one guestdish should be booked (the first index is always the user dish, not the guest dish)

  // console.log(dishes_selected)

  return(
    <>
    { authorizedGuests && authorizedDishes ?
    <React.Fragment>
    {dishes_selected.map((dsh, _ind) => 
        <div key={dsh.id + '-' + _ind}>
        {_ind === 0 ?
        <Form.Text>Which speciality will you choose {'?'}</Form.Text>
        :
        <Form.Text>
        Which speciality your <b>{_ind}<sup>{(Number(_ind)) === 1 ? 'st' : (Number(_ind)) === 2 ? 'nd' : (Number(_ind)) === 3 ? 'rd' : 'th' }</sup></b> guest will choose {'?'}
        </Form.Text>
        }
        <Form.Select
        disabled
        aria-label='Guests Dishes'
        name={`guestDishes_${_ind + 1}`}
        defaultValue={dsh.name}
        /*value={dishes_selected[index === 0 ? 0 : index - 1]}*/
        >
        <option value={dsh.name}>{dsh.name}</option>
        </Form.Select>
        </div>)}
  <Form.Text>Note: The order and assignement of your guests dishes is not important.</Form.Text>
  <br />
  </React.Fragment>
  :
  <IncorrectNumber />}
  </>)
 }


export function GuestsSelectDishes({ meals, guests, /*dishes_selected,*/ handler }) {

const [indexes, setIndexes] = useState([0]);

useEffect(() => {
  const allIndexes = getIndexes(guests);
  setIndexes(allIndexes);
}, [guests])

return(
  <React.Fragment>
  { indexes.length > 0 ?
  indexes.map((elemNumber, _ind) =>
  <Form.Group key={`${elemNumber}-${_ind + 1}`} controlId={`guestDishes_${elemNumber}`} >
   <Form.Label>
        { elemNumber === 0 ?
        <Form.Text>Speciality for <b>you</b></Form.Text>
        :
        <Form.Text>Speciality for your <b>{elemNumber}<sup>{(Number(elemNumber)) === 1 ? 'st' : (Number(elemNumber)) === 2 ? 'nd' : (Number(elemNumber)) === 3 ? 'rd' : 'th' }</sup></b> Guest:</Form.Text>
          }
        </Form.Label>
         <Form.Select
        aria-label='Guests Dishes'
        name={`guestDishes_${elemNumber}`}
        defaultValue={meals[elemNumber].dish_name}
        /*value={dishes_selected[indexes === 0 ? 0 : indexes - 1]}*/
        onChange={handler}>
        <option id="D000" value="D000">Select a guest dish</option>
        {
          meals.map((allDishes, _ind) => <option key={`dish-${allDishes.id}`} id={allDishes.dish_id} value={`${allDishes.dish_name}-${_ind + 1}`}>{allDishes.dish_name}</option>)
        }
      </Form.Select>
      </ Form.Group>)
      :
      <IncorrectNumber />
        }
      </React.Fragment>)
}

