// Connect to database with mongodb driver
import { MongoClient } from 'mongodb'
const mongoDbClient = new MongoClient(process.env.MONGODB_URI)
mongoDbClient
  .connect()
  .then(mongoDbClient.db('admin').command({ ping: 1 }))
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error(err))

// Create node http server
import http from 'node:http'
const server = http.createServer()

// Route requests & responses
import { apiRouter } from './controllers/apiRouter.js'
apiRouter(server)

// Run server with default
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = process.env.PORT || 3000
// proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

export { mongoDbClient }
