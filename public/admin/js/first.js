$(function() {
    // 1-  请求并渲染一级分类的数据
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
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

    // 3- 表单校验
    $('.form-add').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 3-设置验证字段
        fields: {
            // name属性
            categoryName: {
                // 校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '一级分类不能为空'
                    }
                }
            }
        }

    });

    // 4-1 点击提交按钮，在数据验证通过的情况下，发生数据给后台
    // 4-2 后台获取数据，进行添加
    // 4-3 添加完成后，页面重新渲染，隐藏模态框
    $('#form').on('success.form.bv', function(e) {
        console.log(12341234);

        // 阻止默认行为
        e.preventDefault();
        //发送ajax请求给后台
        $.ajax({
            url: "/category/addTopCategory",
            type: "POST",
            data: $('#form').serialize(),
            dataType: 'json',
            success: function(info) {
                console.log(info);
                // 页面重新渲染，
                render();
                // 隐藏模态框
                $('#addModal').modal('hide');
                // 表单验证插件 重置
                // resetForm();只重置表单验证的样式 
                // resetForm(true);重置表单验证的样式和表单数据 
                $('.form-add').data('bootstrapValidator').resetForm(true);
            }
        })
    });
});