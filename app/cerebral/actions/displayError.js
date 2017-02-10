// general purpose error catching and display

function displayError({input, state, output}) {
    var { errMessage } = input
    console.log("ERR: " + errMessage)
}

export default displayError