// /**
//  * Created by yaya on 2019/8/6.

// UUID=59DAFC93-A317-4B1B-8C0A-CD17B0228A24 none auto noauto

//  */
$(function() {
    //本地无历史数据时，测试用于初始化历史数据
    // var arr = []
    // var jsonStr = JSON.stringify(arr)
    //     //向localStorage添加历史记录
    // localStorage.setItem('searchHistoryData', jsonStr)

    //渲染列表历史数据
    render()

    // 功能3: 删除单条历史记录,使用事件委托
    // (1) 事件委托绑定点击事件
    // (2) 将下标存在删除按钮中, 点击后获取下标
    // (3) 读取本地存储, 拿到数组
    // (4) 根据下标, 从数组中将该下标的项移除,  splice
    // (5) 将数组转换成 jsonStr
    // (6) 存到本地存储中
    // (7) 重新渲染
    $('.search-content').on('click', '.fa-remove', function() {
        var that = this; // 设置this指向一直为当前删除按钮
        //删除当前下标的数组中的数据
        var arr = getHistory();
        // mui确认框
        // 参数1: 提示文本
        // 参数2: 标题
        // 参数3: 提示框按钮按钮, 要求是一个数组
        // 参数4: 点击按钮后的回调函数
        mui.confirm("你确定要删除此条历史记录嘛?", "温馨提示", ["取消", "删除"], function(e) {
            if (e.index === 1) { //点击取消时e.index为0; 点击确认时e.index的值为1
                //获取当前arr的index下标
                var index = $(that).data('index')

                //根据下标,删除历史数据
                //1、获取数组
                var arr = getHistory('searchHistoryData');
                //2、根据下标删除某项
                //splice( 从哪开始, 删几个, 添加的项1, 添加的项2, ..... );
                arr.splice(index, 1);

                // 转成 jsonStr 存入本地存储
                var jsonStr = JSON.stringify(arr);

                localStorage.setItem("searchHistoryData", jsonStr);
                // 重新渲染
                render();
            }
        })
    })

    //清空所有历史记录
    $('.search-content').on('click', '.clearAll', function() {
            mui.confirm("你确定要清空历史记录吗?", "温馨提示", ["取消", "狠心清空"], function(e) {
                if (e.index == 1) {
                    // var arr = []
                    // var jsonStr = JSON.stringify(arr)
                    //     //向localStorage添加历史记录
                    // localStorage.setItem('searchHistoryData', jsonStr)
                    localStorage.setItem('searchHistoryData', '[]')
                    render()
                }
            })
        })
        //获取历史数据 key 
    function getHistory(keyName) {
        // 如果读取不出来数据, 默认初始化为 '[]'
        var history = localStorage.getItem(keyName) || '[]'; // 得到历史
        var arr = JSON.parse(history); // 转成数组
        return arr;
    }

    //渲染列表历史数据
    function render() {
        //向localStorage获取记录
        var jsonObj = getHistory('searchHistoryData')
            //向页面渲染历史数据
        $('.search-content').html(template('historyLi', { arr: jsonObj }))
    }

    $('.searhHistory').on('click', function() {
        searchResult()
    })

});