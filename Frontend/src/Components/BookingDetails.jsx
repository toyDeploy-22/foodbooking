
// main
import React, { useState, useEffect } from "react";
import { useParams, redirect } from "react-router-dom";

// functions
import { bookingSchema } from "../Functions/bookingSchema.js";
import BookingError from "./BookingError.jsx";
import editDishesBooking from "../Functions/editDishesBooking.js";
import { notFoundError, internalServerError } from "../Functions/sendSearch.js";
// import { msgSchema } from '../Functions/reservationValidator.js';
// import { dateVal, timeVal } from '../Functions/dateValidation.js';
import { emailMatcher, matcher } from '../Functions/matchers.js';
import editBooking from "../Functions/editBooking.js";
import { getDishes, getGuestDishes } from "../Functions/dishes_DataTypes.js";
import deleteBooking from "../Functions/deleteBooking.js";
import { getErrVariant } from '../Functions/setStyles.js';
import reasons from '../Functions/reasons.js';
import { getAllVariants } from '../Functions/setStyles.js';

// 3r party
import axios from 'axios';

//elements
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from "react-bootstrap/Spinner";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import CloseButton from "react-bootstrap/CloseButton";
import Accordion from 'react-bootstrap/Accordion';
import { UserSelectDish, GuestsDishesDetails, GuestsSelectDishes } from './SelectDishes.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faHand } from "@fortawesome/free-solid-svg-icons";

// Functions to Edit and to Delete (Will have to create routes)
// Display legalAge to tick. If true, can apply changes. 
// When edit button is pushed, all disable fields become editable. Create labels for each field 
// Apply button to show up only if edit button is pushes. 

