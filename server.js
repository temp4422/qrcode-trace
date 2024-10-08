import http from 'node:http'
import fs from 'node:fs'
import url from 'node:url'
import { generateUrl, traceUrl, getQrcode } from './src/api.js'

// Run server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url)
  let targetUrl
  if (reqUrl.query) {
    targetUrl = reqUrl.query.slice(4) // remove 'url='
  }

  switch (reqUrl.pathname) {
    case '/':
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      fs.readFile('./src/index.html', (err, data) => res.end(data))
      break
    case '/generate':
      res.statusCode = 200
      res.end(generateUrl(targetUrl))
      break
    case '/trace':
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(traceUrl(targetUrl))
      break
    case '/get':
      res.statusCode = 200
      res.setHeader('Content-Type', 'image/png')
      fs.readFile('./dist/qrcode.png', (err, data) => res.end(data))
      break
    default:
      res.statusCode = 404
      res.end('Not found')
  }
})

// Default
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
