# Puppeteer: CLI based Website Screenshots
This is a straight forward Puppeteer based website screenshot generator.
<hr />

# How it works

We use Puppeteer to identify and capture any given website's primary navigation links (urls): nav > ul > li > a.

For every qualified navigation item, we capture and add the title and href values into an array.
Then we simply iterate through that array, use Puppeteer's `goto` method to capture both default viewport and full-page screenshots.
<hr />

## Installation & Configuration
- `npm i bkd-puppeteer`
- Create an `.env` file in the root of the project's directory
  - Add baseline variables as shown below
  
  *(If the site has simple authentication, provide a username and password):*


  ```
  HOST=https://npr.com
  USER=yourUserName
  PASS=yourPassword
  DESTINATION=build-directory-of-choice
  ```

## Where screenshots are published
- Screenshots are generated into the directory you've indicated in `.env`
- Filenames follow this format: `Page name - Device name - Height - width.jpg`
  - Realworld example: ```Contact-Us-iPad-768x1024.fullscreen.jpg```

### Available Scripts
- `npm run puppet`
- `npm run puppet-dev` - only difference is the use of nodemon

<hr />

#### That's pretty much it. I know. Nothing Earth shattering but clients find it useful because it's a real time-saver in UI Regression Testing.

#### Hopefully someone out there will find this helpful. I'm going to continue to extend this (mostly for my own personal development).


<p style="font-weight: 700; font-size: 24px; text-align: center; margin-top: 35px;">
 If anyone has suggestions...feel free to throw ideas out there :)
</p>

<div style="display: flex; justify-content: center; align-items: center;">

  <div style="font-weight: 700; padding-right: 10px;">
    created by <a href="//bkd.io" title="BKD Digital, Inc. BE. KNOW. DO">BKD Digital Inc.</a>
  </div>

  <div>
    <img src="https://bkd.io/wp-content/uploads/2016/09/VETERAN_OWNED_02_grande1-e1474132644460.png" style="width: 72px; max-width: 100%;">
  </div>

</div>

