import * as http from 'node:http'
import * as fs from 'node:fs'

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  fs.readFile('./index.html', (err, data) => {
    if (err) res.end()
    res.end(data)
  })
})

const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
