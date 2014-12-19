#!bin/node

// Dependencies
var SunCalc = require("suncalc")
  , CliBox = require("cli-box")
  , ImageToAscii = require("image-to-ascii")
  , Moment = require("moment")
  , Figlet = require("figlet")
  , Couleurs = require("couleurs")()
  ;

// Constants
const HOME_DIRECTORY = process.env[
    process.platform == "win32" ? "USERPROFILE" : "HOME"
];

// Require home config
var Config = require(HOME_DIRECTORY + "/.sunset.json");

// Convert image to text
ImageToAscii({
    path: "./resources/sun.png"
  , pixels: " @ "
  , colored: false
}, function (err, sun) {

    var sunsetDate = Moment(SunCalc.getTimes(new Date(), Config.lat, Config.lng).sunset).format("hh:mm, d MMMM YYYY");

    // ASCII art
    Figlet.text(sunsetDate, function (err, text) {
        console.log(
            new CliBox({
                w: 0
              , h: 0
              , marks: {
                    nw: "╔"
                  , n:  "═"
                  , ne: "╗"
                  , e:  "║"
                  , se: "╝"
                  , s:  "═"
                  , sw: "╚"
                  , w:  "║"
                  , b: " "
                }
            }, {
                text: sun.replace(/\u001b\[0m/g, "").trimRight() + "\n\n\n" + text.split("\n").map(function (c) {
                    return Couleurs.fg(c, "#ecf0f1");
                }).join("\n")
              , hAlign: "center"
              , stretch: true
              , autoEOL: true
            }).toString()
        );
    });
});
