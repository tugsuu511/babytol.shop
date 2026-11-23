// Vitest-ийг дискийн үсэг нь том ("C:\...") cwd-ээс эхлүүлнэ.
//
// Windows дээр cwd "c:\..." (Git Bash, VS Code-ийн терминал) байхад vitest өөрийгөө
// "c:" ба "C:" гэсэн хоёр өөр замаар ачаалж, setup файлын afterEach бүртгэгдэхгүй —
// бүх тест "Vitest failed to find the current suite" алдаагаар унадаг.
// Config дотроос засах боломжгүй (CLI config-оос өмнө ачаалагддаг) тул энд нормчилно.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const upperDrive = (p) => p.replace(/^[a-z]:/, (d) => d.toUpperCase());

const cwd = upperDrive(process.cwd());
const vitestDir = dirname(createRequire(join(cwd, "package.json")).resolve("vitest/package.json"));
const bin = upperDrive(join(vitestDir, "vitest.mjs"));

const { status, signal } = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], { cwd, stdio: "inherit" });
process.exit(status ?? (signal ? 1 : 0));
