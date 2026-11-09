// "Switzerland · Premium Quality" тэмдэг — swiss.pdf-ийн вектор хуулбар (inline SVG).
// Утга нь хажуугийн текстэд байгаа тул чимэглэл болгож aria-hidden хийнэ.

const BUMPS = 40;
const bumps = Array.from({ length: BUMPS }, (_, i) => {
  const a = (i / BUMPS) * Math.PI * 2;
  return { cx: +(100 + 93 * Math.cos(a)).toFixed(2), cy: +(100 + 93 * Math.sin(a)).toFixed(2) };
});

export function SwissSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        {/* Дээд текст: зүүнээс баруун тийш, дээгүүр */}
        <path id="seal-top" d="M40 100 A60 60 0 0 1 160 100" fill="none" />
        {/* Доод текст: зүүнээс баруун тийш, доогуур — үсэг босоо уншигдана */}
        <path id="seal-bottom" d="M28 100 A72 72 0 0 0 172 100" fill="none" />
      </defs>

      {/* Шүдэрсэн хүрээ */}
      <g fill="#4b4b4d">
        <circle cx="100" cy="100" r="93" />
        {bumps.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r="5.2" />
        ))}
      </g>
      <circle cx="100" cy="100" r="88" fill="#ebecee" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#4b4b4d" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="83" fill="none" stroke="#b5b6b8" strokeWidth="0.8" />

      <g fill="#5b5c5e" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="2.2">
        <text fontSize="15.5">
          <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
            SWITZERLAND
          </textPath>
        </text>
        <text fontSize="13">
          <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
            PREMIUM QUALITY
          </textPath>
        </text>
      </g>

      {/* Туг */}
      <circle cx="100" cy="100" r="44" fill="#4b4b4d" />
      <circle cx="100" cy="100" r="40" fill="#ed1c24" stroke="#d9d9db" strokeWidth="1" />
      <path d="M93.5 81h13v12.5H119v13h-12.5V119h-13v-12.5H81v-13h12.5z" fill="#fff" />
    </svg>
  );
}
