require("dotenv").config()

const express = require("express")
const cors = require("cors")
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

// ---------------- UNITY GENERATOR ----------------
app.post("/generate-unity", async (req, res) => {
  const { prompt, template } = req.body

  try {
    let systemPrompt = ""

    if (template === "fps") {
      systemPrompt = `
You are a Unity FPS developer.
Return ONLY JSON:
{
  "files": [
    { "name": "PlayerController.cs", "content": "C# code" },
    { "name": "Gun.cs", "content": "C# code" }
  ]
}
`
    } else if (template === "runner") {
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
    } else if (template === "rpg") {
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
    } else {
      systemPrompt = `
Return Unity game scripts in JSON format only:
{
  "files": [
    { "name": "Game.cs", "content": "C# code" }
  ]
}
`
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt || "make a game" }
      ]
    })

    const text = response.choices[0].message.content
    const json = JSON.parse(text)

    res.json({
      project: template || "custom",
      files: json.files
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "AI generation failed"
    })
  }
})

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})