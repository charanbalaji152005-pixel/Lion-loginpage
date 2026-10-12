import { useEffect, useMemo, useState } from "react";
import Lion from "../Components/Lion.jsx";
import "../Components/LoginPage.css";

const WELCOME_TEXT =
  "Secure access to your digital workspace. Sign in to manage your account, monitor activities, and stay in control.";

// The reel keeps the eyes covered even after the eye icon is clicked.
// Set to true if you want the lion to peek with one eye instead.
const PEEK_WHEN_VISIBLE = false;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- small hooks ---------- */

function useTypewriter(text, active, speed = 28) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setCount(text.length);
      return;
    }
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, count);
}

// Deterministic "random" so stars don't jump between renders
function useStars(n = 36) {
  return useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: n }, () => ({
      left: `${(rnd() * 100).toFixed(1)}%`,
      top: `${(rnd() * 100).toFixed(1)}%`,
      size: 2 + rnd() * 2,
      dur: `${(2.5 + rnd() * 3).toFixed(1)}s`,
      delay: `${(rnd() * 4).toFixed(1)}s`,
    }));
  }, [n]);
}

/* ---------- icons ---------- */

const Icon = ({ children }) => (
  <svg
    className="field-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);
const LockIcon = () => (
  <Icon>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
const EyeIcon = () => (
  <Icon>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);
const EyeOffIcon = () => (
  <Icon>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.5 7.6A16.6 16.6 0 0 0 2 12s3.6 6 10 6c1.5 0 2.8-.3 4-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Icon>
);

/* ---------- page ---------- */

export default function LoginPage({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState(null); // "email" | "password" | null

  // Intro: white cloud band opens up, then the content fades in
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setOpen(true);
      setVisible(true);
      return;
    }
    const t1 = setTimeout(() => setOpen(true), 300);
    const t2 = setTimeout(() => setVisible(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const typed = useTypewriter(WELCOME_TEXT, visible);
  const stars = useStars();

  // Lion reactions
  const covered = focus === "password";
  const peek = PEEK_WHEN_VISIBLE && showPassword;
  const lookAt =
    focus === "email"
      ? { x: -0.7 + 1.4 * Math.min(email.length / 30, 1), y: 0.75 } // looks down, follows the typing
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onSignIn?.({ email, password, remember });
  };

  return (
    <div className={`cloud-video-universe${open ? " is-open" : ""}`}>
      {stars.map((s, i) => (
        <span
          key={i}
          className="cloud-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            "--dur": s.dur,
            "--delay": s.delay,
          }}
        />
      ))}

      <svg
        className="cloud-svg-bg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="cloud-shape"
          fill="#fff"
          d="M0 0H760C880 0 900 70 990 96C1090 126 1160 56 1250 78C1340 100 1410 150 1440 190V780A120 90 0 0 1 1200 780A120 90 0 0 1 960 780A120 90 0 0 1 720 780A120 90 0 0 1 480 780A120 90 0 0 1 240 780A120 90 0 0 1 0 780Z"
        />
      </svg>

      <main className={`cloud-content-grid${visible ? " visible" : ""}`}>
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h1 className="login-title">Hello!</h1>
          <p className="login-sub">Sign in to your account</p>

          <div className="lion-wrap">
            <Lion covered={covered} peek={peek} lookAt={lookAt} />
          </div>

          <label className="field">
            <MailIcon />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
            />
          </label>

          <label className="field">
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus(null)}
            />
            <button
              type="button"
              className="eye-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              // keep focus in the password input so the lion keeps its eyes covered
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </label>

          <div className="login-row">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a className="link-strong" href="#forgot">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-btn">
            SIGN IN
          </button>

          <p className="login-foot">
            Don&apos;t have an account?{" "}
            <a className="link-strong" href="#create">
              Create
            </a>
          </p>
        </form>

        <section className="welcome">
          <h2>Welcome Back!</h2>
          <p>
            {typed}
            <span className="caret" aria-hidden="true" />
          </p>
        </section>
      </main>
    </div>
  );
}
