const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const archiver = require("archiver")
const os = require("os")

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

// ---------------- ZIP DOWNLOAD (FULL WORKING) ----------------
app.post("/download-unity-zip", (req, res) => {
  const { prompt } = req.body

  // unique temp folder (important for Render)
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "unity-"))
  const assetsDir = path.join(tempDir, "Assets")

  fs.mkdirSync(assetsDir, { recursive: true })

  // Unity files
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

  const zipPath = path.join(tempDir, "unity-project.zip")
  const output = fs.createWriteStream(zipPath)
  const archive = archiver("zip", { zlib: { level: 9 } })

  output.on("close", () => {
    res.download(zipPath, "unity-project.zip", () => {
      fs.rmSync(tempDir, { recursive: true, force: true })
    })
  })

  archive.on("error", (err) => {
    console.error(err)
    res.status(500).send("ZIP creation failed")
  })

  archive.pipe(output)
  archive.directory(tempDir, false)
  archive.finalize()
})

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})