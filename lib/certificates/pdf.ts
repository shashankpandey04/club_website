
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { toReadableDate } from '@/lib/certificates/core'

type CertificatePdfPayload = {
  fullName: string
  eventTitle: string
  eventDate: string
  certificateUid: string
  baseUrl: string
}

const PAGE_WIDTH = 841.89
const PAGE_HEIGHT = 595.28

let cachedBackgroundBytes: Uint8Array | null = null
let backgroundBytesPromise: Promise<Uint8Array> | null = null

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function getCertificateBackgroundBytes(baseUrl: string) {
  if (cachedBackgroundBytes) {
    return cachedBackgroundBytes
  }

  if (backgroundBytesPromise) {
    return backgroundBytesPromise
  }

  backgroundBytesPromise = (async () => {
    const url = new URL('/image/certificate/workshop.png', baseUrl).toString()
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch background image: ${response.status}`)
    }
    const imageBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(imageBuffer)
    cachedBackgroundBytes = bytes
    backgroundBytesPromise = null
    return bytes
  })()

  return backgroundBytesPromise
}

function drawCenteredText(options: {
  page: ReturnType<PDFDocument['getPages']>[number]
  text: string
  x: number
  y: number
  size: number
  font: Awaited<ReturnType<PDFDocument['embedFont']>>
  color?: ReturnType<typeof rgb>
  maxWidth?: number
}) {
  const {
    page,
    text,
    x,
    y,
    size,
    font,
    color = rgb(0.12, 0.19, 0.33),
    maxWidth,
  } = options

  let finalSize = size
  let textWidth = font.widthOfTextAtSize(text, finalSize)

  if (maxWidth && textWidth > maxWidth) {
    finalSize = (finalSize * maxWidth) / textWidth
    textWidth = font.widthOfTextAtSize(text, finalSize)
  }

  page.drawText(text, {
    x: x - textWidth / 2,
    y,
    size: finalSize,
    font,
    color,
  })
}

export async function generateCertificatePdf(payload: CertificatePdfPayload): Promise<Buffer> {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://awslpu.in/verify/${payload.certificateUid}`)}`

  const [backgroundBytes, qrCodeResponse] = await Promise.all([
    getCertificateBackgroundBytes(payload.baseUrl),
    fetch(qrCodeUrl),
  ])

  if (!qrCodeResponse.ok) {
    throw new Error(`Failed to fetch QR code image: ${qrCodeResponse.status}`)
  }

  const qrCodeBuffer = new Uint8Array(await qrCodeResponse.arrayBuffer())

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const [backgroundImage, qrImage, titleFont, bodyFont, monoFont] = await Promise.all([
    pdfDoc.embedPng(backgroundBytes),
    pdfDoc.embedPng(qrCodeBuffer),
    pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    pdfDoc.embedFont(StandardFonts.TimesRoman),
    pdfDoc.embedFont(StandardFonts.Courier),
  ])

  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  })

  const nameText = escapeHtml(payload.fullName).toUpperCase()
  const attendanceText = `For attending "${escapeHtml(payload.eventTitle)}" on ${escapeHtml(toReadableDate(payload.eventDate))}`

  drawCenteredText({
    page,
    text: nameText,
    x: PAGE_WIDTH / 2,
    y: PAGE_HEIGHT * 0.49,
    size: 34,
    font: titleFont,
    color: rgb(0.08, 0.15, 0.31),
    maxWidth: PAGE_WIDTH * 0.7,
  })

  drawCenteredText({
    page,
    text: attendanceText,
    x: PAGE_WIDTH / 2,
    y: PAGE_HEIGHT * 0.38,
    size: 22,
    font: bodyFont,
    color: rgb(0.14, 0.27, 0.48),
    maxWidth: PAGE_WIDTH * 0.78,
  })

  page.drawText(payload.certificateUid, {
    x: 50,
    y: 32,
    size: 10,
    font: monoFont,
    color: rgb(0.17, 0.28, 0.45),
  })

  page.drawImage(qrImage, {
    x: PAGE_WIDTH - 142,
    y: 36,
    width: 100,
    height: 100,
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
