Feature: Quotes Page
  As a user interested in Stoic philosophy
  I want to browse and search through quotes
  So that I can find wisdom relevant to my needs

  Scenario: View all quotes
    Given I am on the quotes page
    Then I should see a list of quotes
    And I should see at least 20 quotes
    And each quote should show the philosopher name
    And each quote should show the source

  Scenario: Search quotes
    Given I am on the quotes page
    When I search for "control"
    Then I should see filtered results
    And the results should contain "control" in the text

  Scenario: View quote details
    Given I am on the quotes page
    Then I should see the modern interpretation
    And I should see the context
