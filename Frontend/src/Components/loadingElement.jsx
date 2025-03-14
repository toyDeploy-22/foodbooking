import Spinner from "react-bootstrap/Spinner";

function LoadingElement() {
    return (
        <div>
                <h5>Loading...</h5>
                <br />
                <Spinner animation="border" variant="primary" />
                <Spinner animation="grow" variant="dark" />
                <br />
                <small><i>If this keeps too long, try to refresh the page.</i></small>
                </div>
    )
}

export default LoadingElement;