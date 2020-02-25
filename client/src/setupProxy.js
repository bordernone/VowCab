const proxy = require("http-proxy-middleware");
const config = require("../../config")

module.exports = function(app) {
    app.use(proxy('/api', { target: `http://localhost:${config.backend_port}/`}));
};

