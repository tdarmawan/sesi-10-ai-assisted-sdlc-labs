# PRD — Kuota material bulanan

Problem: planner perlu mencegah akumulasi permintaan di atas kuota kategori. Operator Rina/Budi mengajukan; planner Dewi meninjau dan mengedit. UI demo tidak menyediakan autentikasi.

## Keputusan latihan

Kuota pcs per bulan: fasteners 1500, filters 2000, electrical 3000, consumables 500. Bulan kalender dari request_date YYYY-MM-DD, agregat lintas owner. Submitted/approved dihitung, rejected tidak. Edit juga tunduk kuota, termasuk oleh Dewi. Pada PATCH, keluarkan record lama lalu hitung kandidat pada kategori/bulan tujuan. Batas inklusif. Server menolak overflow secara atomik.

## Acceptance criteria

1. Total filters 1990 + POST qty 10 pada bulan sama diterima (201).
2. Total filters 1990 + POST qty 11 ditolak 422 QUOTA_EXCEEDED, data tetap.
3. PATCH qty/kategori/tanggal/status menerapkan aturan yang sama; record sendiri tidak dihitung dua kali.
4. Submitted dan approved dihitung, rejected dikecualikan; rejected→submitted divalidasi ulang.
5. Kuota kategori dan bulan berbeda terpisah; semua owner digabung.
6. Input invalid 400; record tidak ada 404; error tidak memutasi data.
7. UI menampilkan kode respons dan error JSON dari server.
8. Search owner/part/note dan CSV baseline tetap berjalan setelah refactor.

## Non-goals dan constraint

Tanpa real ERP, autentikasi, database persisten, export PDF, email, atau deployment produksi. Data sintetis in-memory satu proses Node.js 22+. Refactoring dilakukan dahulu; kuota tahap terpisah. Target search <300 ms untuk 5000 record adalah sasaran opsional benchmark, belum jaminan performa.
