const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
//let privatekey = require("../config/credentials.json");
let Promise = require('promise');



// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.scripts',
    'https://www.googleapis.com/auth/drive.file'
  ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './src/config/token.json';

// Load client secrets from a local file.
var activity = function(){
    return new Promise(function (resolve, reject) { 
        var abc = fs.readFile('./src/config/credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), listActivity);
        });
    });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listActivity(auth) {
//var files = function listFiles(auth){
//https://developers.google.com/admin-sdk/reports/v1/quickstart/nodejs
  return new Promise(function (resolve, reject) { 
        const service = google.admin({version: 'reports_v1', auth});
        service.activities.list({
            //userKey: 'all',
            userKey: 'melia@demo.point-star.com',
            applicationName: 'drive',
            //maxResults: 1000,
        }, (err, res) => {
            if (err) return console.error('The API returned an error:', err.message);
            //console.log(res.data.items);
            let listArrayAct = [];
            const activities = res.data.items;
            if (activities.length) {
            console.log('Drive:');
            //let a=0;
            activities.forEach((activity) => {
                //console.log(`${activity.id.time}: ${activity.actor.email} (${activity.events[0].type} - ${activity.events[0].name})`);
                let eventActivities = activity.events;
                if(eventActivities.length) {
                    eventActivities.forEach((Eactivity) => {
                        //console.log(`${Eactivity.type} (${Eactivity.name})`); 
                        if(Eactivity.name == 'change_user_access') {
                            let detailActivities = Eactivity.parameters;
                            let printfActivity = '';
                            let pushValue = '{';
                            detailActivities.forEach((detactivity) => {
                              if(detactivity.name == 'doc_title') {
                                printfActivity += '('+detactivity.value+')';
                                if(pushValue !== '') { pushValue += ','; }
                                pushValue += '"doc_title":"'+detactivity.value+'"';
                              }
                              if(detactivity.name == 'doc_id') {
                                printfActivity += '('+detactivity.value+')';
                                if(pushValue !== '') { pushValue += ','; }
                                pushValue += '"doc_id":"'+detactivity.value+'"';
                              }
                              if(detactivity.name == 'owner') {
                                printfActivity += '('+detactivity.value+')';
                                if(pushValue !== '') { pushValue += ','; }
                                pushValue += '"owner":"'+detactivity.value+'"';
                              }
                              if(detactivity.name == 'target_user') {
                                printfActivity += '('+detactivity.value+')';
                                if(pushValue !== '') { pushValue += ','; }
                                pushValue += '"target_user":"'+detactivity.value+'"';
                              }
                                
                            });
                            console.log(printfActivity);
                            pushValue += '}';
                            listArrayAct.push(pushValue);
                            //listArrayAct.push(JSON.parse(pushValue));
                        }
                        
                    });
                }
                //let detailActivities = activity.events[0].parameters;
                //detailActivities = `${activity.events[0].parameters}`
                // console.log(detailActivities[0])
                // for(var b=0; b<detailActivities.length; b++) {
                //      console.log(detailActivities[b].name)
                
                //  }
                // console.log(a);
                // a=a+1;
            });
            console.log(listArrayAct);
            } else {
            console.log('No logins found.');
            }
            
        });
  });
}
//console.log(listFiles);
module.exports.activity = activity;