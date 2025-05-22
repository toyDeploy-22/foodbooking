import React, { useState, useEffect } from "react";
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
const [fullResas, setFullResas] = useState([{

}])
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
        const url1 = `https://foodbooking-backend.vercel.app/dish/alldishes`; // dishes
        const url2 = `https://foodbooking-backend.vercel.app/allreservation_emails`; // bookings

        const fetchURL1 = async() => {
           const getURL1 = await fetch(url1, { signal: signal });
           const dataURL1 = await getURL1.json();
           setFullDishes(() => [...dataURL1]);
        }

        const fetchURL2 = async() => { 
           const getURL2 = await fetch(url2, {signal: signal});
           const dataURL2 = await getURL2.json();
           setFullResas([...dataURL2]);
        }

        await Promise.all([fetchURL1, fetchURL2]);
        
        setError(false);
        setLoader(false);
        console.log('dishes and bookings added.')
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
    <App3 meals={fullDishes} bookings={fullResas} />
    </div>
    </div>
    </React.Fragment>
    )}
}

export default App;