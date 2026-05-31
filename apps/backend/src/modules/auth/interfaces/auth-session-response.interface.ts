export type AuthRole =
  | 'CUSTOMER'
  | 'STAFF'
  | 'MANAGER'
  | 'SUPER_ADMIN'
  | 'CONTENT_EDITOR'
  | 'ORDER_MANAGER';

export interface AuthSessionResponse {
  id: string;
  firebaseUid: string;
  phoneNumber: string;
  fullName: string;
  role: AuthRole;
}
