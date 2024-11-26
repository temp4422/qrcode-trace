import 'dotenv/config'
import fs from 'node:fs'
import url from 'node:url'
import QRCode from 'qrcode'
import { mongoDbClient } from '../server.js'

const host = process.env.HOST || 'http://localhost:3000'

// Use HashMap if mongodb not available
// const map = new Map()

function generateUrl(req) {
  const targetUrl = url.parse(req.url).query.slice(4)
  const timestampId = Number(new Date().getTime())

  insertInMongodb(timestampId, targetUrl, req)
  // map.set(timestampId, targetUrl) // Use HashMap if mongodb not available

  QRCode.toFile('./dist/qrcode.png', `${host}/trace?url=${timestampId}`)
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`
  return qrcodeTraceUrl
}
// Insert data into database
async function insertInMongodb(timestampId, targetUrl, req) {
  const data = {
    createdOn: new Date(),
    timestampId: timestampId,
    targetUrl: targetUrl,
    userData: { requestIP: req.socket.remoteAddress, requestHeaders: req.headers },
  }

  await mongoDbClient.connect()

  const insertedObj = await mongoDbClient
    .db('qrcode-trace-db')
    .collection('data-collection')
    .insertOne(data)
  // console.log(insertedObj)
}

async function traceUrl(targetTimestamp) {
  let redirectUrl = await readFromMongodb(targetTimestamp)
  // let redirectUrl = map.get(Number(targetTimestamp))

  if (!redirectUrl) {
    return fs.readFileSync('./src/views/not-found.html', 'utf-8')
  }

  const tracePage = fs.readFileSync('./src/views/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}
// Read data from database
async function readFromMongodb(targetTimestamp) {
  await mongoDbClient.connect()

  const data = await mongoDbClient
    .db('qrcode-trace-db')
    .collection('data-collection')
    .findOne({ timestampId: Number(targetTimestamp) })

  const readObj = JSON.stringify(data, null, 2) // pretty print
  // console.log(readObj)
  return data ? data.targetUrl : null
}

export { generateUrl, traceUrl }
