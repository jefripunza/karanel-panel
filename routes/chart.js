module.exports = (app) => {
  const controllers = require("../controllers/chart"); // change your controllers
  // add your private middleware
  require("../utils/createRouter")(app, "/chart", [
    {
      path: "/:csv_name/:gender/:value",
      method: "get",
      render: controllers.chartWithGender,
    },
  ]);
};
