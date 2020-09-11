let pathToFfmpeg = require('ffmpeg-static');
let { spawn } = require('child_process');
let fs = require('fs').promises;

(async () => {
  await ffmpeg({
    input: "frames/img%03d.png",
    videoCodec: "libvpx-vp9",
    videoBitrate: "1000K",
    deadline: "best",
    pixelFormat: "yuva420p",
    title: "faucet-pipeline",
    format: "webm",
    output: "logo.webm"
  })
})();

async function ffmpeg(options) {
  await ffmpegPass({
    ...options,
    pass: "1",
    format: "null",
    output: "/dev/null"
  })
  console.log("pass 1 done");
  await ffmpegPass({
    ...options,
    pass: "2"
  })
  await fs.unlink("./ffmpeg2pass-0.log");
  console.log("pass 2 done");
}

async function ffmpegPass(options) {
  let cliOptions = [
    "-i", options.input,
    // use row-based multi-threading
    "-row-mt", "1",
    "-codec:v", options.videoCodec,
    "-b:v", options.videoBitrate,
    "-deadline", options.deadline,
    "-pix_fmt", options.pixelFormat,
    "-metadata", `title="${options.title}"`,
    "-pass", options.pass,
    "-f", options.format,
    options.output
  ]

  return new Promise((resolve, reject) => {
    let ffmpegProcess = spawn(pathToFfmpeg, cliOptions);

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`child process exited with code ${code}`));
      }
    });
  });
}
