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