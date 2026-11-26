# Kontrak API lab

JSON body dengan Content-Type application/json. Errors `{ "error": "KODE" }`. Validasi 400, tidak ada 404, konflik status/stok/ID 409; kuota terlampaui 422. Metode/path tidak didukung mengembalikan 404. Semua endpoint lokal, tanpa autentikasi. Batas body 64 KiB.

## Material request — port 3000

- GET /: UI demo, search, owner, CSV, form create/edit.
- GET /api/requests?search=flt&owner=Rina: array, substring part_number/note case-insensitive dan owner exact.
- GET /api/requests.csv: filter sama; kolom id,request_date,part_number,category,qty,owner,status,note; CRLF, quoting, dan mitigasi formula CSV.
- POST /api/requests: 201 dan ID otomatis unik.
- PATCH /api/requests/:id: 200, partial fields, ID tetap; validasi gabungan record lama+patch.

```json
{"part_number":"FLT-01","category":"filters","qty":10,"owner":"Rina","status":"submitted","request_date":"2026-11-15","note":"Latihan"}
```

Qty integer positif aman; kategori fasteners/filters/electrical/consumables. Owner/part string nonblank <=120 karakter, note string <=1000, status submitted/approved/rejected, tanggal kalender valid YYYY-MM-DD. Field lain diabaikan. Filter owner tidak mengimplementasikan otorisasi.

Pada solusi, kuota agregat semua owner per category dan request_date.slice(0,7). Submitted/approved dihitung, rejected tidak. POST/PATCH memakai aturan yang sama. PATCH mengecualikan ID lama sebelum menambah kandidat. Batas inklusif 1500/2000/3000/500. Overflow 422 QUOTA_EXCEEDED, tanpa perubahan data.

## Material transfer — port 3001

Model hanya satu gudang dan SKU FLT-01; stock awal 100. Solusi membatasi part ke FLT-01. Starter belum menambahkan pending/reversal.

| Method | Path | Body | Hasil |
| --- | --- | --- | --- |
| GET | /api/stock | — | {warehouse:100} |
| GET | /api/transfers | — | semua transfer |
| GET | /api/transfers/:id | — | satu transfer |
| POST | /api/transfers | {id:"T1",part:"FLT-01",qty:5} | 201 NEW |
| POST | /api/transfers/:id/confirm | {actor:"Rina"} | NEW→CONFIRMED, stock -= qty |
| POST | /api/transfers/:id/pending | {actor:"Rina",reason:"Scanner timeout"} | NEW→PENDING, stock tetap |
| POST | /api/transfers/:id/resolve | {actor:"Dewi",transferRef:"SCAN-001"} | PENDING→CONFIRMED, stock -= qty |
| POST | /api/transfers/:id/reverse | {actor:"Dewi",reason:"Salah lini"} | CONFIRMED→REVERSED, stock += qty |

Input actor/reason/ref harus string nonblank <=120 karakter. ID string nonblank <=64 karakter dengan huruf/angka/underscore/dash. ID duplikat ditolak 409. Retry confirm pada CONFIRMED dan reverse pada REVERSED tidak memutasi lagi. Resolve retry harus memakai transferRef yang sama; ref berbeda 409. Transisi lain ditolak 409. Audit event mencatat action, actor, from, to, timestamp; retry tidak menambah event.

Mutasi dilakukan sinkron di satu proses. Tidak menjamin transaksi lintas proses maupun durability. Reversal adalah pembatalan pencatatan stok demo, bukan bukti perpindahan material fisik.
