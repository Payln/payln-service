import { PostgresError } from "postgres";
import sql from "../../db/db";
import { hashedPassword } from "../../utils/password";

class User {
  async createUser({ firstName, lastName, email, password }: CreateUserParams) {
    try {
      const hp = await hashedPassword(password);

      const [user]: [IUser?] = await sql`
        INSERT INTO users (
          first_name, last_name, email, hashed_password
        ) VALUES (${firstName}, ${lastName}, ${email}, ${hp}) 
        RETURNING *;
      `;
      return user;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`insertion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  scrubUserData(user: IUser) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified
    };
  }

  async getUser(id: number) {
    try {
      const [user]: [IUser?] = await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1;
    `;
      return user;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`insertion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async updateUser(
    id: number,
    email: string | null = null,
    firstName: string | null = null,
    lastName: string | null = null,
    hashed_password: string | null = null,
    is_email_verified: boolean | null = null,
    is_active: boolean | null = null,
    password_changed_at: Date | null = null
  ) {
    try {
      const [user]: [IUser?] = await sql`
      UPDATE users
      SET
        hashed_password = COALESCE(${hashed_password}, hashed_password),
        password_changed_at = COALESCE(${password_changed_at}, password_changed_at),
        first_name = COALESCE(${firstName}, first_name),
        last_name = COALESCE(${lastName}, last_name),
        email = COALESCE(${email}, email),
        is_email_verified = COALESCE(${is_email_verified}, is_email_verified),
        is_active = COALESCE(${is_active}, is_active)
      WHERE
        id = ${id} OR email = ${email}
      RETURNING *;
    `;
      return user;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`insertion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

}

const userClass = new User();

export default userClass;