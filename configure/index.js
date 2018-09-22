'use strict'

const path = require('path')
const fs = require('fs')
const url = require('url')

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
      name: 'functions',
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
        }
      ]
    }
  ],
  screenshotQuestions: [
    {
      type: 'list',
      name: 'functions',
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
