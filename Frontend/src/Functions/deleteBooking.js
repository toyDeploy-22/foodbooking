
const result = {};

const deleteBooking = async(bk_id) => {
  try {
    // const url = `http://localhost:5000/reservation/new-table-deletion/${bk_id}`;

    const url = `https://foodbooking-backend.vercel.app/reservation/new-table-deletion/${bk_id}`;

    const deletable = await fetch(url, {
      method: 'DELETE',
      headers: {"Content-Type": "application/json"},
    });

    if(deletable.status >= 200 && deletable.status > 300) {
    // console.log(deletable.status)
    result.err = false;
    result.code = 200;
    result.title = "Booking Deletion Successful";
    result.msg = `The booking "${bk_id}" has been successfully deleted and all of its data have been cleared.`
    } else {
    result.err = true;
    result.code = 404;
    result.title = "Booking ID Not Found";
    result.msg = "The deletion failed because the booking ID is not found. Please make sure that the booking ID is correct and that your booking is not already deleted."
    }
    return result
  }
  catch(err){ 
    console.error("Oooops:", err);
    result.err = true;
    result.code = 500;
    result.title = "Internal Server Error";
    result.msg = "The booking deletion failed due to an error. Please try again. Please contact the administrator if the issue persists.";

    return result
  }
}

export default deleteBooking;