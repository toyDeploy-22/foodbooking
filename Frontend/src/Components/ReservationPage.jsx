import React, { useState } from 'react';
import { bookingSchema2 } from '../Functions/bookingSchema.js';
import Form from 'react-bootstrap/Form';
import { ReservationSelectDishes } from './SelectDishes.jsx';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Toast from 'react-bootstrap/Toast';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons/faHand';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { errSchema, msgSchema } from '../Functions/reservationValidator.js';
import { timeVal } from '../Functions/dateValidation.js';
import charactersLeft from '../Functions/charactersLeft.js';
import { emailMatcher, matcher } from '../Functions/matchers.js';
import { getDishes, getGuestDishes } from "../Functions/dishes_DataTypes.js";
import sendBooking from '../Functions/sendBooking.js';
import { getErrVariant } from '../Functions/setStyles.js';


function ReservationPage({ meals, info }) {    
const [reservation, setReservation] = useState({
        client_fname: '',
        client_lname: '',
        client_email: '',
        client_phone: '',
        hasGuests: false,
        // dishes: { guestDishes_0: ''},
        client_guests: 0,
        client_smoking: "false",
        client_bookDay: '',
        client_bookTime: '11:00',
        client_extra: '',
        client_legalAge: false
});

const [guestDishes, setGuestDishes] = useState({ guestDishes_0: ''});

const [loader, setLoader] = useState(false);
const [hasErrors, setHasErrors] = useState(errSchema);
const [errStack, setErrStack] = useState(msgSchema);
const [successModal, setSuccessModal] = useState(false);
const [Id, setId] = useState('');
const [isLegal, setIsLegal] = useState(false);

const messages = info.map((msg)=>msg.msg);

const labelStyle = 'fw-bold text-primary';

const handleBooking = (e) => {

        let { name, value, checked } = e.target;

        if(name === 'hasGuests') { 
            value = checked }
        if(name === 'client_guests') { 
            value !== 'more than 9' ? value = Number(value) : value = 10 }
        if(name === 'client_smoking') {
            value === 'true' ? value = true : value = false
        }

      setReservation({...reservation, [name]: value});
      // console.log(reservation)
}

const handle_legalAge = (e) => {
    let { name, checked } = e.target;
    setIsLegal(() => !isLegal);
    setReservation(() => {return {...reservation, [name]: checked }})
    /*
setIsLegal(!isLegal);
reservation.client_legalAge = !isLegal
*/
}

const handle_GuestDishes = (e) => {
    let {name, value} = e.target;
    setGuestDishes({...guestDishes, [name]: value});
   // console.log(guestDishes)
}

const eightyComments = charactersLeft(80, reservation.client_extra.length);

const shortComment = reservation.client_extra.length < 3;

const submitData = async() => {
    try {
    setLoader(true);
    const dishesNames = Object.values(guestDishes);
    const notAllowed = {
          contain_D000: dishesNames.indexOf("D000") > -1,
          containKey: guestDishes.hasOwnProperty('guestDishes_0') !== true,
          contain_Empty: dishesNames.indexOf('') > -1,
          unappropriate_dishesNumber: dishesNames.length !== reservation.client_guests + 1 // +1 because the user is by default added
        }
    
    if(Object.values(notAllowed).filter((truthy) => truthy === true).length > 0) {
        const obj = {
            ok: false, 
            title: "D000 Dish Detected",        
            }
        const stack = [{
        status: false,
        id: '013',
        section: "Incompatible Dishes Selection",
        msg: "Please make sure that all of your guests have a dish selected in the specific list in order to proceed."
        }]; // Not implemented yet in "reasons.js" file. 

         setId(obj.ok);
         setHasErrors(() => obj);
         setErrStack(()=>stack);
         setLoader(false);
    } else {

    let allUserDishes = dishesNames.length > 1 ? getGuestDishes(meals, dishesNames) : getDishes(meals, guestDishes.guestDishes_0);
    const launcher = await sendBooking(reservation, allUserDishes);
    console.log(launcher)

    if(launcher.ok === 'false') {
        const obj = {ok: launcher.ok, title: launcher.title}
         const stack = launcher.msg;
         setId(obj.ok);
         setHasErrors(() => obj);
         setErrStack(() => stack);
         setLoader(false);
        } else if(launcher.ok === 'true') {
            const bookingInit = {
                client_fname: '',
        client_lname: '',
        client_email: '',
        client_phone: '',
        hasGuests: false,
        dishes: '',
        client_guests: 0,
        client_smoking: "false",
        client_bookDay: '',
        client_bookTime: '11:00',
        client_extra: '',
        client_legalAge: ''
        };
        const obj = {ok: launcher.ok, title: launcher.title}
            setId(()=>obj.title);
            setHasErrors(()=>obj);
            setReservation({ ...bookingInit });
            // setGuestDishes(['']);
            setSuccessModal(true);
            setLoader(false)
        } else {
         const obj = {ok: launcher.ok, title: launcher.title}
         const stack = launcher.msg;
         setId(obj.ok);
         setHasErrors(()=>obj);
         setErrStack(()=>stack);
         setLoader(false);
        }} 
    } catch(err) { 
    const obj = {ok: 'false', title: "Error"};
    const stack = [{ status: false, id: 'Err500', section: 'Internal Server Error', msg: "We invite you to refresh the page or try again and contact a network administrator if the issue persists."}];
    console.error('Oops', err);
    setId('false');
    setHasErrors(()=>obj);
    setErrStack(()=>stack);
    setLoader(false);
        }
    }

const ready = async(e) => {
    e.preventDefault();  
   await new Promise(() => setTimeout(submitData, 500))
}

const closeModal = () => {
    setSuccessModal(false);
    setId('');
    setHasErrors(errSchema);
    setErrStack(msgSchema);
    // setGuestDishes(() => {return { guestDishes_0: ''}});
    // setIsLegal(false);
    setReservation(bookingSchema2);
    setTimeout(() => window.location.reload(), 1500);
}

const refresh = () => {
    setId('');
    setHasErrors(() => errSchema);
    setErrStack(() => msgSchema); 
}

return(
        <React.Fragment>
        <h3 className='display-5 bg-dark fw-bold text-light text-center py-2'> Reservation Form</h3>
        <br />
         <Form onSubmit={ready}>
        <Form.Group controlId='client_fname'>
        <Form.Label className={labelStyle}>First Name</Form.Label>
        <Form.Control
        name="client_fname"
        value={reservation.client_fname}
        onChange={handleBooking}
        type="text"
        placeholder="First name" />
        {reservation.client_fname === '' ? <Form.Text className='mx-2' muted>{ messages[1] ?messages[1] : "Error 2" }</Form.Text> : <Form.Text className={reservation.client_fname.length < 3 || reservation.client_fname.match(/[0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{messages[1] ?messages[1] : "Error 2"}</Form.Text>}       
        </Form.Group>
        <br />

        <Form.Group controlId='client_lname'>
        <Form.Label className={labelStyle}>Last Name</Form.Label>
        <Form.Control
        name="client_lname"
        value={reservation.client_lname}
        onChange={handleBooking}
        type="text"
        placeholder="Last name" />
        {reservation.client_lname === '' ? <Form.Text className='mx-2' muted>{ messages[2] ? messages[2] : "Error 3" }</Form.Text> : <Form.Text className={reservation.client_lname.length < 3 || reservation.client_lname.match(/[0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{ messages[2] ? messages[2] : "Error 3" }</Form.Text>}
        </Form.Group>
        <br />

        <Form.Group controlId='client_email'>
        <Form.Label className={labelStyle}>Email</Form.Label>
        <Form.Control
        name="client_email"
        value={reservation.client_email}
        onChange={handleBooking}
        type="email"
        placeholder="Email" />
        {
        reservation.client_email === '' ? 
        <Form.Text className='mx-2' muted>{ messages[3] ? messages[3] : "Error 4" }
        </Form.Text> : <Form.Text className={reservation.client_email.length < 3 || reservation.client_email.match(emailMatcher) === null ? "mx-2 careful" : "d-none"}>{ messages[3] ? messages[3] : "Error 4" }
        </Form.Text>
        }
        </Form.Group>
        <br />

        <Form.Group controlId='client_phone'>
        <Form.Label className={labelStyle}>Phone Number</Form.Label>
        <Form.Control
        name="client_phone"
        value={reservation.client_phone}
        onChange={handleBooking}
        type="text"
        placeholder="Phone Number" />
        {reservation.client_phone === '' ? <Form.Text className='mx-2' muted>{ messages[4] ? messages[4] : "Error 5" }</Form.Text> : <Form.Text className={reservation.client_phone.match(/[^0-9+()]/g) !== null ? "mx-2 careful" : "d-none"}>{messages[4] ? messages[4] : "Error 5"}</Form.Text>}
        </Form.Group>
        <br />
        
        {/*
        <UserSelectDish method={ 'POST' } editDishes={false} meals={meals} dishName={'dishes'} dishes_selected={reservation.dishes} handler={handleBooking} /> 
        */}

        <Form.Group controlId='hasGuests'>
        <Form.Label className={labelStyle}>Guests</Form.Label>
        <br />
        <Form.Text as="font-weight-normal">Are you going alone ?</Form.Text>
        <br />
        <Form.Check
        type="switch"
        name="hasGuests"
        aria-label="going alone ?"
        value={reservation.hasGuests}
        onChange={handleBooking} />
        {
        reservation.hasGuests === true ? 
        <div>
        <Badge bg="primary">No, I am going with guests.</Badge> 
        <p style={{fontFamily: "cursive, Segoe UI, Verdana, sans-serif" }} className='font-weight-light'>{'Coming with some company ?'} Please select below the number of guests:</p>
        </div>
                :
        <div>
        <Badge bg="info"><b>Yes, I am going alone.</b></Badge>
        </div>
        }
        </Form.Group>

        {
        reservation.hasGuests === true && 
        <Form.Group controlId='client_guests'>
        <Form.Label className={labelStyle}>Number of Guests</Form.Label>
        <br />
        <Form.Text className='mx-2'>How many guests are going ?
        </Form.Text>
        <Form.Select
        aria-label='Number of Guests'
        name="client_guests"
        value={reservation.client_guests}
        onChange={handleBooking}>
        <option value="0" disabled>Select number of guests {"("}without including yourself{")"}
        </option>
        {
        [1,2,3,4,5,6,7,8,9,10].map((guest, _ind)=>
        <option 
        key={`guest_${guest + _ind}`} 
        value={guest}>{guest === 10 ? 'more than 9' : guest}
        </option>)                         
        }
        </Form.Select>
        {
        [1,2,3,4,5,6,7,8,9,10].indexOf(reservation.client_guests) === -1 ? <Form.Text className="mx-2 careful">{ messages[5] ? messages[5] : "Error 6" }</Form.Text>
                  :
        <Form.Text className='mx-2 fst-italic text-success'>I am going with {[{id:'1', str: 'one'}, {id:'2', str:'two'}, {id:'3', str:'three'}, {id:'4', str:'four'}, {id:'5',str: 'five'}, {id:'6', str:'six'}, {id:'7', str:'seven'}, {id:'8', str:'eight'},{id:'9', str:'nine'},{id:'10', str:'more than 9'}].filter((nb)=>Number(nb.id) === Number(reservation.client_guests)).map((guests)=>guests.str)} {reservation.client_guests === 1 ? "guest" : "guests"}.</Form.Text>
        }
                           
        {
        reservation.client_guests === 10 && <div><Badge pill bg="info">Note:</Badge><span>  <i>If more than 9 people are going, please specify the exact number in the comment section at the end !</i></span></div>
        }
        </Form.Group>}
        <br />

        <div className={`mb-2 ${labelStyle}`}>Menu Selection</div>
        <ReservationSelectDishes guests={reservation.client_guests} meals={meals} hasGuests={reservation.hasGuests} handler={handle_GuestDishes} />
        
        {/*<GuestsSelectDishes meals={meals} guests={reservation.client_guests} dishName={'guestDishes'} handler={handle_GuestDishes} />*/}

        <Form.Group controlId="client_smoking">
        <div className={labelStyle}>Do you smoke ?</div>

        <Stack direction="horizontal" gap={3}>
        <div>
        <label htmlFor="yesSmoking"></label>
        <Form.Check
        inline
        onChange={handleBooking}
        id="yesSmoking"
        name="client_smoking"
        type="radio"
        value={"true"}
        /><Badge pill bg="success">Yes I smoke</Badge>
        </div>
                        
        <div>
        <label htmlFor="notSmoking"></label>
        <Form.Check
        inline
        onChange={handleBooking}
        id="notSmoking"
        name="client_smoking"
        type="radio"
        value={"false"}
        /><Badge pill bg="danger">No I don't smoke</Badge>
        </div>
        </Stack>
        {
         reservation.client_smoking === undefined && <Form.Text className="mx-2 careful">{ messages[6] ? messages[6] : "Error 7" }</Form.Text> }
         </Form.Group>
         <br />

        <Form.Group controlId='client_bookDay'>
        <Form.Label className={labelStyle}>Booking Date</Form.Label>
        <br />
        <Form.Text className='mx-2'>When are you going ?</Form.Text>
        <Form.Control
        name="client_bookDay"
        onChange={handleBooking}
        value={reservation.client_bookDay}
        type="date" 
        />
        {!reservation.client_bookDay && <Form.Text className='mx-2 fst-italic'>{messages[7]}</Form.Text>}

        {/*
        dateVal(reservation.client_bookDay).filter((day)=>day.toString() === 'true') > 0 && <Form.Text className='mx-2 careful'>{ messages[7] ? messages[7] : "Error 8" }</Form.Text>
        */} 
        </Form.Group>
        <br />

        <Form.Group controlId='client_bookTime'>
        <Form.Label className={labelStyle}>Booking Time</Form.Label>
        <br />
        <Form.Text className='mx-2'>At what time will you be there ?</Form.Text>
        <Form.Text muted><i>Reservations opened from Monday to Saturday from 11:00am to 21:00pm</i></Form.Text>
        <Form.Control
        disabled={reservation.client_bookDay ? false : true}
        name="client_bookTime"
        onChange={handleBooking}
        value={reservation.client_bookTime}
        type="time" 
        min="11:00"
        max="21:00"
        />

        { !reservation.client_bookDay || !timeVal(reservation.client_bookTime)  ? <Form.Text className='mx-2 fst-italic text-dark'>{ messages[8] ? messages[8] : "Error 8" }</Form.Text> : null
        } 
        </Form.Group>
        <br />

        <Form.Group controlId="Extra_Comments">
        <br />
        <Form.Text className='mx-2' muted>
        <i>Please tell us more about your booking (number of guests, special request needed, etc.)</i>
        <br />
        </Form.Text>
        <Form.Control
        as="textarea"
        name='client_extra'
        value={reservation.client_extra}
        onChange={handleBooking}
        className='pt-2'
        rows={3}
        maxLength={80}
        cols={2}
        placeholder={'Comments are optional, but appreciated :)'}
        />
        <Form.Text className={(eightyComments.high) ? "mx-2 text-success" : (eightyComments.low) ? "mx-2 text-danger" : (eightyComments.zero) ? "mx-2 fw-bold" : "" } muted={eightyComments.middle ? true : false }>{80 - reservation.client_extra.length} characters left</Form.Text>
        <br />
        {
        reservation.client_extra.match(matcher) || shortComment === true ? <Form.Text className="mx-2 text-secondary fst-italic fw-bold">{ messages[9] ? messages[9] : "Error 10" }
        </Form.Text>
                    :
        null
        }
        
        </Form.Group>
        <br />
                    
        <Form.Group controlId='legalAge'>
        <Form.Label className={labelStyle}>Confirm your legal age & the information</Form.Label>
        <Form.Check 
        type="checkbox" 
        name="client_legalAge">

        <>
        { isLegal ?
        <Form.Check.Input type="checkbox" name="client_legalAge" 
        value={reservation.client_legalAge} 
        checked={true}
        onChange={handle_legalAge} isValid />
        :
        <Form.Check.Input type="checkbox" name="client_legalAge" 
        value={reservation.client_legalAge} 
        checked={false}
        onChange={handle_legalAge} isInvalid />
        }
        </>
        
        <Form.Text className="text-success fw-bold"><span className="d-inline-block p-1"></span>I confirm having at least 18 years old and the  correctness of the data provided</Form.Text>
        <Form.Control.Feedback className={reservation.client_legalAge !== true ? "careful fst-italic" : "d-none"} 
        type="valid">
        { messages[0] ? messages[0] : "Error 1" }
        </Form.Control.Feedback>
        </Form.Check>
        </Form.Group>
        <br />

        { 
        (Object.entries(reservation).filter((prop) => prop[0] !== 'client_extra').filter((val)=> val[1] === '').length > 0) || !isLegal &&
        <Stack direction="horizontal" className="justify-content-center">
        <Toast animation={true} className=''>
        <Toast.Header className="bg-dark">
        <FontAwesomeIcon icon={faHand} size="xl" style={{color: "#d29719",}} />
        <div className="p-2"></div>
        <strong className="text-warning h6 me-auto">Hey! Before confirming...</strong>
        </Toast.Header>
        <Toast.Body className="bg-secondary text-light fw-bold" style={{fontFamily: "tahoma", fontSize: '1.1em'}}>
        <p className="text-center">You will be able to confirm your booking with the button below only if the required fields are not left in blank !</p>
        <p className="text-center">So make sure that you filled these out {':)'}!</p>
        </Toast.Body>
        </Toast>
        </Stack>
        }
        <br />

        {/* disabled={Object.entries(reservation).filter((prop) => prop[0] !== 'client_extra').filter((val)=>val[1] === '').length > 0 ? true : false }*/}

        { hasErrors.title === "D000 Dish Detected" && 
        <div className="bg-dark p-2">
        <CloseButton variant="white" onClick={refresh} /><Stack direction="horizontal" gap={2} className="text-warning p-2 justify-content-center">
        <FontAwesomeIcon icon={faLightbulb} size="lg" style={{color: "#FFD43B",}} /><p style={{fontSize: '1.08em', marginTop: '5px'}}>{errStack[0].msg}</p>
        </Stack>
        <Button className="d-block m-auto" style={{width: '20%'}} variant="secondary" onClick={refresh}>Close Message</Button>
        </div>
        }

        <div className="footer-Buttons d-flex justify-content-center align-items-center">
        {
        (hasErrors.ok === 'init' && isLegal) && 
        <Button 
        className="text-light fw-bold"
        style={{height: '50px', borderRadius: '25px'}}
        disabled={ Object.entries(reservation).filter((prop) => prop[0] !== 'client_extra').filter((val)=>val[1] === '').length > 0 ? true : false }
        variant={Object.entries(reservation).filter((prop) => prop[0] !== 'client_extra').filter((val)=>val[1] === '').length > 0 ? "danger" : "info"}
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
        { loader ? 'Preparing a table...' : 'Book My Table !' }
        </Button>
        }
        { /* 
        Object.entries(reservation).filter((prop) => prop[0] !== 'client_extra').filter((val) => val[1] === '').length > 0 &&
        <Toast
          className="noClass-name"
          bg="info"
        >
          <Toast.Header closeButton={false}>
           <FontAwesomeIcon icon={faHand} size="xl" style={{color: "#d29719",}} />
            <strong className="mx-auto">Complete your booking!</strong>
          </Toast.Header>
          <Toast.Body className='text-light fw-bold' style={{fontFamily: "tahoma",}}>
            Hey, If you see me, make sure that all required fields are filled-in so that you can save your booking {':)'}
          </Toast.Body>
        </Toast>
        */
        }
        </div>
        <br />

        {/*
        <pre>
        {JSON.stringify(reservation)}
        </pre>
        */
        }

        {
        hasErrors.ok === 'true' && 
        <Modal show={successModal} onHide={closeModal}>
        <Modal.Header className='text-light bg-success' closeButton>
        <Modal.Title>Booking Sent !</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Your booking has been successfully sent !</p>
        <p>Your reservation number is: <b className='text-success'>{Id}</b></p>
        <p><b>Note:</b> <i>Keep safe your reservation number for confirmation and for any booking modification !</i></p>
        </Modal.Body>
        <Modal.Footer>
        <Button className="fw-bold" variant="primary" onClick={closeModal}>
        {'Ok & Leave'}
        </Button>
        </Modal.Footer>
        </Modal>
        }

        {   
        (hasErrors.ok === 'false' && errStack[0].id !== 'Err500') && <>
        {
        hasErrors.title === "D000 Dish Detected" ?
        <div id="D000_Dish_Detected">
        {/* THE ELEMENT TO DISPLAY IS IN LINE 437 */}
        </div>
        :
        <div>
        <h3 className="d-inline-block text-warning bg-secondary mx-2 p-2">{hasErrors.title}: Your booking request cannot be sent for the following {errStack.length > 1 ? 'reasons:' : 'reason:'}</h3>
        <ListGroup as="ol" variant="flush" numbered>
        {errStack.map((err, _ind) =>
        <ListGroup.Item
        as="li" className="d-flex justify-content-between align-items-start" 
        key={err.id + _ind} variant={getErrVariant()} >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{err.section}</div>
          {err.msg}
        </div>
        </ListGroup.Item>
        )}
        </ListGroup>
        <div className="mt-2 text-center">
        <Button className="bg-dark fw-bold text-warning" onClick={refresh}>Ok I check that !</Button>
        <p className="mt-1"><small style={{fontSize: '.9em', fontFamily: "Calibri, Cochin, Georgia, Times, Times New Roman, serif"}}>Click on the above button and try to confirm again after checking!</small></p>
        </div>
        </div>}
        </>
        }

        { 
        errStack[0].id === 'Err500' && 
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
        <Accordion.Header>
        <h5 className="text-danger text-decoration-underline">{errStack[0].section}</h5> 
        </Accordion.Header>
        <Accordion.Body className="text-danger">
        <p>{'A Server Error Occured...'}</p>
        <p>{errStack[0].msg}</p>
        <br />
        <Button className="bg-dark fw-bold text-danger" 
        onClick={refresh}>Ok</Button>
        </Accordion.Body>
        </Accordion.Item>
        </Accordion>
        }
        </Form>
        </React.Fragment>
    )
}
export default ReservationPage;