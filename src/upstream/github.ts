//import { once } from 'events'
//import { createReadStream } from 'fs'
//import { createInterface } from 'readline'
//import { PackageContents } from "./PackageContents"
//import axios from 'axios'

//export class PackageSources {
  //#file!: string
  //upstream: null|string = null
  //upstreamUrl: null|string = null 
  //upstreamRegex: null|string = null
  
  //github(line: string) {
    //this.upstream = "github"
    //this.upstreamRegex = line

    // Regex used to find if a user or a project is specified.
    //let userRgx = /\user=\S*(?=\s)/
    //let projectRgx = /\project=\S*(?=\s)/ 

    // Extract the contents of "project=*" or "user=*".
    //var extContent = (contentRgx: RegExp): string => {
      //var result = line.match(contentRgx)
      // Remove quotes if necessary.
      //if (result![1].includes("'") || result![1].includes('"')) {
        //return result![1].slice(1, -1)
      //} else {
        //return result![1]
      //}
    //}

    // If it's not specified, the user and the project have the name of the package.
    //if (!userRgx.test(line) && !projectRgx.test(line)) {
      //this.upstreamUrl = `https://api.github.com/repos/${this.name}/${this.name}`
    //} 
    // Check if user OR project is specified (match single, double and no quote).
    //if (userRgx.test(line) && !projectRgx.test(line)) {
      //let user = extContent(/user=('([^']+)'|"([^"]+)"|([^ ]+))/)
      //this.upstreamUrl = `https://api.github.com/repos/${user}/${this.name}`
    //} else if (!userRgx.test(line) && projectRgx.test(line)) {
      //let project = extContent(/project=('([^']+)'|"([^"]+)"|([^ ]+))/)
      //this.upstreamUrl = `https://api.github.com/repos/${this.name}/${project}`
    //}
    // Check if user AND project is specified
    //if (userRgx.test(line) && projectRgx.test(line)) {
      //let user = extContent(/user=('([^']+)'|"([^"]+)"|([^ ]+))/)
      //let project = extContent(/project=('([^']+)'|"([^"]+)"|([^ ]+))/)
      //this.upstreamUrl = `https://api.github.com/repos/${user}/${project}`
    //}

    //const response = await axios.get(`${this.upstreamUrl}/releases/latest`)
  //}
//}
