import { useState } from 'react';
import { findSearch, unauthorizedError, notFoundError, internalServerError } from '../Functions/sendSearch.js';
import deleteBooking from '../Functions/deleteBooking.js';
import { initResaSchema } from '../Functions/resaSchema';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';

function DeleteBooking() {

    const [bookingNum, setBookingNum] = useState('');

    const [loader, setLoader] = useState(false);

    const [user, setUser] = useState({ ...initResaSchema });

    const [deleteModal, setDeleteModal] = useState(false);
    const [trashSpin, setTrashSpin] = useState(false);

    const [Error, setError] = useState({
        err: false,
        code: 0,
        title: '',
        msg: ''
    });

    const [deletionResult, setDeletionResult] = useState({
        err: false,
        code: 0,
        title: '',
        msg: ''
    })

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
        setUser(initResaSchema);

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

    const openModal = () => {
      setDeleteModal(true)
    }

    const closeModal = () => {
      setDeleteModal(false)
    }

    const handleClose = () => {
       setError(initError)
    }
 // new mongoose property added: booking_id

const reaDelete = async() => {
  
  try {
    setTrashSpin(true);
    const deletor = await deleteBooking(user['booking_id']);
    setDeletionResult(deletor);
    setTrashSpin(false)

  } catch(err) {
    // console.error(err); origin error already sent from deletebooking.js function
  setDeletionResult(err)
  }
}

const bookingDeletion = async() => {
  const launcher = await new Promise(() => setTimeout(reaDelete, 1000));
  return launcher
}


const refresh = () => {
  setDeleteModal(false);
  setError(initError);
  setDeletionResult(initError);
  setTimeout(() => window.location.reload(), 1000)
}

    return (
      <div>
      <br />
        <Form onSubmit={submitSearch}>
        <h2 className='display-5 text-center text-light'><span className='bg-dark rounded-pill p-3'> Delete My Booking</span></h2>
        <br />
        <p className='text-center'><small><i>Please introduce below the number of the booking you want to delete.</i></small></p>
    <InputGroup size="lg">
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
    variant="dark" 
    size="lg" >
    Find My Booking
    </Button>
    </InputGroup>
    <br /><br />
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
        <Accordion.Header><div className='p-3 bg-dark text-info rounded'><span>We found</span>{' '}<span style={{fontSize: '2em'}}><Badge bg="info">{[user].length}</Badge></span>{' '}<span>Booking with the details you have provided</span></div></Accordion.Header>
        <Accordion.Body>
         <small className="fst-italic">Click on the booking number for more details. You can also click on the blue trash icon if you want to delete your booking.</small>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <br /><br />
    <Stack 
    direction="horizontal" className="p-2 justify-content-center fw-bold lead" gap={3} style={{background: 'linear-gradient(145deg,rgba(161, 161, 161, 1) 0%, rgba(230, 32, 32, 0.5) 85%)', borderRadius: '5px 20px 5px'}}>
      <div className="p-2 text-dark">{user.last_name} {user.first_name}</div>
      <div className="p-2 text-dark">{user.bookDay}{' for '} {user.bookTime}</div>
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
      <div className='p-2'>
<FontAwesomeIcon icon={faTrashArrowUp} onClick={openModal} size="lg" style={{color: "#4c4884"}} />
</div>
      </Stack>
      </div>
    }
    <Modal show={deleteModal} onHide={deletionResult['code'] === 200 ? refresh : closeModal}>
        <Modal.Header className={deletionResult['code'] === 200 ? 'bg-success text-light' : deletionResult['code'] === 0 ? 'text-primary' : `bg-secondary text-${deletionResult['code'] === 404 ? 'warning' : 'danger' }`} closeButton>
          <Modal.Title>{deletionResult['code'] === 0 ? 'Delete Your booking' : deletionResult['title']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { deletionResult.code === 0 ?
        <p>{'Are you sure you want to delete your booking '}<b>{`"${user.booking_id}"`}</b>{' ?'}</p>
            :
         `${deletionResult.msg}`
        }
        {deletionResult.code === 200 && <div className='d-flex justify-content-center'><br /><FontAwesomeIcon icon={faCircleCheck} beatFade size="lg" style={{color: "#63E6BE"}} /></div>}
        </Modal.Body>
        { deletionResult.code === 200 ?
        <Modal.Footer>
        <Button variant="outline-success" onClick={refresh}>
            Close
          </Button>
        </Modal.Footer>
              :
          <Modal.Footer>
        { trashSpin ?
        <Button style={{ backgroundColor: '#ee8787' }} disabled >
          <FontAwesomeIcon icon={faTrashArrowUp} spin size="xs" style={{ color: 'ghostwhite' }} />
          {' '}
            Deleting...
          </Button>
          :
          <Button variant={"outline-danger bg-dark"} onClick={bookingDeletion} >
          <FontAwesomeIcon icon={faTrashArrowUp} size="xs" style={{color: "#db0a0a"}} />
            {deletionResult.code === 0 ? '  Delete' : '  Try Again'}
          </Button>
          }
          <Button variant="outline-danger" onClick={closeModal} disabled={trashSpin ? true : false} >
            Cancel
          </Button>
        </Modal.Footer>
        }
      </Modal>
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

export default DeleteBooking;