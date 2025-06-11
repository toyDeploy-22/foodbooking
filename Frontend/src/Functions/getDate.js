
const today = new Date;

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDate() {
    try {
    const dayName = allDays[today.getDay()];
    const dayNumber = (today.getDate() >= 10 ? today.getDate() : `${(today.getDate()).toString().substring(1)}`);
    const month = allMonths[today.getMonth()];
    const year = today.getFullYear();

    const fullDate = `${dayName.substring(0, 3)}, ${dayNumber} ${month.substring(0, 3)} ${year}`;

    return fullDate;

    } catch(err) {
        console.error('cannot get date');
        console.error(err);
        return ''
    }

}

export default getDate;