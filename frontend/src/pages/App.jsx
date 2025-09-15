import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';

const Home = () => (
  <div className="home-container">
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Professional Certification Portal</h1>
        <p className="hero-subtitle">Earn industry-recognized micro-certifications</p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Certified Professionals</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
      </div>
    </div>
    <div className="features-section">
      <h2>Why Choose Our Certification Program?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Focused Learning</h3>
          <p>Targeted assessments designed by industry experts</p>
        </div>
        <div className="feature-card">
          <h3>Instant Certificates</h3>
          <p>Download your certificate immediately upon passing</p>
        </div>
        <div className="feature-card">
          <h3>Quick Assessment</h3>
          <p>Complete certifications in minutes, not hours</p>
        </div>
        <div className="feature-card">
          <h3>Industry Recognition</h3>
          <p>Certificates recognized by leading companies</p>
        </div>
      </div>
    </div>
  </div>
);

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');
    const { data } = await api.post('/auth/login', { email, password });
    login(data); navigate('/quizzes');
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In to Your Account</h2>
        <p className="auth-subtitle">Enter your credentials to access your certification dashboard</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="Enter your email" required className="auth-input" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter your password" required className="auth-input" />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="demo-info">
          <p><strong>Demo Account:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: Password123</p>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name');
    const email = form.get('email');
    const password = form.get('password');
    const { data } = await api.post('/auth/register', { name, email, password });
    login(data); navigate('/quizzes');
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Join thousands of professionals earning certifications</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input name="name" placeholder="Enter your full name" required className="auth-input" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="Enter your email" required className="auth-input" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Create a strong password" required className="auth-input" />
          </div>
          <button type="submit" className="auth-button">Create Account</button>
        </form>
      </div>
    </div>
  );
}

function Quizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = React.useState([]);
  React.useEffect(() => { api.get('/quizzes').then(r => setQuizzes(r.data)); }, []);
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="quizzes-container">
      <div className="quizzes-header">
        <h2>Available Certifications</h2>
        <p>Choose a certification exam to begin your assessment</p>
      </div>
      <div className="quizzes-grid">
        {quizzes.map(q => (
          <div key={q._id} className="quiz-card">
            <div className="quiz-badge">CERTIFICATION</div>
            <h3 className="quiz-title">{q.title}</h3>
            <p className="quiz-description">{q.description}</p>
            <div className="quiz-details">
              <span className="quiz-detail">Duration: 10-15 minutes</span>
              <span className="quiz-detail">Questions: 5</span>
              <span className="quiz-detail">Pass Rate: 60%</span>
            </div>
            <Link to={`/quiz/${q._id}`} className="quiz-start-btn">
              Start Certification Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizTake() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = React.useState({ loading: true, quiz: null, questions: [], current: 0, answers: {} });
  React.useEffect(() => {
    if (!user) return; // redirect handled below
    api.get(`/quizzes/${id}/questions`).then(r => {
      setState(s => ({ ...s, loading: false, quiz: r.data.quiz, questions: r.data.questions }));
    });
  }, [id, user]);
  if (!user) return <Navigate to="/login" />;
  if (state.loading) return <div>Loading quiz...</div>;
  const q = state.questions[state.current];
  function select(idx) {
    setState(s => ({ ...s, answers: { ...s.answers, [q._id]: idx } }));
  }
  function next() { setState(s => ({ ...s, current: Math.min(s.current + 1, s.questions.length - 1) })); }
  function prev() { setState(s => ({ ...s, current: Math.max(s.current - 1, 0) })); }
  async function submit() {
    const payload = { answers: Object.entries(state.answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption })) };
    const { data } = await api.post(`/results/quiz/${id}/submit`, payload);
    navigate(`/result/${data.resultId}`);
  }
  const answeredCount = Object.keys(state.answers).length;
  const progress = ((state.current + 1) / state.questions.length) * 100;

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="exam-title">
          <h2>{state.quiz.title} Certification Exam</h2>
          <div className="exam-warning">
            WARNING: This is a timed certification assessment. Please read each question carefully.
          </div>
        </div>
        <div className="exam-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">Question {state.current + 1} of {state.questions.length}</span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-number">Question {state.current + 1}</div>
        <div className="question-text">{q.questionText}</div>

        <div className="options-container">
          {q.options.map((opt, idx) => {
            const selected = state.answers[q._id] === idx;
            const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
            return (
              <div key={idx} className={`option-item ${selected ? 'selected' : ''}`}>
                <button
                  type="button"
                  onClick={() => select(idx)}
                  className="option-button"
                >
                  <span className="option-label">{optionLabel}</span>
                  <span className="option-text">{opt}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="exam-footer">
        <div className="exam-status">
          <span className="answered-count">{answeredCount} of {state.questions.length} questions answered</span>
          {answeredCount < state.questions.length && (
            <span className="incomplete-warning">Please answer all questions before submitting</span>
          )}
        </div>

        <div className="exam-controls">
          <button
            onClick={prev}
            disabled={state.current === 0}
            className="control-btn secondary"
          >
            ← Previous
          </button>

          {state.current < state.questions.length - 1 ? (
            <button onClick={next} className="control-btn primary">
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={answeredCount !== state.questions.length}
              className={`control-btn submit ${answeredCount === state.questions.length ? 'enabled' : 'disabled'}`}
            >
              Submit Certification Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [data, setData] = React.useState(null);
  React.useEffect(() => { if (user) api.get(`/results/${id}`).then(r => setData(r.data)); }, [id, user]);
  if (!user) return <Navigate to="/login" />;
  if (!data) return <div className="loading">Loading results...</div>;

  async function downloadCert() {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/results/${id}/certificate.pdf`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `certificate-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  if (!data.passed) {
    return (
      <div className="result-container">
        <div className="result-card failed">
          <div className="result-header">
            <div className="result-icon failure">FAIL</div>
            <h2 className="result-title">Certification Not Achieved</h2>
            <p className="result-subtitle">
              You need to score at least 60% to earn certification
            </p>
          </div>

          <div className="result-details">
            <h3>Exam Results</h3>
            <div className="result-stats">
              <div className="stat">
                <label>Certification:</label>
                <span>{data.quizTitle}</span>
              </div>
              <div className="stat">
                <label>Score:</label>
                <span className="score">{data.score} / {data.total} questions</span>
              </div>
              <div className="stat">
                <label>Percentage:</label>
                <span className="percentage fail">{data.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="retry-section">
            <h3>Try Again</h3>
            <p>Don't worry! You can retake the exam to improve your score</p>
            <Link to="/quizzes" className="retry-btn">
              Back to Certifications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-result-container">
      {/* Success Status */}
      <div className="success-header">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        <h1 className="success-title">Certification Achieved!</h1>
        <p className="success-subtitle">
          Congratulations on successfully completing the {data.quizTitle} certification
        </p>
      </div>

      {/* Certificate Preview */}
      <div className="certificate-preview">
        <div className="certificate">
          <div className="certificate-border">
            <div className="certificate-inner-border">

              {/* Header */}
              <div className="certificate-header">
                <div className="certificate-logo">CertifyPro</div>
                <h2 className="certificate-type">CERTIFICATE OF ACHIEVEMENT</h2>
              </div>

              {/* Main Content */}
              <div className="certificate-body">
                <div className="certificate-text-line">This is to certify that</div>

                <div className="recipient-name">{user.name}</div>

                <div className="certificate-text-line">has successfully completed the certification examination for</div>

                <div className="certification-title">{data.quizTitle}</div>

                <div className="achievement-details">
                  <div className="achievement-score">
                    Score: {data.score}/{data.total} ({data.percentage}%)
                  </div>
                  <div className="achievement-date">
                    Issued on {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="certificate-validation">
                  <div className="validation-text">
                    This certification validates the holder's knowledge and competency
                    in the subject matter as assessed by our rigorous examination standards.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="certificate-footer">
                <div className="signature-section">
                  <div className="signature-line">
                    <div className="signature">CertifyPro Academy</div>
                    <div className="signature-title">Certification Authority</div>
                  </div>
                </div>

                <div className="certificate-seal">
                  <div className="seal-outer">
                    <div className="seal-inner">
                      <div className="seal-text-top">CERTIFIED</div>
                      <div className="seal-year">{new Date().getFullYear()}</div>
                      <div className="seal-text-bottom">AUTHENTIC</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="certificate-corner tl"></div>
              <div className="certificate-corner tr"></div>
              <div className="certificate-corner bl"></div>
              <div className="certificate-corner br"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="download-section">
        <h3>Your Official Certificate</h3>
        <p>Download your professionally formatted certificate in PDF format</p>
        <button onClick={downloadCert} className="download-certificate-btn">
          <span className="download-icon">⬇</span>
          Download Certificate PDF
        </button>
        <div className="certificate-info">
          <small>Certificate ID: CERT-{id.slice(-8).toUpperCase()}</small>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span>CertifyPro</span>
            </Link>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/quizzes" className="nav-link">Certifications</Link>
            {!user && <Link to="/login" className="nav-link">Sign In</Link>}
            {!user && <Link to="/register" className="nav-link register">Register</Link>}
            {user && (
              <div className="user-menu">
                <span className="user-name">Welcome, {user.name}</span>
                <button onClick={logout} className="logout-btn">Sign Out</button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 CertifyPro - Professional Certification Platform</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/quizzes" element={<Layout><Quizzes /></Layout>} />
  <Route path="/quiz/:id" element={<Layout><QuizTake /></Layout>} />
  <Route path="/result/:id" element={<Layout><ResultPage /></Layout>} />
      </Routes>
    </AuthProvider>
  );
}
