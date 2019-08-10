$(function() {
    // 1-  请求并渲染一级分类的数据
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function(info) {
                console.log(info);
                $('tbody').html(template('tmp', info));
                // 根据总数 渲染分页标签
                setPage(info.total);
            }
        })
    }

    render();

    // 2- 分页标签生成(根据数据库数据总数动态生成的)
    function setPage(total) {
        $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
            currentPage: currentPage, //当前页
            totalPages: Math.ceil(total / pageSize), //总页数     
            onPageClicked: function(event, originalEvent, type, page) {
                //为按钮绑定点击事件 page:当前点击的页面
                // 修改当前页面
                currentPage = page;
                // 重新渲染
                render();
            }
        });
    }

    // 3. 通过注册委托事件, 给 a 添加点击事件
    $('.dropdown-menu').on("click", "a", function() {
        // 选中的文本
        var txt = $(this).text();
        // 拿到 categoryId
        var id = $(this).data("id");

        // 修改文本内容
        $('#dropdownText').text(txt);

        // 将选中的 id 设置到 input 表单元素中
        $('[name="categoryId"]').val(id);

        // 需要将校验状态置成 VALID
        // 参数1: 字段
        // 参数2: 校验状态
        // 参数3: 配置规则, 来配置我们的提示文本
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });


    // 4. 配置图片上传
    $('#fileupload').fileupload({
        // 指定数据类型为 json
        dataType: "json",
        // done, 当图片上传完成, 响应回来时调用
        done: function(e, data) {
            console.log(data)
                // 获取上传成功的图片地址
            var picAddr = data.result.picAddr;
            // 设置图片地址
            $('#imgBox img').attr("src", picAddr);
            // 将图片地址存在隐藏域中
            $('[name="brandLogo"]').val(picAddr);

            // 重置校验状态
            $('.form-add').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });


    // 2. 点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function() {
        // $('#addModal').modal("show");

        // 请求一级分类名称, 渲染下拉菜单
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function(info) {
                console.log(info);
                // 将模板和数据相结合, 渲染到下拉菜单中
                var htmlStr = template("dropdownTpl", info);
                console.log("htmlStr:" + htmlStr);

                $('.dropdown-menu').html(htmlStr);
            }
        })
    });
    // 5. 配置表单校验
    $('#form').bootstrapValidator({

        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 校验的字段
        fields: {
            // 一级分类的id
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            // 品牌名称
            brandName: {
                //校验规则
                validators: {
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            // 图片的地址
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });

    // 6. 注册校验成功事件, 通过 ajax 进行添加
    $("#form").on("success.form.bv", function(e) {
        // 阻止默认的提交
        e.preventDefault();

        $.ajax({
            url: "/category/addSecondCategory",
            type: "post",
            data: $('#form').serialize(),
            success: function(info) {
                console.log(info)

                // 关闭模态框
                $('#addModal').modal("hide");
                // 重置表单里面的内容和校验状态
                $('#form').data("bootstrapValidator").resetForm(true);

                // 重新渲染第一页
                currentPage = 1;
                render();

                // 找到下拉菜单文本重置
                $('#dropdownText').text("请选择一级分类")

                // 找到图片重置
                $('#imgBox img').attr("src", "images/none.png")
            }
        })
    })

});