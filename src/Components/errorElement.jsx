import Badge from 'react-bootstrap/Badge';

function ErrorElement() {
return(
    <div className="text-center">
    <h3 className="text-danger fw-bold"><span className="p-2 bg-dark">Something Went Wrong...</span> <Badge pill bg="danger">
        Oops
      </Badge></h3>
    <br /><br />
    <article className="fst-italic text-light bg-dark">
    <p>The page could not diplay properly.</p>
    <p>Please try to refresh this page.</p>
    </article>
    </div>
)
}

export default ErrorElement;