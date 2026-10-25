import {
  House,
  Package,
  Calculator,
  ClipboardList,
  History,
  Truck,
  DollarSign,
  Receipt,
  ArrowRightLeft,
  Weight,
  Settings,
  Puzzle,
  MapPin,
  Box,
  Building2,
  Tag,
  Bell,
  Shield,
  CircleDollarSign,
  TriangleAlert,
  Users
} from 'lucide-react';
import { NavItem } from '../types';

export const navItems: NavItem[] = [
  {
    name: 'Inicio',
    icon: <House size={20} />,
    path: '/dashboard',
  },
  {
    name: 'Envíos',
    icon: <Package size={20} />,
    subItems: [
      { icon: <Calculator size={16} />, name: 'Cotizador', path: '/shipping/quote' },
      { icon: <ClipboardList size={16} />, name: 'Órdenes', path: '/shipping/orders' },
      { icon: <History size={16} />, name: 'Historial de envíos', path: '/shipping/history' },
      { icon: <Truck size={16} />, name: 'Recolecciones', path: '/shipping/pickups' },
    ],
  },
  {
    name: 'Finanzas',
    icon: <DollarSign size={20} />,
    subItems: [
      { icon: <Receipt size={16} />, name: 'Facturación', path: '/finance/billing' },
      { icon: <ArrowRightLeft size={16} />, name: 'Movimientos', path: '/shipping/NoMovementsRecorded' },
      { icon: <Weight size={16} />, name: 'Sobrepeso', path: '/finance/overweight' },
    ],
  },
  {
    name: 'Ajustes',
    icon: <Settings size={20} />,
    subItems: [
      { icon: <Puzzle size={16} />, name: 'Integraciones', path: '/settings/integrations' },
      { icon: <MapPin size={16} />, name: 'Direcciones', path: '/shipping/Directions' },
      { icon: <Box size={16} />, name: 'Paquetes', path: '/settings/packages' },
      { icon: <Building2 size={16} />, name: 'Paqueterías', path: '/settings/carriers' },
      { icon: <Tag size={16} />, name: 'Etiquetas', path: '/settings/labels' },
      { icon: <Bell size={16} />, name: 'Notificaciones', path: '/settings/notifications' },
    ],
  },
  {
    name: 'Admin',
    icon: <Shield size={20} />,
    roles: ['ADMIN', 'VENDOR'],
    subItems: [
      { icon: <Users size={16} />, name: 'Usuarios', path: '/admin/users' },
      { icon: <CircleDollarSign size={16} />, name: 'Reglas de Precios', path: '/admin/pricing-rules' },
      { icon: <TriangleAlert size={16} />, name: 'Alertas', path: '/admin/global-alerts' },
    ],
  },
];