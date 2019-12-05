/* eslint-disable no-console */
const mongoose = require("mongoose");
const config = require("./config.json");

const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];
const finalConfig = { ...defaultConfig, ...environmentConfig };
const { url, port, database } = finalConfig;

const dbPath =
  process.env.PROD_MONGODB || `mongodb://${url}:${port}/${database}`;

mongoose
  .connect(dbPath, { useNewUrlParser: true })
  .catch(err =>
    console.error(
      `mongoose connect error: ${err.message}, mongodb is unavailable`
    )
  );

const db = mongoose.connection;

db.once("open", () =>
  console.log(`db connection ok, db: ${database}, dbPath: ${dbPath}`)
)
  .on("disconnected", () => console.log("db disconnected"))
  .on("close", () => console.log("Database connection closed."));
process.on("SIGINT", () => {
  db.close(() => {
    console.log("connection closed app terminated");
    process.exit(0);
  });
});

exports.dropCollection = col => {
  db.dropCollection(col)
    .then(() => console.log(`collection ${col} was dropped`))
    .catch(err => console.log(`collection was not dropped, error: ${err}`));
};
