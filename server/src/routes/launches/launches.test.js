const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  /**
   * *Before All function
   * has to run before all of the below tests, we want to set up the mongo connection so the tests can run.
   */
  beforeAll(async () => {
    await mongoConnect();
  });

  /**
   * *After all Function
   * has to run after all to terminate the mongo connection
   */

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  /**
     * *Tests for POST methods, Complete DATA
     * first I created 3 variable in which i specified how would the data look as complete, incomplete and invalid.
     * Then I applied the actual tests in an Async function where I first describe the method .POST, which type of data should be sent, and what should JEST expect as output from this operation.
     * 
     * The test first checks that the response has a Content-Type header that includes the text json. Next, it expects the response status code to be 201, which means the request was successful and a new resource has been created on the server.

      After that, the test checks that the launch date in the response body matches the launch date in the request body. It does this by converting the dates to their respective milliseconds since the Unix epoch and comparing them with expect(responseDate).toBe(requestDate).

      Finally, the test verifies that the response body matches the launchDataWithoutDate object, which means that the created launch resource contains all the required fields except for the launchDate.
     */

  describe("Test Post /launch", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "foo",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
