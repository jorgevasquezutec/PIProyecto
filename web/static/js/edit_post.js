var user_id;
var queryString = new Array();
$(function () {

    if (queryString.length == 0) {
        if (window.location.search.split("?").length > 1) {
          var params = window.location.search.split("?")[1].split("&");
          for (var i = 0; i < params.length; i++) {
            var key = params[i].split("=")[0];
            var value = decodeURIComponent(params[i].split("=")[1]);
            queryString[key] = value;
          }
        }
      }

//queryString["id"]

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

            $.getJSON("/post/" + queryString["id"], function (post) {

                $("#titulo").val(post["titulo"]);
                $("#tipo").val(post['tipo']);
                $("#contenido").val(post['contenido'])

            });
                
    });

    $('#edit_post').click(function() {
      var titulo = $("#titulo").val();
      $("#titulo").empty();
      var tipo = $("#tipo").val();
      $("#tipo").empty();
      var contenido = $("#contenido").val();
      $("#contenido").empty();
      var cuser = {
            key:queryString["id"],
            values:{
            "titulo":titulo,
            "contenido":contenido,
            "tipo":tipo,
            "user_id":user_id
            }
        };
        
      //console.log(cuser)
      $.ajax({
            url: '/post',
            type: 'PUT',
            contentType: 'application/json',
            data : JSON.stringify(cuser),
            dataType:'json',
            success: function(){
                window.location="/static/html/info.html?id="+queryString["id"];
            }
          });
    });

});



