/**
 * @Author: John Isaacs <john>
 * @Date:   20-Oct-172017
 * @Filename: processor.js
 * @Last modified by:   john
 * @Last modified time: 08-Feb-182018
 */



const StreamArray = require('stream-json/utils/StreamArray');
const path = require('path');
const fs = require('fs');
var i = 0;
var newJsonArray = [];
var vesselsUsed =[];
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
      "NORTH MARINER",
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

    //let jsonStream = StreamArray.make();

    //var jsonfile = "exp-data/voyages.json";



    //var stream = fs.createWriteStream("voyages3.csv");
    //stream.once('open', function(fd) {
    //  stream.write("id" + ",vesselName,vhash,companyName,chash,platformName,phash,voyageCount,multi,sortid\n");
    //fs.createReadStream(jsonfile).pipe(jsonStream.input);

    //});

    // //You'll get json objects here
    // jsonStream.output.on('data', function({
    //   index,
    //   value
    // }) {
    //
    //   processRow(value);
    // });
    //
    // jsonStream.output.on('end', function() {
    //   console.log('All done');
    //
    // });

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

    Array.prototype.removeValue = function(name, value) {
      var array = $.map(this, function(v, i) {
        return v[name] === value ? null : v;
      });
      this.length = 0; //clear original array
      this.push.apply(this, array); //push all elements except the one we want to delete
    }

    fs.appendFileSync('voyagesAIS.csv', "id" + ",vesselName,vhash,companyName,chash,platformName,phash,voyageCount,multi,sortid\n");

    var json = JSON.parse(require('fs').readFileSync('exp-data/voyages.json', 'utf8'));
    for (var r = 0; r < json.length; r++) {
      //console.log(json[r]);
      fixRow(json[r]);

    }

    //console.log(newJsonArray);
    for (var r = 0; r < newJsonArray.length; r++) {

      var vescheck = VesselList.indexOf(newJsonArray[r].vessel.Name);
      ///console.log(newJsonArray[r].vessel.Name +":"+vescheck)

      if (vescheck >= 0) {
        processRow(newJsonArray[r]);
      }
      else{
        if(vesselsUsed.indexOf(newJsonArray[r].vessel.Name)<0){
          vesselsUsed.push(newJsonArray[r].vessel.Name);
        }
      }
    }

    console.log(vesselsUsed);
    //


    //processRow(json[r]);

    function fixRow(voyage) {
      var fixedLocations = [];
      for (var idx = 0; idx < voyage.locations.length; idx++) {
        var platform = voyage.locations[idx];
        var indexcheck = platformList.indexOf(platform.name);
        var opcheck = OperatorList.indexOf(platform.companyName);
        console.log(opcheck + ":" + platform.companyName)
        if (indexcheck >= 0 && opcheck >= 0) {
          fixedLocations.push(voyage.locations[idx]);
        }
      }
      if (fixedLocations.length > 0) {
        voyage.locations = fixedLocations;
        newJsonArray.push(voyage);
        //console.log(newJsonArray.length);
      }
    }

    function processRow(voyage) {
      //if(i<10){
      //console.log(voyage);
      var vessel = voyage.vessel;
      var voyageCount = voyage.locations.length; //multiple platfroms
      //if (voyageCount > 0) {
      //console.log(voyage.locations);
      var firstCompanyName = voyage.locations[0].companyName;

      var companystring = vessel.Name + " " + firstCompanyName + " " + voyageCount;
      var multi = 0;
      for (var idx = 0; idx < voyage.locations.length; idx++) {
        var platform = voyage.locations[idx];
        var indexcheck = platformList.indexOf(platform.name);
        i++;
        if (platform.companyName != firstCompanyName) {
          multi = 1 //multiple comapnies
        };
        companystring = companystring + " " + platform.companyName + " " + multi;

        fs.appendFileSync('voyagesAIS.csv', i + "," + vessel.Name + "," + vessel.Name.hashCode() + "," + platform.companyName + "," + platform.companyName.hashCode() + "," + platform.name + "," + platform.name.hashCode() + "," + voyageCount + "," + multi + "," + indexcheck +"\n");


      };
      //console.log(companystring);
      //}
      //}
    }
