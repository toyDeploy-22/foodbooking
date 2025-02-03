
const colorVariants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

const getErrVariant = () => {
    const index = Math.round(Math.random() * 2);
return colorVariants.filter((col)=>col === "danger" || "warning")[index === 0 ? index : index - 1]
}

const getAllVariants = () => {
    const index = Math.round(Math.random() * 6);
    return colorVariants.filter((col)=>col !== 'danger' && col !== 'light')[index === 0 ? index : index - 1]
}
/**
const headers = { 
h1: '2em',
h2: '1.5em',
h3: '1.17em',
h4: '1em',
h5: '0.83em',
h6: '0.75em',

FIREFOX 
h1: 2em
h2: 1.5em
h3: 1.17em
h4: 1em
h5: 0.83em
h6: 0.67em
}

const sizes = {
    fontWeight: 'bold',
}
**/

export { getErrVariant, getAllVariants };