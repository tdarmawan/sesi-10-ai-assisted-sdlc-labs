# Design reference — Pending dan reversal

Ini artifact referensi trainer yang ditulis untuk lab, bukan klaim transkrip atau hasil eksekusi Claude/Superpowers.

## Tujuan

Scanner timeout tidak boleh langsung mengurangi stok. Satu gudang/satu SKU FLT-01, awal 100. Unique transfer ID, mutasi sekali, audit dan validasi input.

## State machine

NEW → confirm → CONFIRMED; NEW → pending → PENDING → resolve → CONFIRMED → reverse → REVERSED. Pending tidak mengubah stok. Confirm/resolve mengurangi stok dengan pemeriksaan saldo. Reverse mengembalikan qty sekali. Transisi lain 409.

## Keputusan referensi

ID duplikat 409 dan tidak menimpa record. Actor wajib nonblank. Pending/reverse memerlukan reason; resolve memerlukan transferRef string. Retry pending pada pending, confirm pada confirmed, reverse pada reversed idempotent. Resolve retry wajib ref sama; ref berbeda konflik. Retry tidak menambah audit. Error tidak mengubah stok/status/audit.

Semua keputusan ini perlu ditinjau peserta/pemilik fitur saat latihan. Approval design dalam alur peserta bukan diwakili dokumen referensi ini.

## Risiko & non-goals

Tidak ada hardware scanner, ERP, multi-SKU, autentikasi, database, transaksi lintas proses, atau durability. Produksi perlu transaksi dan reconciliation. Partial update dicegah di proses tunggal dengan validasi dan cek stok sebelum mutasi sinkron.

## Selesai jika

Baseline tidak diubah, regression tests dan real HTTP pass, demo stock 100→100→95→100, lint pass. Review diff dan CI sebelum integrasi.
