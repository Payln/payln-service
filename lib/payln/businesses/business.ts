import sql from "../../db/db";
import { PostgresError } from "postgres";
import { v4 as uuidv4 } from "uuid";

class Business {
  async insertBusiness(
    owner_id: number,
    name: string,
    description: string,
    websiteUrl: string,
    generalEmail: string
  ) {
    try {
      const newId = uuidv4();
      const [business]: [IBusiness?] = await sql`
        INSERT INTO businesses (
          id, owner_id, name, description, website_url, general_email
        ) VALUES (${newId}, ${owner_id}, ${name}, ${description}, ${websiteUrl}, ${generalEmail}) 
        RETURNING *;
      `;
      return business;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Insertion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async completeBusinessDetails(
    id: string,
    phoneNumber: string,
    disputeEmail: string,
    address: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
  ) {
    try {
      const [business]: [IBusiness?] = await sql`
        UPDATE businesses
        SET
          phone_number = ${phoneNumber},
          dispute_email = ${disputeEmail},
          address = ${address},
          city = ${city},
          state = ${state},
          postal_code = ${postalCode},
          country = ${country},
          completed_onboarding = TRUE,
          updated_at = ${new Date()}
        WHERE
          id = ${id}
        RETURNING *;
      `;
      return business;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Update failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async getBusiness(id: number) {
    try {
      const [business]: [IBusiness?] = await sql`
        SELECT *
        FROM businesses
        WHERE id = ${id}
        LIMIT 1;
      `;
      return business;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Query failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async getBusinessByOwner(ownerID: number) {
    try {
      const businesses: IBusiness[] = await sql`
        SELECT *
        FROM businesses
        WHERE owner_id = ${ownerID};
      `;
      return businesses;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Query failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async updateBusiness(
    id: string,
    name: string | null = null,
    description: string | null = null,
    generalEmail: string | null = null,
    websiteUrl: string | null = null,
    phoneNumber: string | null = null,
    disputeEmail: string | null = null,
    address: string | null = null,
    city: string | null = null,
    state: string | null = null,
    postalCode: string | null = null,
    country: string | null = null
  ) {
    try {
      const [business]: [IBusiness?] = await sql`
        UPDATE businesses
        SET
          name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          website_url = COALESCE(${websiteUrl}, website_url),
          general_email = COALESCE(${generalEmail}, general_email),
          phone_number = COALESCE(${phoneNumber}, phone_number),
          dispute_email = COALESCE(${disputeEmail}, dispute_email),
          address = COALESCE(${address}, address),
          city = COALESCE(${city}, city),
          state = COALESCE(${state}, state),
          postal_code = COALESCE(${postalCode}, postal_code),
          country = COALESCE(${country}, country),
          updated_at = ${new Date()}
        WHERE
          id = ${id}
        RETURNING *;
      `;
      return business;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Update failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async deleteBusiness(id: number) {
    try {
      await sql`
        DELETE FROM businesses
        WHERE
          id = ${id};
      `;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Deletion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }
}

const businessClass = new Business();

export default businessClass;