// Дөрвөн SKU. Өнгө нь 2026 оны Book of Standards-ийн албан ёсны HEX утга.
// D3 + DHA Omega болон DHA Omega-г хооронд нь сольж болохгүй.

export type Product = {
  slug: string;
  name: string;
  packshot: string;
  /** Тухайн SKU-г танигдуулах гол өнгө */
  accent: string;
  /** Албан ёсны палитр бүтнээрээ */
  palette: string[];
  /** Нэг хайрцгийн үнэ, төгрөгөөр (₮) */
  price: number;
};

export const products: Product[] = [
  {
    slug: "d3",
    name: "Babytol D3",
    packshot: "/brand/packshots/babytol-d3.png",
    accent: "#F79E24",
    palette: ["#F79E24", "#ED483E", "#CC242E"],
    price: 28000,
  },
  {
    slug: "d3-k1",
    name: "Babytol D3 + K1",
    packshot: "/brand/packshots/babytol-d3-k1.png",
    accent: "#ED1072",
    palette: ["#ED1072", "#9D1F60", "#F49AC2", "#F9B5B2"],
    price: 36000,
  },
  {
    slug: "d3-dha-omega",
    name: "Babytol D3 + DHA Omega",
    packshot: "/brand/packshots/babytol-d3-dha-omega.png",
    accent: "#00A785",
    palette: ["#CC242E", "#00A785", "#F5906C"],
    price: 50000,
  },
  {
    slug: "dha-omega",
    name: "Babytol DHA Omega",
    packshot: "/brand/packshots/babytol-dha-omega.png",
    accent: "#00A785",
    palette: ["#00A785", "#CC242E", "#F79E24"],
    price: 42000,
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** 35000 → "35,000₮". Intl ашиглахгүй — сервер, клиент дээр яг ижил гаралттай байх ёстой. */
export const formatPrice = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`;

/** Нэг SKU-ээс нэг захиалгад авах дээд тоо */
export const MAX_QTY = 20;
