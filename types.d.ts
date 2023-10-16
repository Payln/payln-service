interface User {
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

interface Business {
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
