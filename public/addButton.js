UE.registerUI('wordFormat', function (editor, uiName) {
    function findChild($e, reg) {
        var $r = $e;
        $e.find('>*').each(function (i, c) {
            var $c = $(c);
            if (new RegExp(reg).test($c.text())) {
                $r = findChild($c, reg);
                return true;
            }
            return false;
        });
        return $r;
    }

    // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand('tt', {
        execCommand: function (name, options) {
            // 去除多余的回车符
            var content = editor.getContent();
            var format = window._formatWord || function (content, options) {
                // mac
                content = content
                    .replace(/(<p class="p(\d*)"><span class="s(\d*)"><\/span><br\/><\/p>\n?){2,}/g, '<p><br/></p>')
                    .replace(/(<p class="p(\d*)"><br\/><\/p>\n?){2,}/g, '<p><br/></p>');

                //console.log('content:', content);
                var $content = $('<div>' + content + '</div>');
                if (options.delSpace) {
                    $content.find('>p').each(function (i, ele) {
                        var $e = $(ele);
                        var reg = /^[\u00a0 ]+/;
                        var find = reg.test($e.text());
                        var count = 0;
                        while(find && count < 50){
                            var $c = findChild($e, reg);
                            // 如果含有子标签，先去除子标签，再删空格，再还原子标签
                            if (/^[(&nbsp;) ]+/.test($c.html())) {
                                $c.html($c.html().replace(/^[(&nbsp;) ]*/,''));
                            } else {
                                $c.text($c.text().replace(new RegExp(reg), ''));
                            }
                            find = reg.test($e.text());
                            count ++;
                        }
                    })
                }
                if (options.numbers == 2){
                    // 1.1.1
                    var reg = /^[\s ]*\d+[、.\d]*/;

                    $content.find('>p').each(function (i, ele) {
                        var $e = $(ele);
                        var p = $e.text();
                        if (reg.test(p)) {
                            // var $c = findChild($e, reg);
                            var ns = p.match(reg)[0];
                            var n = 0;
                            if (ns.indexOf('、') !== -1) {
                                n = ns.replace(/、$/, '').split('、').length;
                            } else if (ns.indexOf('.') !== -1) {
                                n = ns.replace(/.$/, '').split('.').length;
                            }

                            // console.log('find:', n, p);
                            // $c.text(space + $c.text().replace(/\s*/,''));
                            if (n) {
                                $e.css({'margin-left': (n * 10) + 'px', 'text-indent': '0'})
                            }
                        }
                    });
                }
                if (options.numbers == 4) {
                    var list = [];
                    var regs = [
                        [/^\s*[一二三四五六七八九十]+、/, /^\s*一、/],            // 一、
                        [/^\s*\d+、/, /^\s*1、/],                              // 1、
                        [/^\s*\d+\.\d+\.\d+\.\d+\.\d+/, /^\s*\d+\.\d+\.\d+\.\d+\.1/],  // 1.1.1.1.1
                        [/^\s*\d+\.\d+\.\d+\.\d+/,/^\s*\d+\.\d+\.\d+\.1/],           // 1.1.1.1
                        [/^\s*\d+\.\d+\.\d+/, /^\s*\d+\.\d+\.1/],                  // 1.1.1
                        [/^\s*\d+\.\d+/,/^\s*\d+\.1/],                           // 1.1
                        [/^\s*\d+\./, /^\s*1\./],                              // 1.
                        [/^\s*[a-z]+\./, /^\s*a\./],                           // a.
                        [/^\s*[a-z]+、/, /^\s*a、/],                            // a、
                        [/^\s*[a-z]+\)/, /^\s*a\)/],                           // a)
                        [/^\s*\d+\)/, /^\s*1\)/],                              // 1)
                        [/^\s*\(\d*\)/, /^\s*\(1\)/],                          // (1)
                    ];
                    var regStarts = [, /^\s*1、/,]
                    $content.find('>p').each(function (i, ele) {
                        var $e = $(ele);
                        var p = $e.text();
                        for (var i = 0; i < regs.length; i++) {
                            if (regs[i][0].test(p)) {
                                if (list[list.length-1] !== regs[i]) {
                                    // 如果开头不是1，寻找上一级
                                    if(!regs[i][1].test(p)){
                                        var isFind = false;
                                        for (var j = list.length-1; j>=0; j--){
                                            if (list[j] === regs[i]) {
                                                list.splice(j+1);
                                                isFind = true;
                                                break;
                                            }
                                        }
                                        if(!isFind){
                                            console.log('标号异常:', p);
                                        }
                                    } else {
                                        list.push(regs[i]);
                                    }
                                }
                                $e.css({'margin-left': (list.length * 10) + 'px', 'text-indent': '0'})
                                break;
                            }
                        }

                    })
                }
                return $content.html();
            }

            content = format(content, options);
            editor.setContent(content);
            dialog.close();
        }
    });

    //创建dialog
    var dialog = new UE.ui.Dialog({
        //指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
        iframeUrl: 'wordFormat.html',
        //需要指定当前的编辑器实例
        editor: editor,
        //指定dialog的名字
        name: uiName,
        //dialog的标题
        title: "WORD一键排版",

        //指定dialog的外围样式
        cssRules: "width:400px;height:180px;"
    });

    //创建一个button
    var btn = new UE.ui.Button({
        name: 'dialogbutton' + uiName,
        title: 'dialogbutton' + uiName,
        cssRules: 'background: url("./word-icon.png")!important; background-size: 20px 20px',
        //点击时执行的命令
        onclick: function () {
            //渲染dialog
            dialog.render();
            dialog.open();
        }
    });

    window._editor = editor;

    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);
