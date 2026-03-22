export default async function handler(req, res) {
  try {
    // 1. Método permitido
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // 2. Obtener query
    const { q = 'fantasy', maxResults = 10 } = req.query

    // 3. Validación simple
    if (!q) {
      return res.status(400).json({ error: 'Query "q" is required' })
    }

    // 4. Llamada a Google Books
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q,
    )}&maxResults=${maxResults}&key=${process.env.GOOGLE_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Error fetching from Google Books',
      })
    }

    const data = await response.json()

    // 5. (Opcional 🔥) Limpiar datos para frontend
    const books =
      data.items?.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        description: item.volumeInfo.description || '',
      })) || []

    // 6. Respuesta
    res.status(200).json({
      total: data.totalItems,
      books,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Internal server error',
    })
  }
}
