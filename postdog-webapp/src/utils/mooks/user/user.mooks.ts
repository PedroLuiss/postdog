export const MOCK_USERS = Array.from({ length: 150 }, (_, i) => ({
  uid: `user-${i}`,
  firstName: `Usuario ${i}`,
  lastName: `Apellido ${i}`,
  email: `usuario${i}@postdog.com`,
  phone: '521234567890',
  isVerified: i % 3 === 0,
  role: i % 10 === 0 ? 'admin' : (i % 15 === 0 ? 'vendor' : 'user'),
  plan: i % 4 === 0 ? 'chihuahua' : (i % 4 === 1 ? 'pug' : (i % 4 === 2 ? 'husky' : 'pitbull')),
  lastShipment: i % 5 === 0 ? '2024-04-15T10:00:00Z' : null,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  isActive: i % 10 !== 0,
  balance: i * 10.5,
  totalRecharges: i * 100,
  totalCharges: i * 89.5,
  shipmentsCount: i * 2,
  ine: 'INE-12345',
  curp: 'CURP-12345678901234',
  billingData: {
    rfc: 'RFC123456789',
    businessName: 'Empresa S.A. de C.V.',
    address: 'Calle Falsa 123'
  }
}));