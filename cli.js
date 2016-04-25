#!/usr/bin/env node

"use strict";

// Dependencies
const SunCalc = require("suncalc")
    , Daty = require("daty")
    , Prompt = require("prompt")
    , IpInfo = require("ipinfo")
    , rJson = require("r-json")
    , wJson = require("w-json")
    , splitByComma = require("split-by-comma")
    , couleurs = require("couleurs")
    , abs = require("abs")
    , Tilda = require("tilda")
    ;

let config = null;

// Constants
const CONFIG_FILE = abs("~/.sunset.json");

new Tilda(`${__dirname}/package.json`, {
    options: {
        opts: ["raw", "r"]
      , desc: "Show only the sunset time in the output, ignoring the ASCII art image."
    }
}).main(action => {

    Prompt.start();
    Prompt.message = "";
    Prompt.delimiter = "";
    Prompt.colors = false;

    function showSunset() {
        // Convert image to text
        let sunsetDate = new Daty(SunCalc.getTimes(new Date(), config.lat, config.lng).sunset)
          , sunsetStr = sunsetDate.format("hh:mm A")
          ;

        if (action.options.raw.is_provided) {
            return action.exit(sunsetStr);
        }

        sunsetStr = couleurs.bold(sunsetDate.format("hh:mm A"));

        // Thanks! :) http://chris.com/ascii/index.php?art=nature/sunset
        console.log(`
                Sunset time today:
                     ${sunsetStr}

                    ,    :     ,
              '.    ;    :    ;    ,\`
          '-.   '.   ;   :   ;   ,\`   ,-\`
       "-.   '-.  '.  ;  :  ;  ,\`  ,-\`   ,-"
          "-.   '-. '. ; : ; ,\` ,-\`   ,-"
     '"--.   '"-.  '-.'  '  \`.-\`  ,-"\`   ,--"\`
          '"--.  '"-.   ...   ,-"\`  ,--"\`
               '"--.  .:::::.  ,--"\`
    ------------------:::::::------------------
                       ~~~~~
                        ~~~
                         ~
        `);
    }

    // Require home config
    try {
        config = require(CONFIG_FILE);
        if (!config.lat || !config.lng) {
            throw new Error("Missing lat or lng.");
        }
        showSunset();
    } catch (e) {
        IpInfo("loc", function (err, loc) {
            if (err) { throw err; }
            loc = loc.trim();
            Prompt.get({
                properties: {
                    location: {
                        required: true
                      , message: "Invalid location."
                      , description: "Your location (lat,lng):"
                      , default: loc
                    }
                }
            }, function (err, result) {
                if (err) { throw err; }
                let location = splitByComma(result.location.trim());
                config = {
                    lat: location[0]
                  , lng: location[1]
                };
                wJson(CONFIG_FILE, config);
                showSunset();
            });
        });
    }
});
