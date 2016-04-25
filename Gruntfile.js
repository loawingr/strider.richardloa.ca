module.exports = function(grunt) {
"use strict";
var hint_opts = {
    bitwise : true,
    camelcase : false,
    curly : true,
    eqeqeq : true,
    es3 : false,
    forin : true,
    globals : { 
        "document" : true,
        "console" : true,
        "alert" : true,
        "window" : true,
        "escape" : true,
        "unescape" : true,
        "module" : true,
        "setTimeout" : true
    },
    immed : false,
    indent : 4,
    latedef : true,
    maxdepth : 5,
    maxparams : 4,
    newcap : true,
    noarg : true,
    noempty : true,
    nonew : true,
    plusplus : false,
    quotmark : true,
    strict : true,
    trailing : true,
    undef : true,
    unused : false
};
var env = {
      dev: grunt.file.readJSON("./conf/dev.json"),
      prod: grunt.file.readJSON("./conf/prod.json")
};
var config = {
    options: {},
    pkg: grunt.file.readJSON("package.json"),
    conf: env,
    concat: {
        options: {
          separator: ""
        },
        dist: {
          src: [ 
            "./src/js/numbers.js"
          ],
          dest: "./build/js/strider.js"
        }
    },
    copy:{
      build:{
          files: [
              { expand: true, cwd: "./src/", src: ["**/**.html"], dest: "./htdocs/dev/" },
              { expand: true, cwd: "./src/", src: ["**/**.html"], dest: "./htdocs/prod/" },
              { expand: true, cwd: "./src/", src: ["**/**.html"], dest: "./htdocs/local/" },
              { expand: true, cwd: "./build/js/", src: ["**/*.js"], dest: "./htdocs/dev/js/" },
              { expand: true, cwd: "./build/js/", src: ["**/*.js"], dest: "./htdocs/prod/js/" },
              { expand: true, cwd: "./build/js/", src: ["**/*.js"], dest: "./htdocs/local/js/" },
          ]
      },
      dev:{
        files:[
          {expand: true, cwd:"./htdocs/dev/", src: ["**/*"], dest: "<%= conf.dev.apache.directory %>"}
        ]
      },
      prod:{
        files:[
          {expand: true, cwd:"./htdocs/prod/", src: ["**/*"], dest: "<%= conf.prod.apache.directory %>"}
        ]
      },
      local:{
        files:[
          {expand: true, cwd:"./htdocs/local/", src: ["**/*"], dest: "<%= conf.local.apache.directory %>"}
        ]
      }
    },
  uglify: {
      local: {
          files: [{ expand: true, cwd: "htdocs/local/", src: ["**/*.js"], dest: "htdocs/local/"}]
      },
      dev: {
          files: [{ expand: true, cwd: "htdocs/dev/", src: ["**/*.js"], dest: "htdocs/dev/"}]
      },
      prod: {
          files: [{ expand: true, cwd: "htdocs/prod/", src: ["**/*.js"], dest: "htdocs/prod/"}]
      }
  },
  jshint: {
    files: [
      "Gruntfile.js",
      "src/js/*.js",
      "test/karma.js"
    ],
    options: hint_opts
  },
  
  clean:{
    build: ["./build/"],
    deploy: ["./node_modules/"]
  },
  karma : {
    numbers : {
        configFile : "test/conf/numbers.conf.js"
    }
  }
};

//this block is here so the build won't break if ./conf/local.json does not exist
if ( grunt.file.exists("./conf/local.json") ) {
    config.conf.local = grunt.file.readJSON("./conf/local.json");
}else{
    config.conf.local = grunt.file.readJSON("./conf/dev.json");
}

grunt.initConfig(config);



grunt.registerTask("check", function(environment) {
    var configFile = "";
    switch(environment) {
        case "dev":
            configFile = "./conf/dev.json";
            break;
        case "prod":
            configFile = "./conf/prod.json";
            break;
        default:
            configFile = "./conf/local.json";
    }
    if (grunt.file.exists(configFile)) {
        grunt.log.ok("JSON with local config exists");
        config.options.deployment = grunt.file.readJSON(configFile);
        if (!config.options.deployment.apache.directory){
            grunt.fail.warn("JSON is missing apache directory { \"apache\": {\"directory\":\"path_to_local_strider\" } }");
        }else{
            grunt.log.ok("The apache deployment directory: "+ config.options.deployment.apache.directory);
        }
    }
    else {
        grunt.fail.warn("JSON with set of javascripts does not exist. Create "+configFile);
    }
});

grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-uglify");
grunt.loadNpmTasks("grunt-contrib-copy");
grunt.loadNpmTasks("grunt-contrib-concat");
grunt.loadNpmTasks("grunt-contrib-clean");
grunt.loadNpmTasks("grunt-replace");
grunt.loadNpmTasks("grunt-karma");

grunt.registerTask("dev-build", ["check:dev", "default"]);
grunt.registerTask("prod-build", ["check:prod", "default"]);

grunt.registerTask("dev-copy", ["check:dev", "copy:dev"]);
grunt.registerTask("prod-copy", ["check:prod", "copy:prod"]);

grunt.registerTask("local", ["check", "default", "copy:local"]);
grunt.registerTask("default", ["jshint", "concat", "copy:build", "clean:build", "uglify"]);
};