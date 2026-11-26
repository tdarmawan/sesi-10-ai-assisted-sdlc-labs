# Bukti verifikasi paket trainer

Dijalankan 26 November 2026, Windows, Node.js v24.21.0. Data sintetis. Ini hasil pengujian aplikasi Node lokal, bukan bukti eksekusi Claude Code atau Superpowers.

| Snapshot | Material request | Material transfer | Architecture |
| --- | --- | --- | --- |
| starter | 6 pass | 6 pass | pass |
| lab1-checkpoint | 6 pass | 6 pass | pass |
| lab2-checkpoint | 6 pass, baseline identik | 6 pass | pass |
| material-request-solution | 12 pass | 6 pass | pass |
| material-transfer-solution | 12 pass | 14 pass | pass |

Baseline test files pada kedua lab tidak berubah dari starter ke solusi. Sebelum implementasi kuota, acceptance suite menghasilkan 5 kegagalan perilaku yang diharapkan dan 1 pass; sesudah implementasi semuanya pass.

`npm run demo` menjalankan HTTP server terisolasi, membuat T1 (201 NEW), pending (200, stock100), resolve (200, stock95), retry resolve (stock95), reverse (stock100), retry reverse (stock100), duplicate ID (409). Server berhenti sendiri.

Pengujian HTTP mencakup UI HTML, JSON, CSV, PATCH, malformed JSON, serta lifecycle transfer. UI memakai textContent, filter owner bukan autentikasi. Architecture checker sederhana bukan pembuktian seluruh dependency atau keamanan produksi.

CI matrix Node22/24 dan Ubuntu/Windows disediakan; hasil lokal tidak sama dengan hasil CI. Periksa tab Actions untuk status aktual. Tidak ada klaim pengujian scanner fisik, ERP, multi-process concurrency, atau database.

## Peta materi

Slide setup → README dan import bundle; Lab1 → material-request/docs/PRD.md dan ARCHITECTURE.md; Lab2 → TRD.md, ADR0001 dan src/requests; implementasi kuota → quota.test.js; Lab3 → material-transfer/docs/superpowers, transitions.test.js dan scripts/demo.mjs.

Semua prompt, code panel, dan output slide ditandai sebagai contoh atau hasil test lokal. Jumlah token, skill, biaya plugin, serta klaim reviewer AI tidak dipresentasikan sebagai hasil aktual.

## Verifikasi dari GitHub

Repo publik: https://github.com/tdarmawan/sesi-10-ai-assisted-sdlc-labs. Clone baru berhasil; 44 berkas cocok dengan paket publikasi. Enam tag latihan berhasil diimpor dari checkpoints.bundle. Dari clone tersebut: npm ci, 26 test, lint:arch, dan demo HTTP lulus. npm run dev pada kedua folder berhasil melayani port 3000/3001; UI request merespons 200, overflow kuota 422, dan lifecycle transfer mengembalikan stock ke 100.

GitHub Actions menjalankan matrix Ubuntu/Windows dengan Node 22/24. Pemeriksaan tambahan mencakup bundle, baseline test yang tidak berubah, dan demo. Status terkini: [Lab verification](https://github.com/tdarmawan/sesi-10-ai-assisted-sdlc-labs/actions/workflows/ci.yml).
