import { Bell, CheckCircle, Info, TriangleAlert, Star, User, Settings, Mail, Package, Truck } from 'lucide-react';

export const NOTIFICATION_ICON_CATEGORIES = [
    {
        name: 'General',
        icons: [
            { id: 'bell', name: 'Notificación', icon: Bell },
            { id: 'info', name: 'Información', icon: Info },
            { id: 'star', name: 'Destacado', icon: Star },
            { id: 'user', name: 'Usuario', icon: User },
        ]
    },
    {
        name: 'Estado',
        icons: [
            { id: 'check-circle', name: 'Éxito', icon: CheckCircle },
            { id: 'alert-triangle', name: 'Alerta', icon: TriangleAlert },
            { id: 'settings', name: 'Ajustes', icon: Settings },
            { id: 'mail', name: 'Correo', icon: Mail },
        ]
    },
    {
        name: 'Servicio',
        icons: [
            { id: 'package', name: 'Paquete', icon: Package },
            { id: 'truck', name: 'Envío', icon: Truck },
        ]
    }
];
