import { useState, useEffect } from "react";
import "./index.css";

const blogFiles = [
  "23-03-2026.json",
  "10-02-2026.json",
  "01-01-2026.json",
];

function parseDate(filename) {
  const parts = filename.replace(".json", "").split("-");
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function formatDate(filename) {
  const date = parseDate(filename);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [isDescending, setIsDescending] = useState(true);
  const [blogs, setBlogs] = useState({});
  const [activeBlogFile, setActiveBlogFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("opendih-theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setTheme(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("opendih-theme", next);
    setTheme(next);
  };

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      const newBlogs = {};
      for (const file of blogFiles) {
        try {
          const res = await fetch(`src/blogs/${file}`);
          if (res.ok) {
            newBlogs[file] = await res.json();
          }
        } catch (e) {
          console.warn("Failed to load blog:", file);
        }
      }
      setBlogs(newBlogs);
      setLoading(false);
    }
    loadBlogs();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeBlog();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSort = () => {
    setIsDescending(!isDescending);
  };

  const openBlog = (file) => {
    setActiveBlogFile(file);
    document.body.style.overflow = "hidden";
  };

  const closeBlog = () => {
    setActiveBlogFile(null);
    document.body.style.overflow = "auto";
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeBlog();
    }
  };

  const sortedFiles = [...blogFiles].sort((a, b) =>
    isDescending
      ? parseDate(b) - parseDate(a)
      : parseDate(a) - parseDate(b)
  );

  const activeBlogData = activeBlogFile ? blogs[activeBlogFile] : null;

  return (
    <>
      <nav>
        <div className="nav-logo serif">OpenDih</div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#research">Research</a>
            <a href="#projects">Projects</a>
            <a href="#blogs">Blogs</a>
          </div>
          <button
            className="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <svg
              className="icon-sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              className="icon-moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="container">
        <header className="hero">
          <h1>Encoding the technical intuition of a thousand developers.</h1>
          <p>
            OpenDih is a research collective building collective-persona
            intelligence models.
          </p>
        </header>

        <main>
          <section id="research">
            <h2>Research Focus</h2>
            <p>
              Standard language models are trained on the broad internet,
              resulting in a sterile, neutralized output. Our research diverges by
              targeting a specific, highly technical demographic: the builders,
              hackers, and architects.
            </p>
            <p>
              By extracting and refining the raw discourse of specific developer
              communities, we map their collective epistemic character. We
              fine-tune base substrates to not only write code, but to solve
              problems with the distinct logic, grit, and intuition of the
              engineers who trained it.
            </p>

            <table>
              <tbody>
                <tr>
                  <td>Data Source</td>
                  <td>Anonymized Discord engineering discourse</td>
                </tr>
                <tr>
                  <td>Pipeline</td>
                  <td>DiscordChatExporter &rarr; Automated heuristic filtering</td>
                </tr>
                <tr>
                  <td>Base Substrate</td>
                  <td>Llama 3.2 (Uncensored)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="projects">
            <h2>Projects</h2>
            <p>Deployments of our synthesized developer intelligence.</p>

            <div className="card-grid">
              <a
                href="https://github.com/OpenDih/ManGPT"
                target="_blank"
                rel="noreferrer"
                className="model-card"
              >
                <span className="card-title">ManGPT <span>&rarr;</span></span>
                <p className="card-desc">
                  Our primary reasoning engine. A high-parameter model distilled
                  from community logic.
                </p>
              </a>
              <a
                href="https://github.com/OpenDih/Manbot"
                target="_blank"
                rel="noreferrer"
                className="model-card"
              >
                <span className="card-title">ManBot <span>&rarr;</span></span>
                <p className="card-desc">
                  The deployment interface. Designed to integrate the collective
                  model back into Discord environments.
                </p>
              </a>
            </div>
          </section>

          <section id="blogs">
            <div className="blog-header-row">
              <h2>Blogs</h2>
              <button className="sort-btn" id="sort-btn" onClick={toggleSort}>
                {isDescending ? "Newest First" : "Oldest First"}
              </button>
            </div>

            <div id="blog-container" className="blog-list">
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                  Loading publications...
                </div>
              ) : Object.keys(blogs).length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  No publications found.
                </div>
              ) : (
                sortedFiles.map((file) => {
                  const data = blogs[file];
                  if (!data) return null;
                  return (
                    <div
                      key={file}
                      className="blog-item"
                      onClick={() => openBlog(file)}
                    >
                      <div className="blog-date">{formatDate(file)}</div>
                      <h3 className="blog-title">{data.title}</h3>
                      <p className="blog-excerpt">{data.excerpt}</p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>

        <footer>
          <span>&copy; 2026 OpenDih Research Collective.</span>
        </footer>
      </div>

      <div
        id="modal-overlay"
        className={activeBlogFile ? "active" : ""}
        onClick={handleOverlayClick}
      >
        <button id="close-modal" onClick={closeBlog}>
          &#10005;
        </button>
        <div id="modal-window" onClick={(e) => e.stopPropagation()}>
          <div id="modal-content">
            {activeBlogData && (
              <>
                <h2 className="modal-title">{activeBlogData.title}</h2>
                <div
                  className="modal-content"
                  dangerouslySetInnerHTML={{ __html: activeBlogData.content }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
