import { test, expect } from "@playwright/test";

test("should get list of users from API", async ({ request }) => {
  // Send GET request to the API
  const response = await request.get("https://reqres.in/api/users?page=1");

  // Verify status code
  expect(response.status()).toBe(200);

  // Verify response body
  const body = await response.json();

  expect(body.page).toBe(1);
  expect(body.data).toHaveLength(6);
  expect(body.data[0]).toHaveProperty("email");

  // Print response for debugging
  console.log("Response:", JSON.stringify(body, null, 2));
});

test("GET - Read a single user", async ({ request }) => {
  // Send GET request
  const response = await request.get("https://reqres.in/api/users/2");

  // Verify status
  expect(response.status()).toBe(200);

  // Verify response structure
  const body = await response.json();

  expect(body.data.id).toBe(2);
  expect(body.data.email).toBeTruthy();
  expect(body.data.first_name).toBeTruthy();
  expect(body.data.last_name).toBeTruthy();

  // Print the user
  console.log(`User: ${body.data.first_name} ${body.data.last_name}`);
});

test("POST - Create a new user", async ({ request }) => {
  // Prepare request body (the data we want to send)
  const newUser = {
    name: "Akila Samaranayake",
    job: "Senior SDET Engineer",
  };

  // Send POST request with body
  const response = await request.post("https://reqres.in/api/users", {
    data: newUser,
  });

  // Verify status (201 = Created)
  expect(response.status()).toBe(201);

  // Verify response contains our data PLUS generated fields
  const body = await response.json();
  expect(body.name).toBe("Akila Samaranayake");
  expect(body.job).toBe("Senior SDET Engineer");
  expect(body.id).toBeTruthy();
  // Server generates ID
  expect(body.createdAt).toBeTruthy();
  // Server generates timestamp
  console.log(`Created user with ID: ${body.id}`);
});

test("PUT - Update user (full replacement)", async ({ request }) => {
  const updatedUser = {
    name: "Akila Updated",
    job: "Lead SDET Engineer", // Promotion!
  };

  const response = await request.put("/api/users/2", {
    data: updatedUser,
  });

  // Verify status (200 = OK)
  expect(response.status()).toBe(200);

  const body = await response.json();

  // Verify updated data
  expect(body.name).toBe("Akila Updated");
  expect(body.job).toBe("Lead SDET Engineer");

  // Server records update time
  expect(body.updatedAt).toBeTruthy();

  console.log(`Updated at: ${body.updatedAt}`);
});


test("PATCH - Partially update user", async ({ request }) => {
  // Only update the job, keep everything else the same
  const partialUpdate = {
    job: "QA Architect", // Only changing this field
  };

  const response = await request.patch("https://reqres.in/api/users/2", {
    data: partialUpdate,
  });

  // Verify status
  expect(response.status()).toBe(200);

  const body = await response.json();

  // Verify updated field
  expect(body.job).toBe("QA Architect");

  // Verify update timestamp exists
  expect(body.updatedAt).toBeTruthy();
});

test("DELETE - Remove a user", async ({ request }) => {
  const response = await request.delete("/api/users/2");

  // Verify status (204 = No Content - successfully deleted)
  expect(response.status()).toBe(204);

  // DELETE request successfully completed.
  // Response body is empty.
});


test("complete API validation example", async ({ request }) => {
  // Arrange
  const userId = 2;

  // Act
  const response = await request.get(`/api/users/${userId}`);

  // Assert - Level 1: Status
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  // Assert - Level 2: Structure
  const body = await response.json();

  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("id");
  expect(body.data).toHaveProperty("email");
  expect(body.data).toHaveProperty("first_name");
  expect(body.data).toHaveProperty("last_name");

  // Assert - Level 3: Values
  expect(body.data.id).toBe(userId);
  expect(body.data.email).toContain("@");
  expect(body.data.first_name).toBeTruthy();

  // Assert - Level 4: Business Logic
  expect(typeof body.data.id).toBe("number");
  expect(body.data.id).toBeGreaterThan(0);

  // Assert - Headers
  expect(response.headers()["content-type"]).toContain(
    "application/json"
  );
});


