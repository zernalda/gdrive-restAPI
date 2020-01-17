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


function api2Function(sendContent2, ab, successCallback, errorCallback) {
    var sendContent2 = 'AAA';
    var s2ContentArr = [];
    for(var b=0; b< 10; b++) {
        var send2Content = JSON.parse('{ "index" : "' + b + '","Content": "'+ sendContent2 + ' - ' + b + '"}');
        s2ContentArr.push(send2Content);
        if(b == 9) {
            //if (sendContent2 == "bad query") {
            //    errorCallback("problem with the query");
            //}
            successCallback(s2ContentArr);    
        }
    }
}

function getListActivity(auth,emailUser,successCallback, errorCallback) {
    //let emailUser = 'melia@demo.point-star.com';
        var s2ContentArr = [];
        var send2Content = '';
        const service = google.admin({version: 'reports_v1', auth});
        service.activities.list({
            //userKey: 'all',
            userKey: emailUser,
            applicationName: 'drive',
            //maxResults: 1000,
        }, (err, res) => {
            if (err) { 
                //return console.error('The API List Activity returned an error:', err.message);
                send2Content = JSON.parse('{"email":"'+emailUser+'","error":"'+err.message+'"}');
                s2ContentArr.push(send2Content);
                successCallback(s2ContentArr); 
            } else {
                const activities = res.data.items;
                if (activities == undefined) { 
                //console.log('None : '+ emailUser); 
                //if(pushList !== '') { pushList +=','; } 
                //pushList += '{"email":"'+emailUser+'","error":"No Activities found."}';
                //listArrayAct.push('{"email":"'+emailUser+'","error":"No Activities found."}');
                    send2Content = JSON.parse('{"email":"'+emailUser+'","message":"No Activities found."}');
                    s2ContentArr.push(send2Content);
                    successCallback(s2ContentArr);  
                } else {
                
                    if (activities.length) {
                    var b = 0;
                    activities.forEach((activity) => {
                        b = b + 1;
                        let eventActivities = activity.events;
                        let pushValueRes = '';
                        if(eventActivities.length) {
                            eventActivities.forEach((Eactivity) => {
                                
                                

                                if(Eactivity.name == 'change_user_access') {
                                    let detailActivities = Eactivity.parameters;
                                    //let printfActivity = '';
                                    //let pushValue = '';
                                    let pushValue = '"email":"'+emailUser+'"';
                                    detailActivities.forEach((detactivity) => {
                                        if(detactivity.name == 'doc_title') {
                                            //printfActivity += '('+detactivity.value+')';
                                            if(pushValue !== '') { pushValue += ','; }
                                            pushValue += '"doc_title":"'+detactivity.value+'"';
                                        }
                                        if(detactivity.name == 'doc_id') {
                                        // printfActivity += '('+detactivity.value+')';
                                            if(pushValue !== '') { pushValue += ','; }
                                            pushValue += '"doc_id":"'+detactivity.value+'"';
                                        }
                                        if(detactivity.name == 'owner') {
                                            //printfActivity += '('+detactivity.value+')';
                                            if(pushValue !== '') { pushValue += ','; }
                                            pushValue += '"owner":"'+detactivity.value+'"';
                                        }
                                        if(detactivity.name == 'target_user') {
                                            //printfActivity += '('+detactivity.value+')';
                                            if(pushValue !== '') { pushValue += ','; }
                                            pushValue += '"target_user":"'+detactivity.value+'"';
                                        }
                                        
                                    });
                                    pushValueRes = '{'+pushValue+'}';
                                    //console.log(pushValueRes);
                                    //if(pushList !== '') { pushList +=','; } 
                                    //pushList += '{'+pushValue+'}';
                
                                    //listArrayAct.push(pushValueRes);
                                    //listArrayAct.push(JSON.parse(pushValue));

                                } 
                            });
                            // if(pushValueRes === '') {
                            //     let pushValue = '"email":"'+emailUser+'"';
                            //     if(pushValue !== '') { pushValue += ','; }
                            //     pushValue += '"message":"No Sharing Document"';
                            //     pushValueRes = '{'+pushValue+'}';
                            // }
                        }
                        if(pushValueRes !== '') {
                            send2Content = JSON.parse(pushValueRes);
                            s2ContentArr.push(send2Content);
                        }
                        //var send2Content = JSON.parse('{ "index" : "' + b + '","Content": "'+ sendContent2 + ' - ' + b + '"}');
                        
                        if(b == activities.length) {
                            //if (sendContent2 == "bad query") {
                            //    errorCallback("problem with the query");
                            //}
                            successCallback(s2ContentArr);    
                        }

                    });
                    } else {
                    //console.log('No Drive found.');
                    //if(pushList !== '') { pushList +=','; } 
                    //pushList += '{"email":"'+emailUser+'","error":"No Drive found."}';
                    //listArrayAct.push('{"email":"'+emailUser+'","error":"No Drive found."}');
                        send2Content = JSON.parse('{"email":"'+emailUser+'","message":"No Drive found."}');
                        s2ContentArr.push(send2Content);
                        successCallback(s2ContentArr);  
                    }
                
                }
            }        
        });        
}


function listExtFiles(st, successCallback, errorCallback) {
    var sContentArr = [];

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
                customer: 'my_customer',
                //customer: 'melia@demoenterprise.point-star.com',
                //maxResults: 10,
                orderBy: 'email',
            }, (err, res) => {
                if (err) return console.error('The API returned an error:', err.message);
            
                const users = res.data.users;
                //let listArray = [];
                
                if (users.length) {
                    var a = 0;
                    //var pushDrive = '';
                    //let listDrive = [];
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

                            sContentArr.push(send1Content);
                            //console.log(send1Content);
                            //console.log('a:'+a);
                            //console.log('length:'+users.length)
                            if(a == users.length) {
                                console.log('SEND ITEM : ')
                                //console.log(sContentArr);
                                successCallback(sContentArr);
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

// myFunction wraps the above API call into a Promise
// and handles the callbacks with resolve and reject
function listExtFilesWrapper() {
    return new Promise((resolve, reject) => {
        //setTimeout(() => {
            listExtFiles('Start',(successResponse) => {
                resolve(successResponse);
            }, (errorResponse) => {
                reject(errorResponse)
            });
        //}, 2000);
    });
}

// now you can use await to get the result from the wrapped api function
// and you can use standard try-catch to handle the errors
async function asyncCall() {
    try {
        const result = await listExtFilesWrapper();
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
