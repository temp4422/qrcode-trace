import * as http from 'node:http'
import * as fs from 'node:fs'
import * as url from 'node:url'
import { Console } from 'console'

// Log to file
const filePath = './logs.txt'
if (!fs.existsSync(filePath)) {
  fs.writeFile(filePath, new Date().toString(), (err) => err)
}
const fconsole = new Console({ stdout: fs.createWriteStream(filePath, { flags: 'a' }) })

// Run server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url)

  switch (reqUrl.pathname) {
    case '/':
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      fs.readFile('./src/index.html', (err, data) => res.end(data))
      break
    case '/trace':
      res.statusCode = 200
      handleUrl()
      break
    default:
      res.statusCode = 404
      res.write('Not found')
      res.end()
  }

  // Trace api
  function handleUrl() {
    //   let userData = `
    // {
    //   "request TIME": "${new Date().toISOString()}",
    //   "request IP": "${req.socket.remoteAddress}",
    //   "request HEADERS": ${JSON.stringify(req.headers)}
    //   },`
    //   fconsole.log(userData)

    res.setHeader('Content-Type', 'text/html')
    fs.readFile('./src/trace.html', (err, data) => res.end(data))
  }
})

// Default
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
