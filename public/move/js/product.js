/**
 * Created by Jepson on 2018/8/13.
 */

$(function() {
    //解析地址，获取产品详情信息
    var $productId = getSearch('productId');
    console.log($productId);
    $.ajax({
        type: "get",
        url: "/product/queryProductDetail",
        data: {
            id: $productId
        },
        dataType: "json",
        success: function(info) {
            console.log(info);
            var htmlStr = template("productDetail", info);
            $('.ltm-main .mui-scroll').html(htmlStr);
            //调用论播图方法
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            //手动
            mui('.mui-numbox').numbox()
        }
    })

    //添加委托事件,选择尺寸
    $('.ltm-main').on("click", ".ltm_size span", function() {
        //排他后,为当前span添加current类名
        $(this).addClass("current").siblings().removeClass("current");
    });
    $('.addCart').on('click', function() {
        //判断是否选择尺寸
        console.log($('.ltm_size').find('.current').length);

        if ($('.ltm_size').find('.current').length === 0) {
            mui.toast('请选择尺码', { duration: 'long', type: 'div' })
        } else {
            //参数说明：
            // productId 产品id
            // num 产品数量
            // size 产品尺码

            var productId = $productId;
            var num = $('.mui-numbox-input').val();;
            var size = $('.ltm_size').find('.current').text();
            console.log(productId, num, size);
            $.ajax({
                type: "post",
                url: "/cart/addCart",
                data: {
                    productId: productId,
                    num: num,
                    size: size
                },
                dataType: "json",
                success: function(info) {
                    console.log(info);
                    if (info.error == 400) {
                        //?后的参数，作为跳转登录页面的参数，用于登录成功时，可返回当前浏览的页面
                        location.href = "login.html?retUrl=" + location.href;;
                    }
                    if (info.success) {
                        // 加入购物车之后提示框
                        mui.confirm("添加成功", "成功加入购物车", ["继续看看", "去购物车"], function(e) {
                            console.log(e);
                            if (e.index === 1) {
                                //  去购物车
                                location.href = "cart.html";
                            }

                        })
                    }
                }
            })
        }
    })
})