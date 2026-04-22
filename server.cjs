const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Backend is live 🚀")
})

// ---------------- TEST ----------------
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "TEST WORKS 🚀"
  })
})

// ---------------- BASIC AI ----------------
app.post("/generate", (req, res) => {
  const { prompt } = req.body

  res.json({
    result: `AI Idea for: ${prompt}`
  })
})

// ---------------- UNITY GENERATOR ----------------
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
        Debug.Log("AI Prompt: ${prompt}");
    }
}`
      },
      {
        name: "GameManager.cs",
        content: `using UnityEngine;

public class GameManager : MonoBehaviour {
    void Start() {
        Debug.Log("Game started from AI generator");
    }
}`
      }
    ]
  })
})

// ---------------- ZIP DOWNLOAD (OPTIONAL NEXT STEP) ----------------
app.post("/download-unity-zip", (req, res) => {
  const { prompt } = req.body

  const tempDir = path.join(__dirname, "tempProject")
  const assetsDir = path.join(tempDir, "Assets")

  fs.mkdirSync(assetsDir, { recursive: true })

  const playerScript = `
using UnityEngine;

public class PlayerController : MonoBehaviour {
    void Update() {
        Debug.Log("AI Generated: ${prompt}");
    }
}
`

  const gameManager = `
using UnityEngine;

public class GameManager : MonoBehaviour {
    void Start() {
        Debug.Log("Game started from AI generator");
    }
}
`

  fs.writeFileSync(path.join(assetsDir, "PlayerController.cs"), playerScript)
  fs.writeFileSync(path.join(assetsDir, "GameManager.cs"), gameManager)

  const zipPath = path.join(__dirname, "unity-project.zip")
  const output = fs.createWriteStream(zipPath)
  const archive = archiver("zip")

  output.on("close", () => {
    res.download(zipPath)
  })

  archive.pipe(output)
  archive.directory(tempDir, false)
  archive.finalize()
})

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})