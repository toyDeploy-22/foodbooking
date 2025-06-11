
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// Do All elements in the form (except extra) as required

function NavBar ({ today }) {

    return (
<Navbar expand="lg" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">BookFood</Navbar.Brand>
        <p id='currentDate' className='text-light'><small>{today}</small></p>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Reservation" id="reservation-nav">
              <NavDropdown.Item href="/reservation/bookingform">Book A Table</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/reservation/search">
                Modify A Reservation
              </NavDropdown.Item>
              <NavDropdown.Item href="/reservation/delete">
                Delete A Reservation
              </NavDropdown.Item>
              {
              /*<NavDropdown.Item href="#">
                Contact
              </NavDropdown.Item>
              */}
            </NavDropdown>
            
            <NavDropdown title="Dishes" id="navbar-nav2">
              <NavDropdown.Item href="/dish/dishsearch/name">Find A Dish By Name</NavDropdown.Item>
              {/*
              <NavDropdown.Item href="/dish/dishsearch/id">
                Find A Dish By Id
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">
                Contact
              </NavDropdown.Item>
              */}
            </NavDropdown>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default NavBar;