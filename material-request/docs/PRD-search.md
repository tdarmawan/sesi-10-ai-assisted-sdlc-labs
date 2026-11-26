# Contoh PRD — Search & CSV yang sudah ada pada starter

Planner menyalin permintaan ke spreadsheet; operator ingin melihat permintaan berdasarkan owner. Filter owner bersifat simulasi. Search pada part_number/note, case-insensitive, dapat digabung owner exact. GET JSON dan CSV memakai filter sama. CSV di server, semua sel diquote, kutip digandakan, awalan formula termasuk whitespace diprefix apostrof. Header: id,request_date,part_number,category,qty,owner,status,note.

Acceptance: search FLT mengembalikan FLT-01; search BAUT+owner Rina kosong; BAUT+Budi satu record. Export operator hanya terfilter secara demo, bukan akses terotorisasi. Non-goals: PDF, ERP dan autentikasi. Maksimal ukuran dataset tidak dipaksakan; benchmark 5000 baris merupakan latihan opsional, belum SLA.
