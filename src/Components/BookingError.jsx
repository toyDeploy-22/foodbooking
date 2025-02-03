


function BookingError ({stack}) {
console.error(stack)
return(
    <div className="text-center text-ligh">
        <h3 className="bg-danger fw-bold pb-2">An error occured</h3>
        <br />
        <p className="text-light"><span className="bg-dark p-2">The booking data have not been retrieved due to an error.</span></p>
        <br/>
        <p><span className="bg-dark text-light p-2">We invite you to try again by refreshing the page, or contact an administrator.</span></p>
        <br />
    </div>
    )
}

export default BookingError;