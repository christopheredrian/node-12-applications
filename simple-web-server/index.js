const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const mimeTypes = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css"
};

/**
 * Creates our server which serves static files given
 * on our mime types
 */
const server = http.createServer((req, res) => {
  // Gets the request relative uri (from fb.com/home => /home)
  let uri = url.parse(req.url).pathname;
  // joins the current working directory to typesthe relative path above
  let fileName = path.join(process.cwd(), unescape(uri));
  console.log(`Loading ${uri}`);
  let stats;
  try {
    // returns file status (info about file)
    // essentially a wrapper to the C/C++ stats
    stats = fs.lstatSync(fileName);
  } catch ($e) {
    console.log($e);
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
    return;
  }
  if (stats.isFile()) {
    // here we can see the usage of the lstat
    let mimeType =
      mimeTypes[
        path
          .extname(fileName)
          .split(".")
          .reverse()[0]
      ];
    console.log(mimeType);
    res.writeHead(200, { "Content-type": mimeType });
    let fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, {
      Location: "index.html"
    });
    res.end();
  } else {
    res.writeHead(500, {
      "Content-type": "text/plain"
    });
    res.write("500 Internal Error\n");
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
