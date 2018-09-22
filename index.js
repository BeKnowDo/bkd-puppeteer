const args = require('args')
const fs = require('fs-extra')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const path = require('../config/paths')
const chalk = require('chalk')
const puppetConfig = require('./puppeteer')
const { prompt } = require('inquirer')
// console.clear()

args
  .option('page', 'The single page you want to scrap')

const flags = args.parse(process.argv)

// const host = 'http://dev.benlido.com'
const user = 'benlido'
const pass = 'benlido2018'

class BenLidoPuppet {
  constructor () {
    this.screenshotExtension = 'jpeg'
    this.pageList = puppetConfig.pages
    this.targets = flags.p !== undefined ? this.pageList.filter(item => item.name === `${flags.p}`) : this.pageList
    this.deviceList = puppetConfig.devices
    this.questions = [
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
    ]
  }

  async getMainNavigation () {
    // navbar-dropdown-primary-items desktop hide-md
    const homePage = this.pageList.filter(item => item.name === 'Home').length ? this.pageList.filter(item => item.name === 'Home')[0] : undefined

    if (homePage !== 'undefined') {
      const targetUrl = homePage.url
      const browser = await puppeteer.launch()
      const puppet = await browser.newPage()

      await puppet.goto(`${targetUrl}`)

      const mainLinks = '.navbar-dropdown-primary-items > li > a'

      // Extract the results from the puppet.
      const links = await puppet.evaluate(mainLinks => {
        const anchors = Array.from(document.querySelectorAll(mainLinks))
        return anchors.map(anchor => {
          const title = anchor.textContent.split('|')[0].trim()
          return {
            name: title,
            url: anchor.href
          }
        })
      }, mainLinks)

      this.pageList = links

      await puppet.close()
      await browser.close()
      return this.takeScreenshots()
    }
  }

  cli () {
    prompt(this.questions)
      .then(answers => {
        this.handleAnswer(answers)
      })
  }

  handleAnswer (response) {
    const path = response.functions ? response.functions : 'none'

    switch (path) {
      case 'none':
        console.log('nothing provided')
        break
      case 'screenshots':
        this.takeScreenshots()
        break

      default:
        break
    }
  }

  takeScreenshots () {
    let i = 0

    puppeteer
      .launch({
        args: ['--disable-dev-shm-usage']
      })
      .then(async browser => {
        for (i; i < this.targets.length; i++) {
          let o = 0
          const url = this.targets[i].url
          const name = this.targets[i].name

          console.clear()
          console.log(chalk.green(`Generating images for: ${name} page`))

          for (o; o < this.deviceList.length; o++) {
            const deviceName = this.deviceList[o].name
            const folder = deviceName.replace(/\s/g, '')
            const rootUrl = `${path.puppeteerDestination}/${name}/`
            const width = devices[deviceName].viewport.width
            const height = devices[deviceName].viewport.height

            console.log(chalk.cyan(`fetching screenshot for: `) + chalk.bgBlack.white(`${deviceName}`))
            const puppet = await browser.newPage()
            await puppet.authenticate({ username: `${user}`, password: `${pass}` })
            await puppet.emulate(devices[`${deviceName}`])
            await puppet.goto(`${url}`)

            const destinationPath = `${rootUrl}`

            try {
              if (!fs.existsSync(destinationPath)) {
                fs.ensureDirSync(destinationPath)
              }

              // console.log(chalk.blue(`File name is: ${name}-${folder}-${width}x${height}.${this.screenshotExtension}`))

              // other actions...
              await puppet.screenshot({
                path: `${rootUrl}/${name}-${folder}-${width}x${height}.fullscreen.${this.screenshotExtension}`,
                type: this.screenshotExtension,
                quality: 20,
                fullPage: true
              })

              await puppet.screenshot({
                path: `${rootUrl}/${name}-${folder}-${width}x${height}.${this.screenshotExtension}`,
                type: this.screenshotExtension,
                quality: 20
              })
            } catch (err) {
              console.error(err)
            }

            await puppet.close()
          }
        }
        await browser.close()
      })
  }
}

new BenLidoPuppet().cli()
// new BenLidoPuppet().getMainNavigation()
// new BenLidoPuppet().takeScreenshots()
