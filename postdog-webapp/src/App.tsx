import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';

// Contexts
import { AppProvider } from "./context/AppContext";
import { SidebarProvider } from "./context/SidebarContext";

// Pages
import Register from "./pages/Register/Register";
import RecoveryPassword from "./pages/auth/RecoveryPassword/RecoveryPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import { DashboardPage, QuotePage, Login, OrdersPage, PickupView, ReportProblemPage, DirectionsPage, NotificationsPage, CustomNotificationsPage, GlobalAlertsPage, UsersPage, UnsubscribePage } from "./pages";

// Styles
import "./App.css";
import "./assets/styles/styles.css";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { ShippingQuoteDrawerProvider } from "./context";
import { ShipmentProvider } from "./context/CreateShipmentContext";
import { ShippingQuoteDrawer } from "./components/ShippingQuote/ShippingQuoteDrawer";
import { NotificationProvider } from "./context/NotificationContext";
import { RealTimeNotificationProvider } from "./context/RealTimeNotificationContext";

import { PushNotificationManager } from "./components/Notifications/PushNotificationManager";
import { PackagesPage } from "./pages/Settings/PackagesPage/PackagesPage";
import { ShipmentsHistoryPage } from "./pages/shipping/history/ShipmentsHistoryPage";
import { LabelsPage } from "./pages/Settings/LabelsPage/LabelsPage";
import { PricingRulesPage } from "./pages/Admin/PricingRulesPage/PricingRulesPage";
import { WalletProvider } from "./context/WalletContext";
import HelpPage from "./pages/HelpPage/HelpPage";
import NoMovementsRecorded from "./components/MovementsRecorded/MovementsRecorded";
import Billing from "./components/Billing/Billing";
import AuthGuard from "./Guard/AuthGuard";
import RoleGuard from "./Guard/RoleGuard";


const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error("La clave publicable de Stripe no está definida en el archivo .env");
}

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <AppProvider>
      <SidebarProvider>
        <NotificationProvider>
          <PushNotificationManager />
          <RealTimeNotificationProvider>
            <WalletProvider>
              <Router>
                <ShipmentProvider>
                  <ShippingQuoteDrawerProvider>
                    <Routes>
                      <Route element={<AuthGuard isPublic={true} />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/recovery-password" element={<RecoveryPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                      </Route>

                      <Route path="/unsubscribe" element={<UnsubscribePage />} />
                      
                      <Route element={<AuthGuard />}>
                        <Route path="/" element={
                          <DashboardLayout title="Inicio">
                            <DashboardPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/dashboard" element={
                          <DashboardLayout title="Inicio">
                            <DashboardPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/shipping/quote" element={
                          <DashboardLayout title="Cotizador">
                            <QuotePage />
                          </DashboardLayout>
                        } />
                        <Route path="/shipping/orders" element={
                          <DashboardLayout title="Órdenes">
                            <OrdersPage />
                          </DashboardLayout>
                        } />
                        <Route path="/shipping/pickups" element={
                          <DashboardLayout title="Recolecciones">
                            <PickupView />
                          </DashboardLayout>
                        } />
                        <Route path="/shipping/Directions" element={
                          <DashboardLayout title="Direcciones">
                            <DirectionsPage />
                          </DashboardLayout>
                        } />
                        <Route path="/shipping/history" element={
                          <DashboardLayout title="Historial de envíos">
                            <ShipmentsHistoryPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/create-report" element={
                          <DashboardLayout title="Reportar Problema">
                            <ReportProblemPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/help" element={
                          <DashboardLayout title="Ayuda">
                            <HelpPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/settings/packages" element={
                          <DashboardLayout title="Paquetes">
                            <PackagesPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/settings/labels" element={
                          <DashboardLayout title="Etiquetas">
                            <LabelsPage />
                          </DashboardLayout>
                        } />

                        <Route path="/settings/notifications" element={
                          <DashboardLayout title="Notificaciones">
                            <CustomNotificationsPage />
                          </DashboardLayout>
                        } />
  
                        <Route path="/finance/billing" element={
                          <DashboardLayout title="Facturación">
                            <Billing />
                          </DashboardLayout>
                        } />
  
                        <Route element={<RoleGuard allowedRoles={['ADMIN', 'VENDOR']} />}>
                          <Route path="/admin/pricing-rules" element={
                            <DashboardLayout title="Reglas de Precios">
                              <PricingRulesPage />
                            </DashboardLayout>
                          } />

                          <Route path="/admin/users" element={
                            <DashboardLayout title="Usuarios">
                              <UsersPage />
                            </DashboardLayout>
                          } />

                          <Route path="/admin/global-alerts" element={
                            <DashboardLayout title="Alertas Globales">
                              <GlobalAlertsPage />
                            </DashboardLayout>
                          } />
                        </Route>
  
                        <Route path="/shipping/NoMovementsRecorded" element={
                          <DashboardLayout title="Movimientos">
                            <NoMovementsRecorded />
                          </DashboardLayout>
                        } />
  
                        <Route path="/notifications" element={<NotificationsPage />} />
                      </Route>
  
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    <ShippingQuoteDrawer />
                  </ShippingQuoteDrawerProvider>
                </ShipmentProvider>
              </Router>
            </WalletProvider>
          </RealTimeNotificationProvider>
        </NotificationProvider>
      </SidebarProvider>
    </AppProvider>
  );
}

export default App;
