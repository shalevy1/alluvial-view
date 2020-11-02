/**
 * @Author: John Isaacs <john>
 * @Date:   06-Feb-182018
 * @Filename: items-processor.js
 * @Last modified by:   john
 * @Last modified time: 09-Feb-182018
 */



var LineByLineReader = require('line-by-line');
var path = require('path');
var fs = require('fs');
lr = new LineByLineReader('exp-data/items-ogtc1-withplatform_owners-pooled.json');
var count =0;
var dict = [];
var voyagesStore = [];
var locationsStore =[];
var locationsDictStore =[];
var vesselsUsed =[];
var compsUsed =[];
var i=0;
var platformList = [
  "SCOTER (gas)",
  "SCOTER (oil)",
  "MERGANSER",
  "HERON",
  "EGRET",
  "MARNOCK-SKUA (oil)",
  "MARNOCK-SKUA (cond)",
  "BRECHIN",
  "ARKWRIGHT",
  "SHAW",
  "CARNOUSTIE",
  "ARBROATH",
  "WOOD",
  "MONTROSE",
  "GODWIN",
  "CAYLEY",
  "GANNET D",
  "GANNET G",
  "GANNET A",
  "GANNET B",
  "GANNET C",
  "GANNET E",
  "GUILLEMOT A",
  "GUILLEMOT WEST",
  "GUILLEMOT NORTH",
  "GUILLEMOT NORTH WEST",
  "CLAPHAM",
  "SAXON",
  "PICT",
  "TEAL",
  "TEAL SOUTH",
  "COOK",
  "MALLARD",
  "GADWALL",
  "GROUSE",
  "KITTIWAKE",
  "GOOSANDER",
  "CRATHES",
  "SCOLTY",
  "DAUNTLESS",
  "DURWARD",
  "BUCHAN",
  "TWEEDSMUIR SOUTH",
  "TWEEDSMUIR",
  "HANNAY",
  "ETTRICK",
  "GOLDEN EAGLE",
  "BUZZARD",
  "BRODGAR",
  "ENOCHDHU",
  "CHESTNUT",
  "SHELLEY",
  "EVEREST",
  "DRAKE",
  "FLEMING",
  "SEYMOUR",
  "HAWKINS",
  "HUNTINGTON",
  "BARDOLINO",
  "HOWE",
  "NELSON",
  "BRIMMOND",
  "FORTIES",
  "MAULE",
  "MONAN",
  "MIRREN",
  "MADOES",
  "ELGIN",
  "GANNET F"
]

var OperatorList = [
  "BP",
  "TOTAL",
  "SHELL",
  "REPSOL",
  "ENQUEST",
  "NEXEN"
]

var VesselList = [
      "VESTLAND MIRA",
      "SKANDI BARRA",
      "SKANDI CAPTAIN",
      "SKANDI BUCHAN",
      "SKANDI RONA",
      "VESTLAND CETUS",
      "BOURBON MONSOON",
      "EDDA FERD",
      "ISLAND CHALLENGER",
      "BRAGE SUPPLIER",
      "GRAMPIAN SCEPTRE",
      "STRIL ODIN",
      "EDDA FRIGG",
      "HAVILA CRUSADER",
      "FS ARENDAL",
      "SEA TANTALUS",
      "NORTH PROMISE",
      "GRAMPIAN SOVEREIGN",
      "NORTH     MARINER",
      "BOURBON BORGSTEIN",
      "ATLANTIC MERLIN",
      "NORTH POMOR",
      "EDDA FRENDE",
      "NS IONA",
      "BRAGE TRADER",
      "HAVILA COMMANDER",
      "FS PISCES",
      "NS FRAYJA",
      "DINA SCOUT"
    ]

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

lr.on('error', function (err) {
	// 'err' contains error object
});

