import * as http from 'node:http'
import * as fs from 'node:fs'

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  fs.readFile('./index.html', (err, data) => {
    if (err) res.end()
    res.end(data)
  })
})

// Set the port and hostname
const hostname = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 80
// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
