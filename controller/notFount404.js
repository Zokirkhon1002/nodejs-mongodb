// Method: GET
// Desc: response 404 not found page!

const notFound404 = async (req, res) => {
  res.status(404).json({
    state: false,
    message: "404 not found!",
    data: [
      {
        message: "You are out of routes",
      },
    ],
  });
};

module.exports = notFound404;
