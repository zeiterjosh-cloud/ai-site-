require("dotenv").config()

const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const os = require("os")
const archiver = require("archiver")
const OpenAI = require("openai")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// ---------------- OPENAI ----------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

// ---------------- AI UNITY GENERATOR (TEMPLATES) ----------------
app.post("/generate-unity", async (req, res) => {
  const { prompt, template } = req.body

  try {
    let systemPrompt = ""

    if (template === "fps") {
      systemPrompt = `
You are a Unity FPS game developer.
Return ONLY JSON:
{
  "files": [
    { "name": "PlayerController.cs", "content": "C# code" },
    { "name": "Gun.cs", "content": "C# code" },
    { "name": "EnemyAI.cs", "content": "C# code" }
  ]
}
`
    }

    if (template === "runner") {
      systemPrompt = `
You are a Unity endless runner developer.
Return ONLY JSON:
{
  "files": [
    { "name": "PlayerController.cs", "content": "C# code" },
    { "name": "GameManager.cs", "content": "C# code" }
  ]
}
`
    }

    if (template === "rpg") {
      systemPrompt = `
You are a Unity RPG developer.
Return ONLY JSON:
{
  "files": [
    { "name": "Player.cs", "content": "C# code" },
    { "name": "Combat.cs", "content": "C# code" }
  ]
}
`
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt || "Generate Unity game code in JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const text = response.choices[0].message.content
    const json = JSON.parse(text)

    res.json({
      project: template || "custom",
      files: json.files
    })

  } catch (err) {
    console.error("AI ERROR:", err)
    res.status(500).json({ error: "AI generation failed" })
  }
})

// ---------------- ZIP DOWNLOAD ----------------
app.post("/download-unity-zip", (req, res) => {
  const { prompt } = req.body

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "unity-"))
  const assetsDir = path.join(tempDir, "Assets")

  fs.mkdirSync(assetsDir, { recursive: true })

  const player = `
using UnityEngine;

public class PlayerController : MonoBehaviour {
    void Update() {
        Debug.Log("AI: ${prompt}");
    }
}
`

  const manager = `
using UnityEngine;

public class GameManager : MonoBehaviour {
    void Start() {
        Debug.Log("Game started");
    }
}
`

  fs.writeFileSync(path.join(assetsDir, "PlayerController.cs"), player)
  fs.writeFileSync(path.join(assetsDir, "GameManager.cs"), manager)

  const zipPath = path.join(tempDir, "game.zip")
  const output = fs.createWriteStream(zipPath)
  const archive = archiver("zip", { zlib: { level: 9 } })

  output.on("close", () => {
    res.download(zipPath, "unity-game.zip", () => {
      fs.rmSync(tempDir, { recursive: true, force: true })
    })
  })

  archive.on("error", (err) => {
    console.error(err)
    res.status(500).send("ZIP error")
  })

  archive.pipe(output)
  archive.directory(tempDir, false)
  archive.finalize()
})

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})