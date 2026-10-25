import { AdminUserResponse, UserUI } from '../../types';

export const mapAdminUserToUI = (user: AdminUserResponse): UserUI => {
    return {
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number,
        createdAt: user.created_at,
        isActive: user.status?.name === 'active',
        role: user.role_id?.toLowerCase() || '-------',
        plan: user.plan?.toLowerCase() || '--------',
        lastShipment: user.lastActivity,
        documents: user.documents || []
    };
};

export const mapAdminUsersToUI = (users: AdminUserResponse[]): UserUI[] => {
    return users.map(mapAdminUserToUI);
};
