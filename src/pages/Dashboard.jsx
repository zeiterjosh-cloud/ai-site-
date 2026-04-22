import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Card from "../components/Card"

export default function Dashboard() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateUnity = async () => {
    if (!prompt) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("http://localhost:5000/generate-unity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json()
      setResult(data.result)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div style={styles.app}>
      <Sidebar />

      <div style={styles.main}>
        <h1>AI Unity Game Builder</h1>

        <div style={styles.generator}>
          <input
            placeholder="Describe your game..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.input}
          />

          <button onClick={generateUnity} style={styles.button}>
            Generate
          </button>
        </div>

        {loading && <p>Generating...</p>}

        {result && (
          <div style={styles.result}>
            <h2>{result.projectName}</h2>

            <h3>Folder Structure</h3>
            <pre>{result.folderStructure}</pre>

            <h3>Instructions</h3>
            <ul>
              {result.instructions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>Scripts</h3>
            {Object.entries(result.scripts).map(([name, code]) => (
              <div key={name}>
                <h4>{name}.cs</h4>
                <pre>{code}</pre>
              </div>
            ))}
          </div>
        )}

        <div style={styles.grid}>
          <Card title="Create Project" desc="Build apps instantly" />
          <Card title="AI Tools" desc="Generate ideas & code" />
          <Card title="Unity Mode" desc="Game builder system" />
        </div>
      </div>
    </div>
  )
}

const styles = {
  app: { display: "flex", height: "100vh", background: "#0d0d0d", color: "white" },
  main: { flex: 1, padding: "30px" },
  generator: { marginBottom: "20px" },
  input: { padding: "10px", width: "250px" },
  button: { padding: "10px", marginLeft: "10px" },
  result: { background: "#111", padding: "20px", marginTop: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }
}