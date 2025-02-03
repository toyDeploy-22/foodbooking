
const checkObj = (obj) => {
    
    let newObj = new Object(); 
  
    for (let [key, value] of Object.entries(obj)) {
    if(key !== 'client_extra'){
    newObj[key] = value
      }
    };
    return Object.values(newObj);
    }