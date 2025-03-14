
/**
<Form.Text className={reservation.client_extra.length >= 45 && reservation.client_extra <= 80 ? "text-success" : `${reservation.client_extra.length < 20 ? "text-danger" : "" }`} muted={reservation.client_extra.length >= 20 && reservation.client_extra.length < 45 ? true : false }>{80 - Number(reservation.client_extra.length)} 
**/

const charactersLeft = (limit, char) => {

    let result = {
        high: false,
        middle: false,
        low: false,
        zero: false,
        error: false
    };

    const resultKeys = Object.keys(result);
    
    if(limit - char >= 45 && limit - char <= 80) {
        let newObject = {};
        resultKeys.filter((r)=> r !== 'high').map((r)=>newObject[r] = false);
        result = { ...newObject, high: true };

    } else if(limit - char < 45 && limit - char >= 20) { 
        let newObject = {};
        resultKeys.filter((r)=> r !== 'middle').map((r)=>newObject[r] = false);
        result = { ...newObject, middle: true };

    } else if(limit - char < 20 && limit - char >= 1) { 
        let newObject = {};
        resultKeys.filter((r)=> r !== 'low').map((r)=>newObject[r] = false);
        result = { ...newObject, low: true };

    } else if(limit - char === 0) {
        let newObject = {};
        resultKeys.filter((r)=> r !== 'zero').map((r)=>newObject[r] = false);
        result = { ...newObject, zero: true };

    } else { 
        let newObject = {};
        resultKeys.filter((r)=> r !== 'error').map((r)=>newObject[r] = false);
        result = { ...newObject, error: true };
    }
    
return result;
}

export default charactersLeft;