require("dotenv").config();

const express = require("express");
const path = require("node:path");
const { neon } = require("@neondatabase/serverless");

const app = express();
const sql = neon(process.env.DATABASE_URL);

async function checkDatabaseConnection() {
  const result = await sql`SELECT version()`;
  console.log("Connected to Neon:", result[0].version);
}

checkDatabaseConnection().catch(console.error);

const newRouter = require("./routes/newRouter");
const indexRouter = require("./routes/indexRouter");

app.locals.links = [
  { href: "/", text: "Home" },
  { href: "/new", text: "New Message" },
];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/new", newRouter);
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Express app - listening on port ${PORT}!`);
});
