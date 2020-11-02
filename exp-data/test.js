/**
 * @Author: John Isaacs <john>
 * @Date:   21-Sep-172017
 * @Filename: test.js
 * @Last modified by:   john
 * @Last modified time: 21-Sep-172017
 */



 var json2csv = require('json2csv');
 var fields = ['collection', 'company', 'delivery', 'list_of_vehicle_type', 'item_name', 'info', 'load_size', 'nb_of_items_on_job', 'nb_of_vehicles', 'platform', 'requested_by'];

 try {
   var result = json2csv({ data: myData, fields: fields });
   console.log(result);
 } catch (err) {
   // Errors are thrown for bad options, or if the data is empty and no fields are provided.
   // Be sure to provide fields if it is possible that your data array will be empty.
   console.error(err);
 }
