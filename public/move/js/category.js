$(function() {
    render();
    function render() {
        $.ajax({
            url: '/category/queryTopCategory',
            dataType: 'json',
            success: function(res) {
                // console.log(res);
                $('.nav-list').html(template('categoryItem', res));
            }
        })
    }

    function renderBrand(id){
        $.ajax({
            url: '/category/querySecondCategory',
            dataType: 'json',
            data:{
                id:id
            },
            success: function(res) {
                 console.log(res);
                $('.cate-main').html(template('renderB', res));
            }
        })
    }
    renderBrand(1);

    $('.nav-list').on('click', 'a', function () {
        $(this).parent().addClass('current').siblings().removeClass('current');
        var id = $(this).data('id');
        renderBrand(id);
    })


})