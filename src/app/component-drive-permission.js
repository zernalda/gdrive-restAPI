const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const async = require('async');
// var async = require("async");

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/admin.directory.user'
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
  
function listPermission() {
  // list user dari admin directory SDK
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

                // async.eachSeries(auth, function retrievePermissions(fileId, callback) {
                    // const drive = google.drive({version: 'v2', auth});
                    var fileId = '0ByImNGGBJqMbS3JwMzJTWm9SZU0';
                    var request = gapi.client.drive.permissions.list({
                      'fileId': fileId
                    });
                    request.execute(function(resp) {
                      callback(resp.items);
                    });
                //   }
                // )
                // var permissions = [
                //   {
                //     'type': 'user',
                //     'role': 'writer',
                //     'emailAddress': 'user@example.com'
                //   }, {
                //     'type': 'domain',
                //     'role': 'writer',
                //     'domain': 'example.com'
                //   }
                // ];

                // // const files = res.data.permission;
                // // console.log(files);
                // // Using the NPM module 'async'
                // async.eachSeries(permissions, function (permission, callback) {
                //     drive.permissions.create({
                //     resource: permission,
                //     fileId: fileId,
                //     fields: 'id',
                //     }, function (err, res) {
                //     if (err) {
                //         // Handle error...
                //         console.error(err);
                //         callback(err);
                //     } else {
                //         console.log('Permission ID: ', res.data)
                //         callback(res);
                //     }
                //     });
                // });

                //console.log(oAuth2Client);
                //resolve(oAuth2Client)
            });
        });
    });
  }
  
// async function asyncCall() {
//     console.log('calling');
//     const result = await listPermission();
//     //setTimeout(() => {
//     console.log('RESULT:'+result);
//     return result;
//     //}, 10*1000);
//     // expected output: 'resolved'
// }
var permission =  function() { 
    console.log(listPermission());
    return listPermission(); 
}

module.exports.permission = permission;