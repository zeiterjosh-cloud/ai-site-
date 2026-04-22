export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>AI Site</h2>

      <p>Dashboard</p>
      <p>Projects</p>
      <p>AI Tools</p>
      <p>Billing</p>
    </div>
  )
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#111",
    color: "white",
    padding: "20px"
  }
}