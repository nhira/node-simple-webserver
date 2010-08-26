var sys = require("sys"),
	http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname;

	var filename = path.join(process.cwd() + "/work", uri);
	filename = filename.replace(/%20/g, " ");
	sys.log('[' + request.connection.remoteAddress + '][' + request.url + '] mapped to [' + filename + ']');
	path.exists(filename, function(exists) {
		if (!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			sys.log(filename + ' could not be found');
			return;
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.sendHeader(500, {"Content-Type": "text/plain"}, err);
				response.end();
				sys.log(err);
				return;
			}

			response.sendHeader(200);
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(8080);

sys.puts("Server running at http://localhost:8080/");
