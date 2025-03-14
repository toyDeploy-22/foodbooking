

const submitReservation = async (evnt) => {
    // let's prevent the default browser behavior
    evnt.preventDefault()
    console.log(this.state.reservation)
    try {
        let response = await fetch('https://striveschool.herokuapp.com/api/reservation',
            {
                method: 'POST',
                body: JSON.stringify(this.state.reservation),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        // now response holds the result of my operation
        // the ok property of it will tell me if everything went well or not
        if (response.ok) {
            alert('your reservation has been saved correctly')
            this.setState({
                reservation: { // INITIAL STATE
                    name: '',
                    phone: '',
                    numberOfPersons: 1,
                    smoking: false,
                    dateTime: '',
                    specialRequests: ''
                }
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } else {
            alert('something went wrong')
        }
    } catch (error) {
        console.log(error)
    }
}

handleChange = (e) => {
    // e.target.value
    // e.target.id
    let id = e.target.id
    console.log('the field I need to change in the reservation object is', id)
    // id can be "name", "phone", "smoking"
    this.setState({
        reservation: {
            ...this.state.reservation,
            [id]: id === 'smoking' ? e.target.checked : e.target.value
        }
    })
}