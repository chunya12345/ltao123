// /**
//  * Created by yaya on 2019/8/6.
//  */
$(function() {
    //解析地址栏参数，将参数赋值到input搜索框中
    var key = getSearch('key');
    $('.search-txt').val(key)
        //初始化查询结果，渲染到页面
    render(key)
    $('.searhHistory').on('click', function() {
        searchResult()
    })

    //点击进行排序
    $('.lt_sort a[data-type]').click(function() {
        //排序操作
        if ($(this).hasClass("current")) {
            // 有类, 切换箭头方向
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        } else {
            // 当前a没有类, 给自己加上, 让其他的移除
            $(this).addClass("current").siblings().removeClass("current");
        }
        // 重新渲染
        render(key);
    })
})

function render(key) {
    var params = {
            proName: key,
            page: 1,
            pageSize: 100
        }
        // 两个可选的参数
        // 通过判断有没有高亮的a标签, 来决定需不需要传递排序的参数
    var $current = $('.lt_sort a.current');
    if ($current.length > 0) {
        // 当前有 a 标签有current类, 需要进行排序
        console.log("需要进行排序");
        // 按照什么进行排序
        var sortName = $current.data("type");
        // 升序还是降序, 可以通过判断箭头的方向决定, （1升序，2降序）
        var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;

        // 如果需要排序, 需要将参数添加在params中
        params[sortName] = sortValue;
    }

    setTimeout(function() {
        $.ajax({
            url: '/product/queryProduct',
            type: 'get',
            data: params,
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
}