
import { Route, Routes } from "react-router-dom";
import Homepage from './Components/Homepage.jsx';
import DishList from "./Components/DishList.jsx";
import DishProfileName from "./Components/DishProfileName.jsx";
import DishProfileId from './Components/DishProfileId.jsx';
import DishSearchName from './Components/DishSearchname.jsx';
import DishSearchId from './Components/DishSearchId.jsx';
import NotFound from './Components/NotFound.jsx';
// import allDishes from './Functions/dishesTable.js'; dishes data in case

function App2 ({ meals }) {

const domainUrl = "dish";

return(
     <Routes>
    <Route index element={<Homepage meals={ meals } />} />
    <Route exact path='/' element={<Homepage meals={ meals }/>} />
    <Route path={`${domainUrl}/alldishes`} element={<DishList meals={ meals } />} />
    <Route path={`${domainUrl}/dishsearch/name`} element={<DishSearchName meals={ meals } />} />
    <Route path={`${domainUrl}/dishsearch/id`} element={<DishSearchId meals={ meals } />} />
    <Route path={`${domainUrl}/name`} element={<DishProfileName meals={ meals }/>} />
    <Route path={`${domainUrl}/id`} element={<DishProfileId meals={ meals }/>} />
    <Route path='dish/*' element={<NotFound />} />
    </Routes>)
}

export default App2;