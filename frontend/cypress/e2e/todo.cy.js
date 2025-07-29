
describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Login with valid credentials and manage todos', () => {
    cy.get('[data-cy=email]').type('test@test.com');
    cy.get('[data-cy=password]').type('123456');
    cy.get('[data-cy=login]').click();
    cy.contains('Your Todos');

    cy.get('[data-cy=new-todo]').type('Buy milk');
    cy.get('[data-cy=add-button]').click();
    cy.contains('Buy milk');

    cy.get('[data-cy=delete-button]').click();
    cy.contains('Buy milk').should('not.exist');
  });

  it('Login with invalid credentials', () => {
    cy.get('[data-cy=email]').type('wrong@test.com');
    cy.get('[data-cy=password]').type('wrong');
    cy.get('[data-cy=login]').click();
    cy.contains('Your Todos').should('not.exist');
  });
});
