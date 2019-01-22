const app = require('./src/app.js');
const server = app.listen(3000, () => console.log(`http://localhost:3000`));

module.exports = server;