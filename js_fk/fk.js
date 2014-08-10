/* 
 *  email: senlin#hiloong.com
 *  website:　www.hiloong.com
 *  俄罗斯方块  版本 0.01
 *  data : 2014-05-13
 *  没有兼容ie8 主要是的是按键的问题
 *  基本操作： a 左边， d 右边， 空格或者回车表示变形
 * 
 *  文件三个： 
 *      第一个： index.php ; 主程序和一些html 标签
 *      第二个:  fk.js 功能函数
 *      第三个： jquery
 *      
 *      
 *      核心定义的是 function  fk() 定义的结构， 每种方块的，定义和变形 
 */

// 调试的时候打印信息 

function prt(str) {

    $("#info").html(str);
}


// 数组的复制

function array_clone (arr) {
    // 判读是否是数组
    if(arr instanceof Array) { 
        var a = new Array();
        for (var i in arr) {
            if(arr[i] instanceof Array) {
                a.push(array_clone(arr[i]));
            } else {
                a.push(arr[i]);
            }
        }
        return a;
    } else {
        return NULL;
    }
        
}




// 测试使用用于打印对象的值

// type == 1 表示 返回，不打印
// type == 0 表示直接 alert
function var_dump(o, type) {
    var info = "";

    function d1(o) {
        var tmp = "";
        for (var iter in o) {
            tmp = tmp + "\n" + iter + ": " + o[iter];
            if (typeof o[iter] === 'object') {
                info = info + d2(o[iter]);
            }
        }
        return tmp;
    }

    function d2(o) {
        var tmp = "";
        for (var iter in o) {
            tmp = tmp + "\n" + iter + ": " + o[iter];
            if (typeof o[iter] === 'object') {
                info = info + d1(o[iter]);
            }
        }
        return tmp;
    }


    for (var iter in o) {
        info = info + "\n" + iter + ": " + o[iter];
        if (typeof o[iter] === 'object') {
            info = info + d1(o[iter]);
        }
    }

    if (type)
        return (info + "\t#");
    alert(info);
}


GAMESPEED = 600; // 设置游戏的速度， 1000 是一秒钟，这个是真对下落的速度
MAPX = 10; // x 方向的格数
MAPY = 15; // y 方向的各数
UL = 40; // 单元长度，单位是像素
B_COLOR = 'white'; // 背景颜色
U_COLOR = 'red';  // 单元格颜色

score = 0;
map_data = new Array();
f_now = get_fk();  // !!!!  这个是是个全局变量


// 当一个活动的方块，下降结束的时候，对新的 map_data
// 进行可能的操作， 积分 ，和 消行
function scan() {
    
    for(var j = MAPY-1; j >= 0; j--) {
        var t = 1;
        for(var i = 0; i < MAPX; i++) {
            t *= map_data[j][i];
        }

        if(t) {  // 表示这一行被填满了            
            //alert("1rd");
            //$(".u").css("background-color", "green");
            del_line(j); // 删除 第 j 行
        } else {
            
            //$(".u").css("background-color", "red");
        }
    }
   
}

// 删除第 j 行
// 这个需要操作的是 在第 j 行以上的全部下降一行
function del_line(n) {
    
    $("#info").html("得分是"+ ++score);
    console.log(map_data);
    //alert(n);
    for(var i = 0; i < 0; i++) {
        map_data[n][i] = 0;
    }
    

    for(var j = n; j > 0; j--) {
        for(var i = 0; i < MAPX; i++) {
            map_data[j][i] = map_data[j-1][i];
        }

    }
    
console.log(map_data);    
    draw_map_data();  // 重新刷新视图
    scan();
}



// 根据全局变量 map_data 来刷新 #map
function draw_map_data() {
    for(var j = 0; j < MAPY; j++) {
        for(var i = 0; i < MAPX; i++) {
            if(map_data[j][i]) {
                $("#u_"+j+"_"+i).css({
                    "background-color" : U_COLOR
                });
            } else {
                $("#u_"+j+"_"+i).css({
                    "background-color" : B_COLOR
                });
            }
        }
    }
}


function down() {
    // 这里进行是否可以向下运动
    if(move_able_d(f_now)) {
        setTimeout(down, GAMESPEED);
    } else {
        // 这里说明已经落到底部，或者已经不能再次移动
        var data = array_clone(f_now.data[f_now.status]);
        
        // 用来存储已经放好位置的方块
        for (var i in data) {
            var y = data[i][0] + f_now.dy;
            var x = data[i][1] + f_now.dx;
            map_data[y][x] = 1;
        }
        scan();
        // 创建一个新的方块
        f_now = get_fk();
        down();
    }
    draw_u(f_now, 0);
    f_now.dy++;
    draw_u(f_now, 1);
    
    
}


// 随机获得一个方块
function get_fk() {
    var f = new fk(parseInt(Math.random()*7)+1, parseInt(Math.random()*4));
    f.dx = 5;
    f.dy = 0;
    return f;
}

// 初始化工作
function init() {
    draw();
    for (j = 0; j < MAPY; j++) {
        map_data[j] = new Array();
        for (i = 0; i < MAPX; i++) {
            map_data[j][i] = 0;
        }
    }
    // 打印初始得分
    $("#info").html("得分是"+ score);
}



// 绘制地图
function draw() {

    $("body").append('<div id="info"></div>');

    $("body").append("<div id='map'></div>");
    $("#map").css({
        "border": "3px solid blue",
        "width": ((UL + 2) * MAPX) + "px",
        "height": ((UL + 2) * MAPY) + "px"
    });


    for (y = 0; y < MAPY; y++) {
        for (x = 0; x < MAPX; x++) {
            if (x === 0)
                $("#map").append("<div style='clear:both'></div>");
            $("#map").append("<div class='u' id='u_" + y + "_" + x + "'> " + y + " " + x + " </div>");

        }
    }

    $(".u").css({
        "border": "1px solid red",
        "float": "left",
        "width": UL + "px",
        "height": UL + "px",
    });

}


