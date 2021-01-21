const javaModule = require('./javaModule');

exports.compileJava = function ( envData , code , fn ){
	javaModule.compileJava(envData , code,fn);
}

exports.compileJavaWithInput = function ( envData , code , input ,  fn ){
	javaModule.compileJavaWithInput( envData , code , input ,  fn );	
}