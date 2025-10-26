Feature: Philosophers Page
  As a user interested in Stoic philosophy
  I want to view and explore the three great Stoic philosophers
  So that I can learn about their lives and teachings

  Scenario: View all philosophers
    Given I am on the philosophers page
    Then I should see exactly 3 philosophers
    And I should see "Marcus Aurelius"
    And I should see "Seneca"
    And I should see "Epictetus"

  Scenario: View philosopher details
    Given I am on the philosophers page
    When I click on "Marcus Aurelius"
    Then I should see the philosopher details page
    And I should see the biography
    And I should see key works
    And I should see core teachings

  Scenario: View philosopher quotes
    Given I am viewing "Marcus Aurelius" details
    Then I should see quotes from "Marcus Aurelius"
    And I should see at least 10 quotes