// 定义结构

// type === 1 : 表示 四个方块 D
// type === 2 : 表示 一个数杠 I
// type === 3 : 表示 L
// type === 4 : 表示 RL
// type === 5 : 表示 T
// type === 6 : 表示 N
// type === 7 : 表示 RN


// stattus  = [0 -- 4] 表示其中的一个信息
function fk(type, status) {
    this.type = type;
    this.status = status;

    this.set = function(x, y) {
        this.dx = x;
        this.dy = y;
    };
    // dx, dy 中心的偏移量
//    this.dx = 0;
//    this.dy = 0;

    this.data = [];

    switch (this.type) {
        case 1:
            this.data = [
                [[0, 0], [0, 1], [1, 0], [1, 1]],
                [[0, 0], [0, 1], [1, 0], [1, 1]],
                [[0, 0], [0, 1], [1, 0], [1, 1]],
                [[0, 0], [0, 1], [1, 0], [1, 1]]
            ];
            break;

        case 2:
            this.data = [
                [[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]],
                [[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]]
            ];
            break;

        case 3:
            this.data = [
                [[-1, 0], [0, 0], [1, 0], [1, 1]],
                [[0, -1], [0, 0], [0, 1], [1, -1]],
                [[-1, -1], [0, 0], [-1, 0], [1, 0]],
                [[-1, 1], [0, 0], [0, -1], [0, 1]]
            ];
            break;

        case 4:
            this.data = [
                [[1, -1], [0, 0], [-1, 0], [1, 0]],
                [[-1, -1], [0, 0], [0, -1], [0, 1]],
                [[-1, -1], [0, 0], [-1, 0], [1, 0]],
                [[-1, 1], [0, 0], [0, -1], [0, 1]]
            ];
            break;

        case 5:
            this.data = [
                [[0, -1], [0, 0], [0, 1], [-1, 0]],
                [[-1, 0], [0, 0], [1, 0], [0, 1]],
                [[0, -1], [0, 0], [0, 1], [1, 0]],
                [[-1, 0], [0, 0], [1, 0], [0, -1]]
            ];
            break;

        case 6:
            this.data = [
                [[1, 0], [0, 0], [0, 1], [-1, 1]],
                [[0, -1], [0, 0], [1, 0], [1, 1]],
                [[-1, 0], [0, 0], [0, -1], [1, -1]],
                [[-1, -1], [0, 0], [-1, 0], [0, 1]]
            ];
            break;

        case 7:
            this.data = [
                [[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[1, -1], [0, 0], [1, 0], [0, 1]],
                [[-1, -1], [0, 0], [0, -1], [1, 0]],
                [[0, -1], [0, 0], [-1, 0], [-1, 1]]
            ];
            break;

        default:


    }
}

// 绘制图形
// 参数 o = new fk()
// type = 0 表示情况颜色
// type = 1 绘制单元格颜色

function draw_u(o, type) {
    var d = o.data[o.status];
    for (var key in d) {

        var y = d[key][0] + o.dy;
        var x = d[key][1] + o.dx;

        if (type) {
            $("#u_" + y + "_" + x).css({
                "background-color": U_COLOR
            });
            
            $("#u_" + o.dy + "_" + o.dx).css({
                "outline": "3px solid green"
            });
        } else {
            $("#u_" + y + "_" + x).css({
                "background-color": B_COLOR
            });
            
            $("#u_" + o.dy + "_" + o.dx).css({
                "outline": "0px solid green"
            });
        }
    }
}



// 改变状态
function ch_u(o) {
    draw_u(o, 0); // 清除当前的颜色
    o.status = (o.status + 1) % 4; // 状态的改变
    draw_u(o, 1); // 绘制当前的颜色
}

// 移动
function move_u(o) {
    draw_u(o, 0);
}

// 判读是否可以移动
// move_able 
// 有两种限制，边界限制，和非空位设置

function move_able(data, map_data) {
   
    for (var i = 0; i < data.length; i++) {
        
        if (data[i][0] >= MAPY) {
            return false;
        }
        if (data[i][1] < 0 || data[i][1] >= MAPX) {
            return false;
        }
        // 非空位检查 || 占位检查
        var x = data[i][1];
        var y = data[i][0];
        
        if (map_data[y][x] !== 0) {
             //return true;
            return false;
        }
    }
    return true;
}


// 变形判读 

function change_able(o) {
    
    var data = array_clone(o.data[(o.status+1)%4]);
    for (var i in data) {    
        data[i][0] = data[i][0] + o.dy ;
        data[i][1] = data[i][1] + o.dx;
    }
    //return true;
    return move_able(data, map_data);
}

// 下判读, 是否可以向下运动
function move_able_d(o) {
    var data = array_clone(o.data[o.status]);
    for (var i in data) {    
        data[i][0] = data[i][0] + o.dy + 1 ;
        data[i][1] = data[i][1] + o.dx;
    }
    return move_able(data, map_data);
}


// 左判读，左边是否可以移动
function move_able_l(o) {
    var data = array_clone(o.data[o.status]);
    for (var i in data) {    
        data[i][0] = data[i][0] + o.dy ;
        data[i][1] = data[i][1] + o.dx - 1;
    }
    return move_able(data, map_data);
}


// 判断是否可以移动
// 右判断， 右边是否可以移动
function move_able_r(o) {
    var data = array_clone(o.data[o.status]);
    for (var i in data) {
        data[i][0] = data[i][0] + o.dy ;
        data[i][1] = data[i][1] + o.dx + 1;
    }
    return move_able(data, map_data);
}





