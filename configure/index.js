'use strict'

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
module.exports = {

  devices: [
    {
      'name': 'iPhone 6 Plus'
    },
    {
      'name': 'iPhone 7'
    },
    {
      'name': 'iPhone 7 Plus'
    },
    {
      'name': 'iPhone 8'
    },
    {
      'name': 'iPhone 8 Plus'
    },
    {
      'name': 'iPhone X'
    },
    {
      'name': 'Pixel 2'
    },
    {
      'name': 'iPad'
    },
    {
      'name': 'iPad Pro'
    }
  ],

  initialQuestions: [
    {
      type: 'list',
      name: 'response',
      message: 'What would you like to do?',
      choices: [
        {
          key: 't',
          name: 'Take Screenshots',
          value: 'screenshots'
        },
        {
          key: 'l',
          name: 'Load test the server',
          value: 'loadtest'
        },
        {
          key: 'x',
          name: 'Get me out of here!',
          value: 'exit'
        }
      ]
    }
  ],

  targetWebsiteQuestions: [
    {
      type: 'input',
      name: 'response',
      message: 'Which website would you like to target? (fully qualified url expected: https://domain.com)'
    }
  ],

  screenshotQuestions: [
    {
      type: 'list',
      name: 'response',
      message: 'Which pages should we capture?',
      choices: [
        {
          key: 'a',
          name: 'All Primary Pages',
          value: 'all'
        },
        {
          key: 's',
          name: 'Specific URL',
          value: 'specific_url'
        }
      ]
    }
  ]
}
