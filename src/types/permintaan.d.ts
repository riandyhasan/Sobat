interface Permintaan {
  id: string;
  tipe: string;
  jumlah: integer;
  sumber: string;
  sumber_kode: string;
  obat_id: string;
  nama_obat: string;
  tanggal_permintaan: string | Date;
}
