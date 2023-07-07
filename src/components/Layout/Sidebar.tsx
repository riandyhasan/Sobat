import React, { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SobatLogo from "@assets/logo/sobat.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEM } from "@data/menu";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactNode;
  pathname: string;
}

export default function ResponsiveDrawer(props: Props) {
  const { window, children, pathname } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1rem",
        }}
      >
        <Link href="/obat">
          <Image alt="Logo Sobat" src={SobatLogo} width={100} />
        </Link>
      </Box>
      <List>
        {MENU_ITEM.map((item, index) => (
          <Link
            href={item.pathname}
            key={index}
            style={{ textDecoration: "none" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor:
                  pathname == item.pathname ? theme.palette.primary.light : "",
                borderRight:
                  pathname == item.pathname
                    ? `4px solid ${theme.palette.primary.main}`
                    : "",
              }}
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    color:
                      pathname == item.pathname
                        ? theme.palette.primary.main
                        : theme.palette.grey[600],
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.menu}
                  sx={{
                    color:
                      pathname == item.pathname
                        ? theme.palette.text.primary
                        : theme.palette.grey[400],
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistem Manajemen Obat
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <div>{children}</div>
      </Box>
    </Box>
  );
}
