import { Route, Routes } from "react-router-dom";
import ReservationPage from './Components/ReservationPage.jsx';
import BookingSearch from "./Components/BookingSearch.jsx";
import BookingDetails from './Components/BookingDetails.jsx';
import NotFound from './Components/NotFound.jsx';
import reasons from './Functions/reasons.js';

function App3({ meals }) {
    
const domain = "reservation";

return(
<Routes>
<Route path={`${domain}/bookingform`} element={<ReservationPage meals={ meals } 
info={ reasons }
/>} />
<Route exact path={`${domain}/search`} element={<BookingSearch />} />
<Route path={`${domain}/search/:booking_id`} element={<BookingDetails meals={ meals } />} />
<Route path='reservation/*' element={<NotFound />} />
</Routes>)
}

export default App3;