/**
 * Module dependencies.
 */
const express = require('express');
const proxy = require('http-proxy-middleware')
const helmet = require('helmet')

/**
 * Configure proxy middleware
 */
const jira_instance = process.env.JIRA_INSTANCE;
const jsonPlaceholderProxy = proxy({
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

const app = express();
app.use(helmet());

/**
 * Add the proxy to express
 */
app.use('/rest/api', jsonPlaceholderProxy);


const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Server: listening on port ${port}`);