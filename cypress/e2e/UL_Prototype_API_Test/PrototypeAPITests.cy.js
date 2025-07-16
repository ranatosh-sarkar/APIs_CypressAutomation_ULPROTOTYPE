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

  it("Complete Request Chaining", () => {

    // Step 1: POST /addRegister
    cy.log("🚀 POST /addRegister");
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addRegister`,
      headers: { "Content-Type": "application/json" },
      body: { contact, firstName, lastName, email, password },
      timeout: 90000
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.contact).to.eq(contact);
    });

    cy.wait(3000);

    // Step 2: GET /registerByContact
    const registerByContactNumber = 6087654321;
    cy.log("📞 GET /registerByContact");
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registerByContact`,
      qs: { contact: registerByContactNumber }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.contact).to.eq(registerByContactNumber);
    });

    cy.wait(3000);

    // Step 3: GET /registers
    cy.log("📚 GET /registers");
    cy.request("GET", `${Cypress.config().baseUrl}/registers`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.some(u => u.contact === contact)).to.be.true;
    });

    cy.wait(3000);

    // Step 4: POST /addApplication
    cy.log("📄 POST /addApplication");
    cy.request("POST", `${Cypress.config().baseUrl}/addApplication`, {
      contact, password, accounttype, country, socialid
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.socialid).to.eq(socialid);
    });

    cy.wait(3000);

    // Step 5: GET /applicationByContact
    cy.log("🔍 GET /applicationByContact");
    cy.request("GET", `${Cypress.config().baseUrl}/applicationByContact/${contact}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.contact).to.eq(contact);
    });

    cy.wait(3000);

    // Step 6: GET /applications
    cy.log("📂 GET /applications");
    cy.request("GET", `${Cypress.config().baseUrl}/applications`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.find(app => app.contact === contact)).to.exist;
    });

    cy.wait(3000);

    // Step 7: POST /kycDataCapture
    cy.log("📝 POST /kycDataCapture");
    cy.request("POST", `${Cypress.config().baseUrl}/kycDataCapture`, {
      contact, password, socialid, annualincome, taxid, drivinglicence, passportnumber, occupation, ongoingloans
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.taxid).to.eq(taxid);
    });

    cy.wait(3000);

    // Step 8: POST /kycVerification
    cy.log("🔐 POST /kycVerification");
    cy.request("POST", `${Cypress.config().baseUrl}/kycVerification`, {
      contact, password, socialid, annualincome, taxid, drivinglicence, passportnumber, occupation, ongoingloans
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.kycstatus).to.eq("ACTIVE");
    });

    cy.wait(3000);

    // Step 9: POST /deposit
    cy.log("💰 POST /deposit");
    cy.request("POST", `${Cypress.config().baseUrl}/deposit`, {
      contact, password, amount: 1000.00
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.txntype).to.eq("DEPOSIT");
    });

    cy.wait(3000);

    // Step 10: POST /withdraw
    cy.log("🏧 POST /withdraw");
    cy.request("POST", `${Cypress.config().baseUrl}/withdraw`, {
      contact, password, amount: 2000.00
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.txntype).to.eq("WITHDRAW");
    });

    cy.wait(3000);

    // Step 11: POST /transferFund
    cy.log("🔁 POST /transferFund");
    cy.request("POST", `${Cypress.config().baseUrl}/transferFund/6087654321`, {
      contact, password, amount: 500.00
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.txntype).to.eq("TRANSFER_IN");
    });

    cy.wait(3000);

    // Step 12: GET /displayStatement + Schema Validation
    cy.log("📜 GET /displayStatement");
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

    cy.request("GET", `${Cypress.config().baseUrl}/displayStatement/${contact}?password=${password}`).then((res) => {
      expect(res.status).to.eq(200);
      const validate = ajv.compile(schema);
      expect(validate(res.body)).to.be.true;
    });
  });
});
