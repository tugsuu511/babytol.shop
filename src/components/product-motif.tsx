// SKU бүрийн hero дэвсгэрийн хээ — leaflet-ийн дүрслэлээс сэдэвлэсэн, opacity 10–50% (Social Design Guide §5).
// Цэвэр чимэглэл тул aria-hidden.

export function ProductMotif({ slug }: { slug: string }) {
  switch (slug) {
    case "d3":
      return <SunMotif />;
    case "d3-k1":
      return <CirclesMotif />;
    case "d3-dha-omega":
      return <SeaMotif />;
    case "dha-omega":
      return <MindMotif />;
    default:
      return null;
  }
}

const base = "pointer-events-none absolute inset-0 h-full w-full";

/** D3 — «нарны витамин»: туяатай нар */
function SunMotif() {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 600 600" className={base} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g transform="translate(330 250)">
        <circle r="250" fill="#F79E24" opacity="0.08" />
        <circle r="150" fill="#F79E24" opacity="0.14" />
        <g stroke="#F79E24" strokeWidth="14" strokeLinecap="round" opacity="0.35">
          {rays.map((a) => (
            <line key={a} x1="0" y1="-178" x2="0" y2={a % 45 === 0 ? -238 : -214} transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** D3 + K1 — leaflet-ийн давхацсан ягаан тойргууд */
function CirclesMotif() {
  return (
    <svg viewBox="0 0 600 600" className={base} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <circle cx="420" cy="140" r="150" fill="#F9B5B2" opacity="0.35" />
      <circle cx="330" cy="300" r="170" fill="#F49AC2" opacity="0.25" />
      <circle cx="470" cy="450" r="120" fill="#ED1072" opacity="0.1" />
      <circle cx="140" cy="500" r="60" fill="#F49AC2" opacity="0.25" />
    </svg>
  );
}

/** D3 + DHA Omega — далайн замаг, бөмбөлөг */
function SeaMotif() {
  return (
    <svg viewBox="0 0 600 600" className={base} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <g fill="none" stroke="#00A785" strokeWidth="16" strokeLinecap="round" opacity="0.22">
        <path d="M120 600 C 90 520, 160 470, 120 390 S 150 270, 130 220" />
        <path d="M200 600 C 230 530, 170 480, 210 410 S 180 320, 220 280" />
        <path d="M470 600 C 440 530, 500 470, 460 400 S 490 300, 470 250" />
        <path d="M540 600 C 560 540, 520 500, 545 450" />
      </g>
      <g fill="#00A785" opacity="0.18">
        <circle cx="380" cy="120" r="22" />
        <circle cx="430" cy="70" r="12" />
        <circle cx="300" cy="180" r="9" />
      </g>
      <g fill="#F5906C" opacity="0.3">
        <circle cx="520" cy="190" r="16" />
        <circle cx="90" cy="150" r="10" />
      </g>
    </svg>
  );
}

/** DHA Omega — «сэргэг оюун»: бөмбөлөг ба геометр зураас */
function MindMotif() {
  return (
    <svg viewBox="0 0 600 600" className={base} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="#fff" opacity="0.45">
        <circle cx="470" cy="110" r="26" />
        <circle cx="520" cy="200" r="12" />
        <circle cx="110" cy="470" r="18" />
        <circle cx="80" cy="120" r="8" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
        <path d="M400 420 L480 300 L540 440 Z" />
        <circle cx="474" cy="390" r="30" />
        <path d="M60 300 q 30 -60 60 0 t 60 0 t 60 0" />
      </g>
      <text x="380" y="530" fill="#fff" opacity="0.6" fontSize="34" fontStyle="italic" fontFamily="Georgia, serif">
        a²+b²=c²
      </text>
    </svg>
  );
}
