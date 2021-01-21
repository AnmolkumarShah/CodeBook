const pathModule = require('path');
const fs = require('fs');

exports.flush = function(fn) {
  path = pathModule.join(__dirname,'../','temp/');
  console.log(path);
  fs.readdir(path, function(err , files){ 
    if(!err)
    {
      for( var i = 0 ; i<files.length ; i++ )
      {
        
        // fs.unlinkSync(path+files[i]);	 
        // console.log(path+files[i]);
        
        fs.unlink(path+files[i],function(err,){
          if(err && err.code == 'ENOENT') {
              // file doens't exist
              console.info("File doesn't exist, won't remove it.");
              return ;
          } else if (err) {
              // other errors, e.g. maybe we don't have enough permission
              console.error("Error occurred while trying to remove file");
              return ;
          } else {
              console.info(`removed`);
          }
        })

      }
    }
  });
  fn();	    
}