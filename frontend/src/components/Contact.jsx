import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bento-card contact-card">
      <h2 className="section-title">Contact Me</h2>

      <input
        type="text"
        className="form-input"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <p className="preview-box">Message: {message}</p>

      <p className="char-count-chip">Character Count: {message.length}</p>

      <button onClick={() => setShowHelp(!showHelp)} className="btn btn-secondary help-toggle-btn">
        Toggle Help
      </button>

      {showHelp && <p className="help-box">Type your message above.</p>}
    </div>
  );
}

export default Contact;