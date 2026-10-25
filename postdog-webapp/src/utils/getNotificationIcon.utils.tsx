import { 
    Bell, 
    Truck, 
    Package, 
    Warehouse, 
    MapPin, 
    TriangleAlert, 
    CircleX, 
    Zap, 
    Lock, 
    Loader, 
    RefreshCw, 
    Megaphone, 
    Search, 
    Wrench, 
    Settings, 
    Sparkles, 
    Monitor, 
    MessageSquare, 
    Mail, 
    Phone, 
    CircleHelp, 
    Clock, 
    CircleCheckBig, 
    Info, 
    ShieldAlert,
    Star,
    User,
    CheckCircle
} from 'lucide-react';

export const getNotificationIcon = (isGlobal: boolean, iconName?: string, size: number = 20) => {
  if (isGlobal && iconName) {
    switch (iconName) {
      case 'truck': return <Truck size={size} />;
      case 'package': return <Package size={size} />;
      case 'warehouse': return <Warehouse size={size} />;
      case 'map-pin': return <MapPin size={size} />;
      case 'alert-triangle': return <TriangleAlert size={size} />;
      case 'circle-x': return <CircleX size={size} />;
      case 'zap': return <Zap size={size} />;
      case 'lock': return <Lock size={size} />;
      case 'loader': return <Loader size={size} />;
      case 'refresh-cw': return <RefreshCw size={size} />;
      case 'megaphone': return <Megaphone size={size} />;
      case 'search': return <Search size={size} />;
      case 'wrench': return <Wrench size={size} />;
      case 'settings': return <Settings size={size} />;
      case 'sparkles': return <Sparkles size={size} />;
      case 'monitor': return <Monitor size={size} />;
      case 'message-square': return <MessageSquare size={size} />;
      case 'mail': return <Mail size={size} />;
      case 'phone': return <Phone size={size} />;
      case 'circle-help': return <CircleHelp size={size} />;
      case 'clock': return <Clock size={size} />;
      case 'circle-check-big': return <CircleCheckBig size={size} />;
      case 'check-circle': return <CheckCircle size={size} />;
      case 'info': return <Info size={size} />;
      case 'shield-alert': return <ShieldAlert size={size} />;
      case 'star': return <Star size={size} />;
      case 'user': return <User size={size} />;
      default: return <Bell size={size} />;
    }
  }
  return <Bell size={size} />;
};