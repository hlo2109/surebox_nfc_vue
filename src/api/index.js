/**
 * API barrel — módulos sin colisión de nombres.
 * `companies.api` y `services.api` exportan funciones con el mismo nombre en
 * algunos casos; impórtalos siempre desde `@/api/companies.api` o `@/api/services.api`.
 */

export * from './config';
export * from './auth.api';
export * from './nfc.api';
export * from './serviceRequests.api';
export * from './users.api';
export * from './roles.api';
export * from './location.api';
export * from './radar.api';
