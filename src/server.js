import http, { request } from 'node:http'

import { MongoClient } from 'mongodb'
import { routes } from './routes/routes.js'

// Connect to database with mongodb driver
const mongoDbClient = new MongoClient(process.env.MONGODB_URI)
async function connectToDatabase() {
  try {
    await mongoDbClient.connect()
    // Send a ping to confirm a successful connection
    await mongoDbClient.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
    return mongoDbClient
  } catch (error) {
    console.log(error)
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoDbClient.close()
  }
}
// connectToDatabase()

// Run server
const server = http.createServer()

// Route requests & responses
routes(server)

// Default
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080 // proxy to nginx 80 and 443 with certbot tls
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

export { mongoDbClient, server }
