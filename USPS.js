const parseString = require("xml2js").parseString;

const axios = require("axios");
const xml2js = require("xml2js");
const querystring = require("querystring");

module.exports = class USPS {
  constructor() {
    this.url = "http://production.shippingapis.com/ShippingAPI.dll";
    this.user = "813BYUI05357";
  }

  query(req, handler) {
    const xml = this.buildRequest(req);

    axios
      .post(
        this.url,
        querystring.stringify({
          API: "RateV4",
          XML: xml
        })
      )
      .then(response => {
        var obj;
        parseString(
          response.data,
          { mergeAttrs: true, explicitArray: false },
          (err, result) => {
            obj = result;
          }
        );

        handler(obj);
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  buildRequest(req) {
    var builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false, indent: "", newline: "\n" }
    });

    const obj = {
      RateV4Request: {
        $: { USERID: this.user },
        Revision: 2,
        Package: {
          $: { ID: req.id },
          Service: req.service,
          FirstClassMailType: req.type,
          ZipOrigination: req.origin,
          ZipDestination: req.destination,
          Pounds: req.pounds,
          Ounces: req.ounces,
          Container: "",
          Size: "REGULAR",
          Machinable: true
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
</Package>

<RateV4Request USERID="xxxx">
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
</Package>
<Package ID="2ND">
<Service>PRIORITY</Service>
<ZipOrigination>44106</ZipOrigination>
<ZipDestination>20770</ZipDestination>
<Pounds>1</Pounds>
<Ounces>8</Ounces>
<Container>VARIABLE</Container>
<Size>LARGE</Size>
<Width>15</Width>
<Length>30</Length>
<Height>15</Height>
<Girth>55</Girth>
<Value>1000</Value>
<SpecialServices>
<SpecialService>1</SpecialService>
</SpecialServices>
</Package>
<Package ID="3RD">
<Service>ALL</Service>
<ZipOrigination>90210</ZipOrigination>
<ZipDestination>96698</ZipDestination>
<Pounds>8</Pounds>
<Ounces>32</Ounces>
<Container/>
<Machinable>true</Machinable>
<DropOffTime>23:59</DropOffTime>
<ShipDate>2016-03-23</ShipDate>
</RatePriceType>
<RatePaymentType></RatePaymentType>
</Package>
</RateV4Request>
*/
