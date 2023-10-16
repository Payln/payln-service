/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomEmail, randomProfileImgUrl, randomString } from "../lib/utils/random";
import request from "supertest";
import { Payln } from "../lib/payln/app";
import { configs } from "../lib/utils/config";
import sql from "../lib/db/db";

const testPayln: Payln = new Payln(configs);

describe("Test business routes", () => {
  it("should test create business route", async () => {
    const newBiz = {
      name: randomString(10),
      description: randomString(12),
      email: randomEmail(),
      profile_image_url: randomProfileImgUrl(),
      password: randomString(20),
    };

    // console.log(newBiz);

    // const res = await request(testPayln.app)
    //   .post("/api/v1/business")
    //   .send(newBiz);
    // console.log(res.body);
    // const { data: { result: { business } } } = res.body;

    // expect(res.statusCode).toEqual(201);
    // expect(business.about).toEqual(newBiz.description);
    // expect(business.email).toEqual(newBiz.email);
    // expect(business.profile_image_url).toEqual(newBiz.profile_image_url);
    // expect(business.hashed_password).toEqual(newBiz.password);

    sql.end();
  });
});