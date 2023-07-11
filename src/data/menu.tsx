import { Medication, LocalPharmacy, Grading } from "@mui/icons-material";
export const MENU_ITEM = [
  {
    menu: "Stok Obat",
    icon: <Medication />,
    pathname: "/obat",
  },
  {
    menu: "Permintaan",
    icon: <LocalPharmacy />,
    pathname: "/permintaan",
  },
  {
    menu: "Rekap",
    icon: <Grading />,
    pathname: "/rekap",
  },
];
