interface Business {
  id: string;
  name: string;
  about: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  website_url: string;
  profile_image_url: string;
  hashed_password: string;
  password_changed_at: Date;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_email_verified: boolean;
}

