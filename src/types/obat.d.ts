interface Obat {
  id: string;
  nama_obat: string;
  jenis: string;
  subjenis: string;
  stok: number;
  satuan: string;
  permintaan: PuskesmasObat[];
}

interface PuskesmasObat {
  puskesmas: Puskesmas;
  jumlah: number;
}
