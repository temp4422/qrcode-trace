import * as http from 'node:http'
import * as fs from 'node:fs'
import { Console } from 'console'

// Log to file
const filePath = './logs.txt'
if (!fs.existsSync(filePath)) {
  fs.writeFile(filePath, new Date().toString(), (err) => err)
}
const fconsole = new Console({ stdout: fs.createWriteStream(filePath, { flags: 'a' }) })

// Run server
const server = http.createServer((req, res) => {
  // Log request
  let userData = `
${req.socket.remoteAddress}
/* === USER HEADERS === */
${JSON.stringify(req.headers)}`
  fconsole.log(userData)

  // Response headers
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  fs.readFile('./index.html', (err, data) => {
    if (err) res.end()
    res.end(data)
  })
})

// Default
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
