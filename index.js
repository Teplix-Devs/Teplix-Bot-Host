const {
         exec
} = require("child_process");
const path = require("path");
const {Octokit} = require("octokit");
const { writeFileSync } = require("fs");
const AdmZip = require("adm-zip");

const octokit = new Octokit({
         auth: process.env.GH_TOKEN
});

const url = "https://github.com/teplix-Devs/Teplix-Bot/archive/master.zip";

octokit.request(`GET ${url}`).then(({data}) => {
         writeFileSync("./data.zip", Buffer.from(data));

         const zip = new AdmZip("./data.zip");

         zip.extractAllTo(".", true);

     const child = exec("npm i .", {
         cwd: path.join(process.cwd(), "Teplix-Bot-main")
     });

     child.on("exit", () => {
         console.log("NPM Done!");

         const main = exec("node .", {
              cwd: path.join(process.cwd(), "Teplix-Bot-main")
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
         }, 12 * 60 * 60 * 1000); //20 days max uptime
     });
     
});