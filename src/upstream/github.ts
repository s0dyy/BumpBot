import axios from 'axios'

export async function github(line: string, name: string): Promise<Array<string>> {
    // Regex used to find if a user or a project is specified.
    const userRgx = /\user=\S*(?=\s)/
    const projectRgx = /\project=\S*(?=\s)/ 

    // Extract the contents of "project=*" or "user=*".
    const extContent = (contentRgx: RegExp): string => {
      const result = line.match(contentRgx)
      // Remove quotes if necessary.
      if (result![1].includes("'") || result![1].includes('"')) {
        return result![1].slice(1, -1)
      } else {
        return result![1]
      }
    }

    var upstream: Array<string> = []
    // If it's not specified, the user and the project have the name of the package.
    if (!userRgx.test(line) && !projectRgx.test(line)) {
      const upstreamUrl = `https://api.github.com/repos/${name}/${name}`
      upstream.push(upstreamUrl)
    } 
    // Check if user OR project is specified (match single, double and no quote).
    if (userRgx.test(line) && !projectRgx.test(line)) {
      const user = extContent(/user=('([^']+)'|"([^"]+)"|([^ ]+))/)
      const upstreamUrl = `https://api.github.com/repos/${user}/${name}`
      upstream.push(upstreamUrl)
    } else if (!userRgx.test(line) && projectRgx.test(line)) {
      const project = extContent(/project=('([^']+)'|"([^"]+)"|([^ ]+))/)
      const upstreamUrl = `https://api.github.com/repos/${name}/${project}`
      upstream.push(upstreamUrl)
    }
    // Check if user AND project is specified
    if (userRgx.test(line) && projectRgx.test(line)) {
      const user = extContent(/user=('([^']+)'|"([^"]+)"|([^ ]+))/)
      const project = extContent(/project=('([^']+)'|"([^"]+)"|([^ ]+))/)
      const upstreamUrl = `https://api.github.com/repos/${user}/${project}`
      upstream.push(upstreamUrl)
    }

    //const response = await axios.get(`${upstream[0]}/tags`)
    //upstream.push(response.data[0].name)

    return upstream
}
