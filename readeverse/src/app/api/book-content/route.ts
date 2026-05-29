export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const url = searchParams.get('url')

    console.log('URL:', url)

    if (!url) {
      return Response.json({
        error: 'Missing URL',
      })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
    })

    console.log('STATUS:', response.status)

    const text = await response.text()

    console.log('TEXT SAMPLE:', text.slice(0, 200))

    return Response.json({
      content: text,
    })
  } catch (error) {
    console.error('API ERROR:', error)

    return Response.json({
      error: 'Failed',
    })
  }
}