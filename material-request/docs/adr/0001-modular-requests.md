# ADR 0001: Feature module dengan dependency injection

Status: accepted (latihan). Context: starter mencampur route, validasi, data, CSV. POST dan PATCH akan berbagi kuota.

Decision: domain murni, service diinjeksi repository, app.js composition root. CSV di server dengan filter yang sama. Refactor dipisahkan dari kuota.

Alternatives rejected: duplikasi kuota dalam route (drift), service import memoryRepository langsung (coupling), mengganti framework/database saat refactor (scope melebar), export seluruh data di browser (filter berpotensi terlewat).

Consequences: test domain/service mudah, adapter dapat diganti. Port merupakan kontrak JavaScript, bukan interface TypeScript. Transaksi produksi dan otorisasi belum disediakan.
