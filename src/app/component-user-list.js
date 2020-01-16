const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
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
  
function listUser() {
  // list user dari admin directory SDK
  }
  
async function asyncCall() {
    console.log('calling');
    const result = await listUser();
    //setTimeout(() => {
    console.log('RESULT:'+result);
    return result;
    //}, 10*1000);
    // expected output: 'resolved'
}
  
var user =  function() { 
    return asyncCall(); 
}

module.exports.user = user;