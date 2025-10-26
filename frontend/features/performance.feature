Feature: Performance
  As a user of the application
  I want pages to load quickly
  So that I have a smooth browsing experience

  @performance
  Scenario: Home page loads quickly
    Given I measure page load time
    When I navigate to the home page
    Then the page should load in under 3 seconds

  @performance
  Scenario: API responses are fast
    Given I am on the home page
    When I request a new random quote
    Then the API should respond in under 500 milliseconds

  @performance
  Scenario: Navigation is responsive
    Given I am on the home page
    When I navigate to different pages
    Then each page transition should complete in under 2 seconds
