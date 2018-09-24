const fs = require('fs-extra')
const { prompt } = require('inquirer')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const chalk = require('chalk')
const figlet = require('figlet')
const puppetConfig = require('../configure')

console.clear()

const user = process.env.USER
const pass = process.env.PASS

module.exports = class BKD_PUPPET_TOOLS {
  constructor () {
    this.host = ''
    this.screenshotExtension = 'jpeg'
    this.pageList = puppetConfig.pages || []
    this.deviceList = puppetConfig.devices
    this.initialQuestions = puppetConfig.initialQuestions
    this.screenshotQuestions = puppetConfig.screenshotQuestions
    this.targetWebsiteQuestions = puppetConfig.targetWebsiteQuestions
  }

  async findNavigationItems () {
    const targetUrl = this.host
    const browser = await puppeteer.launch()
    const puppet = await browser.newPage()

    await puppet.goto(targetUrl)

    // Extract the results from the puppet.1
    let urls = await puppet.evaluate(() => {
      let links = []
      const navigation = document.querySelectorAll('nav li a')

      navigation.forEach(item => {
        const title = item.textContent.split('|')[0].trim()
        links.push({
          name: title,
          url: item.href
        })
      })
      return links
    })

    await puppet.close()
    await browser.close()
    this.pageList = urls
    this.takeScreenshots()
  }

  welcomeMessage () {
    figlet.text('Puppeteer \nScreenshot\n Generator', {
      font: 'Standard'
    },
    (err, data) => {
      if (err) {
        console.log(chalk.bgWhite.red(`So...we though that'd work too. We've been alerted and are working on it`))
        return
      }
      console.log(data)
      this.init()
    })
  }

  init () {
    prompt(this.initialQuestions)
      .then(answers => {
        this.initialQuestion(answers)
      })
  }

  askTargetWebsite () {
    prompt(this.targetWebsiteQuestions)
      .then(answers => {
        const url = answers.response
        const validation = this.urlValidator(url)

        if (validation) {
          this.host = url
          this.askScreenshotOptions()
        } else {
          console.clear()
          console.log(chalk.red.bgBlack(`We need the full URL. For example: http://www.google.com. NOT: google.com  :) Try again...`))
          this.askTargetWebsite()
        }
      })
  }

  urlValidator (host) {
    try {
      new URL(host)
      return true
    } catch (_) {
      return false
    }
  }

  initialQuestion (answers) {
    const path = answers.response ? answers.response : 'none'

    switch (path) {
      case 'none':
        console.log('nothing provided')
        break

      case 'exit':
        console.clear()
        console.log(chalk.green(`Thanks for using BKD's Screenshot generator. If you have feedback to share, don't hesitate to email bkd@bkd.io`))
        break

      case 'screenshots':
        console.clear()
        this.askTargetWebsite()
        break

      default:
        break
    }
  }

  askScreenshotOptions () {
    prompt(this.screenshotQuestions)
      .then(answers => {
        const path = answers.response ? answers.response : 'none'

        switch (path) {
          case 'none':
            console.log(chalk.red(`Whomp, whomp!`) + chalk(` something went wring`))
            break

          case 'all':
            console.log(chalk.bgWhite.black(`Fetching ALL pages...`))
            this.findNavigationItems()
            break

          case 'specific_url':
            console.log(chalk.cyan(`specific url`))
            break
        }
      })
  }

  takeScreenshots () {
    let i = 0

    puppeteer
      .launch({
        args: ['--disable-dev-shm-usage']
      })
      .then(async browser => {
        if (this.pageList) {
          for (i; i < this.pageList.length; i++) {
            let o = 0
            const url = this.pageList[i].url
            const name = this.pageList[i].name

            console.clear()
            console.log(chalk.green(`Generating images for: ${name} page`))

            for (o; o < this.deviceList.length; o++) {
              const deviceName = this.deviceList[o].name
              const folder = deviceName.replace(/\s/g, '')
              this.host = this.host.replace('https://', '')
              this.host = this.host.replace('//', '')
              this.host = this.host.replace('www', '')
              this.host = this.host.replace(/[^A-Za-z0-9 ]/g, '')
              this.host = this.host.replace(/\s{2,}/g, ' ')
              this.host = this.host.replace(/\s/g, '-')

              const rootUrl = `${process.env.DESTINATION}/${this.host}/${name}/`
              const width = devices[deviceName].viewport.width
              const height = devices[deviceName].viewport.height

              console.log(chalk.cyan(`fetching screenshot for: `) + chalk.bgBlack.white(`${deviceName}`))
              const puppet = await browser.newPage()

              if (user && pass) {
                await puppet.authenticate({ username: `${user}`, password: `${pass}` })
              }

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
        }
        await browser.close()
      })
  }
}
