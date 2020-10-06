const { crc32b } = require("node-crc")

const fileSystem = require("fs")
const { resolve } = require("path")
const glob = require("glob")

const express = require("express")

const app = express()

app.use(express.static("public"))

// CONFIG
const filesUrl = "http://arcanus-client-updater.vercel.app/files/"

// CONFIG END

app.use("/", function (req, res) {
  try {
    const filesToUpdate = glob.sync(resolve("public/files/**/*.*"))

    let files = {}
    for (let i = 0; i < filesToUpdate.length; i++) {
      const current = filesToUpdate[i]
      const content = fileSystem.readFileSync(current)

      const relativePath = current.split(resolve("files/") + "/")[1]
      const checksum = crc32b(content).toString("hex")
      files[relativePath] = checksum
    }

    const data = {
      url: filesUrl,
      files: files,
      keepFiles: true,
    }

    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: 400, error: e })
  }
})

app.listen(process.env.PORT || 3000)
