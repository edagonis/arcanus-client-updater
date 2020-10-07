const { crc32b } = require("node-crc")

const fileSystem = require("fs")
const { resolve } = require("path")
const glob = require("glob")

// CONFIG
const filesUrl = "https://arcanus-client-updater.vercel.app/files/"

// CONFIG END

export default (req, res) => {
  try {
    const publicFolder = resolve("public")
    const filesToUpdate = glob.sync(publicFolder + "/files/**/*.*")

    let files = {}
    for (let i = 0; i < filesToUpdate.length; i++) {
      const current = filesToUpdate[i]
      const content = fileSystem.readFileSync(current)

      const relativePath = current.split(publicFolder + "/files/")[1]
      const checksum = crc32b(content).toString("hex")
      files[relativePath] = checksum
    }

    const data = {
      url: filesUrl,
      files: files,
      keepFiles: false,
    }

    res.statusCode = 200
    return res.json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: 400, error: e })
  }
}
