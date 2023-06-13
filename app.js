                                                                            // Weather App
// Package Used
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");


// Create Route for URL page.html
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile( __dirname + "/page.html");
  });

// Implement our API Call to URL
app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const stateName = req.body.stateName;
  const urlInput = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateName}&appid=0a96cb24c70366b286de9b08b6c45cdb`;
    
  https.get(urlInput, function(response){
      let data = "";
      response.on("data", function(chunk){
        data += chunk;
    });
    
    response.on("end", function(){
      const cityState = JSON.parse(data);
      console.log(cityState);
      
      const lat = cityState.coord.lat;
      const long = cityState.coord.lon;
      const urlTemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0a96cb24c70366b286de9b08b6c45cdb&units=imperial`;
      
      https.get(urlTemp, function(responseTemp){
        let dataTemp = ""; 

        responseTemp.on("data", function(chunkTemp){
          dataTemp += chunkTemp;
        });
          
        responseTemp.on('end', function () {
            const jsondataTemp = JSON.parse(dataTemp);
            const temp = jsondataTemp.main.temp;
            const des = jsondataTemp.weather[0].description;
            const icon = jsondataTemp.weather[0].icon;
            const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write(`<h1>The temp in ${cityName} , ${stateName} is ${temp} degrees</h1>`)
              res.write(`<p>The weather description is ${des} </p>`)
              res.write("<img src=" + imageurl + ">"
              );
        res.send();
       });
     });
   });
 });  
});

app.listen(5000);