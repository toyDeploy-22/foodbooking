import { useState } from 'react';
import { findSearch, unauthorizedError, notFoundError, internalServerError } from '../Functions/sendSearch';
import { initResaSchema } from '../Functions/resaSchema';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';

function BookingSearch() {

    const [bookingNum, setBookingNum] = useState('');

    const [loader, setLoader] = useState(false);

    const [user, setUser] = useState({ ...initResaSchema });

    const [Error, setError] = useState({
        err: false,
        code: 0,
        title: '',
        msg: ''
    });

    const initError = {
        err: false,
        code: 0,
        title: '',
        msg: '' } // Not a state

    const handleSearch = (e) => {
        setBookingNum(e.target.value);
        if(Error.err) {
            setError(initError)
        }
    };

    const submitSearch = async(e) => {
        e.preventDefault();
        try {
        setLoader(true);
        setError(initError);
        
        const findUser = await findSearch(bookingNum);

        switch(findUser.code.toString()[0]) {
            case "2":
            const success = {err: false, code: 200, title: 'Success', msg: 'Reservation found'}; 
            setLoader(false);
            setError(success);
            setUser(findUser.data[0]);
            break;

            case "4":
            const notFoundError_Obj = (findUser.code === 401 ? unauthorizedError() : notFoundError(bookingNum));
            setLoader(false);
            setError(notFoundError_Obj)
            break;

            default: 
            const newError = internalServerError("default error");
            setLoader(false);
            setError(newError);
            }
        } catch(err) {
            console.error(err)
            const newError = internalServerError("Internal Server Error");
            setLoader(false);
            setError(newError)            
        }
    }

    const handleClose = () => {
       setError(initError)
    }
 // new mongoose property added: booking_id
    return (
      <div>
      <br />
        <Form onSubmit={submitSearch}>
        <h2 className='display-3 text-center text-light'><span className='rounded-pill p-4' style={{background: 'linear-gradient(356deg,rgba(199, 184, 46, 1) 0%, rgba(2, 26, 12, 1) 88%)'}}>Booking Check</span></h2>
        <br />
        <p className='text-center fst-italic'><small>Look for your booking, check the details, and edit the info if you want !</small></p>
    <InputGroup size="lg">
    <InputGroup.Text className="bg-secondary" style={{color: 'ghostwhite; text-shadow: black 1px 1px'}} >Search For Booking nº
    </InputGroup.Text>
    <Form.Control
    onChange={handleSearch}
    placeholder='Type Here'
    aria-label="Booking-Number"
    aria-describedby="inputGroup-booking-number"
    name="bookingNumber"
    value={bookingNum}
    />
    <Button 
    type="submit"
    variant="success" 
    size="lg" >
    Find Booking
    <br />
    <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" style={{color: "#ffffff"}} />
    </Button>
    </InputGroup>
    <p className='text-center'><small><i>Please introduce your booking number in the above field.</i></small></p><br /><br />
    {
        loader === true && 
        <div className='d-flex flex-row'>
        <div className='offset-3'></div>
        <Spinner animation="border" variant="primary" />
        <Spinner animation="grow" variant="dark" />
        </div>
    }
    </Form>

    {
        Error.code === 200 && 
        <div>
        {/*<Badge bg="light"><b>{[user].length}</b></Badge> */}
      <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5><Badge bg="info">{[user].length}</Badge> Booking Found !</h5></Accordion.Header>
        <Accordion.Body>
         <small className="fst-italic">If you want more details about your booking, just click on the booking number.</small>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <br /><br />
    <Stack 
    direction="horizontal" className="p-2 justify-content-center fw-bold lead" gap={3} style={{backgroundColor: '#552c68', borderRadius: '5px 20px 5px'}}>
    <div className="p-2"><FontAwesomeIcon icon={faUtensils} size="lg" style={{color: "#23bea4",}} /></div>
      <div className="p-2 text-light">{user.last_name} {user.first_name}</div>
      <div className="p-2 text-light">{user.bookDay}{' for '} {user.bookTime}</div>
      <div className="vr" />
      <div className="p-2"><Link
      className="bookingNumberFound text-success text-decoration-none"
    to={`/reservation/search/${user.booking_id}`}
    target='_blank'
    >{user.booking_id}</Link></div>
      {
      user.hasOwnProperty("extra") && user.extra !== '' ? <div className="p-2 text-light"><article>{user.extra.length > 65 ? user.extra.substring(0, 64) + "..." : user.extra}</article></div>
      :
      <div className="p-2 text-light h6">This reservation has no comment.</div>
      }
      </Stack>
      </div>
    }
    {''}
    { Error.err &&
            <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog className={`bg-${Number(Error.code.toString()[0]) === 4 ? "warning" : "danger"}`}>
        <Modal.Header className={`bg-dark text-light border-bottom border-${Number(Error.code.toString()[0]) === 4 ? "warning" : "danger"}`}>
          <Modal.Title className="text-center w-100">{Error.title}</Modal.Title>
          {' '}
          <FontAwesomeIcon icon={faTriangleExclamation} size="lg" beat style={{color: `${Error.code.toString()[0] === "4" ? "#FFD43B" : "#ba1234"}`}} />
          {' '}
        </Modal.Header>

        <Modal.Body className={`bg-dark text-light border-top border-bottom border-${Number(Error.code.toString()[0]) === 4 ? "warning" : "danger"}`}>
          <p style={{fontFamily: `${'Courier New'}, Courier, monospace`, textAlign: 'center'}}>{Error.msg}</p>
        </Modal.Body>

        <div className="bg-dark text-light text-center">
        <br/>
        <Button variant={Number(Error.code.toString()[0]) === 4 ? "warning" : "danger"} className="bg-dark text-light" onClick={handleClose}
        >Close Message</Button>
        <br /><br />
        </div>
      </Modal.Dialog>
    </div>
    }
    </div>
    )
}

export default BookingSearch;