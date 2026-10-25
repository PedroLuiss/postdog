import React from 'react';
import { UserPlus } from 'lucide-react';
import styles from './UsersPage.module.scss';
import {
    AccountDetailsModal, BillingDetailsModal, BulkActionsBar,
    IndividualNotificationModal, MovementsModal, UserFilters, UserModal,
    UserStats, UserTable
} from '../../../components/Users';
import { useUsersPage } from './hooks/useUsersPage';
import { AlertDialogUi } from '../../../components/ui/AlertDialogUi/AlertDialogUi';
import SelectUi from '../../../components/ui/SelectUi/SelectUi';

export const UsersPage = () => {
    const {
        users, stats, isFetchingMore, totalItems,
        searchTerm, setSearchTerm, filters, handleFilterChange, clearFilters,
        selectedUserIds, toggleUserSelection, selectAllUsers,
        isModalOpen, setIsModalOpen,
        activeModal, setActiveModal, selectedUser,
        handleLoadMore, handleAction, handleBulkAction, handleConfirmBulkAction, handleDeleteUser, handleResetPassword, handleToggleStatus,
        handleUserCreated, handleUserUpdated,
        bulkValue, setBulkValue, loading, isVendor, handleSort, isLoading, loadingStats
    } = useUsersPage();

    const isBulk = selectedUserIds.length > 0 && activeModal !== 'movements' && activeModal !== 'edit' && activeModal !== 'billing';

    return (
        <div className={styles['users-page']}>

            <UserStats stats={stats} loading={loadingStats} />

            <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
                totalItems={users.length}
            />

            <UserTable
                users={users}
                selectedUserIds={selectedUserIds}
                onToggleSelect={toggleUserSelection}
                onSelectAll={selectAllUsers}
                onAction={handleAction}
                isFetchingMore={isFetchingMore}
                onLoadMore={handleLoadMore}
                hasMore={users.length < totalItems}
                isVendor={isVendor}
                loading={loading}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={handleSort}
            />

            {!isVendor && (
                <div className={styles['users-page__footer']}>
                    <button className={styles['users-page__btn-add']} onClick={() => setIsModalOpen(true)}>
                        <UserPlus />
                        Agregar usuario
                    </button>
                </div>
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmitSuccess={handleUserCreated}
            />

            {selectedUser && !isBulk && (
                <>
                    <MovementsModal
                        isOpen={activeModal === 'movements'}
                        onClose={() => setActiveModal(null)}
                        user={selectedUser}
                    />

                    <AccountDetailsModal
                        isOpen={activeModal === 'edit'}
                        onClose={() => setActiveModal(null)}
                        user={selectedUser}
                        isVendor={isVendor}
                        onUpdateSuccess={handleUserUpdated}
                    />

                    <BillingDetailsModal
                        isOpen={activeModal === 'billing'}
                        onClose={() => setActiveModal(null)}
                        user={selectedUser}
                    />

                    <IndividualNotificationModal
                        isOpen={activeModal === 'notify'}
                        onClose={() => setActiveModal(null)}
                        user={selectedUser}
                    />

                    {/* <AlertDialogUi
                        isOpen={activeModal === 'delete'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleDeleteUser}
                        isLoading={isLoading}
                        title="Eliminar Usuario"
                        description={`¿Estás seguro de que deseas eliminar permanentemente a ${selectedUser.firstName}? Esta acción no se puede deshacer y solo es permitida si el saldo es $0.`}
                        confirmLabel="Eliminar permanentemente"
                    /> */}

                    <AlertDialogUi
                        isOpen={activeModal === 'activate'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleToggleStatus}
                        isLoading={isLoading}
                        title="Activar Usuario"
                        description={`¿Estás seguro de que deseas activar a ${selectedUser.firstName}? El usuario podrá acceder al sistema nuevamente.`}
                        confirmLabel="Activar"
                    />

                    <AlertDialogUi
                        isOpen={activeModal === 'deactivate'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleToggleStatus}
                        isLoading={isLoading}
                        title="Desactivar Usuario"
                        description={`El usuario ${selectedUser.firstName} no podrá iniciar sesión hasta que sea activado nuevamente.`}
                        confirmLabel="Desactivar"
                    />

                    <AlertDialogUi
                        isOpen={activeModal === 'reset-pwd'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleResetPassword}
                        isLoading={isLoading}
                        title="Restablecer Contraseña"
                        description={`Se enviará un correo de recuperación a ${selectedUser.email}.`}
                        confirmLabel="Enviar correo"
                    />
                </>
            )}

            {isBulk && (
                <>
                    <AlertDialogUi
                        isOpen={activeModal === 'change-role'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        title="Cambiar Rol de Usuarios"
                        description={`Selecciona el nuevo rol para los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados.`}
                        confirmLabel="Cambiar Rol"
                        disabledConfirm={!bulkValue}
                    >
                        <SelectUi
                            name="bulk-role"
                            value={bulkValue}
                            onChange={(e) => setBulkValue(e.target.value.toString())}
                            options={[
                                { value: 'admin', label: 'Administrador' },
                                { value: 'user', label: 'Usuario' },
                                { value: 'vendor', label: 'Vendor' },
                            ]}
                            placeholder="Seleccionar rol"
                        />
                    </AlertDialogUi>

                    <AlertDialogUi
                        isOpen={activeModal === 'change-plan'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        title="Cambiar Plan de Usuarios"
                        description={`Selecciona el nuevo plan para los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados.`}
                        confirmLabel="Cambiar Plan"
                        disabledConfirm={!bulkValue}
                    >
                        <SelectUi
                            name="bulk-plan"
                            value={bulkValue}
                            onChange={(e) => setBulkValue(e.target.value.toString())}
                            options={[
                                { value: 'chihuahua', label: 'Chihuahua' },
                                { value: 'pug', label: 'Pug' },
                                { value: 'husky', label: 'Husky' },
                                { value: 'pitbull', label: 'Pitbull' },
                            ]}
                            placeholder="Seleccionar plan"
                        />
                    </AlertDialogUi>

                    <IndividualNotificationModal
                        isOpen={activeModal === 'notify'}
                        onClose={() => setActiveModal(null)}
                        user={selectedUser}
                        userIds={selectedUserIds}
                    />

                    <AlertDialogUi
                        isOpen={activeModal === 'activate'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        isLoading={isLoading}
                        title="Activar Usuarios"
                        description={`¿Estás seguro de que deseas activar a los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados?`}
                        confirmLabel="Activar"
                    />

                    <AlertDialogUi
                        isOpen={activeModal === 'deactivate'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        title="Desactivar Usuarios"
                        description={`¿Estás seguro de que deseas desactivar a los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados?`}
                        confirmLabel="Desactivar"
                    />

                    <AlertDialogUi
                        isOpen={activeModal === 'reset-pwd'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        title="Restablecer Contraseñas"
                        description={`Se enviará un correo de recuperación a los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados.`}
                        confirmLabel="Restablecer"
                    />

                    {/* <AlertDialogUi
                        isOpen={activeModal === 'delete'}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleConfirmBulkAction}
                        title="Eliminar Usuarios"
                        description={`¿Estás seguro de que deseas eliminar permanentemente a los ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'usuario' : 'usuarios'} seleccionados? Esta acción no se puede deshacer.`}
                        confirmLabel="Eliminar"
                    /> */}
                </>
            )}

            {!isVendor && (
                <BulkActionsBar
                    selectedCount={selectedUserIds.length}
                    onAction={handleBulkAction}
                    onCancel={() => selectAllUsers(false)}
                />
            )}
        </div>
    );
};
