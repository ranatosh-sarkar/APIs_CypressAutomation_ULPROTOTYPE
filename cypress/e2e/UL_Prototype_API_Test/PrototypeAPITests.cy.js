describe("Testing ALL APIs: Demonstrating API Request Chaining", () => {

  const generate10DigitContact = () => Math.floor(1000000000 + Math.random() * 9000000000);
  const generate3Digit = () => Math.floor(100 + Math.random() * 900);
  const randomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const contact = generate10DigitContact();
  const firstName = randomString(3);
  const lastName = randomString(3);
  const email = `${firstName}.${lastName}@example.com`;
  const password = randomString(6);
  const applicationstatus = "PENDING";
  const country = randomString(3);
  const socialid = generate3Digit() + lastName + country;
  const accounttype = "SAVINGS";
  const annualincome = "58000";
  const drivinglicence = "DL-" + socialid;
  const occupation = "Engineer";
  const ongoingloans = "0";
  const passportnumber = "P" + socialid;
  const taxid = "TAX" + socialid;

  it("Request Chaining all APIs", () => {
    cy.log("🚀 POST /addRegister");

    const requestBody_addRegister = { contact, firstName, lastName, email, password };

    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addRegister`,
      headers: { "Content-Type": "application/json" },
      body: requestBody_addRegister,
      failOnStatusCode: false,
      timeout: 90000
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.include(requestBody_addRegister);
      cy.log("✅ /addRegister passed");
    });

    cy.wait(3000);

    // Step 2
    cy.log("📞 GET /registerByContact");
    const knownContact = 6087654321;
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registerByContact`,
      qs: { contact: knownContact }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        contact: knownContact,
        firstName: "Alan",
        lastName: "Collins",
        email: "alan.collins@example.com"
      });
    });

    cy.wait(3000);

    // Step 3
    cy.log("📄 GET /registers");
    cy.request(`${Cypress.config().baseUrl}/registers`).then((res) => {
      expect(res.status).to.eq(200);
      const match = res.body.find(u => u.contact === contact);
      expect(match).to.exist;
      expect(match.email).to.eq(email);
    });

    cy.wait(3000);

    // Step 4
    cy.log("📝 POST /addApplication");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addApplication`,
      body: { contact, password, accounttype, country, socialid }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, accounttype, country, socialid, applicationstatus });
      expect(res.body.password).to.be.null;
    });

    cy.wait(3000);

    // Step 5
    cy.log("🔍 GET /applicationByContact");
    cy.request(`${Cypress.config().baseUrl}/applicationByContact/${contact}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, country, socialid, applicationstatus });
    });

    cy.wait(3000);

    // Step 6
    cy.log("📋 GET /applications");
    cy.request(`${Cypress.config().baseUrl}/applications`).then((res) => {
      expect(res.status).to.eq(200);
      const found = res.body.find(app => app.contact === contact);
      expect(found).to.exist;
      expect(found.socialid).to.eq(socialid);
    });

    cy.wait(3000);

    // Step 7
    cy.log("🧾 POST /kycDataCapture");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/kycDataCapture`,
      body: { contact, password, socialid, annualincome, taxid, drivinglicence, passportnumber, occupation, ongoingloans }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, password, socialid, annualincome });
    });

    cy.wait(3000);

    // Step 8
    cy.log("✔️ POST /kycVerification");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/kycVerification`,
      body: { contact, password, socialid, annualincome, taxid, drivinglicence, passportnumber, occupation, ongoingloans }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact,
        firstName,
        lastName,
        email,
        socialid,
        applicationstatus: "ACTIVE",
        balance: "2000.0",
        kycstatus: "ACTIVE"
      });
    });

    cy.wait(3000);

    // Step 9
    cy.log("💵 POST /deposit");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/deposit`,
      body: { contact, password, amount: 1000.0 }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, txntype: "DEPOSIT", amount: 1000.0 });
    });

    cy.wait(3000);

    // Step 10
    cy.log("🏧 POST /withdraw");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/withdraw`,
      body: { contact, password, amount: 2000.0 }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, txntype: "WITHDRAW", amount: 2000.0 });
    });

    cy.wait(3000);

    // Step 11
    cy.log("🔁 POST /transferFund");
    const recipientContact = 6087654321;
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/transferFund/${recipientContact}`,
      body: { contact, password, amount: 500.0 }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact: recipientContact, txntype: "TRANSFER_IN", amount: 500.0 });
    });

    cy.wait(3000);

    // Step 12
    cy.log("🧾 GET /displayStatement with schema validation");
    const Ajv = require("ajv");
    const ajv = new Ajv();
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "array",
      items: {
        type: "object",
        required: ["id", "contact", "txntype", "amount", "balanceAfter", "txnTime", "password"],
        properties: {
          id: { type: "number" },
          contact: { type: "number" },
          txntype: { type: "string" },
          amount: { type: "number" },
          balanceAfter: { type: "number" },
          txnTime: { type: "string" },
          password: {}
        }
      }
    };

    cy.request(`${Cypress.config().baseUrl}/displayStatement/${contact}?password=${password}`)
      .then((res) => {
        expect(res.status).to.eq(200);
        const valid = ajv.validate(schema, res.body);
        if (!valid) {
          console.error("Schema errors:", ajv.errors);
        }
        expect(valid).to.be.true;
      });
  });
});
