// Connect to database with mongodb driver
import { MongoClient } from 'mongodb'
const mongoDbClient = new MongoClient(process.env.MONGODB_URI)
mongoDbClient
  .connect()
  .then(mongoDbClient.db('admin').command({ ping: 1 }))
  .then(() => console.log('OK, successfully connected to MongoDB!'))
  .catch((err) => console.error(err))

// Run node http server
import http from 'node:http'
const server = http.createServer()

// Route requests & responses
import { apiRouter } from './controllers/apiRouter.js'
apiRouter(server)

// Default listen
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})

export { mongoDbClient }
