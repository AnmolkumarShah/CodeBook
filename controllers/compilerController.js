const compilex = require('compilex');
const path = require('path');
const fs = require('fs');
const flush = require('../functions/flush');

compilex.init({stats:true});

exports.getCompile = (req,res,next)=>{
  res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:"## write your code here...",output:"",language:"Python Language"});
};

exports.reRun = (req,res,next)=>{
  const code = req.body.code;
  const language = req.body.language.trim();
  res.render("compiler.ejs",{pageTitle : "ReRun",path : "/compiler" ,code:code,output:"",language:language});
};

exports.compileRun = async (req,res,next)=>{
  const language = req.body.language;
  const input = req.body.input;
  const code = req.body.code;
  const isInput = req.body.isInput;

  

  const clear = () => {
    try{
        flush.flush(function(){
        console.log('All temporary files flushed !'); 
      });
    }catch(err){
      console.log(err);
      console.log("LOOP OR SOMETHING INFINITE");
      res.redirect('/compiler');
    }
  }

  const flushJava = function(path){
    
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path)
  
      if (files.length > 0) {
        files.forEach(function(filename) {
          if (fs.statSync(path + "/" + filename).isDirectory()) {
            flushJava(path + "/" + filename)
          } else {
            fs.unlink(path + "/" + filename,function(err){
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
            });            
          }
        })
        // fs.rmdirSync(path)
      } else {
        // fs.rmdirSync(path)
      }
    } else {
      console.log("Directory path not found.")
      res.redirect('/compiler');
    }
  }


  try{
    switch(language){
      case "C Language":
      {

        let envData = { OS : "windows",cmd : "g++",options: {timeout:2000 }};
        if(isInput){
          compilex.compileCPPWithInput(envData,code, input ,async function(data){
            if(data.error){	
              const output = await data.error;     
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C Language"});
              clear();    
            }else{       
              const output = await data.output;  
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C Language"});
              clear();         
            }        	
          }); 
        }else{
          compilex.compileCPP(envData,code,async function(data){
            if(data.error){	
              const output = await data.error;    
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C Languagec"});
              clear();        
            }else{       
              const output = await data.output; 
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C Language"});
              clear();           
            }        	
          }); 
        }
        break;
      }
      case "C++ Language":
      {

        let envData = { OS : "windows",cmd : "g++",options: {timeout:2000 }};
        if(isInput){
          compilex.compileCPPWithInput(envData,code, input ,async function(data){
            if(data.error){	
              const output = await data.error;   
              clear();         
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C++ Language"});
            }else{       
              const output = await data.output;  
              clear();          
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C++ Language"});
            }        	
          }); 
        }else{
          compilex.compileCPP(envData,code,async function(data){
            if(data.error){	
              const output = await data.error; 
              clear();           
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C++ Language"});
            }else{       
              const output = await data.output;   
              clear();         
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"C++ Language"});
            }        	
          }); 
        }

        break;

      }
      case "Java Language":
      {
        
        let envData = { OS : "windows",options: {timeout:2000 }};
        if(isInput){
          compilex.compileJavaWithInput(envData,code, input ,async function(data){
            if(data.error){	
              const output = await data.error;  
              const pathToDir = path.join(__dirname,'../','java');
              flushJava(pathToDir);
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Java Language"});
            }else{       
              const output = await data.output;    
              const pathToDir = path.join(__dirname,'../','java');
              flushJava(pathToDir);      
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Java Language"});
            }        	
          }); 
        }else{
          compilex.compileJava(envData,code,async function(data){
            if(data.error){	
              const output = await data.error;   
              const pathToDir = path.join(__dirname,'../','java');
              flushJava(pathToDir);   
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Java Language"});
            }else{       
              const output = await data.output;     
              const pathToDir = path.join(__dirname,'../','java');
              flushJava(pathToDir);   
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Java Language"});
            }        	
          }); 
        }
        break;
      }
      case "Python Language":
      {

        let envData = { OS : "windows",options: {timeout:2000 }};
        if(isInput){
          compilex.compilePythonWithInput(envData,code, input ,async function(data){
            if(data.error){	
              const output = await data.error;  
              clear();          
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Python Language"});
            }else{       
              const output = await data.output;  
              clear();          
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Python Language"});
            }        	
          }); 
        }else{
          compilex.compilePython(envData,code,async function(data){
            if(data.error){	
              const output = await data.error;     
              clear();      
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Python Language"});
            }else{       
              const output = await data.output;      
              clear();      
              res.render("compiler.ejs",{pageTitle : "Compiler",path : "/compiler" ,code:code,output:output,language:"Python Language"});
            }        	
          }); 
        }
        break;
      }
    }    
  }catch(err){
    res.redirect('/');
  }
    
    
};