import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyMessage, setHistoryMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLoginMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setLoginMessage("");
      setError("");

      const response = await fetch("https://message-risk-analyzer-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setToken(data.token);
      setLoginMessage("Login successful. You can now save and view analysis history.");
    } catch (err) {
      setLoginMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter a message to analyze.");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setHistoryMessage("");

      const response = await fetch("https://message-risk-analyzer-backend.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong while analyzing.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!token) {
      setHistoryMessage("Please login to save analysis history.");
      return;
    }

    if (!result) {
      setHistoryMessage("Analyze a message before saving.");
      return;
    }

    try {
      setLoading(true);
      setHistoryMessage("");

      const response = await fetch("https://message-risk-analyzer-backend.onrender.com/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          score: result.score,
          risk: result.risk,
          matchedKeywords: result.matchedKeywords,
          explanation: result.explanation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error saving analysis.");
      }

      setHistoryMessage("Analysis saved successfully.");
    } catch (err) {
      setHistoryMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async () => {
    if (!token) {
      setHistoryMessage("Please login to view history.");
      return;
    }

    try {
      setLoading(true);
      setHistoryMessage("");

      const response = await fetch("https://message-risk-analyzer-backend.onrender.com/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error fetching history.");
      }

      setHistory(data.history || []);
      setHistoryMessage(`Fetched ${data.count} saved analysis record(s).`);
    } catch (err) {
      setHistoryMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
    setHistoryMessage("");
  };

  const getRiskClass = (risk) => {
    if (!risk) return "";

    const level = risk.toLowerCase();

    if (level.includes("high")) return "high-risk";
    if (level.includes("medium")) return "medium-risk";
    if (level.includes("low")) return "low-risk";

    return "safe-risk";
  };

  return (
    <main className="app">
      <section className="hero-section">
        <p className="eyebrow">Message Risk Analyzer</p>

        <h1>Analyze text for risk, toxicity, and unsafe language</h1>

        <p className="subtitle">
          A rule-based text intelligence system with public analysis and JWT-protected
          saved history for logged-in users.
        </p>
      </section>

      <section className="analyzer-card">
        <h2 className="section-title">Login to Save History</h2>

        <div className="form-grid">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter registered email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>

        <div className="actions">
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>

        {loginMessage && (
          <p className={token ? "success-message" : "error-message"}>
            {loginMessage}
          </p>
        )}
      </section>

      <section className="analyzer-card">
        <label htmlFor="message">Message to analyze</label>

        <textarea
          id="message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Example: I hate you idiot..."
          rows="7"
        />

        <div className="actions">
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Message"}
          </button>

          <button className="secondary-btn" onClick={handleClear}>
            Clear
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </section>

      {result && (
        <section className="result-card">
          <div className="result-header">
            <div>
              <p className="result-label">Analysis Result</p>
              <h2 className={getRiskClass(result.risk)}>{result.risk}</h2>
            </div>

            <div className="score-box">
              <span>Score</span>
              <strong>{result.score}</strong>
            </div>
          </div>

          <div className="result-grid">
            <div className="info-box">
              <h3>Classification</h3>
              <p>{result.risk}</p>
            </div>

            <div className="info-box">
              <h3>Risk Score</h3>
              <p>{result.score}</p>
            </div>
          </div>

          {result.matchedKeywords?.length > 0 && (
            <div className="keywords-section">
              <h3>Matched Keywords</h3>

              <div className="keyword-list">
                {result.matchedKeywords.map((keyword, index) => (
                  <span key={index}>{keyword}</span>
                ))}
              </div>
            </div>
          )}

          {result.explanation && (
            <div className="explanation-box">
              <h3>Explanation</h3>
              <p>{result.explanation}</p>
            </div>
          )}

          <div className="actions result-actions">
            <button onClick={handleSaveAnalysis} disabled={loading}>
              Save Analysis
            </button>

            <button className="secondary-btn" onClick={handleViewHistory} disabled={loading}>
              View History
            </button>
          </div>

          {historyMessage && (
            <p className={historyMessage.includes("success") || historyMessage.includes("Fetched") ? "success-message" : "error-message"}>
              {historyMessage}
            </p>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="result-card">
          <div className="result-header">
            <div>
              <p className="result-label">Saved History</p>
              <h2>Previous Analyses</h2>
            </div>

            <div className="score-box">
              <span>Total</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item._id}>
                <div className="history-top">
                  <strong className={getRiskClass(item.risk)}>{item.risk}</strong>
                  <span>Score: {item.score}</span>
                </div>

                <p className="history-message">{item.message}</p>

                {item.matchedKeywords?.length > 0 && (
                  <div className="keyword-list">
                    {item.matchedKeywords.map((keyword, index) => (
                      <span key={index}>{keyword}</span>
                    ))}
                  </div>
                )}

                <p className="history-explanation">{item.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;