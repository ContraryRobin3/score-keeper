import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create app and define port
const app = express();
const port = 3000;

// Configure static publi folder
app.use(express.static("public"));

// GET request to return main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.get("*", (req, res) => {
  res.redirect("/");
});

// Set up server to listen on defined port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
