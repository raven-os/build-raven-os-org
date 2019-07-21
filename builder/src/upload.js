const rp = require('request-promise')
const fs = require('fs')
const glob = require('glob')

class Upload {
  constructor (config) {
    this.config = config
  }

  findPackages (outputDir) {
    try {
      return glob.sync(outputDir + '**/*.nest', {})
    } catch (err) {
      console.error('[builder.upload.findPackages]', err)
    }
  }

  async _req (uri, body) {
    const options = {
      method: 'POST',
      uri,
      body,
      headers: {
        'X-Auth-Token': this.config.apikeys.nest_server
      }
    }

    try {
      return rp(options)
    } catch (err) {
      console.error('[error.upload]', err.message)
    }
  }

  async sendRequest (packagePath) {
    const uploadUrl = this.config.nest_server_api_url + 'api/upload/'

    try {
      const content = fs.readFileSync(packagePath)
      const res = await this._req(uploadUrl, content)

      return this.getPackageUrl(JSON.parse(res))
    } catch (err) {
      console.error('[builder.upload.sendRequest]', err)
    }
  }

  getPackageUrl (pkgInfo) {
    return `${this.config.nest_server_api_url}p/${pkgInfo.category}/${pkgInfo.name}`
  }

  async toNestServer (outputDir) {
    const packages = this.findPackages(outputDir)
    const pkgUrlList = []

    for (let pkg of packages) {
      const res = await this.sendRequest(pkg)
      pkgUrlList.push(res)
    }

    return pkgUrlList
  }
}

module.exports = Upload