function BookingDetails ({ meals }) {

// States
const [bookingDetails, setBookingDetails] = useState(bookingSchema);
// const [userDish, setUserDish] = useState('');
const [allMeals, setAllMeals] = useState([]);
const [guestDishes, setGuestDishes] = useState({ guestDishes_0: '' 
// guestDishes_0 represents the user dish, from guestDishes_1, guest dishes 
});
const [loader, setLoader] = useState(false);
const [Error, setError] = useState({
        err: false,
        code: 0,
        title: "",
        msg: ""}); // Fetching ID


const [editResult, setEditResult] = useState({
        err: false,
        code: 0,
        title: "init",
        msg: ""}) // Edition Fetch result
       // const [errorStack, setErrorStack] = useState(msgSchema);
const { booking_id } = useParams();
const [editing, setEditing] = useState(false);
// const [cancel, setCancel] = useState(false)
const [successModal, setSuccessModal] = useState(false);
const [editDishes, setEditDishes] = useState(false); // Guest dishes
const [eightyComments, setEightyComments] = useState(80);
const [shortComment, setShortComments] = useState(false);
const [legalAge2, setLegalAge2] = useState(undefined);
const [deletable, setDeletable] = useState(false);
const [deleteLoader, setDeleteLoader] = useState(false);
const [deleteResult, setDeleteResult] = useState({
        err: false,
        code: 0,
        title: "init",
        msg: ""});

const [loaderDishes, setLoaderDishes] = useState(false);
const [dishesResult, setDishesResult] = useState({
        err: false,
        code: 0,
        title: "init",
        msg: ""});
const [showDishesResult, setShowDishesResult] = useState(false);

// Variables
// const BKhost = "http://localhost:5000";
// const FRhost = "http://localhost:3000";

const BKhost = "https://foodbooking-backend.vercel.app";
const FRhost = "https://foodbooking-frontend.vercel.app";

const messages = reasons.map((msg)=>msg.msg);
const noteGuest = '(Note: if you want to change the number of guests, please delete your booking and create a new one).'
// Variables CSS Styles
const labelStyle = 'fw-bold text-primary';

/**
let eightyComments = charactersLeft(80, bookingDetails.extra.length);
const shortComment = bookingDetails.extra.length < 3;
**/

// const codes = [400, 401, 403, 404, 500]

// Functions
const handleBooking = (e) => {

        let { name, value, checked } = e.target;
        if(name === 'guests') { 
            value !== 'more than 9' ? value = Number(value) : value = 10 }
        if(name === 'smoking') {
            value = checked
        }
            
      setBookingDetails({...bookingDetails, [name]: value});
}

/*
const handle_UserDish = (e) => {
  setUserDish(e.target.value)
}
*/

const handle_GuestDishes = (e) => {
    let {name, value} = e.target;
   bookingDetails.guests > 0 ? 
   setGuestDishes({...guestDishes, [name]: value}) : setGuestDishes({[name]: value});
    console.log(guestDishes)
}

const editData = async() => {
  try {
    let obj = {};
    if(legalAge2) {
    setLoader(true);

    /*
    const oldDishes = bookingDetails.dishes_selected.filter((dsh, _ind) => _ind !== 0);
    const checkDishes = getDishes(meals, UserSelectDish);

    if(checkDishes[0].id === '') {
      obj.err = true; 
      obj.code = 401; 
      obj.title = "Dish Not recognized";
      obj.msg = "Please make sure that the dish you have selected is available in the list.";
      setLoader(false);
      setEditResult(()=>obj);
    } else {
    const newDishes = [checkDishes[0], ...oldDishes];
    }
    */

    const editBody = await editBooking(bookingDetails, bookingDetails.dishes_selected);

    switch(editBody.code) {
      case 400:
      case 401: 
      obj.err = editBody.err; 
      obj.code = 401; 
      obj.title = editBody.title;
      obj.msg = editBody.msg;
      setLoader(false);
      setEditResult(()=>obj);
      break;

      case 403:
      obj.err = editBody.err; 
      obj.code = editBody.code; 
      obj.title = editBody.title;
      obj.msg = "An error occured during edition. Please try again.";
      setLoader(false);
      setEditResult(()=>obj);
      break;

      case 404:
      obj = notFoundError(booking_id);
      setLoader(false);
      setEditResult(()=>obj);
      break;

      case 201:
      obj.err = editBody.err;
      obj.code = 200;
      obj.title = editBody.title;
      obj.msg = editBody.msg;
      setLoader(false);
      setSuccessModal(true);
      setEditResult(()=>obj);
      break;

      default: 
      const unenditified_Err = {
        err: true,
        code: 500,
        title: "Something Is Wrong",
        msg: "Something did not went as expected. Please make sure that all required fields are properly filled in. You can also reload the page and try again."}
        setLoader(false);
        setEditResult(() => unenditified_Err)
      }
      } else {
      obj.err = true;
      obj.code = 401;
      obj.title = "Legal Age required";
      obj.msg = "You must confirm that you have the legal age by checking the above case and amend your booking.";
      setLoader(false);
      setEditResult(()=>obj);
    }

  } catch (err) {
    console.error('Oops', err);
    const Error = internalServerError(err);
      setLoader(false);
      setEditResult(()=>Error)
  }
}

  /*
    const oldDishes = bookingDetails.dishes_selected.filter((dsh, _ind) => _ind !== 0);
    const checkDishes = getDishes(meals, UserSelectDish, []);
    */
const editGuestDishes = async(id, dishes) => {
  // e.preventDefault();
  let obj = {};
  const guestDishesArr = Object.values(guestDishes);
    try {
    setDishesResult({
        err: false,
        code: 0,
        title: "init",
        msg: ""});

        const notAllowed = {
          contain_D000: guestDishesArr.indexOf("D000") > -1,
          containKey: guestDishes.hasOwnProperty('guestDishes_0') !== true,
          contain_Empty: guestDishesArr.indexOf('') > -1,
          unappropriate_dishesNumber: guestDishesArr.length !== bookingDetails.guests + 1 // the + 1 represents the user
        }

        if(Object.values(notAllowed).filter((truthy) => truthy === true).length > 0) {
        obj.err = true;
        obj.code = 401;
        obj.title = "D000 Dish Detected";
        obj.msg = "Please make sure that all of your guests have a dish selected in the specific list in order to proceed."
        setLoaderDishes(false);
        setDishesResult(()=>obj);
        } else {
    setLoaderDishes(true);
    console.log({
      meals: "...meals API",
      guestDishes: dishes
    })
    const checker = bookingDetails.guests > 0 ? 
    getGuestDishes(meals, Object.values(dishes)) : getDishes(meals, dishes.guestDishes_0);

    if(checker.map((dsh) => dsh.id).filter((unknown) => unknown === '').length > 0) {
        obj.err = true;
        obj.code = 401;
        obj.title = `Uknown ${checker.map((dsh) => dsh.id).filter((unknown) => unknown === '').length > 1 ? 'dishes' : 'dish'} Detected`;
        obj.msg = `The ${checker.map((dsh) => dsh.id).filter((unknown) => unknown === '').length > 1 ? "dishes" : "dish"} "${checker.map((dsh) => dsh.name || 'not recognized')}" is not found on our menu. Please make sure to select a dish from the specified list in order for your edition to be valid.`
        setLoaderDishes(false);
        setDishesResult(()=>obj);
    } else {
      const editBody = await editDishesBooking(id, checker);
      obj = {...editBody};

      switch(Number(obj.code.toString().split("")[0])) {

      case 4:
      case 5:
      obj.err = true;
      setLoaderDishes(false);
      setDishesResult(()=>obj);
      break;

      case 2:
      obj.err = false;
      setLoaderDishes(false);
      setDishesResult(()=>obj);
      break;

      default: 
      const unenditified_Err = {
        err: true,
        code: 400,
        title: "Something Is Wrong",
        msg: "Something did not went as expected. Please make sure that all required fields are properly filled in. You can also reload the page and try again."}
        setLoaderDishes(false);
        setDishesResult(()=>unenditified_Err);
      }}
    }} catch(err) {
      console.error(err);
      const internalErr = {
        err: true,
        code: 500,
        title: "Edition Did Not Start",
        msg: "The edition has not been launched because of an internal error. Please contact your administrator if the issue persists."}
      setLoaderDishes(false);
      setDishesResult(()=>internalErr);
    }
}

const launchEditGuestDishes = () => {
  setShowDishesResult(true);
}

const closeEditGuestDishes = () => {
  setShowDishesResult(false);
  setGuestDishes({ guestDishes_0: ''});
  setEditDishes(false);
  setDishesResult({
        err: false,
        code: 0,
        title: "init",
        msg: ""});
}

const deleteData = async() => { 
  const obj = {}
  try{
  setDeleteLoader(true);
    const deleter = await deleteBooking(booking_id);
    
    obj.err = deleter.err;
    obj.title = deleter.title;
    obj.code = deleter.code;
    obj.msg = deleter.msg;
    setDeleteLoader(false);
    setDeleteResult(()=>obj);
  
  } catch(err) {
    console.error("Oooops:", err);
    obj.err = true;
    obj.code = 500;
    obj.title = "Internal Server Error";
    obj.msg = "The booking deletion failed due to an error. Please try again. Please contact the administrator if the issue persists."
    setDeleteLoader(false);
    setDeleteResult(()=>obj)
  }
}

const sendToSearch = () => {
  redirect('reservation/search')
}

const ready = (e) => {
    e.preventDefault();  
    setTimeout(editData, 500)
}

const closeModal = () => {
    setSuccessModal(false);
    window.location.reload();
}


const refresh = () => {
    setEditResult({
        err: false,
        code: 0,
        title: "init",
        msg: ""});
}

const closeWarning = () => {
  setDishesResult({
        err: false,
        code: 0,
        title: "init",
        msg: ""});
  
  setShowDishesResult(false)
}

// useEffect
useEffect(()=>{
  const getBooking = async() => {
  try {
  setLoader(true);
  const bookingFetch = await axios({
    method: 'get', url: `${BKhost}/reservation/search/${booking_id}`});

  if(bookingFetch.status === 404){
    const obj = notFoundError(booking_id)
    setLoader(false);
    setError(()=>obj)
    } else if(bookingFetch.status >= 200 && bookingFetch.status < 300) {
      const success = {
        err: false,
        code: 200,
        title: "success",
        msg: ""}

      setLoader(false);
      const newUser = bookingFetch.data;
      setBookingDetails(()=>newUser);
      // setUserDish(newUser.dishes_selected[0].name);
      setAllMeals(()=>meals);
      setEightyComments(()=>bookingDetails.extra ? 80 - Number(bookingDetails.extra.length) : 80);
      setShortComments(()=>bookingDetails.extra ? bookingDetails.extra.length < 3 : false);
      setError(()=>success);
    }
  } catch(err){
    console.error("Ooops", err);
    const obj = internalServerError(err)
    setLoader(false);
    setError(()=>obj)
     } 
  };
  getBooking();
 }, [])

    return(
      <React.Fragment>
      
      { // loading
        loader === true && 
      <div 
      id="spinnerContainer" 
      className="text-center">
      <h2>Loading...</h2>
      <div>
      <Spinner animation="border" variant="primary" />
      {' '}
      <Spinner animation="grow" variant="dark" />
      </div>
      </div>
      }

      { Error.code === 200 &&
        <React.Fragment>
        {
          editing === true ?
         <Form onSubmit={ready}>
        <Form.Group controlId='first_name'>
        <Form.Label className={labelStyle}>First Name</Form.Label>
        <Form.Control
        disabled={editDishes ? true : false}
        name="first_name"
        value={bookingDetails.first_name}
        onChange={handleBooking}
        type="text"
        placeholder="First name" />
        {bookingDetails.first_name === '' ? <Form.Text className='mx-2' muted>{ messages[1] ?messages[1] : "Error 2" }</Form.Text> : <Form.Text className={bookingDetails.first_name.length < 3 || bookingDetails.first_name.match(/[0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{messages[1] ?messages[1] : "Error 2"}</Form.Text>}       
        </Form.Group>
        <br />

        <Form.Group controlId='last_name'>
        <Form.Label className={labelStyle}>Last Name</Form.Label>
        <Form.Control
        disabled={editDishes ? true : false}
        name="last_name"
        value={bookingDetails.last_name}
        onChange={handleBooking}
        type="text"
        placeholder="Last name" />
        {bookingDetails.last_name === '' ? <Form.Text className='mx-2' muted>{ messages[2] ? messages[2] : "Error 3" }</Form.Text> : <Form.Text className={bookingDetails.last_name.length < 3 || bookingDetails.last_name.match(/[0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{ messages[2] ? messages[2] : "Error 3" }</Form.Text>}
        </Form.Group>
        <br />

        <Form.Group controlId='email'>
        <Form.Label className={labelStyle}>Email</Form.Label>
        <Form.Control
        disabled={editDishes ? true : false}
        name="email"
        value={bookingDetails.email}
        onChange={handleBooking}
        type="email"
        placeholder="Email" />
        {
        bookingDetails.email === '' ? 
        <Form.Text className='mx-2' muted>{ messages[3] ? messages[3] : "Error 4" }
        </Form.Text> : <Form.Text className={bookingDetails.email.length < 3 || bookingDetails.email.match(emailMatcher) === null ? "mx-2 careful" : "d-none"}>{ messages[3] ? messages[3] : "Error 4" }
        </Form.Text>
        }
        </Form.Group>
        <br />

        <Form.Group controlId='phone'>
        <Form.Label className={labelStyle}>Phone Number</Form.Label>
        <Form.Control
        disabled={editDishes ? true : false}
        name="phone"
        value={bookingDetails.phone}
        onChange={handleBooking}
        type="text"
        placeholder="Phone Number" />
        {bookingDetails.phone === '' ? <Form.Text className='mx-2' muted>{ messages[4] ? messages[4] : "Error 5" }</Form.Text> : <Form.Text className={bookingDetails.phone.match(/[^0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{messages[4] ? messages[4] : "Error 5"}</Form.Text>}
        </Form.Group>
        <br />
        
        <Form.Group controlId='guests'>
        <Form.Label className={labelStyle}>Guests</Form.Label>
        <br />
        <Form.Text as="font-weight-normal">Number of Guests</Form.Text>
        <br />
        <Form.Select
        disabled
        aria-label='Number of Guests'
        name="guests"
        value={bookingDetails.guests}
        onChange={handleBooking}>
        <option value="" disabled> Select number of guests {"("}without including yourself{")"}</option>
        {
        [0,1,2,3,4,5,6,7,8,9,10].map((guest, _ind)=>
        <option 
        key={`guest_${guest + _ind}`} 
        value={guest}>{guest === 10 ? 'more than 9' : guest}
        </option>)   
        }
        </Form.Select>
        {
        [0,1,2,3,4,5,6,7,8,9,10].indexOf(bookingDetails.guests) <= -1 ? <Form.Text className="mx-2 careful">{ messages[5] ? messages[5] : "Error 6" }</Form.Text>
                  :
        <Form.Text className={`${bookingDetails.guests === 0 ? 'd-none' : 'mx-2 fst-italic text-success'}`}>I am going with <b>{[{id:'0', str: 'zero'}, {id:'1', str: 'one'}, {id:'2', str:'two'}, {id:'3', str:'three'}, {id:'4', str:'four'}, {id:'5',str: 'five'}, {id:'6', str:'six'}, {id:'7', str:'seven'}, {id:'8', str:'eight'},{id:'9', str:'nine'},{id:'10', str:'more than 9'}].filter((nb)=>Number(nb.id) === Number(bookingDetails.guests)).map((g)=>g.str)} {bookingDetails.guests <= 1 ? "guest" : "guests"}</b>. <i>{noteGuest}</i></Form.Text>
        }
        {bookingDetails.guests === 0 && <Form.Text className='mx-2 fst-italic text-success'><b>I want to go alone</b>. <span>{noteGuest}</span></Form.Text>}
                           
        {
        bookingDetails.guests === 10 && <div><Badge pill bg="info">Note:</Badge><span>  <i>If more than 9 people are going, please specify the exact number in the comment section at the end !</i></span></div>
        }

        { bookingDetails.guests < 1 && 
        <>
        { !editDishes ?
          <div id="fieldset">
          <br />
          <div className={`mb-2 ${labelStyle}`}>Your Dish</div>
          <legend style={{fontSize: '.85em'}}>{"Click on the below button to change the selection of your dish:"}</legend>
          <br />
          <InputGroup className="mb-2" size="lg">
          <InputGroup.Text>Dish Booked</InputGroup.Text>
          <Form.Control aria-label="Dish Booked" disabled
          value={bookingDetails.dishes_selected[0].name} />
          </InputGroup>
          <Button className="fw-bold text-light" variant={"primary"} onClick={()=>setEditDishes(true)}>Change My Menu</Button>
          </div>
          :
        <fieldset>
        <br />
        <div className={labelStyle}>Your Dish</div>
        <legend>{
        "Click on the below button to cancel the edition:"
        }</legend><br />
        <UserSelectDish guests={bookingDetails.guests} 
        meals={allMeals} dishName={'guestDishes_0'} 
        dishes_selected={bookingDetails.dishes_selected} 
        handler={handle_GuestDishes} />
        {dishesResult.title === "D000 Dish Detected" && <div className="bg-dark text-warning p-2"><CloseButton variant="white" onClick={closeWarning} />
        <Stack direction="horizontal" gap={2} className="justify-content-center"><FontAwesomeIcon icon={faHand} size="lg" style={{color: "#FFD43B",}} />{' '}<p style={{fontSize: '1.08em'}}>{dishesResult.msg}</p></Stack></div>}
        {dishesResult.title === "D000 Dish Detected" && <br />}
        {dishesResult.title === "D000 Dish Detected" ? 
        <Button
        variant="dark"
        className="fw-bold text-warning"
        onClick={closeWarning}
        >
        Close and Continue
        </Button>
        :
        <Button 
        className="launchEditGuestDishes"
        onClick={launchEditGuestDishes}>
        {
        loaderDishes ? "Sending..." : "Confirm My Dish"
        }
        </Button>
        }
        {' '} 
        <Button className="fw-bold text-light" variant={"secondary"} 
        onClick={closeEditGuestDishes}>Cancel Edition</Button>
        </fieldset>}
        </>
        }

        {bookingDetails.guests > 0 && bookingDetails.dishes_selected.length > 0 && 
        <div>
        <fieldset>
        <br />
        <div className={labelStyle}>Your Dish</div>
        <legend style={{fontSize: '1em'}}>{
        !editDishes ? "Click on the below button to change the selection of dishes for your guests:" : "Click on the below button to cancel the edition:"
        }</legend><br />
        {
          !editDishes ?
          <>
         <GuestsDishesDetails guests={bookingDetails.guests} dishes_selected={bookingDetails.dishes_selected} />
        <Button className="fw-bold text-light" variant="primary" onClick={()=>setEditDishes(true)}>Change Dishes Selection</Button>
        </>
        :
        <>
        <GuestsSelectDishes meals={allMeals} guests={bookingDetails.guests} dishName={'guestDishes'} dishes_selected={bookingDetails.dishes_selected} handler={handle_GuestDishes} /><br />
        {dishesResult.title === "D000 Dish Detected" && <div className="bg-dark text-warning p-2">
        <CloseButton variant="white" onClick={closeWarning} />
        <Stack direction="horizontal" gap={2} className="justify-content-center"><FontAwesomeIcon icon={faHand} size="lg" style={{color: "#FFD43B",}} />{' '}<p style={{fontSize: '1.08em'}}>{dishesResult.msg}</p></Stack></div>}
        {dishesResult.title === "D000 Dish Detected" && <br />}
        <Stack direction="horizontal" className="justify-content-center" gap={2}>
        { dishesResult.title === "D000 Dish Detected" ? 
        <Button
        variant="dark"
        className="fw-bold text-warning"
        onClick={closeWarning}
        >
        Close and Continue
        </Button>
        :
        <Button 
        className="launchEditGuestDishes"
        onClick={launchEditGuestDishes}>
        {
        loaderDishes ? "Sending..." : "Confirm Guest Dishes"
        }
        </Button>
        }
        
        {
          dishesResult.code !== 201 && 
        <Button 
        disabled={loaderDishes ? true : false}
        variant="secondary"
        onClick={closeEditGuestDishes}>
        Cancel Edition
        </Button>
        }
        </Stack>
        </>
        }
        </fieldset>
        </div>
          }

          {  editDishes && showDishesResult &&
              <Modal
              show={dishesResult.title === "D000 Dish Detected" ? false : true}
              size="md"
              aria-labelledby="guestsDishes-confirmation"
              centered>
      <Modal.Header className={`bg-${dishesResult.code === 201 ? "success" : "primary"} border border-${[400, 404, 408].indexOf(dishesResult.code) > -1 ? "warning" : dishesResult.code === 500 ? "danger"
         : "info"}`} closeButton={false}>
        <Modal.Title 
        className="p-2 text-light fw-bold"
        id="guestsDishes-confirmation">
         {dishesResult.code === 0 ? <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faCircleQuestion} style={{color: "#e2bd36",}} size="lg" /><h4 className="p-2">{ "Guests Dishes Edition Confirmation"}</h4></div> 
         : dishesResult.code === 201 ? dishesResult.title 
         : <div className="p-2 d-flex justify-content-around"><FontAwesomeIcon icon={faTriangleExclamation} size="lg" style={{color: "#FFD43B",}} /><span className="px-4"></span><h4>{'Confirmation Failure'}</h4></div>}
        </Modal.Title>
        <CloseButton variant="white" />
      </Modal.Header>
      <Modal.Body>
      { dishesResult.code === 0 ?
      <div>
        <p style={{fontFamily: 'Times New Roman, Courier New, Courier, monospace', fontSize: '1.2em'}}>Are you sure you want to confirm the guests dishes edition ?</p>
        <p className="text-center">{'('}<small style={{fontStyle: 'italic'}}>If you want to cancel the action, click on "Cancel" button.</small>{')'}</p>
        </div>
          :
      dishesResult.code === 201 ?
      <div>
        <p style={{fontFamily: `${'Lucida Sans'}, ${'Lucida Sans Regular'}, ${'Lucida Sans Unicode'},Tahoma, Verdana, sans-serif`,}}>{dishesResult.msg}</p>
        </div>
        :
         <div>
        <p 
        style={{fontFamily: 'Cambria, Cochin, Courier New, Courier, monospace'}}>
        An error occured. Please check the message below for more details:</p>
        <br />
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
        <Accordion.Header className="text-center">
        {
          dishesResult.code === 500 ?
          <h5 className="text-decoration-underline text-danger">Ooops...</h5>
          :
          <h5 className="text-decoration-underline text-dark" style={{textShadow: "#FFDE00 2px 2px"}}>Almost sent!</h5> 
        }
        </Accordion.Header>
        <Accordion.Body className={`bg-dark fw-bold ${dishesResult.code === 500 ? "text-danger" : "text-warning"}`} style={{ letterSpacing: '1px' }}>
        <article>
        {dishesResult.code === 500 && <p className="text-center">A server error occured...</p>}
        <p>{dishesResult.msg || "Please try again or contact your administrator."}</p>
        </article>
        </Accordion.Body>
        </Accordion.Item>
        </Accordion>
        </div>
        }
      </Modal.Body>
      <Modal.Footer className="px-0 d-flex justify-content-center">
      {dishesResult.code !== 201 &&
      <Button 
      disabled={loaderDishes ? true : false}
      className={`fw-bold ${[400, 404, 408].indexOf(dishesResult.code) > -1 ? "text-warning" : "text-light"}`}
      variant={loaderDishes ? "secondary" : dishesResult.code === 500 ? "danger" : "dark"}
      onClick={()=>editGuestDishes(bookingDetails.booking_id, guestDishes)}>
        {loaderDishes &&
        <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        />}
      { loaderDishes ? "Sending dishes..." : dishesResult.code === 0 ? "Confirm Dishes Edition" : "Try again" }
      </Button>
        }
        <Button 
        disabled={loaderDishes ? true : false}
        variant={dishesResult.code === 201 ? "outline-success" : "outline-secondary"}
        style={{letterSpacing: '1px'}}
        onClick={closeEditGuestDishes}>
        {dishesResult.code === 201 && <FontAwesomeIcon icon={faCheck} size="lg" style={{color: "#63E6BE",}} />}
        {' '}
        {dishesResult.code === 201 ? "Finish" : "Cancel"}</Button>
      </Modal.Footer>
    </Modal>
        }
        </Form.Group>
        <br />

        <Form.Group controlId="smoking">
        <Form.Label as="p" className={labelStyle}>Do you smoke ?</Form.Label>

        <Form.Check
        disabled={editDishes ? true : false}
        type="switch"
        name="smoking"
        value={bookingDetails.smoking}
        onChange={handleBooking}
      />

        { !editDishes &&
        <Stack direction="horizontal" gap={3}>{
        bookingDetails.smoking === true ?
        <Badge pill bg="success">Yes I smoke</Badge>
        :
        <Badge pill bg="danger">No I don't smoke</Badge>
        }
        </Stack>
        }
        
        {
         bookingDetails.smoking === undefined && <Form.Text className="mx-2 careful">{ messages[6] ? messages[6] : "Error 7" }
         </Form.Text> 
         }
         </Form.Group>
         <br />

        <Form.Group controlId='bookDay'>
        <Form.Label className={labelStyle}>Booking Date</Form.Label>
        <br />
        <Form.Text className='mx-2'>My booking is for the:</Form.Text>
        <Form.Control
        disabled={editDishes ? true : false}
        name="bookDay"
        onChange={handleBooking}
        value={bookingDetails.bookDay}
        type="date" 
        />
        {
        !bookingDetails.bookDay && <Form.Text className='mx-2 careful'>{ messages[7] ? messages[7] : "Error 8" }</Form.Text>
        } 
        </Form.Group>
        <br />

        <Form.Group controlId='bookTime'>
        <Form.Label className={labelStyle}>Booking Time</Form.Label>
        <br />
        <Form.Text className='mx-2'>My booking will start at:</Form.Text>
        <Form.Text muted><i>You can book from Monday to Saturday from 11:00am to 21:00pm</i></Form.Text>
        <Form.Control
        disabled={editDishes ? true : false}
        name="bookTime"
        onChange={handleBooking}
        value={bookingDetails.bookTime}
        type="time" 
        min="11:00"
        max="21:00"
        />

        { !bookingDetails.bookTime && <Form.Text className='mx-2 careful'>{ messages[7] ? messages[7] : "Error 8" }</Form.Text>
        } 
        </Form.Group>
        <br />

        
        <Form.Group controlId="extra">
        <Form.Label as="p" className={labelStyle}>Comments</Form.Label>
        <Form.Text className='mx-2' muted><i>Please tell us more about your booking (number of guests, special request needed, etc.)</i></Form.Text>
        <Form.Control
        disabled={editDishes ? true : false}
        as="textarea"
        name='extra'
        value={bookingDetails.extra}
        onChange={handleBooking}
        className='pt-2'
        rows={3}
        maxLength={80}
        style={{ height: '75px' }}
        />
        <Form.Text className={(eightyComments.high) ? "mx-2 text-success" : (eightyComments.low) ? "mx-2 text-danger" : (eightyComments.zero) ? "mx-2 fw-bold" : "" } muted={eightyComments.middle ? true : false }>{80 - bookingDetails.extra.length} characters left</Form.Text>
        <br />
        {
        bookingDetails.extra.match(matcher) || shortComment === true ? <Form.Text className="mx-2 careful">{ messages[9] ? messages[9] : "Error 10" }
        </Form.Text>
                    :
        null
        }
        </Form.Group>
        <br />
                    
        <Form.Group controlId='legalAge2'>
        <Form.Label className={labelStyle}>Confirm your legal age to send your edition request</Form.Label>
        <Form.Check 
        disabled={editDishes ? true : false}
        type="checkbox" 
        name="legalAge2">
        <Form.Check.Input type="checkbox" name="legalAge2" 
        value={legalAge2} 
        onChange={(e)=>setLegalAge2(e.target.checked)} isValid />
        <Form.Text className="text-success fw-bold"><span className="d-inline-block p-1"></span>I confirm having at least 18 years old and the correctness of the data provided</Form.Text>
        <Form.Control.Feedback className={bookingDetails.legalAge !== true ? "careful fst-italic" : "d-none"} 
        type="valid">
        { messages[0] ? messages[0] : "Error 1" }
        </Form.Control.Feedback>
        </Form.Check>
        </Form.Group>
        <br />

        {   
        editResult.code === 401 && <div className="px-2">
        <h3 className="d-block text-warning bg-secondary p-2">{editResult.title}: Your booking edition request cannot be sent :{'('}</h3>
        <ListGroup as="ol" variant="flush">
        <ListGroup.Item
        as="li" className="d-flex justify-content-between align-items-start" 
        variant={getErrVariant()} >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{editResult.title}</div>
          {editResult.msg}
        </div>
        </ListGroup.Item>
        </ListGroup>
        <div className="mt-2 text-center">
        <Button className="bg-dark fw-bold text-warning" onClick={refresh}>Ok I check that !</Button>
        <p className="mt-1"><small style={{fontSize: '.9em', fontFamily: "Calibri, Cochin, Georgia, Times, Times New Roman, serif"}}>Click on the above button and try to confirm again after checking!</small></p>
        </div>
        </div>
        }

        { 
         editResult.code === 500 && 
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
        <Accordion.Header>
        <h5 className="text-danger text-decoration-underline">Ooops...</h5> 
        </Accordion.Header>
        <Accordion.Body className="text-danger">
        <p>A server error occured...</p>
        <p>We invite you to refresh the page or try again and contact a network administrator if the issue persists.</p>
        <br />
        <Button className="bg-dark fw-bold text-danger" 
        onClick={refresh}>Ok</Button>
        </Accordion.Body>
        </Accordion.Item>
        </Accordion>
        }

        {
          editResult.code === 404 && <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
        <Accordion.Header>
        <h5 className="text-warning text-decoration-dark">{editResult.title}</h5> 
        </Accordion.Header>
        <Accordion.Body className="text-dark">
        <p>{editResult.msg}</p>
        <br />
        <Button className="fw-bold text-danger" 
        onClick={refresh}>Ok</Button>
        </Accordion.Body>
        </Accordion.Item>
        </Accordion>
        }

        {/*
          editResult.code === 401 && editResult.title === "Legal Age required" &&<div>
          <Badge className="p-2" bg="primary" pill>Almost there !</Badge>
          {' '}
          <p className="d-inline-block fw-bold fs-6 text-">{editResult.msg}</p>
          </div>
        */}

        {
        editResult.code === 200 && 
        <Modal show={successModal} onHide={closeModal}>
        <Modal.Header className='text-light bg-success' closeButton>
        <Modal.Title>{editResult.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>{editResult.msg.substring(0, 42)}</p>
        <p>{editResult.msg.substring(43)}</p>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={closeModal}>
        Ok
        </Button>
        </Modal.Footer>
        </Modal>
        }

        { editResult.title === "init" && <>
        <Button
        className='text-light fw-bold info' variant='dark'
        type="submit">
        <Spinner
        className={ loader ? "inline-block" : "d-none" }
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
        />
        {' '}
        { loader ? 'Editing your booking...' : 'Confirm edition' }
        </Button>
        <span className="d-inline-block p-2"></span>
        <Button variant="outline-info" className='text-dark fw-bold info'
        onClick={()=>setEditing(false)}
        >Cancel</Button>
        </>
      }

        {/*
        <pre>
        {JSON.stringify(bookingDetails)}
        {'\n'}
        legalAge 2: {JSON.stringify(legalAge2)}
        </pre>
        */}

        </Form>
        :
        <Card>
        <Card.Header className={`text-md-center border border-${getAllVariants()}`}>Booking Details</Card.Header>
        <Card.Body>
        <Stack className="justify-content-center p-2" direction="horizontal" gap={3}>
        <Button 
        className="fw-bold" variant="dark" onClick={()=>setEditing(true)}>Edit Reservation</Button>
        <Button  className="text-danger fw-bold" variant="outline-dark" onClick={()=>setDeletable(true)}>Delete Reservation</Button>
        </Stack>
        <Modal show={deletable} onHide={()=>setDeletable(false)}>
        <Modal.Header className={deleteResult.code === 200 ? `bg-success text-light fw-bold` : `border border-danger text-dark`} closeButton>
          <Modal.Title>
          {
          deleteResult.code === 0 ?
          `Delete Booking ${booking_id}` : `${deleteResult.title}`
          }</Modal.Title>
        </Modal.Header>
        {
          deleteResult.code === 0 ?
        <Modal.Body>
        <p className="fs-5 fw-bold">Are you sure you want to delete the booking {booking_id} ?</p>
        <div className="fst-italic">
        <small>
        Please note that once confirmed, all of your booking details will be <span className="text-decoration-underline">permanently deleted</span>.</small>
        <br />
        <small>
         If you want to cancel this action, please click on "No, I cancel" button.
         </small>
         </div>
        </Modal.Body>
        :
         <Modal.Body className={deleteResult.code === 200 ? `border border-primary` : `border border-dark`}>
          {deleteResult.msg}
          </Modal.Body>
        }
        {
          deleteResult.code === 0 ?
          <Modal.Footer>
          <Button className="fw-bold text-light" variant="danger" onClick={()=>deleteData(booking_id)}>
          { deleteLoader === true && 
          <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
        />
          }
        {
        deleteLoader === true ? "Deleting..." : "Yes I want to delete"
        }
        </Button>
        <Button 
        disabled={deleteLoader === true ? true : false}
        className="fw-bold noICancel-button"
        variant="outline-danger" onClick={()=>setDeletable(false)}>
            No, I cancel
          </Button>
        </Modal.Footer>
        :
        <Modal.Footer className="justify-content-center">
          <Button className="fw-bold text-light" variant={deleteResult.code === 200 ? "dark" : "danger"} onClick={deleteResult.code === 200 ? ()=>window.location.href = `${FRhost}/reservation/search` : ()=>setDeletable(false)}>
        Ok
          </Button>
        </Modal.Footer>
        }
      </Modal>
        <br />
        <Card.Title className={`text-md-center p-2 fs-2 border border-${getAllVariants()} border-opacity-25`}>Personal Information</Card.Title>
        <br />
        <Stack className="p-2" direction="horizontal" gap={3}>
        <ListGroup className="fst-italic" style={{fontSize: '10px'}}>
      <ListGroup.Item>Request sent on: {bookingDetails.createdAt.substring(0, 10)} at {bookingDetails.createdAt.substring(11,16)}</ListGroup.Item>
        <ListGroup.Item>Modified on: {bookingDetails.updatedAt.substring(0, 10)} at {bookingDetails.updatedAt.substring(11,16)}</ListGroup.Item>
        </ListGroup>
        <ListGroup className="fst-italic" style={{fontSize: '10px'}}>
        <ListGroup.Item>VIP Table: no</ListGroup.Item>
        <ListGroup.Item>Restaurant site code: F005</ListGroup.Item>
        </ListGroup>
        <ListGroup className="ms-md-3"></ListGroup>
         <ListGroup className="vr"></ListGroup>
         <ListGroup className="mx-md-auto">
        <Card.Img 
        className="mx-md-3"
        variant="top" 
        alt="profile_picture" 
        src="holder.js/35px50" />
        </ListGroup>
        </Stack>
        <br />
        <p className={`h4Header text-${getAllVariants()}`}>General details</p>
        <ListGroup className="p-2">
        <ListGroup.Item>
        <p className="h5Header p-1">Full Name</p>
        <p>{bookingDetails.last_name} {bookingDetails.first_name}</p>
        </ListGroup.Item>
        <ListGroup.Item>
        <p className="h5Header p-1">Email address</p>
        <p>{bookingDetails.email}</p>
        </ListGroup.Item>
        <ListGroup.Item>
        <p className="h5Header p-1">Phone</p>
        <p>{bookingDetails.phone}</p>
        </ListGroup.Item>
        <ListGroup.Item>
        <p className="h5Header p-1">Booking number</p>
        <p>{bookingDetails.booking_id}</p>
        </ListGroup.Item>
        <ListGroup.Item>
        <p className="h5Header p-1">Booked for</p>
        <p>{bookingDetails.bookDay} from {bookingDetails.bookTime}</p>
        </ListGroup.Item>
        </ListGroup>

        <br />

        <p className={`h4Header text-${getAllVariants()}`}>Additional details</p>
        <ListGroup className="p-2">
        <ListGroup.Item>
        <p className="p-1">I am Coming with: {' '}{ bookingDetails.guests > 0 ? <Badge bg={getAllVariants()}>{bookingDetails.guests}</Badge> : <b>0</b>}{' '}{bookingDetails.guests < 2 ? 'guest' : 'guests'}</p>
        </ListGroup.Item>

        <ListGroup.Item>
        <h5 className="p-1"><Badge bg={getAllVariants()}>My Menu</Badge></h5>
        <ol>
        {bookingDetails.dishes_selected.map((dish, _ind) => <li key={`${dish.id}-${_ind}`}>{dish.name}</li>)}
        </ol>
        <p><span>Total: <b>{allMeals.filter((meal) => bookingDetails.dishes_selected.map((dsh) => dsh.id).indexOf(meal.dish_id) > -1).map((meal) => meal.dish_price).reduce((a, b) => a + b).toFixed(2)}</b><b>{allMeals.map((dsh)=>dsh.dish_symbol)[0]}</b></span></p>
        </ListGroup.Item>

        <ListGroup.Item>
        <p className="p-1">I want a smoking sit:{' '}{!bookingDetails.smoking ? <Badge pill bg="danger">No</Badge> : <Badge pill bg={getAllVariants()}>Yes</Badge>}</p>
        </ListGroup.Item>

        <ListGroup.Item>
        <p>Comments:{' '}{!bookingDetails.hasOwnProperty('extra') ? <Badge pill bg="danger">No</Badge> : <Badge pill bg={getAllVariants()}>Yes</Badge>}</p></ListGroup.Item>
        </ListGroup>
        {
        bookingDetails.extra &&
        <article className={`p-2 border border-${getAllVariants()}`}>
        <p className={`fw-bold text-${getAllVariants()}`}>Your Comment:</p>
        <p style={{fontFamily: 'Courier New, Courier, monospace', fontSize: '.8em'}}>
        {bookingDetails.extra}
        </p>
        </article>
        }
        </Card.Body>
        </Card>
        }
        </React.Fragment>
      }

      { // Error
        <React.Fragment>
      { Error.code === 404 &&
      <Card className="text-center">
      <div className="bg-dark text-light p-3">
      <h3>Ooops...</h3>
      </div>
      <Card.Body>
        <Card.Title>Unknown ID</Card.Title>
        <Card.Text>
        <p>The Booking ID is not found.</p>
        <p><i>{Error.msg}</i></p> 
        </Card.Text>
        <Button 
        variant="dark"
        className="fw-bold text-decoration-none" 
        onClick={()=>sendToSearch}
        >Search Again</Button>
      </Card.Body>
    </Card>
      }
      { Error.err && Error.code !== 404 &&
      <BookingError stack={Error} />
      }
      </React.Fragment>
      }
      </React.Fragment>
    )
}

export default BookingDetails;