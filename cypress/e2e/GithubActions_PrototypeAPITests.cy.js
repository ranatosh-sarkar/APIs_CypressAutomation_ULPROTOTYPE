describe('✅ Smoke Test: GET /registers API', () => {
  it('should return 200 OK and valid data', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/UL_SavingsAccount-API_prototype/registers`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })
})

/*
// Commenting full chaining logic temporarily
describe('Testing ALL APIs: Demonstrating API Request Chaining', () => {
  it('Request Chaining all APIs', () => {
    // Full chain removed for testing basic API first
  })
})
