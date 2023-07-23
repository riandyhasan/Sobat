import {
  Medication,
  LocalPharmacy,
  Grading,
  Vaccines,
} from "@mui/icons-material";
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
  // {
  //   menu: "Penerimaan",
  //   icon: <Vaccines />,
  //   pathname: "/penerimaan",
  // },
  {
    menu: "Rekap",
    icon: <Grading />,
    pathname: "/rekap",
  },
];
