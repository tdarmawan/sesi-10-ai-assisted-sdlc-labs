# Analisis arsitektur starter

Snapshot acuan: tag material-request-start. Nomor baris berikut milik snapshot tersebut; verifikasi pada editor sebelum menggunakannya untuk perubahan.

- src/server.js:1–7: entry point, menggabungkan createApp dan httpServer, bind loopback port 3000.
- src/http.js:1–32: adapter node:http, pembacaan JSON, batas body, serialisasi respons.
- src/app.js:1 dst: starter merangkap memory store, validation, list, CSV, POST/PATCH dan routing.
- src/ui.js:1 dst: HTML form dan fetch ke API; output memakai textContent untuk menghindari HTML injection.
- test/baseline.test.js:1 dst: enam characterization tests, termasuk real HTTP.

Alur: server → HTTP adapter → app({method,url,body}) → validasi/list/mutasi → {status,body,headers} → HTTP. Data di closure rows; bukan D1, MCP, atau database. Owner adalah filter query demo, bukan otorisasi. UI memanggil API yang sama untuk create/edit.

Risiko kuota: POST dan PATCH dapat memiliki implementasi terpisah jika aturan diletakkan di route; arahkan keduanya ke shared service. PATCH harus menghitung state kandidat tanpa mengubah store sampai validasi selesai.

## Koreksi manual

Terverifikasi: src/app.js pada starter menggunakan structuredClone(seed) dan array rows di closure. Asumsi awal bahwa aplikasi memakai database salah. Tidak ada persistensi; restart mengembalikan seed.

## Target sesudah refactor

src/requests/domain.js: validation dan CSV; repository.js: memory adapter; service.js: use case diinjeksi repository; app.js: routing dan composition. Rincian di TRD pada checkpoint berikutnya.
