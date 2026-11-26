# TRD contoh — Search dan CSV

Fitur sudah tersedia pada starter. GET /api/requests dan /api/requests.csv menerima search (part_number/note, case-insensitive) serta owner (exact, simulasi). Keduanya memakai filter identik.

Kolom CSV: id, request_date, part_number, category, qty, owner, status, note. Semua sel diquote dan kutip ganda di-escape. Prefix apostrof untuk awalan formula termasuk whitespace. Content-Type text/csv; nama download requests.csv.

Target setelah refactor: domain.filterRequests/toCsv, service.list/exportCsv, repository.all. Route meneruskan query ke service; tidak menduplikasi aturan. ADR0001 menjelaskan pilihan CSV di server dan dependency injection. Baseline test memeriksa kombinasi filter, quoting/formula, dan HTTP.

Non-goals: database, ERP, export PDF dan autentikasi. Owner query bukan kontrol akses. Sasaran performa memerlukan benchmark terpisah.
