# TRD — Modular requests dan kuota

## Struktur dan dependency

- domain.js: validate, filterRequests, csvCell, toCsv. Murni, tidak import HTTP/repository.
- repository.js: defaultSeed dan memoryRepository, port all/get/insert/update. Selalu clone agar state tidak bocor.
- service.js: materialRequestService(repository), use case list/exportCsv/create/update. Tidak import concrete repository.
- app.js: composition root, route → service; respons HTTP tetap sama.
- quota.js: tahap setelah refactoring, shared rule assertWithinQuota.

Kontrak baseline di ../../docs/API.md. Data id, part_number, category, qty, owner, status, request_date, note. PATCH parsial, ID immutable. Error 400/404; kuota baru 422. CSV dibuat server setelah filter; mitigation formula dan quoting dipertahankan.

## Tahap implementasi

1. Jalankan enam baseline tests pada starter, commit characterization tests sebelum refactor.
2. Extract validation/filter/CSV ke domain; jalankan baseline, review diff, commit.
3. Extract memoryRepository dan injected service; jalankan baseline, commit.
4. Delegate route dari app ke service; tambahkan rules dan lint:arch; jalankan baseline identik dan lint; commit. Tag lab2-checkpoint berhenti di sini.
5. Tahap terpisah: quota.js dan acceptance tests. POST dan PATCH memvalidasi kandidat sebelum repository write. Aggregate category+request_date month, exclude current ID, include submitted/approved only.

## Constraint

Satu proses in-memory dan mutasi sinkron tanpa await antara cek kuota dan write. Produksi butuh transaksi persisten, autentikasi, observability, concurrency lintas proses. Lint sederhana memeriksa import statis; review manual tetap diperlukan.
