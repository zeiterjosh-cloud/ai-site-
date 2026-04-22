const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// ROOT
app.get("/", (req, res) => {
  res.send("Backend is live 🚀")
})

// TEST ROUTE (THIS MUST EXIST)
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "TEST WORKS 🚀"
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})