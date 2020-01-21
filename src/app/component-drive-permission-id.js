const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var async = require("async");

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.scripts'
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
  

function listFiles(docid) {
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
                    let listArray = [];
                    const mainDomain = 'demo.point-star.com';
                    const drive = google.drive({version: 'v2', auth});
                    drive.permissions.list({
                        fileId: docid
                        //pageSize: 10,
                        //fields: 'nextPageToken, files(id, name)',
                    }, (err, res) => {
                        //console.log(res);
                        if (err) { 
                          console.log('The API permission returned an error: ' + err);
                          //console.log(err);
                          let pushErrMessage = '{"permissionId":"None","message":"File Not Found"}';
                          resolve(listArray.push(JSON.parse(pushErrMessage)));
                        } else {
                          //console.log(res.data.items);
                          const files = res.data.items;
                          if (files.length) {
                              //console.log('Files:');
                              files.map((file) => {
                                  //console.log(`${file.name} (${file.id})`);
                                  let fileType = `${file.type}`;
                                  let permissionId = `${file.id}`;
                                  //let userName = `${file.name}`;
                                  let domainName = `${file.domain}`;
                                  let emailShare = `${file.emailAddress}`;
                                  if(domainName !== mainDomain) {
                                    let pushValue = '{"permissionId":"'+permissionId+'","emailShare":"'+emailShare+'","domainName":"'+domainName+'","fileType":"'+fileType+'"}';
                                    listArray.push(JSON.parse(pushValue));
                                  }
                              });
                              resolve(listArray);
                          } else {
                              console.log('No files found.');
                              let pushMessage = '{"permissionId":"None","message":"No files found"}';
                              resolve(listArray.push(JSON.parse(pushMessage)));
                          }
                        }
                        
                    });

                    //console.log(oAuth2Client);
                    //resolve(oAuth2Client)
                });
            });
        
    });
  }
  
async function asyncCall(docid) {
    console.log('calling');
    const result = await listFiles(docid);
    console.log('RESULT:'+result);
    return result;
}

module.exports.fn1 = function(docid) {
  return asyncCall(docid); 
  //return 'sample' // need to return `this` object here
}