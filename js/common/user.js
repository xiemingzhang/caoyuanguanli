$(function () {
    userpage.init();


});

var userpage = {
    username: $.trim($("#loginname").val()),
    pwd: $.trim($("#pwd").val()),
    //code: $.trim($("#code").val()),
    ///初始化
    init: function () {

    },
    /////获取验证码
    //getcode: function () {
    //    $("#imgCode").attr("src", "/userlogin/getverifycode?" + (new Date()).valueOf());
    //},
    ///验证
    check: function () {
        var bo = true
        username = $.trim($("#loginname").val());
        pwd = $.trim($("#pwd").val());
        //code = $.trim($("#code").val());
        ///是否为空 
        if(username.length==0){
           alert("请输入登录名！");
            bo = false;
            return false;
        }
        if (pwd.length == 0) {
            alert("请输入密码！");
            bo = false;
            return false;
        }
        //if (code.length == 0) {
        //   alert( "请输入验证码！");
        //    bo = false;
        //    return false;
        //}
        //if (bo) {

        //    ///验证码正确？
        //    $.ajax({
        //        async: false,
        //        type: "post",
        //        url: "/userlogin/VerifyCode",
        //        data: { code: code },
        //        success: function (result) {
        //            if (result.Code == -1) {
        //              alert("请输入正确的验证码！");
        //                bo = false;
        //                return false;
        //            }
        //        }
        //    });
        //}
        return bo;

    },
    submit: function () {

        if (this.check()) {
            username = $.trim($("#loginname").val());
            pwd = $.trim($("#pwd").val());
            //code = $.trim($("#code").val());
            ///验证码正确？
            $.ajax({
                async: false,
                type: "post",
                url: "/userlogin/login",
                data: {
                    LoginName: username, Password: pwd
                },
                success: function (result) {
                    if (result.Code == -1) {
                        alert( result.Msg);
                        return false;
                    }
                    else {
                        window.location.href = "/home/index";
                    }
                }
            });
        }

    }
}
