const { homeRouting } = require("./home");
const { logoutRouting } = require("./logout");
const { productRouting } = require("./product");
const { STATUS_CODE } = require("../constants/statusCode");

function requestRouting(request, response) {
  const { method, url } = request;
  const time = new Date().toISOString();

  if (url === "/") {
    console.log(`INFO [${time}]: ${method} – ${url}`);
    homeRouting(method, response);
  } else if (url.startsWith("/product")) {
    console.log(`INFO [${time}]: ${method} – ${url}`);
    productRouting(method, url, request, response);
  } else if (url === "/logout") {
    console.log(`INFO [${time}]: ${method} – ${url}`);
    logoutRouting(method, response);
  } else if (url === "/kill") {
    console.log(
      `PROCESS [${time}]: logout has been inititated and the application will be closed`
    );

    process.exit();
  } else {
    console.log(`ERROR [${time}]: requested url ${url} doesn’t exist`);
    response.statusCode = STATUS_CODE.NOT_FOUND;
    response.end("<h1>404 Not Found</h1>");
  }
}

module.exports = { requestRouting };
