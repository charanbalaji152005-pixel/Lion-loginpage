import { useEffect, useRef, useState } from "react";

const clamp = (v, min = -1, max = 1) => Math.max(min, Math.min(max, v));

// 14 mane tufts arranged in a ring around the face
const TUFTS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { x: 80 + Math.cos(a) * 47, y: 74 + Math.sin(a) * 47 };
});

const EYE_L = { x: 63, y: 68 };
const EYE_R = { x: 97, y: 68 };

/**
 * Props
 *  covered : paws rise and cover the eyes (password field focused)
 *  peek    : while covered, the right paw slides down so one eye peeks out
 *  lookAt  : {x, y} in -1..1 to override cursor tracking (e.g. while typing)
 */
export default function Lion({ covered = false, peek = false, lookAt = null }) {
  const ref = useRef(null);
  const [pointerLook, setPointerLook] = useState({ x: 0, y: 0.15 });

  // Pupils follow the mouse / finger anywhere on the page
  useEffect(() => {
    const onMove = (e) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      setPointerLook({
        x: clamp((e.clientX - cx) / 260),
        y: clamp((e.clientY - cy) / 260),
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const look = lookAt ?? pointerLook;
  const pupilShift = `translate(${(look.x * 3.4).toFixed(2)}px, ${(look.y * 3.4).toFixed(2)}px)`;

  const leftPaw = covered ? "translate(11px, -58px)" : "translate(0px, 0px)";
  const rightPaw = !covered
    ? "translate(0px, 0px)"
    : peek
    ? "translate(8px, -40px)"
    : "translate(-11px, -58px)";

  return (
    <svg
      ref={ref}
      className="lion"
      viewBox="0 0 160 144"
      role="img"
      aria-label="Lion mascot"
    >
      {/* Mane */}
      <g fill="#b8651b">
        {TUFTS.map((t, i) => (
          <circle key={i} cx={t.x} cy={t.y} r="15" />
        ))}
      </g>
      <circle cx="80" cy="74" r="50" fill="#d9892e" />

      {/* Ears */}
      <circle cx="44" cy="30" r="13" fill="#e0a24a" />
      <circle cx="44" cy="30" r="6.5" fill="#f3c9a0" />
      <circle cx="116" cy="30" r="13" fill="#e0a24a" />
      <circle cx="116" cy="30" r="6.5" fill="#f3c9a0" />

      {/* Face */}
      <circle cx="80" cy="76" r="38" fill="#f2b95f" />

      {/* Muzzle */}
      <circle cx="70" cy="93" r="13" fill="#fde8c4" />
      <circle cx="90" cy="93" r="13" fill="#fde8c4" />

      {/* Nose + mouth */}
      <path d="M72 82 h16 q0 8 -8 10 q-8 -2 -8 -10 z" fill="#5b2f1a" />
      <path
        d="M80 92 v4 M80 96 q-6 6 -13 2 M80 96 q6 6 13 2"
        fill="none"
        stroke="#5b2f1a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <g fill="#b9833f">
        <circle cx="66" cy="94" r="1" />
        <circle cx="70" cy="98" r="1" />
        <circle cx="94" cy="94" r="1" />
        <circle cx="90" cy="98" r="1" />
      </g>

      {/* Eyes */}
      {[EYE_L, EYE_R].map((e, i) => (
        <g key={i}>
          <ellipse cx={e.x} cy={e.y} rx="9" ry="10" fill="#fff" stroke="#5b2f1a" strokeWidth="1.6" />
          <g className="lion-pupil" style={{ transform: pupilShift }}>
            <circle cx={e.x} cy={e.y} r="4.6" fill="#24120a" />
            <circle cx={e.x + 1.6} cy={e.y - 2} r="1.4" fill="#fff" />
          </g>
        </g>
      ))}

      {/* Paws: rest at the bottom, rise to cover the eyes */}
      <g transform="translate(52 128)">
        <g className="lion-paw" style={{ transform: leftPaw }}>
          <ellipse rx="16" ry="12" fill="#f2b95f" stroke="#c98a2f" strokeWidth="1.5" />
          <path d="M-5 -3 v7 M0 -4 v8 M5 -3 v7" stroke="#c98a2f" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(108 128)">
        <g className="lion-paw" style={{ transform: rightPaw }}>
          <ellipse rx="16" ry="12" fill="#f2b95f" stroke="#c98a2f" strokeWidth="1.5" />
          <path d="M-5 -3 v7 M0 -4 v8 M5 -3 v7" stroke="#c98a2f" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
