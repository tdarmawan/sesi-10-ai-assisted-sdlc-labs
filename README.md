# Sesi 10 — AI-Assisted SDLC Engineering

Latihan Bahasa Indonesia untuk Claude Code: requirement → analisis → desain → refactoring → implementasi → verifikasi → PR. Seluruh data sintetis, tanpa afiliasi dengan perusahaan manufaktur tertentu.

## Mulai di sini

Prasyarat: Node.js 22+ (`node --version`), npm (`npm --version`), Git. Claude Code memerlukan akun/akses yang sesuai. Aplikasi demo sendiri tidak memerlukan login, database, atau API key. GitHub CLI hanya diperlukan untuk alur PR dari terminal.

```sh
git clone https://github.com/tdarmawan/sesi-10-ai-assisted-sdlc-labs.git
cd sesi-10-ai-assisted-sdlc-labs
git bundle verify checkpoints.bundle
git fetch ./checkpoints.bundle "refs/tags/*:refs/tags/*"
npm ci
npm test
npm run lint:arch
```

`checkpoints.bundle` menyimpan history lokal starter→dokumen→refactor→solution. Import dilakukan sekali sesudah clone. Bundle tidak menjalankan code atau hook.

Untuk mengerjakan lab dari awal, gunakan tag starter lalu buat branch kerja:

```sh
git switch -c feat/nama-peserta-request material-request-start
cd material-request
npm ci
npm test
npm run dev
```

Buka http://127.0.0.1:3000. Hentikan server dengan Ctrl+C. Jalankan perintah satu per baris; sintaks ini bekerja di PowerShell maupun shell POSIX. Jika PowerShell memblokir `npm.ps1`, gunakan `npm.cmd` tanpa mengubah kebijakan keamanan komputer.

## Peta latihan dan checkpoint

| Lab | Folder | Mulai | Hasil | Referensi |
| --- | --- | --- | --- | --- |
| 1A: PRD kuota | material-request | material-request-start | docs/PRD.md | lab1-checkpoint |
| 1B: analisis | material-request | lanjut Lab 1A | docs/ARCHITECTURE.md | lab1-checkpoint |
| 2A: TRD + ADR | material-request | lanjut Lab 1B | docs/TRD.md, docs/adr/0001-modular-requests.md | lab2-checkpoint |
| 2B: refactoring | material-request | lanjut Lab 2A | src/requests/, baseline test tidak berubah | lab2-checkpoint |
| 2C: implementasi kuota | material-request | lab2-checkpoint | shared quota rule POST/PATCH | material-request-solution |
| 3: Superpowers pending/reversal | material-transfer | material-transfer-start | design, plan, state machine, test | material-transfer-solution |

Tag menunjuk seluruh snapshot repo; `cd` ke folder yang benar. Checkpoint bukan branch kerja. Gunakan `git show tag:path` untuk membandingkan tanpa mengganti branch atau `git switch -c feat/nama-lanjutan tag` di checkout bersih. Simpan pekerjaan dengan commit sebelum berpindah; jangan memakai reset paksa. Solusi lengkap ada pada branch default `main`. Karena publikasi melalui browser, tag latihan diimpor dari `checkpoints.bundle` dengan perintah fetch di atas; tag tidak otomatis ada di remote GitHub.

## Transfer material

Dari root repo, di clone baru:

```sh
git switch -c feat/nama-peserta-transfer material-transfer-start
cd material-transfer
npm ci
npm test
npm run dev
```

API pada http://127.0.0.1:3001. Di solusi, jalankan `npm run demo` pada terminal kedua untuk skenario NEW → PENDING → CONFIRMED → REVERSED; demo menjalankan server terisolasi sendiri dengan port acak dan berhenti otomatis.

## Panduan

- [Langkah lengkap, prompt, dan kriteria lulus](docs/LABS.md)
- [Kontrak API](docs/API.md)
- [Setup Claude Code & Superpowers](docs/CLAUDE-SETUP.md)
- [Troubleshooting dan PR](docs/TROUBLESHOOTING.md)
- [Pemetaan slide dan bukti pengujian](docs/VALIDATION.md)

Repo ini demonstrasi satu proses dengan penyimpanan in-memory. Restart menghapus perubahan. Query `owner` adalah filter demo, bukan kontrol akses. Stok transfer adalah satu saldo gudang untuk satu SKU FLT-01. Sistem produksi memerlukan autentikasi, persistensi, transaksi database, idempotency key yang tersimpan, dan rekonsiliasi scanner.
