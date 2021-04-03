import path from 'path'
import glob from 'glob'
import semver from 'semver'
import { once } from 'events'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

export class PackageContents {
  path: string = ""
  repository: string = ""
  category: string = ""
  name: string = ""
  exheres: string|Array<string> = ""
  exlib: string|null = null
  files: Array<string>|null = null
  versions: string|Array<string> = ""
  bestVersion: string = ""
  bestIsValid: boolean = false
  #file!: string
  upstream: null|string = null
  //upstreamUrl: null|string = null 
  //upstreamRegex: null|string = null

  constructor(packagePath: string) {
    this.path = packagePath
    let segments = this.path.split(path.sep)
    this.repository = segments[1]
    this.category = segments[3]
    this.name = segments[4]
  }

  findFiles() {
    var pathCleaner = (paths: Array<string>): Array<string> => {
      let newPaths = []
      for (let p of paths) {
        let crop = p.replace(`repositories/${this.repository}/packages/${this.category}/${this.name}/`, '')
        newPaths.push(crop)
      } 
      return newPaths.reverse()
    }
    // Check if one or more exheres exists.
    let exheres = glob.sync(`${this.path}/*.exheres-0`)
    exheres.length < 2 ? this.exheres = pathCleaner(exheres).toString() : this.exheres = pathCleaner(exheres)
    // Check if exlib exists.
    let exlib = glob.sync(`${this.path}/*.exlib`)
    if (exlib.length) { this.exlib = pathCleaner(exlib).toString() }
    // And if the package has additional files.
    let files = glob.sync(`${this.path}/files/**`)
    if (files.length) { this.files = pathCleaner(files) }
  }

  async findVersions() {
    // Single exheres.
    if (typeof(this.exheres) === 'string') {
      // Remove the package name before, because if a package contains a number, semver will use it for the version number
      let exheresCut = this.exheres.substring(this.exheres.indexOf("-") + 1)
      let pv = semver.coerce(exheresCut, {loose: true})!
      if (pv.raw == "0.0.0" && this.exheres.includes("scm")) {
        this.versions = "scm"
        this.bestVersion = "scm"
      } else {
        this.versions = pv.raw
        this.bestVersion = pv.raw
        // TODO: Find a solution for invalid versions (not a priority, ~500 packages, most of them are related to KDE or Perl).
        if (semver.valid(pv.raw)) {
          this.bestIsValid = true
        }
      }
    // Multiple exheres.
    } else if (typeof(this.exheres) === 'object') {
      let versions = []
      let scm = false
      let notValidForSort = []
      // Loop, check scm or invalid versions.
      for (const e of this.exheres) {
        // Remove the name before, because if a package contains a number, semver will use it for the version number
        let exheresCut = e.substring(e.indexOf("-") + 1)
        var version = semver.coerce(exheresCut, {loose: true})!
        if (version.raw == "0.0.0" && e.includes("scm")) {
          scm = true
        } else if (!semver.valid(version.raw)) {
          notValidForSort.push(version.raw)
        } else {
          versions.push(version.raw)
        }
      }
      // Sort first, cannot sort with invalid version or scm.
      if (versions.length) {
        semver.rsort(versions)
      } else {
        // TODO: Add to log later.
        console.log(`WARNING: No valid version found for ${this.category}/${this.name}.`)
      }
      // Push scm and no valid if exists.
      if (notValidForSort.length) { 
        for (const version of notValidForSort) { 
          versions.push(version) 
        }
      } 
      if (scm) { versions.push("scm") }
      this.versions = versions
      this.bestVersion = versions[0]
      if (!notValidForSort.length) { this.bestIsValid = true }
    }
  }

  async findSource() {
    // The file that will be used to find the source (exlib or the most recent exheres).
    if (this.exlib == null) {
      Array.isArray(this.exheres) ? this.#file = `${this.exheres[0]}` : this.#file = `${this.exheres}`
    } else {
      this.#file = `${this.exlib}`
    }

    // TODO: Make regex more complex in the future.
    let github = /require.*github/
    let pecl = /require.*pecl/

    try {
      const rl = createInterface({
        input: createReadStream(`${this.path}/${this.#file}`),
      });
      // Loop on each row and test the regex.
      // TODO: stop readline if successful
      rl.on('line', (line: string) => {
        if (github.test(line)) {
          //this.github(line)
          this.upstream = "github"
        } else if (pecl.test(line)) {
          //this.pecl(line)
          this.upstream = "pecl"
        }
      });
      await once(rl, 'close');

    } catch (err) {
      console.error(err);
    }
  }
}

