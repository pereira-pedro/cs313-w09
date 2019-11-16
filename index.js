const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const uniqid = require("uniqid");
const USPS = require("./USPS.js");
const bodyParser = require("body-parser");

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .post("/getRate", (req, res) => {
    try {
      const request = {
        id: uniqid(),
        service: "FIRST CLASS",
        type: req.body.type,
        origin: req.body.origin,
        destination: req.body.destination,
        pounds: req.body.unit === "lb" ? req.body.weight : req.body.weight / 16,
        ounces: req.body.unit === "oz" ? req.body.weight : req.body.weight * 16
      };
      const m = new USPS();

      m.query(request, response => {
        if (req.body.output !== "json") {
          res.render("pages/index", {
            request: req.body,
            result: response.RateV4Response
          });
        } else {
          res.json(response);
        }
      });
    } catch (error) {
      res.status(500).send(`Invalid request. \n\n${error}`);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
