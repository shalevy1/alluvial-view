/**
 * @Author: John Isaacs <john>
 * @Date:   20-Oct-172017
 * @Filename: processor.js
 * @Last modified by:   john
 * @Last modified time: 25-Oct-172017
 */



const StreamArray = require('stream-json/utils/StreamArray');
const path = require('path');
const fs = require('fs');
var i = 0;

let jsonStream2 = StreamArray.make();

var jsonfile = "exp-data/voyages.json";
var platforms = "exp-data/q20_21_22.json";

var platfromList = [];

fs.createReadStream(platforms).pipe(jsonStream2.input);


var stream = fs.createWriteStream("voyageslimited.csv");

jsonStream2.output.on('data', function({
  index,
  value
}) {
  console.log('"'+value['name']+'",');
  platfromList.push(value['name'])
});

jsonStream2.output.on('end', function() {
  console.log('All done');
  startWriteStream();
});

function startWriteStream() {
	let jsonStream = StreamArray.make();
  stream.once('open', function(fd) {
    stream.write("id" + ",vesselName,companyName,platformName,voyageCount,multi\n");
    fs.createReadStream(jsonfile).pipe(jsonStream.input);
  });

	//You'll get json objects here
	jsonStream.output.on('data', function({
	  index,
	  value
	}) {
		console.log(value);
	  processRow(value);
	});

	jsonStream.output.on('end', function() {
	  console.log('All done');
	  stream.end();
	});
}






function processRow(voyage) {

  var vessel = voyage.vessel;
  var voyageCount = voyage.locations.length;
  var firstCompanyName = voyage.locations[0].companyName;
  voyage.locations.forEach(function(platform) {
    if (platformList.indexOf(platform.name) > -1) {
      i++;
      var multi = 0;
      if (platform.companyName == firstCompanyName) {
        multi = 1
      };
      stream.write(i + "," + vessel.Name + "," + platform.companyName + "," + platform.name + "," + voyageCount + "," + multi + "\n")
    };
  });


}
