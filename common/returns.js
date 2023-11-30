function returnResult(state, message, data) {
  let returnR = {
    state: state,
    message: message,
  };
  if (state) {
    returnR.data = data;
  }
  return returnR;
}

function handleErrorResponse500(res, error) {
  return res.status(500).json({ state: false, message: error.message });
}

function errorResponse400(res, error) {
  return res.status(400).json({ state: false, message: error.details[0].message, data: null });
}

module.exports = { handleErrorResponse500, returnResult, errorResponse400 };
