Feature: Stoic Themes
  As a user interested in Stoic philosophy
  I want to explore the core Stoic themes
  So that I can understand key principles and their modern applications

  Scenario: View all themes
    Given I am on the themes page
    Then I should see exactly 7 themes
    And I should see "Dichotomy of Control"
    And I should see "Amor Fati"
    And I should see "Memento Mori"

  Scenario: View theme scientific connections
    Given I am on the themes page
    Then each theme should show scientific connections
    And each theme should show CBT connections
    And each theme should show neuroscience connections
    And each theme should show psychology connections
