describe('Build', function() {
  it('Login and Upload manifest and build', function() {
    cy.visit('http://localhost:8080/login')
    cy.get(':nth-child(1) > .col > .input-group > .form-control').click().type('admin@build.com')
    .should('have.value', 'admin@build.com')
    cy.get(':nth-child(2) > .col > .input-group > .form-control').click().type('toto42')
    .should('have.value', 'toto42')
    cy.get('.custom-button').click() // button login
    cy.url().should('include', '/builds')
    cy.visit('http://localhost:8080/builds')
    cy.get(':nth-child(3) > .nav-link').click() // button createManifest
    cy.get('#name').click().type('readlinetest').should('have.value', 'readlinetest')
    cy.wait(5000)
    cy.readFile('cypress/fixtures/readline.py').then(text => cy.get('[style="top:18px;height:18px;"]').type(text, { delay: 0 }))
    cy.wait(500)
    cy.get('.custom-button').click()
    cy.contains('Manifest successfully created')
    cy.get(':nth-child(2) > .nav-link').click()
    cy.get('.form-control').click().type('readline.py').should('have.value', 'readline.py')
    cy.wait(500)
    cy.get('kbd').click() // click on readline.py
    cy.get(':nth-child(6) > [href="#"]').click() // click on build icon
    cy.contains('Build successfully created')
    cy.get(':nth-child(1) > .nav-link').click() // click on build button top right
    cy.url().should('include', '/builds')
    cy.get(':nth-child(1) > :nth-child(2) > a > kbd').click() // click on build #100
    cy.contains('finished', {timeout: 120000 })
    cy.contains('Done!')
  })
})