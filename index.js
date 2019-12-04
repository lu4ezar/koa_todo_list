const app = require("./src/app.js");

let port = process.env.PORT;
if (port == null || port === "") {
  port = 3000;
}
// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`port = ${port}`));

module.exports = server;
