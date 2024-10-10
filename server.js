import * as http from 'node:http'
import * as fs from 'node:fs'
import * as url from 'node:url'
import { generateUrl, traceUrl } from './src/api.js'

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
      res.write(generateUrl(targetUrl))
      res.end()
      break
    case '/trace':
      const { redirectUrl, tracePageWithRedirect } = traceUrl(targetUrl)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.write(redirectUrl)
      res.write(tracePageWithRedirect)
      res.end()
      break
    default:
      res.statusCode = 404
      res.write('Not found')
      res.end()
  }
})

// Default
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
