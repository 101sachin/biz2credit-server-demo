const fs = require("fs");
const express = require("express");

// customers Model function: return incircle customers
const readCustomers = require("./customers.js");

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = "./customers.txt";

const Dublin = {
  lat: 53.339428,
  long: -6.257664
};

// allow CORS Origin Access for Demo Purpose Only
// use middleware
app.use(function(req, res, next) {
  res.header("Access-Control-allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,x-Requested-With"
  );
  next();
});

app.get("/api/customers", (req, res) => {
  readCustomers(filePath)
    .then(customers => {
      //console.log(customers);
      const inCircleCustomes = [];
      customers.forEach(customer => {
        //console.log(customer);
        let d = getDistanceFromLatLonInKm(
          Dublin.lat,
          Dublin.long,
          customer.latitude,
          customer.longitude
        );
        console.log("distance ========================", d);
        if (d <= 100) {
          inCircleCustomes.push(customer);
        }
        //console.log(inCircleCustomes);
      });
      inCircleCustomes.sort((a, b) => a.user_id - b.user_id);

      // send the response
      res.send(inCircleCustomes);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(PORT, server => {
  console.log("server listening at port 3000");
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  //console.log(lat1, lon1, lat2, lon2);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
