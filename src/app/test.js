var async = require("async");

function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }
  
  async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    return result;
    // expected output: 'resolved'
  }
  
var files =  function() { 
    return asyncCall(); 
}

//dbModule = 'ABC';
//exports default dbModule
module.exports.files = files;