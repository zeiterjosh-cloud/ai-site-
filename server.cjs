const express = require("express")
const cors = require("cors")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Test route (checks if backend is alive)
app.get("/", (req, res) => {
  res.send("Backend is live 🚀")
})

// AI / generator route (placeholder for now)
app.post("/generate", (req, res) => {
  const { prompt } = req.body

  res.json({
    result: `Generated output for: ${prompt}`
  })
})

// Port setup (IMPORTANT for Render)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})