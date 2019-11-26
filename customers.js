const fs = require("fs");
const { once, EventEmitter } = require("events");
const readline = require("readline");

async function readFile(path) {
  const customers = [];
  console.log(path);
  try {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path),
      //output: process.stdout,
      console: false
    });

    readInterface.on("line", function(line) {
      //console.log(line);
      customers.push(JSON.parse(line));
    });

    readInterface.on("close", function() {
      // console.log(customers);
    });

    return new Promise(resolved => {
      readInterface.on("close", function() {
        // console.log(customers);
        resolved(customers);
      });
    });

    // await once(readInterface, "close"); //added to version 11.03
    // console.log("==============================");
    // console.log(customers);
    // return customers;
  } catch (err) {
    console.log(err);
  }
}

module.exports = readFile;
