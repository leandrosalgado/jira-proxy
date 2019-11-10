/**
 * Module dependencies.
 */
var express = require('express');
var proxy = require('http-proxy-middleware')

/**
 * Configure proxy middleware
 */
const jira_instance = process.env.JIRA_INSTANCE;
var jsonPlaceholderProxy = proxy({
  target: jira_instance,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader("Accept", "application/json");
    proxyReq.setHeader("X-Atlassian-Token", "no-check");
    proxyReq.setHeader("cookie", "");
    proxyReq.setHeader("User-Agent", "");
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    proxyRes.headers['Access-Control-Max-Age'] = '600';
  }
  
});

var app = express();

/**
 * Add the proxy to express
 */
app.use('/', jsonPlaceholderProxy);

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Server: listening on port ${port}`);