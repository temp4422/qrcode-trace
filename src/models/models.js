import fs from 'node:fs'
import QRCode from 'qrcode'
import { mongoDbClient } from '../server.js'

// const host = 'https://qrcode-trace.duckdns.org'
const host = 'http://localhost:3000'

// Use HashMap if not using mongodb
const map = new Map()

// Insert data into database
async function insertInMongodb(timestampId, qrcodeTraceUrl, targetUrl, requestIP, requestHeaders) {
  await mongoDbClient.connect()
  await mongoDbClient.db('admin').command({ ping: 1 })
  console.log('Pinged your deployment. You successfully connected to MongoDB!')

  // const qrcodeTraceCollection = client.db('qrcode-trace-db').collection('data-collection')
  // const result = await qrcodeTraceCollection.insertOne({
  //   createdOn: new Date(),
  //   timestampId: timestampId,
  //   targetUrl: targetUrl,
  //   qrcodeTraceUrl: qrcodeTraceUrl,
  //   userData: { requestIP: requestIP, requestHeaders: requestHeaders },
  // })
  // console.log(result)
}

function generateUrl(targetUrl, requestIP, requestHeaders) {
  const timestampId = Number(new Date().getTime())
  map.set(timestampId, targetUrl.toString())
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`

  QRCode.toFile('./dist/qrcode.png', `${host}/trace?url=${timestampId}`)

  insertInMongodb(timestampId, qrcodeTraceUrl, targetUrl, requestIP, requestHeaders)

  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  let redirectUrl = map.get(Number(targetTimestamp))
  if (!redirectUrl.includes('http')) redirectUrl = 'http://' + redirectUrl
  const tracePage = fs.readFileSync('./src/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}

function getQrcode() {}

export { generateUrl, traceUrl, getQrcode }
