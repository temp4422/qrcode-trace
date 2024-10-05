const http = require('http')

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and content type
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')

  // Send the response body "Hello, World!"
  res.end('Hello, World!\n')
})

// Set the port and hostname
const hostname = '127.0.0.1'
const port = 80

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
