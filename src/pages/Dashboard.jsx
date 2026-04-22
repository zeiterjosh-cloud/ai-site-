import { useState } from "react"

const API_URL = "https://ai-site-atz0.onrender.com"

export default function Dashboard() {
  const [userInput, setUserInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // ---------------- GENERATE UNITY FILES ----------------
  const handleGenerate = async () => {
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/generate-unity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: userInput
        })
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: "Generation failed" })
    }

    setLoading(false)
  }

  // ---------------- DOWNLOAD ZIP ----------------
  const downloadZip = async () => {
    try {
      const res = await fetch(`${API_URL}/download-unity-zip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: userInput
        })
      })

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "unity-project.zip"
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("ZIP download failed:", err)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Unity AI Generator 🚀</h1>

      <textarea
        rows={5}
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Describe your game..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={handleGenerate}>
          {loading ? "Generating..." : "Generate Unity Code"}
        </button>

        <button onClick={downloadZip} style={{ marginLeft: 10 }}>
          Download ZIP 📦
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>

          {result.files &&
            result.files.map((file, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <h3>{file.name}</h3>
                <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
                  {file.content}
                </pre>
              </div>
            ))}

          {result.error && <p style={{ color: "red" }}>{result.error}</p>}
        </div>
      )}
    </div>
  )
}