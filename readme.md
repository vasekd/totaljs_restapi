[![MIT License][license-image]][license-url]

# Total.js RESTAPI visualizer (grey pages)

Create html visualiser for total.js web API. As I call it "grey pages".

![restapi screenshot](https://github.com/vasekd/static/raw/master/totaljs_restapi_bundle_home.png)

## Installation

- `cd <your totaljs project>`
- create bundles directory `mkdir bundles`
- create bundle config `echo https://github.com/vasekd/totaljs_restapi/raw/master/restapi.bundle > ./bundles/restapi.bundle`

## Usage

### Sync response
- create dir: `mdkir controllers`
- create router in controllers/api.js:

```javascript
exports.install = function() {

	// Sets cors for this all API
	CORS('/api/*', ['get'], true);

	// Routes
	ROUTE('/api/test', item_query);
};

function item_query() {
	this.result(200, {
		data: 'test struct'
	});
}
```

### Async response
- create dir: `mdkir controllers`
- save this to the file controllers/api.js:
- make sure you have define *Item model ex:

```javascript
NEWSCHEMA('Item').make(function(schema) {

	schema.define('id', 'UID');
	schema.define('date', 'Date', true);
	schema.define('pay', 'String', true);
	schema.define('present', 'Object', true);

	schema.setGet(function($) {

		var item = NOSQL('item');

		// Reads
		item.one().make(function(builder) {
			builder.where('id', $.options.id);
			builder.callback($.callback, 'error-item-404');
		});

	});

});
```

- create router in controllers/api.js:

```javascript
exports.install = function() {

	// Sets cors for this all API
	CORS('/api/*', ['get'], true);

	// Routes
	ROUTE('/api/test', item_query, ['*Item']);

};

function item_query() {
	var self = this;
	var options = {};

	options.search = self.query.search;

	self.$query(options, self.resultCallback());
}
```

## Start
- start with: `npm run dev`
- go to: `http://localhost:8080/` ( example api: `http://localhost:8080/api/test/` )

## License

The source-code is under __MIT license__.

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt