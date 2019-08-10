/**
 * Created by yaya on 2018/8/13.
 */
mui.init();
(function($$) {
    var arr = []; //存放被选中，需要删除商品的id
    render();

    // 1. 进入页面, 发送ajax请求, 获取购物车列表, 进行渲染
    function render() {
        $.ajax({
            type: "get",
            url: "/cart/queryCart",
            dataType: "json",
            success: function(info) {
                console.log(info);
                if (info.error === 400) {
                    // 用户没登陆, 跳转到登录页, 在跳转时, 将页面地址拼接
                    location.href = "login.html?retUrl=" + location.href;
                    return;
                }

                // 用户已登录, 通过模板引擎渲染  (需要的是对象, 要将数组包装)
                var htmlStr = template("temp", { arr: info });
                $('.ltm-main .mui-table-view').html(htmlStr);
            }
        });
    }
    //删除一条商品
    $('.mui-table-view').on('click', '.deleteProById', function() {
        arr = [];
        var id = $(this).data('id')
        arr.push(id);
        console.log(arr);
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认从购物车中,移除此商品吗？', '删除商品', ["狠心清空", "取消"], function(e) {
            if (e.index == 0) {
                $.ajax({
                    url: '/cart/deleteCart',
                    type: 'get',
                    data: {
                        "id": arr
                    },
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        if (res.success == true) {
                            mui.toast('您已成功从购物车移除此商品')
                            li.parentNode.removeChild(li);
                            render();
                        }
                    }
                })
            } else {
                setTimeout(function() {
                    $$.swipeoutClose(li);
                }, 0);
                mui.toast('您取消了删除操作')
            }
        })
    })
})(mui);