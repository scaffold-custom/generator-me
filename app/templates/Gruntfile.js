module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'connect-livereload']});
    grunt.initConfig({
        // 指定打包目录
        buildBase: 'build',
        //源码目录
        srcBase: 'src',
        //模板目录
        tmplBase: 'template',

        clean: {
            build: [
                '<%%=buildBase %>'
            ]
        },

        kmc: {
            options: { <%
                if (combo == 'Y') { %>
                        depFilePath: '<%%=buildBase %>/deps.js',
                    comboOnly: true,
                    fixModuleName: true,
                    comboMap: true,
                    <%
                } %>
                    packages: [{
                        name: '<%=name%>',
                        path: '<%%=srcBase %>',
                        charset: 'utf-8',
                        ignorePackageNameInUri: true

                    }]
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%=srcBase %>',
                    src: ['**/*.js'],
                    dest: '<%%=buildBase %>'
                }]
            }
        },


        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%%= srcBase %>',
                    src: ['**/*.js', '**/*.css', '!**/*.less.css', '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.png', '**/*.jpg', '**/*.swf'],
                    dest: '<%%= buildBase %>'
                }]
            }

        },
        <% if (style.indexOf('scss') > -1) { %>
        compass: {
            dev: {
                options: {
                    config: 'config.rb',
                    specify: '<%%= srcBase %>/**/*.scss',
                    sassDir: '<%%= srcBase %>/scss',
                    cssDir: '<%%= srcBase %>/css',
                    debugInfo: false,
                    outputStyle: 'expand' //expand or nest or compact or compress
                }
            }
        },
        <% } else if (style.indexOf('less') > -1) { %>
        less: {
            options: {
                paths: ['<%%= srcBase %>']
            },

            dev: {
                options: {
                    sourceMap: true,
                    outputSourceFiles: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= srcBase %>',
                    dest: '<%%= srcBase %>',
                    src: ['**/*.less', '!**/_*.less', '!bower_components/**'],
                    ext: '.css'
                }]
            }
        },
        <% } %>
        cssmin: {
            build: {
                expand: true,
                cwd: '<%%= buildBase %>',
                src: ['**/*.css', '!**/*-min.css'],
                dest: '<%%= buildBase %>',
                ext: '-min.css'
            }
        },

        uglify: {
            options: {
                mangle: {
                    except: ['KISSY']
                },
                preserveComments: 'some',
                'ascii-only': true
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%%= buildBase %>',
                    src: ['**/*.js', '!*-min.js'],
                    dest: '<%%= buildBase %>',
                    ext: '-min.js'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox > 10', 'Opera > 10', 'ie > 6', 'Chrome > 20']
                // Task-specific options go here.
            },
            build: {
                expand: true,
                cwd: '<%%= srcBase %>',
                src: ['**/*.css'],
                dest: '<%%= srcBase %>',
                ext: '.css',
            },
        },
        ejs: {
            all: {
                options: {
                    // title: 'My Website',
                    version: '201407015',
                    // url: function(url) {
                    //     return 'http://example.com/formatted/url/' + url;
                    // },
                },
                expand: true,
                cwd: '<%%= tmplBase %>',
                src: ['**/*.ejs', '!**/_*.ejs'],
                dest: 'view',
                ext: '.html',
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: /\.\.\/\.\.\/src\/ZeroClipboard\.swf/g,
                        replacement: 'http://mu.tanx.com/js/libs/ZeroClipboard.swf'
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '<%%= buildBase %>',
                    src: ['sdk_doc.js'],
                    dest: '<%%=buildBase %>'
                }]
            }
        },
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost',
                livereload: 35797,
                // keepalive: true
            },
            server: {
                options: {
                    open: true,
                    base: 'view',
                    middleware: function(connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        var lrSnippet = require('connect-livereload')({
                            port: options.livereload
                        });
                        var middlewares = [lrSnippet, proxy];
                        // return [
                        //     lrSnippet,
                        //     // Include the proxy first
                        //     proxy,
                        //     // Serve static files.
                        //     connect.static(options.base.toString()),
                        //     // // Make empty directories browsable.
                        //     connect.directory(options.base.toString())
                        // ];

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Serve static files.
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });

                        // Make directory browse-able.
                        var directory = options.directory || options.base[options.base.length - 1];
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                },
                proxies: [{
                    context: '/cortex',
                    host: '10.10.2.202',
                    port: 8080,
                    https: false,
                    xforward: false,
                    headers: {
                        "x-custom-added-header": 'test head'
                    }
                }]
            },
        },
        watch: {
            ejs: {
                files: ['<%%= tmplBase %>/**/*.ejs'],
                tasks: ['ejs']
            },
            <% if (style.indexOf('scss') > -1) { %>
            compass: {
                files: [ '<%%= srcBase %>/**/*.scss' ],
                tasks: [ 'compass' ]
            },
            <% } else { %>
            less: {
                files: [ '<%%= srcBase %>/**/*.less' ],
                tasks: [ 'less' ]
            },
            <% } %>
            autoprefixer: {
                files: ['<%%= srcBase %>/**/*.css'],
                tasks: ['autoprefixer']
            },
            kmc: {
                files: ['<%%= srcBase %>/**/*.js'],
                tasks: ['kmc:main']
            },
            livereload: {
                options: {
                    livereload: '<%%=connect.options.livereload%>' //监听前面声明的端口  35729
                },

                files: [ //下面文件的改变就会实时刷新网页
                    'view/*.html',
                    'src/**/*.css',
                    'src/**/*.js',
                    'src/images/**/*.{png,jpg}'
                ]
            }
        }
    });

    var GRUNT_BEGIN_TS = Date.now();
    var timeLine = [];

    grunt.registerTask('timer', 'Log time spent', function(name) {
        if (name !== 'end') {
            timeLine.push({
                task: name,
                ts: Date.now()
            });
        }

        if (name === 'end') {
            timeLine.reduce(function(prev, current) {
                var taskName = current.task.replace(/--/g, ':');
                console.log('   ' + taskName + '\t ' + (current.ts - prev.ts) / 1000 + 's');
                return current;
            }, {
                ts: GRUNT_BEGIN_TS
            });
            grunt.log.ok('Total took ' + (Date.now() - GRUNT_BEGIN_TS) / 1000 + 's');
        }
    });

    function addTimerTask(tasks) {
        tasks = tasks.reduce(function(prev, current) {
            prev.push(current);
            prev.push('timer:' + current.replace(/:/g, '--'));
            return prev;
        }, []);

        tasks.push('timer:end');
        return tasks;
    }


    /**
     * 注册基本任务
     */
    var defaultTasks = ['clean',<% if (style.indexOf('scss') > -1) { %>'compass:dev' <% } else { %> 'less:dev' <% } %> , 'autoprefixer', 'ejs', 'copy:all', 'cssmin', 'kmc:main', 'replace', 'uglify:build'];
    grunt.registerTask('default', addTimerTask(defaultTasks));
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('live', ['php']);

};