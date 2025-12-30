import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'finance', 'manager', 'viewer'] },
  { text: 'Contracts', icon: <DescriptionIcon />, path: '/contracts', roles: ['admin', 'finance', 'manager'] },
  { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices', roles: ['admin', 'finance'] },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments', roles: ['admin', 'finance'] },
  { text: 'Reconciliation', icon: <AssessmentIcon />, path: '/reconciliation', roles: ['admin', 'finance'] },
  { text: 'Rate Changes', icon: <MonetizationOnIcon />, path: '/rate-changes', roles: ['admin', 'finance'] },
  { text: 'Services', icon: <HomeWorkIcon />, path: '/services', roles: ['admin', 'finance', 'manager'] },
];

export default function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuthStore();

  const drawer = (
    <Box>
      <Toolbar /> {/* Spacer for AppBar */}
      <List>
        {menuItems.map((item) => {
          const hasAccess = hasPermission(item.roles as any);
          
          if (!hasAccess) return null;

          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) onDrawerToggle();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}