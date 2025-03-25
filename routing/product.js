const fs = require("fs");
const { STATUS_CODE } = require("../constants/statusCode");

function productRouting(method, url, request, response) {
  response.setHeader("Content-Type", "text/html");

  if (url === "/product/add" && method === "GET") {
    response.write(`
      <html>
        <head><title>Shop – Add product</title></head>
        <body>
          <h1>Add product</h1>
          <form action="/product/add" method="POST">
            <input type="text" name="name" placeholder="Product name" required />
            <br/>
            <textarea name="description" placeholder="Description" required></textarea>
            <br/>
            <button type="submit">Submit</button>
          </form>
          <nav>
            <a href="/">Home</a> |
            <a href="/product/new">Newest product</a> |
            <a href="/logout">Logout</a>
          </nav>
        </body>
      </html>
    `);
    response.end();
  } else if (url === "/product/add" && method === "POST") {
    let body = [];

    request.on("data", (chunk) => body.push(chunk));

    request.on("end", () => {
      const parsed = Buffer.concat(body).toString();
      const pairs = parsed.split("&");

      const result = pairs
        .map((pair) => {
          const [key, value] = pair.split("=");
          if (!key || typeof value === "undefined") return "";
          try {
            const cleanValue = decodeURIComponent(value.replace(/\+/g, " "));
            return `${key}: ${cleanValue}`;
          } catch (err) {
            return `${key}: [decode error]`;
          }
        })
        .join("\n");

      fs.writeFile("product.txt", result, (err) => {
        if (err) {
          response.statusCode = 500;
          response.end("Server error");
          return;
        }

        response.statusCode = STATUS_CODE.FOUND;
        response.setHeader("Location", "/product/new");
        response.end();
      });
    });
  } else if (url === "/product/new") {
    fs.readFile("product.txt", "utf-8", (err, data) => {
      const content = data ? data : "No products yet.";
      response.write(`
        <html>
          <head><title>Shop – Newest product</title></head>
          <body>
            <h1>Newest product</h1>
            <pre>${content}</pre>
            <nav>
              <a href="/">Home</a> |
              <a href="/product/add">Add product</a> |
              <a href="/logout">Logout</a>
            </nav>
          </body>
        </html>
      `);
      response.end();
    });
  } else {
    console.log(`ERROR: requested url ${url} doesn’t exist`);
    response.statusCode = STATUS_CODE.NOT_FOUND;
    response.end(`<h1>404 - Page not found</h1>`);
  }
}

module.exports = { productRouting };
