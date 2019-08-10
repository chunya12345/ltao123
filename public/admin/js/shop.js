$(function() {
    var currentPage = 1; // 当前页
    var pageSize = 5; // 一页多少条
    var picArr = []; // 专门用来保存图片对象

    // 1. 一进入页面就进行页面渲染
    render();

    function render() {
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function(info) {
                // console.log(info);
                // 将模板与数据对象相结合, 渲染到页面中
                var htmlStr = template("productTpl", info);
                // console.log(htmlStr);
                $('.shopList').html(htmlStr);

                // 进行分页初始化
                $('#paginator').bootstrapPaginator({
                    // 指定版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给下面的页码添加点击事件
                    onPageClicked: function(a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    };

    //2、点击模态框时，初始化下拉列表
    $('#addBtn').click(function() {
        // 发送 ajax 请求, 请求二级分类列表数据, 进行渲染下拉菜单
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function(info) {
                // console.log(info);
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);

                // 注意: 不要在事件处理函数中, 注册事件,
                //       会重复注册事件
            }
        })
    });

    // 3. 注册事件委托, 给 a 注册点击事件
    $('.dropdown-menu').on("click", "a", function() {
        // console.log("呵呵");
        // 获取选择的文本内容
        var txt = $(this).text();
        // 获取存在自定义属性中的 id
        // 存的时候, data-id,
        // 取的时候, 直接 $(this).data("id") 不需要加上 前面的 data-
        var id = $(this).data("id");

        $('#dropdownText').text(txt);
        // 设置隐藏域
        $('[name="brandId"]').val(id);
        // 需要将校验状态置成 VALID
        // 参数1: 字段
        // 参数2: 校验状态
        // 参数3: 配置规则, 来配置我们的提示文本
        $('#shopForm').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });
    //4、上传文件
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function(e, data) {
            console.log(data);
            var picObj = data.result;
            var picAddr = picObj.picAddr;
            console.log(picAddr);
            picArr.unshift(picObj);
            $('#imgBox').prepend('<img src="' + picAddr + '" width="100" height="100">');
            if (picArr.length > 3) {
                picArr.pop();
                // $("#imgBox img:last-child").remove();
                $("#imgBox img:last-of-type").remove();

            }
            if (picArr.length == 3) {
                $('#shopForm').data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }
        }
    });

    // 5. 配置表单校验
    $('#shopForm').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段
        fields: {
            // 二级分类id, 归属品牌
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            // 商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            // 商品库存
            // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
            // 数字: \d
            // + 表示一个或多个
            // * 表示零个或多个
            // ? 表示零个或1个
            // {n} 表示出现 n 次
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });


    // 6. 注册校验成功事件
    $("#shopForm").on("success.form.bv", function(e) {
        // 阻止默认的提交
        e.preventDefault();
        // 表单提交得到的参数字符串
        var params = $('#shopForm').serialize();
        console.log("params:" + params);

        // 拼接上所有的图片参数
        params += "&picArr=" + JSON.stringify(picArr);
        $.ajax({
            url: '/product/addProduct',
            type: 'post',
            data: params,
            success: function(info) {
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal("hide");
                    // 重置校验状态和文本内容
                    $('#shopForm').data("bootstrapValidator").resetForm(true);
                    // 重新渲染第一页
                    currentPage = 1;
                    render();

                    // 手动重置, 下拉菜单
                    $('#dropdownText').text("请选择二级分类")

                    // 删除结构中的所有图片
                    $('#imgBox img').remove();
                    // 重置数组 picArr
                    picArr = [];

                }
            }
        })
    });



    //改变状态
    // 2. 通过事件委托给 按钮注册点击事件
    $('.shopList').on("click", ".btn", function() {
        // 用户 id
        var id = $(this).parent().data("id");
        // 获取将来需要将用户置成什么状态
        var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
        console.log(id);
        console.log(isDelete);

        // 先解绑, 再绑定事件, 可以保证只有一个事件绑定在 按钮上
        $('#changeStatus').off("click").on("click", function() {
            console.log(123);
            // $.ajax({
            //     type: "post",
            //     url: "/user/updateUser",
            //     data: {
            //         id: id,
            //         isDelete: isDelete
            //     },
            //     success: function(info) {
            //         console.log(info)
            //         if (info.success) {
            //             // 关闭模态框
            //             $('#changeModal').modal("hide");
            //             // 重新渲染
            //             render();
            //         }
            //     }
            // })
        })
    })
});