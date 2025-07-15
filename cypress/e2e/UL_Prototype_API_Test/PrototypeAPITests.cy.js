describe("Testing ALL APIs: Demonstrating API Request Chaining", () => {
  // const contact = 3246876957;
  // const firstName = "HR";
  // const lastName = "RH";
  // const email = "hr@example.com";
  // const password = "hr123";

it("Fix POST /addRegister request", () => {
  const requestBody_addRegister = {
    contact: 3246876957,
    firstName: "HR",
    lastName: "RH",
    email: "hr.rh@example.com",
    password: "hr123"
  };

  cy.log("🚀 POST /addRegister with extended timeout...");
  cy.request({
    method: "POST",
    url: `${Cypress.config().baseUrl}/addRegister`,
    headers: {
      "Content-Type": "application/json"
    },
    body: requestBody_addRegister,
    timeout: 90000, // 90 seconds
    failOnStatusCode: false
  }).then((response) => {
    cy.log("✅ Status: " + response.status);
    cy.log("📦 Body: " + JSON.stringify(response.body));

    expect(response.status).to.eq(200);
    expect(response.body.contact).to.eq(requestBody_addRegister.contact);
    expect(response.body.firstName).to.eq(requestBody_addRegister.firstName);
    expect(response.body.lastName).to.eq(requestBody_addRegister.lastName);
    expect(response.body.email).to.eq(requestBody_addRegister.email);
  }).catch((err) => {
    cy.log("❌ POST failed: " + JSON.stringify(err));
    throw err;
  });
});
});
