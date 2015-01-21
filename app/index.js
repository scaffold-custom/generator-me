'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var MeGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.pkg = require('../package.json');

        this.cwd = this.options.env.cwd;
        this.log('name----',this.cwd);
        //工程名称
        this.name = getProjectName(this);
        this.on('end', function() {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    askFor: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay('欢迎使用自定义脚手架!\n作者:luxueyan\n博客:http://hi.gitcafe.com'));

        var prompts = [{
            type: 'input',
            name: 'author',
            message: 'name of author',
            default: 'luxueyan'
        }, {
            type: 'input',
            name: 'email',
            message: 'email of author',
            default: 'luxueyan.lxy@alibaba-inc.com'
        },
        {
            name: 'combo',
            message: '是否使用依赖表combo文件（Y/N）:',
            default: 'Y'
        },
        {
            name: 'mini',
            message: '是否基于kissy mini（Y/N）:',
            default: 'N'
        },
        {
            type: 'checkbox',
            name: 'style',
            message: 'choose you css extention language',
            choices: ['less', 'scss'],
            default: ['scss']
        }];

        this.prompt(prompts, function(props) {
            this.author = props.name;
            this.email = props.email;
            this.combo = props.combo;
            this.mini = props.mini;
            this.style = props.style;
            done();
        }.bind(this));
    },

    mk: function() {
        var fold = ['template','test','build','src','view'];
        for(var i=0;i<fold.length;i++){
            this.mkdir(fold[i]);
        }
    },

    copyfiles: function() {
        this.template('Gruntfile.js','Gruntfile.js');
        this.copy('_.gitignore','.gitignore');
        this.template('_package.json','package.json');
        this.template('README.md', 'README.md');
        this.template('totoro-config.json', 'totoro-config.json');
        this.template('ejs/_head.ejs', 'template/_head.ejs');
        this.template('ejs/_foot.ejs', 'template/_foot.ejs');
        this.template('ejs/index.ejs', 'template/index.ejs');
        this.copy('src/index.js', 'src/index.js');
        this.copy('src/index.css', 'src/css/index.css');
        if (this.style.indexOf('less') > -1) {
            this.copy('src/index.less', 'src/less/index.less');
        } else if (this.style.indexOf('scss') > -1) {
            this.copy('src/index.scss', 'src/scss/index.scss');
            this.copy('config.rb', 'config.rb');
        }
        this.copy('src/mods/header.js', 'src/mods/header.js');
        this.copy('src/mods/article.js', 'src/mods/article.js');

        this.template('test/runner.html', 'test/runner.html');
        this.template('test/runner.js', 'test/runner.js');
        this.template('test/spec/index-spec.js', 'test/spec/index-spec.js');
    }
});

module.exports = MeGenerator;

/**
 * 获取工程名称
 */

function getProjectName(that) {
    var root = that.cwd;
    return path.basename(root);
}