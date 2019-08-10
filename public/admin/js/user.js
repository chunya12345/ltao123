/**
 * Created by yaya on 2019/8/1.
 */


$(function() {
    //当前页
    var currentPage = 1
        // 一页多少条
    var pageSize = 5
    render()

    function render() {
        $.ajax({
            url: '/user/queryUser',
            type: 'get',
            dataType: 'json',
            data: {
                pageSize: pageSize,
                page: currentPage
            },
            success: function(res) {
                console.log(res)
                    //显示用户数据
                var htmlStr = template('template', res)
                console.log(htmlStr)
                $('.userDate tbody').html(htmlStr)

                //显示分页
                // 调用分页函数.参数:当前所在页, 总页数(用总条数 除以 每页显示多少条,在向上取整), ajax函数
                // setPage(currentPage, Math.ceil(res.size / pageSize), render)
                // 配置分页
                $('#paginator').bootstrapPaginator({
                    // 指定bootstrap版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: res.page,
                    // 总页数
                    totalPages: Math.ceil(res.total / res.size),

                    // 当页面被点击时触发
                    onPageClicked: function(a,  b,  c, page) {
                        // page 当前点击的页码
                        currentPage = page;
                        // 调用 render 重新渲染页面
                        render();
                    }
                });


            }
        })

    }

    // $('.changeStatus').click(function() {

    // 2. 通过事件委托给 按钮注册点击事件
    $('.userDate tbody').on("click", ".btn", function() {
        // 用户 id
        var id = $(this).parent().data("id");
        // 获取将来需要将用户置成什么状态
        var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
        console.log(id);
        console.log(isDelete);

        // 先解绑, 再绑定事件, 可以保证只有一个事件绑定在 按钮上
        $('#changeStatus').off("click").on("click", function() {
            console.log(123);

            $.ajax({
                type: "post",
                url: "/user/updateUser",
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function(info) {
                    console.log(info)
                    if (info.success) {
                        // 关闭模态框
                        $('#changeModal').modal("hide");
                        // 重新渲染
                        render();
                    }
                }
            })
        })
    })


    /**
     *
     * @param pageCurrent 当前所在页
     * @param pageSum 总页数
     * @param callback 调用ajax
     */
    // function setPage(pageCurr, pageSum, callback) {
    //     $('#paginator').bootstrapPaginator({ // 这个方法调用时，自动在.pagination添加分页li
    //         /*当前使用的是3版本的bootstrap*/
    //         bootstrapMajorVersion: 3,
    //         /*配置的字体大小是小号*/
    //         size: 'small',
    //         /*当前页*/
    //         currentPage: pageCurr,
    //         /*一共多少页*/
    //         totalPages: pageSum,
    //         /*页面上最多显示几个含数字的分页按钮*/
    //         numberOfPages: pageSum,
    //         /*设置显示的样式，默认是箭头	*/
    //         itemTexts: function(type, page, current) {
    //             switch (type) {
    //                 case "first": // type值固定
    //                     return `<span class="glyphicon glyphicon-fast-backward"></span>`;
    //                 case "prev":
    //                     return `<span class="glyphicon glyphicon-step-backward"></span>`;
    //                 case "next":
    //                     return `<span class="glyphicon glyphicon-step-forward"></span>`;
    //                 case "last":
    //                     return `<span class="glyphicon glyphicon-fast-forward"></span>`;
    //                 case "page":
    //                     return page;
    //             }
    //         },
    //         onPageClicked: function(event, originalEvent, type, page) {
    //             currPage = page; // 注意currPage的作用域
    //             callback && callback();
    //         }
    //     });
    // }



})