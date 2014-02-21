apibox
======

Create declarative APIs in few minutes

## 0. Requirements
- Node.js
- NPM
- MongoDB

## 1. Install

	mkdir myapi
	cd myapi
	npm install --save apibox

## 2. Configure

Save the following file as **config.js**

	module.exports = {
	    "db": "test", // the name of the MongoDB database
	    "collection": "data", // the name of the MongoDB Collection
	    "documentation": "./docs.yml", // the file where the API is declared
	    "api": {
	        "hostname": "localhost",
	        "port": 9987
	    },
	    "cors": {
	        "activate": false, // activate Cross-origin resource sharing
	        "hostname": "example.com"   
	    }
	};

and then document your API entrypoints in your **docs.yml** (or somewhere else, if you defined another location in your **config.js**)

	resourcePath: /api/v1
	description: Test API Entrypoint
	apis:

	- path: /
	  operations:

	  - httpMethod: GET
	    summary: Get all entries
	    notes: All entries will be sent back to the client
	    responseClass: Entries
	    nickname: getAllEntries
	    consumes: 
	        - application/json

	- path: /entry/
	  operations:

	  - httpMethod: GET
	    summary: Get a single entry
	    notes: Return only one entry object
	    responseClass: Entry
	    nickname: getEntry
	    consumes: 
	        - application/json
	    parameters:

	      - name: name
	        description: The name you are searching for
	        paramType: query
	        dataType: string
	        required: true

	  - httpMethod: POST
	    summary: Post a new entry
	    notes: Return the object "message ok" if worked
	    nickname: PostEntry
	    consumes: 
	        - application/json
	    parameters:

	      - name: name
	        description: The name of the new entry
	        paramType: query
	        dataType: string

	models:
	  Entry:
	    id: _id
	    properties:
	      name:
	        type: String

Please refer to the [Swagger-core API Declaration specification](https://github.com/wordnik/swagger-core/wiki) editing your **docs.yml**

## 3. Run!
If you didn't it before, add the folder **./node_modules/.bin** to your **PATH**, so you will be able to access the commands provided by the installed node.js modules.

	export PATH="$PATH:./node_modules/.bin"

and finally run the server using

	apibox-serve

Open your browser at [http://localhost:9987/docs](http://localhost:9987/docs) (or the domain/port you have choosen) to see it working.

If you want to use the CLI, you can run for example:

	apibox-cli
