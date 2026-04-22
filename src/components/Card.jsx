export default function Card({ title, desc }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

const styles = {
  card: {
    background: "#1a1a1a",
    color: "white",
    padding: "20px",
    borderRadius: "12px"
  }
}