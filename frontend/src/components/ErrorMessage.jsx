function ErrorMessage({ message }) {
  return (
    <div className="error-banner">
      <h2>Error!</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;