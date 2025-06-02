import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingElement from "./Components/loadingElement.jsx";
import ErrorElement from "./Components/errorElement.jsx";

// Components
import NavBar from './Components/Navbar.jsx';
import App2 from './App2.js';
import App3 from './App3.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

function App () {

const [loader, setLoader] = useState(false);
const [fullDishes, setFullDishes] = useState([]);
const [allEmails, setAllEmails] = useState([]);
const [Error, setError] = useState(false);


useEffect(()=>{
// For cleanup:
const controller = new AbortController();
const signal = controller.signal;
// const localhost = http://localhost:5000 (for development)

// useEffect always expects a regular function, not a Promise.
const getDishes = async() => {
    try {
        setLoader(true);
        const url = `https://foodbooking-backend.vercel.app/dish/alldishes`;
        const dataURL = await axios.get(url, { signal: signal });
        // const dataURL = await fetchURL.json();
        setFullDishes(() => [...dataURL.data.dishes]);
        setAllEmails(() => dataURL.data.bookings.map((customer) => customer.email));
        setError(false);
        setLoader(false);
        console.log('dishes added.')
    }
    catch(err) {
        setLoader(false);
        if(err.name === "AbortError") {
        setError(false);
        console.log("Aborted successfully");
        } else {
        setError(err);
        console.error(err);
        }
    }
}
getDishes();
return () => controller.abort()
}, []);

if(loader === true) {
    return (
        <LoadingElement />
    )
} else if(loader === false && Error) {
return(
<ErrorElement />
    )
} else {
return (
    <React.Fragment>
    <div className='fruitsCover'>
    <NavBar />
    <div className='coverContainer'>
    <App2 meals={fullDishes} />
    <App3 meals={fullDishes} emails={allEmails} />
    </div>
    </div>
    </React.Fragment>
    )}
}

export default App;