lr.on('line', function (line) {
	var jsonline = JSON.parse(line);
  //console.log(jsonline);
var idx = dict.indexOf(jsonline.voyageCounter)
if(idx<0){
  dict.push(jsonline.voyageCounter);
	voyagesStore.push({vesselName:jsonline.vesselName});
	var locations = [];
	var locationsDict = [];
	locationsDict.push(jsonline.platform);
	locations.push({companyName:jsonline.platformOwner,name:jsonline.platform})
	locationsStore.push(locations);
	locationsDictStore.push(locationsDict);

	//voyagesStore.push({vesselName:jsonline.vesselName});
  //console.log(jsonline);

	//console.log(voyagesStore.length);
}
else{
	locations = locationsStore[idx];
	locationsDict = locationsDictStore[idx];
	//console.log(locationsDictStore[idx]);
	if(locationsDict.indexOf(jsonline.platform)<0){
		locations.push({companyName:jsonline.platformOwner,name:jsonline.platform});
    locationsDict.push(jsonline.platform);

	}
	//console.log(locations.length);
}


});

lr.on('end', function () {
	// All lines are read, file is closed now.
  console.log("done reading");
	fs.appendFileSync('voyagesPOOL.csv',"id" + ",vesselName,vhash,companyName,chash,platformName,phash,voyageCount,multi,sortid\n");
console.log(voyagesStore.length+":"+locationsStore.length);

  for(var v=0;v<voyagesStore.length;v++){
    fixRow(v);
    var vescheck = VesselList.indexOf(voyagesStore[v].vesselName);
    if (vescheck >= 0) {
      processRow(v);
    }
    else{
      if(vesselsUsed.indexOf(voyagesStore[v].vesselName)<0){
        vesselsUsed.push(voyagesStore[v].vesselName);
      }
    }

	}
  console.log(vesselsUsed);
  console.log(compsUsed);
	console.log("done writing");
});

function fixRow(idx) {
var fixedLocations =[];
var locations = locationsStore[idx];

  for (var x = 0; x < locations.length; x++) {
    var platform = locations[x];
    var indexcheck = platformList.indexOf(platform.name);
    var Operatorcheck = OperatorList.indexOf(platform.companyName.toUpperCase());
    //console.log(platform.companyName);

    if (indexcheck >= 0 && Operatorcheck >= 0) {

      fixedLocations.push(locations[x]);
    }
    else{
      if(compsUsed.indexOf(platform.companyName.toUpperCase())<0){
        compsUsed.push(platform.companyName.toUpperCase());
      }
    }
  }
  //if(fixedLocations.length >0){
    locationsStore[idx]= fixedLocations;
    //newJsonArray.push(voyage);
    //console.log(newJsonArray.length);
  //}

}
function processRow(idx) {
  //if(i<10){
  //console.log(voyage);

  var vessel = voyagesStore[idx].vesselName;
	var locations = locationsStore[idx];

  var voyageCount = locations.length; //multiple platfroms
  if (voyageCount > 0) {
  //console.log(voyage.locations);
    var firstCompanyName = locations[0].companyName.toUpperCase();

    var companystring = vessel + " " + firstCompanyName + " " + voyageCount;
    var multi = 0;
    for (var idx = 0; idx < locations.length; idx++) {
      var platform = locations[idx];
      var indexcheck = platformList.indexOf(platform.name);
      i++;
      if (platform.companyName.toUpperCase() != firstCompanyName) {
        multi = 1 //multiple comapnies
      };
      companystring = companystring + " " + platform.companyName.toUpperCase() + " " +multi;

      fs.appendFileSync('voyagesPOOL.csv', i + "," + vessel + "," + vessel.hashCode() + "," + platform.companyName.toUpperCase() + "," + platform.companyName.toUpperCase().hashCode() + "," + platform.name + "," + platform.name.hashCode() + "," + voyageCount + "," + multi + "," + indexcheck + "\n");


    };
    //console.log(companystring);
    }
  //}
}
