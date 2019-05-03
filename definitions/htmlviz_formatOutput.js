const YAML = require('yamljs');
const fs = require('fs');

Controller.prototype.result = function(stat, d) {
	return returnResp(this, (stat||200), d);
}

Controller.prototype.resultCallback = function() {
	let self = this;
	return (stat, d) => returnResp(self, (stat||200), d);
}

F.middleware('formatOutput', function($) {
	$.next();
});

function returnResp (self, s, d){
	let t = process.hrtime();
	
	let rootPath = '/api/v1/';

	// Set status of response
	if (s){
		self.status = s;
	}

	// Very naive accept parser, but fast
	if (self.req.headers.accept === 'application/json'){
		if (s > 300 || s < 200)
			self.res.send(s, d);
		self.json(d);
		return;
	}

	// Check error
	if (s > 300 || s < 200){
		let model = {
			status: s, 
			url: self.req.uri.pathname,
			method: self.req.method,
			root: rootPath,
			data: d,
			views: ['table']
		};
		return self.view('error', model);	
	}
	
	
	// Check format of output
	let accept = 'text/yaml';
	if (self.query.format){
		accept = self.query.format;
	}

	let rdata = '';
	let links = [];

	if (d){
		links = d.links ? d.links : [];
		if (accept === 'text/yaml'){
			rdata = "---\n"+YAML.stringify(d, null, 4);
		}else if (accept === 'application/json'){
			rdata = JSON.stringify(d, null, 4);
		}
	}

	// Find adequate htmlviz
	let h = {};
	let v;
	
	// Check exitsence of the view
	if (d){
		Object.keys(d).map((v) => {
			if (fs.existsSync(F.path.views('htmlviz_'+v+'.html'))) {
				h[v] = v;
			}
		});
	}

	let td = process.hrtime(t);
	let model = {
		url: self.req.uri.pathname,
		method: self.req.method,
		root: rootPath,
		query: self.req.uri.query,
		links: links,
		data: rdata,
		rawdata: d,
		duration: (td[0]*1000+td[1]/1000000).toFixed(2)+'ms',
		htmlviz: h
	};

	self.layout('htmlviz_layout');
	self.view('htmlviz_base', model);
}
