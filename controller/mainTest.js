// Method: GET
// Desc: response main page!

const mainTest = async (req, res) => {
  res.status(200).json({
    state: true,
    message: "Server is working perfectly",
  });
};

module.exports = mainTest;
