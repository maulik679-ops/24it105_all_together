import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch("https://api.github.com/users/maulik679-ops/repos?sort=updated")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        return res.json();
      })
      .then((data) => {
        setRepos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <ErrorMessage message={error} />
        <button onClick={fetchRepos} className="btn-retry">Retry</button>
      </div>
    );
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="projects-container">
      <h2>GitHub Repositories</h2>
      <input
        type="text"
        className="search-box"
        placeholder="Search repository..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="repo-list">
        {filteredRepos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <h3>{repo.name}</h3>
            <p>{repo.description || "No description provided."}</p>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
