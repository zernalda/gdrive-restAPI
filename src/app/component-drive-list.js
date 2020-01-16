const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var async = require("async");

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    // 'https://www.googleapis.com/auth/drive.appdata',
    // 'https://www.googleapis.com/auth/drive.file',
    // 'https://www.googleapis.com/auth/drive.metadata',
    // 'https://www.googleapis.com/auth/drive.metadata.readonly',
    // 'https://www.googleapis.com/auth/drive.photos.readonly',
    // 'https://www.googleapis.com/auth/drive.readonly',
    // 'https://www.googleapis.com/auth/drive.scripts'
  ];
const TOKEN_PATH = './src/config/token.json';

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
}
  

function listFiles() {
    return new Promise(resolve => {
        
            fs.readFile('./src/config/credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Drive API.
                var credential = JSON.parse(content);
                const {client_secret, client_id, redirect_uris} = credential.web;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);
            
                // Check if we have previously stored a token.
                fs.readFile(TOKEN_PATH, (err, token) => {
                    if (err) return getAccessToken(oAuth2Client, callback);
                    oAuth2Client.setCredentials(JSON.parse(token));
                    //console.log('TOKEN:'+token);
                    //callback(oAuth2Client);
                    auth = oAuth2Client;
                    const drive = google.drive({ version: 'v3', auth });


                    (async function () {

                      let res = await new Promise((resolve, reject) => {
                        drive.files.list({
                          pageSize: 5,
                          fields: 'files(name, webViewLink)',
                          orderBy: 'createdTime desc'
                        }, function (err, res) {
                          if (err) {
                            reject(err);
                          }
                          resolve(res);
                        });
                      });

                      let data = 'Name,URL\n';

                      res.data.files.map(entry => {
                        const { name, webViewLink } = entry;
                        data += `${name},${webViewLink}\n`;
                      });
                      console.log(data);

                      fs.writeFile('data.csv', data, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                      });

                    })()

                    // drive.files.list({
                    //     fields: 'nextPageToken, files(id, name, kind)',
                    // }, (err, res) => {
                    //     //console.log(res);
                    //     if (err) return console.log('The API returned an error: ' + err);
                    //     const files = res.data.files;
                    //     let listArray = [];
                    //     if (files.length) {
                    //         //console.log('Files:');
                    //         files.map((file) => {
                    //             //console.log(`${file.name} (${file.id})`);
                    //             let fileName = `${file.name}`;
                    //             let fileId = `${file.id}`;
                    //             let fileKind = `${file.kind}`
                    //             let pushValue = '{"fileName":"'+fileName+'","fileId":"'+fileId+'", "fileKind":"'+fileKind+'"}';
                    //             listArray.push(JSON.parse(pushValue));
                    //             //listArray.push(fileName,fileId);
                    //         });
                    //         console.log('Arr');
                    //         console.log(listArray);
                    //         resolve(listArray);
                    //         //callback(listArray);
                    //         //return listArray;
                    //     } else {
                    //         console.log('No files found.');
                    //     }
                    // });

                    //console.log(oAuth2Client);
                    //resolve(oAuth2Client)
                });
            });
        
    });
  }
  
// async function asyncCall() {
//     console.log('calling');
//     const result = await listFiles();
//     //setTimeout(() => {
//     console.log('RESULT:'+result);
//     return result;
//     //}, 10*1000);
//     // expected output: 'resolved'
// }
  
// var files =  function() { 
//     return asyncCall(); 
// }

module.exports.files = listFiles;