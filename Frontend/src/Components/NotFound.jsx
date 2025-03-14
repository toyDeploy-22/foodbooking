
import { Link } from "react-router-dom";

function NotFound () {
return(
    <div className="text-center text-ligh">
        <h3 className="bg-danger fw-bold pb-2">No wepage Found</h3>
        <br />
        <p className="text-light"><span className="bg-dark p-2">We did not find any page related.</span></p>
        <br/>
        <p><span className="bg-dark text-light p-2">Please check the URL.</span></p>
        <br />
        <p><em>{'('}<b>Note:</b> You can go the home page by clicking <Link to="/">Here</Link>{'.)'}</em></p>
    </div>
    )
}

export default NotFound;