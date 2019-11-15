const parseString = require("xml2js").parseString;

const https = require("https");
var xml2js = require("xml2js");

module.exports = class USPS {
  constructor() {
    this.url = "https://production.shippingapis.com/ShippingAPI.dll?API=RateV4";
    this.user = "813BYUI05357";
  }

  query(req, handler) {
    const xml = this.buildRequest(req);

    https
      .get(`${this.url}&XML=${xml}`, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          var obj;
          parseString(data, (err, result) => {
            console.log(result);
            obj = result;
          });

          handler(obj);
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
      });
  }

  buildRequest(req) {
    var builder = new xml2js.Builder();
    let obj = {
      RateV4Request: {
        $: {
          USERID: this.user
        },
        _: {
          Revision: {
            _: 2
          },
          Package: {
            $: {
              ID: req.id
            },
            _: {
              Service: {
                _: req.service
              },
              FirstClassMailType: {
                _: req.type
              },
              ZipOrigination: {
                _: req.origin
              },
              ZipDestination: {
                _: req.destination
              },
              Pounds: {
                _: req.pounds
              },
              Ounces: {
                _: req.ounces
              },
              Container: {},
              Size: {
                _: "REGULAR"
              },
              Machinable: {
                _: true
              }
            }
          }
        }
      }
    };

    return builder.buildObject(obj);
  }
};

/*<RateV4Request USERID="xxxx">
<Revision>2</Revision>
<Package ID="1ST">
<Service>FIRST CLASS</Service>
<FirstClassMailType>LETTER</FirstClassMailType>
<ZipOrigination>44106</ZipOrigination>
<ZipDestination>20770</ZipDestination>
<Pounds>0</Pounds>
<Ounces>3.12345678</Ounces>
<Container/>
<Size>REGULAR</Size>
<Machinable>true</Machinable>
</Package>*/
