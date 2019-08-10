$(function () {
  // 1- 历史记录渲染
  // 2- 清空历史记录
  // 3- 删除单条历史记录
  // 4- 添加历史记录功能 

  // 用来模拟 之前存储历史记录
  var arr = ["耐克", "李宁", "新百伦", "耐克王", "阿迪王"];

  localStorage.setItem('search', JSON.stringify(arr));

  // 1- 历史记录渲染
  function render() {
    // 1- 取数据库
    var arr = JSON.parse(localStorage.getItem('search') || '[]');
    // 2-渲染： 使用模板引擎渲染
    $('.search-content').html( template('tmp', {list: arr} ) );
  }

  render();

  // 2- 清空历史记录
  // 1- 点击清空按钮，弹出模态框，询问是否请求
  // 2- 确定清空， 调用remove(search), 删除search对象所有历史记录删除；
  // 3- 重新渲染页面

  // mui 提示框使用
  // mui.confirm(提示内容，标题，[按钮], function (e){})

  // 用事件委托 给动态生成盒子绑定事件
  $('.search-content').on('click', '.his-clear', function (){
    // $('.his-clear').click(function () {
    // 弹出模态框
    mui.confirm('确定要清空吗？', '警告', ['取消', '狠心删除'], function (e) {
      console.log(e);  
      // e.index 点击按钮的索引值 
      if (e.index == 1) {
        //清空 
        localStorage.removeItem('search');
        // 重新渲染
        render();
      }
    });
  });

  // 3- 删除单条记录
  // 1- 用事件委托给删除按钮绑定点击事件， 
  // 2- 弹出一个确认框 ，如果确定删除，继续操作
  // 3- 获取点击数据对应的下标，根据下标进行删除即可  2 
  //    数据在localStorage以字符串的形式存储的， 操作不方便， 取出来转出数组，对数组进行操作， 
  //    操作完成后，在转回字符串，存储回localStorate中即可
  //    3-1 取出json字符串，转成数组
  //    3-2 从数组中，根据下标删除
  //    3-3 把数组转回字符串，存储回localStorate中
  // 4- 删除完成后，页面重新渲染 

  $('.search-content').on('click', '.his-del', function () {
    var that = this; // 保存外部this 
    //弹出模态框
    mui.confirm('确定要删除吗？', '温馨提示', ['取消', '删除'], function (e) {
      if (e.index == 1) {
        // 将进行删除
        // 根据 下标进行删除
        // 获取下标 
        var index = $(that).data('index');
        // 3-1 取出json字符串，转成数组
        var arr = JSON.parse(localStorage.getItem('search'));
        // 3-2 从数组中，根据下标删除  arr.splice(从哪删，删几个， 替换项) 
        arr.splice(index, 1);
        // 3-3 数组转回字符串，存储回localStorate中
        localStorage.setItem('search', JSON.stringify(arr));
        // 4-页面重新渲染
        render();
      }
    }) 
  });

  // 4- 添加历史记录功能 
  // 1- 点击添加按钮，获取输入框的值，判断值是否为空，为空提示，到此结束
  // 2- 把输入关键字 添加到历史记录中
  //    2-1 取出json字符串，转成数组
  //    2-2 向数组中添加
  //    2-3 把数组转回字符串，存储回localStorate中
  // 注意点： 
  //    1-只保留最新10条记录
  //    2-历史记录中不能有重复项， 如果有 先删除之前记录，在添加最新记录；






});