const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
//let privatekey = require("../config/credentials.json");
let Promise = require('promise');
var async = require("async");


// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.activity',
    'https://www.googleapis.com/auth/admin.reports.usage.readonly',
    'https://www.googleapis.com/auth/admin.reports.audit.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.activity.readonly',
    'https://www.googleapis.com/auth/drive.scripts',
    'https://www.googleapis.com/auth/drive.file'
  ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './src/config/token.json';


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
function getListActivity(successCallback, errorCallback) {
    // var sContentArr = [];

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
            auth = oAuth2Client;
            const service = google.admin({version: 'directory_v1', auth});
            service.users.list({
                // customer: 'my_customer',
                customer: 'admin@demo.point-star.com',
                //maxResults: 10,
                orderBy: 'email',
            }, (err, res) => {
                if (err) return console.error('The API returned an error:', err.message);
            
                const users = res.data.users;
                let listArray = [];
                
                if (users.length) {
                    var a = 0;
                    //var pushDrive = '';
                    // let listDrive = [];
                    users.map((user) => {
                        //var send1 = query + ' * ' + a;
                        getListActivity(auth,user.primaryEmail,(successResponse) => { 
                            a = a + 1;
                            console.log(user.primaryEmail);
                            //var send1Content = JSON.parse('{ "id" : "' + a + '", "files":"' + successResponse + '"}');
                            //var send1Content = '{"email":"'+user.primaryEmail+'","Content":"'+JSON.stringify(successResponse)+'"}';
                            var send1Content = successResponse;
                            console.log(send1Content.length);
                            if(send1Content.length == 0) {
                                send1Content.push(JSON.parse('{"email":"'+user.primaryEmail+'","message":"No sharing Document"}'));
                                
                            }
                            // else {
                            //     let pushValue = '"email":"'+emailUser+'","message":"No Sharing Document"';
                            //     pushValueRes = '{'+pushValue+'}';
                            //     send2Content = JSON.parse(pushValueRes);
                            //     s2ContentArr.push(send2Content);
                            // }

                            listDrive.push(send1Content);
                            //console.log(send1Content);
                            //console.log('a:'+a);
                            //console.log('length:'+users.length)
                            if(a == users.length) {
                                console.log('SEND ITEM : ')
                                //console.log(sContentArr);
                                successCallback(listArray);
                            }
                        }, (errorResponse) => {
                            errorCallback(errorResponse)
                        });
                        

                    });
                    

                } else {
                    //console.log('No users found.');
                    //callback("No users found");
                    successCallback("No users found");
                }
            });



            //console.log(oAuth2Client);
            //resolve(oAuth2Client)
        });
    });
}


 // now you can use await to get the result from the wrapped api function
// and you can use standard try-catch to handle the errors
async function asyncCall() {
    try {
        const result = await getListActivity();
        console.log(result);
        return result;
        // the next line will fail
        //const result2 = await apiFunctionWrapper("bad query");
        //console.log(result2);
    } catch(error) {
        console.error("ERROR:" + error);
    }
  }
  
  // call the main function
  var files =  function() { 
      return asyncCall();; 
  }
  
  //exports default dbModule
  module.exports.files = files;

