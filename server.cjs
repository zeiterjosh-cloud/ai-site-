const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// -------------------- ROOT --------------------
app.get("/", (req, res) => {
  res.send("Backend is live 🚀")
})

// -------------------- TEST --------------------
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "TEST WORKS 🚀" })
})

// -------------------- AI GENERATOR --------------------
app.post("/generate", (req, res) => {
  const { prompt } = req.body

  res.json({
    result: `AI Idea for: ${prompt}`
  })
})

// -------------------- UNITY GENERATOR --------------------
app.post("/generate-unity", (req, res) => {
  const { prompt } = req.body

  res.json({
    project: "Unity Game",
    files: [
      {
        name: "PlayerController.cs",
        content: `using UnityEngine;

public class PlayerController : MonoBehaviour {
    void Update() {
        Debug.Log("AI: ${prompt}");
    }
}`
      }
    ]
  })
})

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// -------------------- ROOT --------------------
app.get("/", (req, res) => {
  res.send("Backend is live 🚀")
})

// -------------------- TEST --------------------
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "TEST WORKS 🚀" })
})

// -------------------- AI GENERATOR --------------------
app.post("/generate", (req, res) => {
  const { prompt } = req.body

  res.json({
    result: `AI Idea for: ${prompt}`
  })
})

// -------------------- UNITY GENERATOR --------------------
app.post("/generate-unity", (req, res) => {
  const { prompt } = req.body

  res.json({
    project: "Unity Game",
    files: [
      {
        name: "PlayerController.cs",
        content: `using UnityEngine;

public class PlayerController : MonoBehaviour {
    void Update() {
        Debug.Log("AI: ${prompt}");
    }
}`
      }
    ]
  })
})

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})