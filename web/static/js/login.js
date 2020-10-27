function authenticate(){
  var password = $("#password").val();
  $("#password").empty();
  var username = $("#username").val();
  $("#username").empty();
  var complete_user = JSON.stringify({
            "password" : password,
            "username" : username,
          });
  console.log(complete_user)
  $.ajax({
        url: '/login',
        type: 'POST',
        contentType: 'application/json',
        data : complete_user,
        dataType:'json',
        success: function(){
            window.location="/static/html/main.html"
        }
      });
}