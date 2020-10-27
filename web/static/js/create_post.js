var user_id;
$(function () {
  $.getJSON("/current", function (data) {
    user_id=data.id;
    $("#currentuser").empty();
        cur ='<a href="#" role="button" id="user_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Profile and settings">'+data["name"] +
        " " +
        data["fullname"] +'</a>'+'</a>'+
            '<div class="dropdown-menu" aria-labelledby="user_dropdown" style="right:0; left:auto;">'+
            '<a class="dropdown-item" href="/logout">Sign out</a>'
            '</div>';
            $("#currentuser").append(cur);

    });

    $('#crear_post').click(function() {
      var titulo = $("#titulo").val();
      $("#titulo").empty();
      var tipo = $("#tipo").val();
      $("#tipo").empty();
      var contenido = $("#contenido").val();
      $("#contenido").empty();
      var cuser = JSON.stringify({
            "titulo":titulo,
            "contenido":contenido,
            "tipo":tipo,
            "user_id":user_id
              });
      console.log(cuser)
      $.ajax({
            url: '/post',
            type: 'POST',
            contentType: 'application/json',
            data : cuser,
            dataType:'json',
            success: function(){
                window.location="/static/html/main.html"
            }
          });
    });

});



