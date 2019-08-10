$(function () {
  // 1- 左侧一级分类动态渲染
  // 2- 二级分类动态渲染
  // 3- 点击左侧一级分类，实现切换效果，并且 渲染对应二级分类

  // 1- 左侧一级分类动态渲染
  // 1-1 ajax去获取一级分类的数据 
  // 1-2 模板引擎动态渲染
  $.ajax({
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function (res) {
      console.log(res);      
      // 渲染
      $('.nav-list').html(template('tmp-one', res));
    }
  })

  // 2- 二级分类动态渲染
  // 2-1 根据一级分类获取对应的二级分类的数据 
  // 2-2 渲染
  // 根据一级分类 渲染对应二级分类
  function renderSecondById(id) {
    $.ajax({
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);     
        $('.cate-main').html(template('tmp-two', res));
      }
    })
  }

  renderSecondById(1);

  // 3- 点击左侧一级分类，实现切换效果，并且 渲染对应二级分类
  $('.nav-list').on('click', 'a', function () {
    // 高亮排他 
    $(this).parent().addClass('current').siblings().removeClass('current');
    // 获取当前 a对应id，渲染对应二级分类 
    var id = $(this).data('id');
    renderSecondById(id);
  });
  
});