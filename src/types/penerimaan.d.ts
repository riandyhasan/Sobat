interface Penerimaan {
  id: string;
  batch: string;
  faktur: string;
  jumlah: integer;
  sumber: string;
  obat_id: string;
  nama_obat: string;
  tanggal_penerimaan: string | Date;
  tanggal_kadaluarsa: string | Date;
  harga_obat: number;
  satuan_harga: string;
}
