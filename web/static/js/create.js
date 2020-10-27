function create(){
  var password = $("#password").val();
  $("#password").empty();
  var username = $("#username").val();
  $("#username").empty();
  var name = $("#name").val();
  $("#name").empty();
  var fullname = $("#fullname").val();
  $("#fullname").empty();
  var cuser = JSON.stringify({
            "password" : password,
            "username" : username,
            "name": name,
            "fullname":fullname,
          });
  console.log(cuser)
  $.ajax({
        url: '/users',
        type: 'POST',
        contentType: 'application/json',
        data : cuser,
        dataType:'json',
        success: function(){
            window.location="/static/html/login.html"
        }
      });
}