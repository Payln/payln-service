/* eslint-disable @typescript-eslint/no-explicit-any */
interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  hashed_password: string;
  password_changed_at: Date;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_email_verified: boolean;
}

interface IBusiness {
  id: string;
  owner_id: number;
  name: string;
  description: string;
  general_email: string;
  dispute_email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  website_url: string;
  profile_image_url: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UpdateUserParams {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  hashed_password: string;
  is_email_verified?: boolean;
  is_active?: boolean;
  password_changed_at?: Date;
}

interface CreateSessionTokenParams {
  user_id: number;
  token: string;
  scope: string;
  expires_at: Date;
  extra_details?: Record<string, any>;
}

interface ISessionToken {
  id: string;
  user_id: number;
  token: string;
  scope: string;
  is_blocked: boolean;
  extra_details: Record<string, any>;
  expires_at: Date;
  created_at: Date;
}

interface CheckSessionResult {
  session_exists: boolean;
}

interface EmailVerificationQueueParams {
  userId: number;
  userFirstName: string;
  userEmailAddr: string;
}

interface DeleteSessionTokenParams {
  sessionTokenId: string
}