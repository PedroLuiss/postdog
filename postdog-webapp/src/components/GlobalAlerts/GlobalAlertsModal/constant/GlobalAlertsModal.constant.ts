import { 
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
    ShieldAlert 
} from 'lucide-react';

export const ICON_CATEGORIES = [
    {
        name: 'General',
        icons: [
            { id: 'truck', name: 'Camión', icon: Truck },
            { id: 'package', name: 'Caja', icon: Package },
            { id: 'warehouse', name: 'Almacén', icon: Warehouse },
            { id: 'map-pin', name: 'Ubicación', icon: MapPin },
            { id: 'alert-triangle', name: 'Precaución', icon: TriangleAlert },
            { id: 'circle-x', name: 'Error', icon: CircleX },
            { id: 'zap', name: 'Incidencia', icon: Zap },
            { id: 'lock', name: 'Bloqueo', icon: Lock },
            { id: 'loader', name: 'En proceso', icon: Loader },
            { id: 'refresh-cw', name: 'Actualización', icon: RefreshCw },
            { id: 'megaphone', name: 'Anuncio', icon: Megaphone },
            { id: 'search', name: 'Revisión', icon: Search },
            { id: 'wrench', name: 'Mantenimiento', icon: Wrench },
            { id: 'settings', name: 'Configuración', icon: Settings },
            { id: 'sparkles', name: 'Mejora', icon: Sparkles },
            { id: 'monitor', name: 'Sistema', icon: Monitor },
            { id: 'message-square', name: 'Mensaje', icon: MessageSquare },
            { id: 'mail', name: 'Correo', icon: Mail },
            { id: 'phone', name: 'Teléfono', icon: Phone },
            { id: 'circle-help', name: 'Ayuda', icon: CircleHelp },
            { id: 'clock', name: 'Tiempo', icon: Clock },
            { id: 'circle-check-big', name: 'Completado', icon: CircleCheckBig },
            { id: 'info', name: 'Información', icon: Info },
            { id: 'shield-alert', name: 'Seguridad', icon: ShieldAlert },
        ]
    }
];

export const ICON_OPTIONS = [
    { name: 'Logística', icon: Truck },
    { name: 'Alertas', icon: TriangleAlert },
    { name: 'Operación', icon: Package },
    { name: 'Sistema', icon: Settings },
];