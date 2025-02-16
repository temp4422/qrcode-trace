import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateUrl, traceUrl } from '../models/models.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Using server.on() as addEventListener() https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// https://stackoverflow.com/questions/8187507/is-the-on-method-in-this-node-js-code-a-javascript-method-or-a-node-method
const apiRouter = (server) => {
  server.on('request', async (req, res) => {
    const reqUrl = url.parse(req.url)

    switch (reqUrl.pathname) {
      case '/':
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => res.end(data))
        break
      case '/generate':
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        const qrcodeTraceUrl = generateUrl(req)
        res.end(qrcodeTraceUrl)
        break
      case '/trace':
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        const traceUrlQuery = reqUrl.query.slice(4)
        const traceUrlPage = await traceUrl(traceUrlQuery)
        res.end(traceUrlPage)
        break
      case '/get':
        res.statusCode = 200
        res.setHeader('Content-Type', 'image/png')
        fs.readFile('./generated/qrcode.png', (err, data) => res.end(data))
        break
      default:
        res.statusCode = 404
        fs.readFile(path.join(__dirname, '../views/not-found.html'), (err, data) => res.end(data))
    }
  })
}

export { apiRouter }
