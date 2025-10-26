Feature: Home Page
  As a user interested in Stoic philosophy
  I want to view a random quote and navigate to different sections
  So that I can explore Stoic wisdom

  Scenario: View home page
    Given I am on the home page
    Then I should see the page title "Stoic Wisdom"
    And I should see a quote displayed
    And I should see navigation links

  Scenario: Get a new random quote
    Given I am on the home page
    And I see the initial quote
    When I click the "New Quote" button
    Then I should see a different quote

  Scenario: Navigate to philosophers page
    Given I am on the home page
    When I click on the "Philosophers" link
    Then I should be on the philosophers page
    And I should see a list of philosophers

  Scenario: Navigate to quotes page
    Given I am on the home page
    When I click on the "Quotes" link
    Then I should be on the quotes page
    And I should see a list of quotes

  Scenario: Navigate to themes page
    Given I am on the home page
    When I click on the "Themes" link
    Then I should be on the themes page
    And I should see a list of themes

  Scenario: Navigate to timeline page
    Given I am on the home page
    When I click on the "Timeline" link
    Then I should be on the timeline page
    And I should see historical events
