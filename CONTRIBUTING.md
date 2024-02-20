# Contributing to Blackjack-Is-Fun

### Table of Content

-   [Welcome](#welcome)
-   [Code of Conduct](#code-of-conduct)
-   [Environment Details](#environment-details)
-   [How Can I Contribute?](#how-can-i-contribute)
    -   [Submitting an Issue](#submitting-an-issue)
    -   [Your First Contribution](#your-first-contribution)
    -   [Making a Pull Request](#making-a-pull-request)
-   [Styleguides](#styleguides)
    -   [Git Commit Messages](#git-commit-messages)
    -   [Git Branch Naming](#git-branch-naming)
    -   [Pull Requests](#pull-requests)
    -   [Issues](#issues)

## Welcome

🎉 Welcome to the Black Jack Is Fun project! We're thrilled that you're considering contributing to our repository. Before you get started, please take a moment to read through this guide to understand how you can contribute effectively and make the most out of your involvement.

## Code of Conduct

This project and everyone participating in it is governed by the
[blackjack-is-fun Code of Conduct](/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## Environment Details

This project has a variety of dependencies required to run. This section will act as a guide to setting up the environment for this project.

#### Install Node.js and npm

1. Download and install Node.js from https://nodejs.org/.
2. npm (Node Package Manager) is included with Node.js, so you don't need to install it separately.

#### Clone Repo

1. Clone the repository
    > `git clone https://github.com/jacketattack/blackjack-is-fun.git`

#### Install Dependencies

1. Install dependencies: `npm i`
2. Start app: `npm run start` and navigate to `http://localhost:1234` and beat the dealer!

## How Can I Contribute?

### Submitting an Issue

We use github's [issue tracker](https://github.com/jacketattack/blackjack-is-fun/issues) to contain bug reports and feature/enhancement requests. Before submitting an issue, search to ensure that there are no similar issues. When raising an issue, follow the [issues styleguide](#issues).

### Your First Contribution

Unsure where to begin contributing to blackjack-is-fun? You can start looking through the [good first issue](https://github.com/jacketattack/blackjack-is-fun/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [help wanted](https://github.com/jacketattack/blackjack-is-fun/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) issues. There are other labels that can be used to better find an issue that fits your needs, but these will be the most beginner-friendly.

Once you find an issue you like and are assigned to it, make a separate branch following the [styleguide](#git-branch-naming) for naming git branches.

### Making a Pull Request

There are some rules before a pull request can be reviewed:

1. It is preferred to have only one atomic commit, which should include both the source code changes and automated tests for it.
2. The pull request must pass all tests
3. We require that PRs are kept up to date with the target branch thus they should be rebased with the target branch. Visit [git branching](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) to learn more about rebasing
4. Formatting should follow the [styleguide](#pull-requests)

While the style must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

Commit message should be 'X: ' where X is the issue number and message is in the imperative tense following [how to write a good git commit](https://cbea.ms/git-commit). Below are the basic rules:

#### Required

-   Begin subject line with capitalization
-   Do not end subject with punctuation
-   Use the present tense ("Add feature" not "Added feature")
-   Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
-   Use the body for what and why vs how
-   Separate subject from body with a blank line

#### Preferred

-   Limit the first line to 50 characters or less
-   Wrap the body at 72 characters

### Git Branch Naming

Branches should include a label describing the type of issue followed by a slash, the issue number, and the issue subject separated using hyphens. An example of a branch name would be: feature/123-add-contributor-file

> The below table provides a simple guide to a few labels:
> | Label | Meaning |
> | ------------- | ------- |
> | hotfix | for quickly fixing critical issues,usually with a temporary solution |
> | bugfix | for fixing a bug |
> | feature | for adding, removing or modifying a feature|

### Pull Requests

Pull requests are a means of code review before merging the branch, so it should be descriptive. In many cases, a title is all that is neccesary. If the issue is bigger, then provide a short description of what the pull request is for.

When working on front-end issues, the pull request should include a before and after image. This will help reviewers understand what is being changed.

### Issues

Issues should be descriptive to ensure this project is beginner-friendly. The title should be a short summary of the issue. The body needs to contain goal and acceptance criteria headers with corresponding descriptions. Images are encourages to help depict the issue or changes that need to be made.
