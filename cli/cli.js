const fs = require('fs-extra')
const { prompt } = require('inquirer')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const chalk = require('chalk')
const puppetConfig = require('../configure')
console.clear()

const user = process.env.USER
const pass = process.env.PASS
let host = `${process.env.HOST}`

module.exports = class BKD_PUPPET_TOOLS {
  constructor () {
    this.screenshotExtension = 'jpeg'
    this.pageList = puppetConfig.pages || []
    this.deviceList = puppetConfig.devices
    this.initialQuestions = puppetConfig.initialQuestions
    this.screenshotQuestions = puppetConfig.screenshotQuestions
  }

  async findNavigationItems () {
    const targetUrl = host
    const browser = await puppeteer.launch()
    const puppet = await browser.newPage()

    await puppet.goto(targetUrl)

    // Extract the results from the puppet.1
    let urls = await puppet.evaluate(() => {
      let links = []
      const navigation = document.querySelectorAll('nav ul li a')

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

  cli () {
    prompt(this.initialQuestions)
      .then(answers => {
        this.initialQuestion(answers)
      })
  }

  initialQuestion (answers) {
    const path = answers.functions ? answers.functions : 'none'

    switch (path) {
      case 'none':
        console.log('nothing provided')
        break

      case 'screenshots':
        this.questionScreenshotType()
        break

      default:
        break
    }
  }

  questionScreenshotType () {
    prompt(this.screenshotQuestions)
      .then(answers => {
        const path = answers.functions ? answers.functions : 'none'

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
              host = host.replace('https://', '')
              host = host.replace('//', '')
              host = host.replace('www', '')
              host = host.replace(/[^A-Za-z0-9 ]/g, '')
              host = host.replace(/\s{2,}/g, ' ')
              host = host.replace(/\s/g, '-')

              const rootUrl = `${process.env.DESTINATION}/${host}/${name}/`
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
