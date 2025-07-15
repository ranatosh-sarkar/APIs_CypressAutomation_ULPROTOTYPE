describe("Testing ALL APIs: Demonstrating API Request Chaining", () => {
  // const contact = 7654646957;
  // const firstName = "KISS";
  // const lastName = "KASS";
  // const email = "kiss.kass@example.com";
  // const password = "kass123";

it("Fix POST /addRegister request", () => {
  const requestBody_addRegister = {
    contact: 7654646957,
    firstName: "KISS",
    lastName: "KASS",
    email: "kiss.kass@example.com",
    password: "kass123"
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
