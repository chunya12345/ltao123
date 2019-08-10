$(function() {
    // 区域滚动 
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
});

//解析地址
function getSearch(name) {
    //获取搜索地址
    var search = location.search
        //中文解码
    search = decodeURI(search)
        //1、截取 2、分隔
    search = search.slice(1).split('=');
    //获取key值 和value值
    var keyName = search[0];
    var value = search[1];
    //写成obj对象，作为返回值   
    var obj = {};
    obj[keyName] = value;
    return obj[name];
}

//获取查询结果
function searchResult() {
    //搜索历史记录
    var searchText = $('.search-txt').val().trim();
    if (searchText.length == 0) {
        //提示框
        mui.toast('请输入搜索内容', { duration: 'long', type: 'div' })
    } else {
        var getHisData = localStorage.getItem('searchHistoryData').trim();
        console.log("getHisData::::;;" + getHisData);
        var hisData = [];
        if (getHisData.length != 0) {
            hisData = JSON.parse(getHisData)
            var indexInArr = $.inArray(searchText, hisData)
            if (indexInArr == -1) {
                //搜索内容不在数据中，添加到数据最前面
                hisData.unshift(searchText)
            } else {
                //搜索内容在数据中时，返回数组中所在下标。从数组中删除后，再添加到数据最前面
                hisData.splice(indexInArr, 1)
                hisData.unshift(searchText)
            }
            // 2. 数组长度控制在 10 以内
            if (hisData.length >= 10) {
                // 移除最后一个
                hisData.pop();
            }

            //添加到本地历史记录
            console.log(hisData);
            hisData = JSON.stringify(hisData)
        } else {
            hisData.unshift(searchText)
        }
        localStorage.setItem('searchHistoryData', hisData)
        var key = $('.search-txt').val();
        setTimeout(function() {
            $.ajax({
                url: '/product/queryProduct',
                type: 'get',
                data: {
                    proName: key,
                    page: 1,
                    pageSize: 100
                },
                dataType: 'json',
                beforsend: function() {
                    // ajax加载之前,动画显示
                    $('.lt_product').html('<div class="loading"></div>');
                },
                success: function(res) {
                    console.log(res);
                    var htmlStr = template('searchResult', res)
                    $('.ltm-product').html(htmlStr);
                }
            })
        }, 1000)

        //清空搜索框
        // $('.search-txt').val('')
        // 搜索完成, 跳转到搜索列表, 并将搜索关键字传递过去
        var currentHref = location.search
        if (currentHref.length == 0) {
            location.href = "searchList.html?key=" + searchText;
        }
    }
}