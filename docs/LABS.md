# Panduan Lab

## Persiapan

Ikuti README. Jalankan `npm test` dari root untuk semua lab, atau dari folder lab untuk lab itu saja. Buka folder `material-request` di Code tab untuk Lab 1–2, folder `material-transfer` untuk Lab 3. Sertakan CLAUDE.md root dalam konteks bila sesi dimulai di subfolder.

## Lab 1A — PRD kuota (20 menit)

Mulai pada tag `material-request-start`, branch `feat/nama-peserta-request`. Jangan lihat solusi sebelum mencoba. Kategori dan kuota per bulan kalender: fasteners 1500, filters 2000, electrical 3000, consumables 500 pcs. Pengguna Rina/Budi (operator) dan Dewi (planner).

Prompt:

> Baca @../CLAUDE.md dan @src/app.js. Saya ingin fitur kuota material bulanan per kategori untuk POST dan PATCH /api/requests. Kuota: fasteners 1500, filters 2000, electrical 3000, consumables 500 pcs. Interview saya dengan AskUserQuestion tentang tanggal acuan, status yang dihitung, perubahan kategori/bulan, dan edit oleh planner. Tulis docs/PRD.md berisi problem, users, aturan, acceptance criteria, non-goals. Jangan ubah src/ atau test/.

Jawaban referensi trainer: bulan dari `request_date` (YYYY-MM-DD, tanpa konversi timezone), agregat semua owner, submitted/approved dihitung, rejected dikecualikan, total sama dengan batas diterima, edit mengecualikan record lama, aturan juga berlaku pada Dewi. Batas = qty total, bukan jumlah record. Angka ini adalah keputusan latihan; peserta boleh mencatat alternatif beserta dampaknya.

Lulus jika setiap aturan bisa diuji dan non-goals jelas. `git add docs/PRD.md` lalu `git commit -m "docs: PRD kuota material"`.

## Lab 1B — Analisis arsitektur (15 menit)

Mulai sesi baru (`/clear` pada CLI; gunakan sesi baru bila perintah tidak tersedia di Desktop). Prompt:

> Baca @../CLAUDE.md dan @docs/PRD.md. Gunakan subagent Explore untuk membaca src/ dan test/. Telusuri src/server.js → src/http.js → src/app.js, alur GET/POST/PATCH, CSV, dan penyimpanan. Beri Explore aturan arsitektur secara eksplisit. Tulis docs/ARCHITECTURE.md dengan file:baris, alur data, risiko kuota, serta asumsi. Jangan ubah aplikasi.

Verifikasi satu pernyataan dengan membuka file asli. Catat koreksi manual: starter in-memory, bukan database/D1/MCP. Simpan dokumen dengan commit. Bandingkan `lab1-checkpoint` setelah mencoba; nomor baris bergantung snapshot.

## Lab 2A — TRD dan ADR (15 menit)

> Baca @docs/PRD.md dan @docs/ARCHITECTURE.md. Tulis docs/TRD.md dan docs/adr/0001-modular-requests.md. Target src/requests/domain.js, repository.js, service.js. Domain murni; service menerima repository; app.js merangkai dependency. Pisahkan refactoring dari fitur kuota. Rinci kontrak, schema, urutan migrasi, test, alternatif ditolak. Jangan ubah src/ atau test/.

Review lalu `git add docs` dan commit. Lulus jika kontrak baseline dipertahankan dan implementasi kuota menjadi tahap terpisah.

## Lab 2B — Refactoring (30 menit)

> Gunakan Plan mode. Ikuti @docs/TRD.md. Jalankan test baseline dahulu. Pindahkan validasi/CSV ke domain.js, data ke repository.js, dan use case ke service.js secara bertahap. App hanya routing dan composition. Pertahankan test/baseline.test.js tanpa perubahan; jangan implementasikan kuota dahulu. Setelah tiap tahap jalankan npm test dan npm run lint:arch, tunjukkan output, lalu commit setelah saya meninjau diff.

Lulus jika baseline 6 test pass pada starter dan refactor, UI dan endpoint tetap berjalan, dependency rule diperiksa. Periksa diff `git diff material-request-start lab2-checkpoint -- material-request/test/baseline.test.js` (harus kosong).

## Lab 2C — Implementasi kuota (tambahan / sesi berikut, 25 menit)

Mulai dari `lab2-checkpoint`, buat branch `feat/kuota-material`. Tambahkan failing acceptance tests untuk batas inklusif, overflow POST/PATCH, edit sendiri, pindah bulan/kategori, rejected, semua owner dan Dewi. Implementasikan shared rule pada service. Test baru harus fail karena behavior, lalu pass setelah implementasi. Bandingkan `material-request-solution`.

## Lab 3 — Superpowers: pending dan reversal (45 menit)

Clone baru disarankan agar pekerjaan request tersimpan. Mulai tag `material-transfer-start`, branch `feat/nama-peserta-transfer`. Ikuti docs/CLAUDE-SETUP.md; Superpowers opsional, alur manual tetap dapat dilakukan.

Brainstorming:

> Baca @../CLAUDE.md, @src/service.js, @src/app.js, dan @test/baseline.test.js. Gunakan Superpowers brainstorming. Scanner dapat timeout: NEW harus menjadi PENDING tanpa mutasi stok. Resolve pending mengonfirmasi dan mengurangi stok sekali. Reversal hanya untuk CONFIRMED dan mengembalikan stok sekali. Bahas status invalid, retry, ID unik, actor, reason, dan audit. Tulis design di docs/superpowers/specs/pending-reversal.md. Tunggu persetujuan design sebelum mengubah code.

Plan:

> Design disetujui. Gunakan writing-plans, simpan docs/superpowers/plans/pending-reversal.md. Pecah menjadi task kecil: status/audit, helper stok, pending, resolve, reversal, route/test HTTP. Per task: file, failing test, implementasi, command verifikasi, commit. Tunggu review plan.

Execution:

> Plan disetujui. Implementasikan per task; gunakan subagent jika tersedia, atau satu sesi. Jalankan baseline tanpa perubahan dan tambah test invalid transition, retry/idempotency, stok, audit, duplicate ID, actor whitespace, transferRef bukan string. Jalankan npm test, npm run lint:arch, npm run demo. Review diff dan tunjukkan bukti. Jangan merge.

Lulus jika NEW→PENDING (stok 100)→CONFIRMED (95)→REVERSED (100), retry tidak menambah audit/mutasi, error tidak meninggalkan state setengah berubah, input malformed ditolak. Setelah push ke fork milik peserta, buka PR dan periksa CI.

## Tantangan: filter tanggal

Di service.list(query), tambahkan from/to inklusif pada GET dan CSV. Validasi tanggal dan from <= to; test tanggal batas, hasil kosong, format salah, serta kombinasi owner/search. Jawaban tidak disertakan agar tetap menjadi latihan.
