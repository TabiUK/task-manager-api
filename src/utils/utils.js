console.log("welcome: utils.js")

 /**
     * takes in a request.body, with an array of allowed data fields
     * creates keys for the request.body and checks that they are included in allowedUpdates.
     * @param body value of request.body
     * @param allowedUpdates array of allowed data fields
     * @param errorMessage optional errorMessage to return
     */
const isValidOperation = (keyPair, allowedUpdates, errorMessage = 'invalid operation') =>
{
    const CheckValidOperation = keyPair.every((update) => allowedUpdates.includes(update))
    
    if (!CheckValidOperation) return { error: errorMessage}

    return { error: undefined}
}

module.exports.isValidOperation = isValidOperation

console.log("end of line: utils.js")
