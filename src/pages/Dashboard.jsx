import { useState } from "react"

const API = "https://ai-site-atz0.onrender.com"

export default function Dashboard() {
  const [input, setInput] = useState("")
  const [template, setTemplate] = useState("fps")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)

    const res = await fetch(`${API}/generate-unity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
        template: template
      })
    })

    const data = await res.json()
    setResult(data)

    setLoading(false)
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎮 AI Game Builder</h1>

      {/* TEMPLATE SELECTOR */}
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        style={{ padding: 10, marginTop: 10 }}
      >
        <option value="fps">FPS Shooter</option>
        <option value="runner">Endless Runner</option>
        <option value="rpg">RPG Game</option>
      </select>

      <textarea
        rows={4}
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Describe your game..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={generate} style={{ marginTop: 10 }}>
        {loading ? "Generating..." : "Generate Game"}
      </button>

      {/* OUTPUT */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result ({result.project})</h2>

          {result.files?.map((file, i) => (
            <div key={i}>
              <h3>{file.name}</h3>
              <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
                {file.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}