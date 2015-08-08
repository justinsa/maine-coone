# NHTSA Vehicle Recall Web Service
Re-invention of the NHTSA web service for viewing vehicle recall data.

Available at: https://maine-coone.herokuapp.com

DOT-NHTSA Web API specifications: http://www.nhtsa.gov/webapi/Default.aspx?Recalls/API/83

##Data Extraction Script
Since the existing NHTSA Web API has a limited set of functionality for accessing recall data (model year, make, and model values are all required to get recall data), it was necessary to extract and then import the data behind an improved Web API. This was accomplished with the following script that sequentially fetched and iterated through years, makes, models, and then recalls. Each phase of the script will store the result set to local disk, which can then be reloaded on subsequent runs should the script fail or process terminate unexpectedly at a later stage.

[/automation/data-extractor.js](https://github.com/justinsa/maine-coone/blob/master/automation/data-extractor.js)

##Data Import Script
Inserted the pulled recall data into MongoDB for use by the web service. This script could definitely be improved by bulk importing.

[/automation/data-importer.js](https://github.com/justinsa/maine-coone/blob/master/automation/data-importer.js)

##Development
To run this application locally you either need the access URI for the MongoLabs instance where the 112 MB of recall data is stored **or** you need to run extraction and importing to your own database. Extraction takes a while... be forewarned.

All you need to get going is:

  ```cmd
  npm install
  node ./boot.js --db {Connection URI}
  ```

The service is then available at ```http://localhost:8080```