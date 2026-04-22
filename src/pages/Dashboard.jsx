import { useState } from "react"

const API_URL = "https://ai-site-atz0.onrender.com"

export default function Dashboard() {
  const [userInput, setUserInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!userInput.trim()) return

    setLoading(true)
    setResult(null)

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

      // 🚨 check backend errors properly
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      console.log("Backend response:", data)

      setResult(data)
    } catch (err) {
      console.error("Error calling backend:", err)
      setResult({
        error: "Backend connection failed. Check Render URL or route."
      })
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Unity AI Generator 🚀</h1>

      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Describe your game..."
        rows={6}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px"
        }}
      />

      <button
        onClick={handleGenerate}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        {loading ? "Generating..." : "Generate Unity Project"}
      </button>

      {/* RESULT SECTION */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result:</h2>

          {result.error && (
            <p style={{ color: "red" }}>{result.error}</p>
          )}

          {result.files?.map((file, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h3>{file.name}</h3>
              <pre
                style={{
                  background: "#111",
                  color: "#0f0",
                  padding: "10px",
                  overflowX: "auto"
                }}
              >
                {file.content}
              </pre>
            </div>
          ))}

          {!result.files && !result.error && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  )
}