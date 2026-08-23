function ErrorMessage({ message }) {
  return (
    <div className="error-card">
      <h2 className="error-title">Error!</h2>
      <p className="error-text">{message}</p>
    </div>
  );
}

export default ErrorMessage;