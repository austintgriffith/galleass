const fs = require("fs")
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())
//https://github.com/andrewrk/node-s3-client
var s3 = require('s3');

var client = s3.createClient({
  s3Options: awsCreds,
});

var params = {
  localDir: "public",

  s3Params: {
    Bucket: "galleass.io",
    Prefix: "",
    ACL: "public-read"
    // other options supported by putObject, except Body and ContentLength.
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  },
};

// Loop through all the files in the temp directory
fs.readdir( params.localDir , function( err, files ) {

    //the deployment address needs to be here so this needs to happen from the live box!

        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach( function( file, index ) {
          if(file.indexOf(".psd")>=0){
            console.log(file,index)
            fs.unlinkSync(params.localDir+"/"+file)
          }
        })


        var uploader = client.uploadDir(params);
        uploader.on('error', function(err) {
          console.error("unable to sync:", err.stack);
        });
        uploader.on('progress', function() {
          console.log("progress", uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', function() {
          console.log("done uploading");
        });

        //you'll also want to uplaod to ipfs
})
