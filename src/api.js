import * as fs from 'node:fs'
import { Console } from 'console'

// const host = 'https://qrcode-trace.duckdns.org'
const host = 'http://localhost:3000'

// Log to file
const filePath = './logs.txt'
if (!fs.existsSync(filePath)) {
  fs.writeFile(filePath, new Date().toString(), (err) => err)
}
const fconsole = new Console({ stdout: fs.createWriteStream(filePath, { flags: 'a' }) })

const map = new Map()

function generateUrl(targetUrl) {
  const timestampId = Number(new Date().getTime())
  map.set(timestampId, targetUrl.toString())
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`
  console.log(qrcodeTraceUrl)
  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  let redirectUrl = map.get(Number(targetTimestamp))
  if (!redirectUrl.includes('http')) redirectUrl = 'http://' + redirectUrl
  const tracePage = fs.readFileSync('./src/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}

async function downloadQrcode(targetUrl) {
  console.log('OK')
  await fetch(
    `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${host}/trace?url=${targetUrl}`
  )

  // const response = await fetch(
  //   `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${host}/trace?url=${targetUrl}`
  // )
  // const data = await response.json()
  // https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=http://localhost:3000/trace?url=1728555897046
}

export { fconsole, generateUrl, traceUrl, downloadQrcode }
