describe("Testing ALL APIs: Demonstrating API Request Chaining", () => {
  const contact = 7654646957;
  const firstName = "KISS";
  const lastName = "KASS";
  const email = "kiss.kass@example.com";
  const password = "kass123";

  it("Fix POST /addRegister request", () => {
    const requestBody_addRegister = {
      contact,
      firstName,
      lastName,
      email,
      password
    };

    cy.log("Posting to /addRegister...");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addRegister`,
      headers: {
        "Content-Type": "application/json"
      },
      body: requestBody_addRegister,
      failOnStatusCode: false
    }).then((response) => {
      cy.log("Status: " + response.status);
      cy.log("Body: " + JSON.stringify(response.body));

      expect(response.status).to.eq(200);
      expect(response.body.contact).to.eq(contact);
      expect(response.body.firstName).to.eq(firstName);
      expect(response.body.lastName).to.eq(lastName);
      expect(response.body.email).to.eq(email);
      expect(response.body.password).to.eq(password);
    });
  });
});
