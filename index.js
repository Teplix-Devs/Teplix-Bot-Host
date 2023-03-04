process.env.GH_TOKEN = "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";

const {
         exec
} = require("child_process");
const download = require("download-git-repo");
const path = require("path");
const {Octokit} = require("octokit");

const octokit = new Octokit({
         auth: process.env.GH_TOKEN
});

download("Teplix-Devs/Teplix-Bot", "code", {
         headers: {
                  Authorization: `Bearer ${process.env.GH_TOKEN}`
         }
}, () => {
     const child = exec("npm i .", {
         cwd: path.join(process.cwd(), "code")
     });

     child.on("exit", () => {
         console.log("NPM Done!");

         const main = exec("node .", {
              cwd: path.join(process.cwd(), "code")
         });
         
         main.on("message", console.log);
         main.on("spawn", () => {
              console.log("Bot Running");
         });
         main.on("exit", () => {
                  console.log("Bot Stopped!");
         });
         main.on("error", console.log);

         setTimeout(async() => {
                  await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
                           owner: 'Teplix-Devs',
                           repo: 'Teplix-Bot-Host',
                           workflow_id: 'manual.yml',
                           ref: 'main',
                           headers: {
                                    'X-GitHub-Api-Version': '2022-11-28'
                           }
                  });
                  process.exit(0);
         }, /*20 * 24*/ 12 * 60 * 60 * 1000); //20 days max uptime
     });
     
});