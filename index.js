const express = require("express");
const path = require("path");
const model = require("model");
const PORT = process.env.PORT || 5000;
const uniqid = require("uniqid");

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/getRate", (req, res) => {
    const request = {
      id: uniqid(),
      service: "FIRST CLASS",
      type: req.type,
      origin: req.origin,
      destination: req.destination,
      pounds: req.pounds,
      ounces: req.ounces
    };

    const m = new model.USPS();

    m.query(request, res => {
      console.log(res);
      //  res.render('pages/index')
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
