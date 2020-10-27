var queryString = new Array();
var user_id;
var post_id;
var message_legth;
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
  //console.log(queryString);

  $(document).on("click", "a#delete_subject",function () {
  //$("a#delete_subject").on("click", function () {
    console.log("entro aqui");
    var $element = $(this);
    var $delete_url = $(this).attr("href");
    var $delete_trash = $(this).find('i.fa');
    var post_delete={
      key:post_id,
      values:{
        estado:1
      }
    }
    $.ajax({
      url: '/post',
      type: 'PUT',
      contentType: "application/json",
      data:JSON.stringify(post_delete),
      success: function (data) {
        if ($delete_trash.hasClass('fa-trash-o')) {
          $delete_trash.removeClass('fa-trash-o').addClass('fa-trash');
          $('body').fadeOut("slow", "swing");
          window.location="/static/html/main.html"
        }
        else {
          console.log('Unexpected error!');
        }
      }
    });
    
    return false;
  });

  $(document).on("click", "a#delete_comment",function () {
    
    var $element = $(this);
    var $delete_url = $(this).attr("href");
    var $delete_trash = $(this).find('i.fa');

    var msg_id=$(this).data("num");
    //console.log(msg_id);
    var data_msg={
      key:msg_id,
      values:{
        estado:1
      }
    }
    $.ajax({
      url: '/post_message',
      data:JSON.stringify(data_msg),
      contentType: "application/json",
      type: 'PUT',
      success: function (data) {
        if ($delete_trash.hasClass('fa-trash-o')) {
          $delete_trash.removeClass('fa-trash-o').addClass('fa-trash');
          $element.closest("li.list-group-item").fadeOut();
          $("#contador").empty();
          message_legth = message_legth - 1;
          $("#contador").append(
            '<i class="fa fa-comment fa-md" aria-hidden="true"></i> ' +
              message_legth +
              " Comments </a>"
          );
        }
        else {
          console.log('Unexpected error!');
        }
      }
    });
    
    return false;
  });






  $(document).on("click", "#js-star-subject", function () {
    
    var $star_count = $(this).find('#js-star-count');
    var id=$(this).data("num");
    //console.log(id);
    //var $star_url = $(this).attr("href");
    var $star_icon = $(this).find('i.fa');
    //console.log( $star_count.text());
    var like={
       post_id:id,
       user_id:user_id
    }
    if ($star_icon.hasClass('fa-star-o')) {
       $.ajax({
          data:JSON.stringify(like),
          url: '/post_likes',
          type: 'POST',
          contentType: "application/json",
          success: function (data) {
            console.log(data);
            $star_count.text(parseInt($star_count.text())+1);
            $star_icon.removeClass('fa-star-o').addClass('fa-star');
          }
        });

     }
     else if ($star_icon.hasClass('fa-star')) {
       $.ajax({
          data:JSON.stringify(like),
          url: '/post_likes',
          type: 'DELETE',
          contentType: "application/json",
          success: function (data) {
            console.log(data);
            $star_count.text(parseInt($star_count.text())-1);
            $star_icon.removeClass('fa-star').addClass('fa-star-o');
          }
        });

     } else {
       console.log('Unexpected error!');
     }      
    return false;
  });


  $.getJSON("/current", function (user) {
    $("#coment_as").empty();
    $("#user_id").empty();
    user_id = user.id;

    $("#currentuser").empty();
    cur =
      '<a href="#" role="button" id="user_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Profile and settings">' +
      user["name"] +
      " " +
      user["fullname"] +
      "</a>" +
      "</a>" +
      '<div class="dropdown-menu" aria-labelledby="user_dropdown" style="right:0; left:auto;">' +
      '<a class="dropdown-item" href="/logout">Sign out</a>';
    ("</div>");
    $("#currentuser").append(cur);

    div_as = 'Comment as <a class="font-weight-bold">' + user.username + "</a>";
    $("#coment_as").append(div_as);
    $("#user_id").append(user.username);

    $.getJSON("/post/" + queryString["id"], function (post) {
      //console.log(post);
      post_id = post.id;
      $("#post_content").empty();
      $("#comments_container").empty();
      $.getJSON("/post_message/" + queryString["id"], function (messages) {
        //     <div class="star-partition">
        //     <a href="/b/upiupioupo/like/" style="text-decoration:none;" title="2 points" id="js-star-subject">
        //     <i class="fa fa-lg fa-star" aria-hidden="true" id="star_icon"></i>
        //     <br>
        //     <span id="js-star-count">3</span>
        //     </a>
        //  </div>

        message_legth = messages.length;

        div =
          '<div class="star-partition">' +
          '<a style="color: #007bff;cursor: pointer;" style="text-decoration:none;" title="2 points" id="js-star-subject"  data-num="' +
          post.id +
          '">';

        if (find_user(user_id, post.likes)) {
          div =
            div +
            '<i class="fa fa-star fa-lg" aria-hidden="true" id="star_icon"></i>';
        } else {
          div =
            div +
            '<i class="fa fa-star-o fa-lg" aria-hidden="true" id="star_icon"></i>';
        }

        div =
          div +
          "<br>" +
          '<span id="js-star-count">' +
          post.likes.length +
          "</span>" +
          "</a>" +
          "</div>";

        div =
          div +
          '<div class="body-partition"><p class="post-info text-muted">' +
          '<a title="visit board" class="board-link"></a> • Posted by' +
          '<a href="/u/jcal/" title="view profile" class="profile-link">' +
          post["user_created"]["username"] +
          "</a>" +
          "<span>" +
          post["fecha_post"] +
          "</span>" +
          "</p>" +
          '<h5><a class="card-link">' +
          post["titulo"] +
          "</a></h5>" +
          "<p>" +
          post["contenido"] +
          "</p>" +
          '<div class="card-bottom-area text-muted">' +
          '<a href="/s/uoiui/upiupioupo/" id="contador">' +
          '<i class="fa fa-comment fa-md" aria-hidden="true"></i> ' +
          messages.length +
          " Comments </a>" +
          "</div></div> ";


        if(post["user_id"]==user_id){

        
        div=div+
          '<div style="float:right;">'+
          '<a href="/static/html/editpost.html?id='+post["id"]+'" title="edit subject">'+
             '<i class="fa fa-edit fa-lg"></i> Edit</a> •'+
          '<a  style="color: #007bff;text-decoration: underline;cursor: pointer;" title="delete subject" id="delete_subject">'+
             '<i class="fa fa-trash-o fa-lg"></i> Delete</a>'+
          '</div>';
          }

        //console.log(div);
        $("#post_content").append(div);
        var i = 0;
        $.each(messages, function () {
          if (user.id !== messages[i].user_id) {
            //sin delete.
            template =
              '<li class="list-group-item" id=pmessage_' +
              messages[i]["id"] +
              ">" +
              "<p>" +
              messages[i].mensaje +
              '<br><a title="view profile" id="commenter" class="card-link">' +
              messages[i]["user_created"]["username"] +
              "</a>—" +
              "<span>" +
              messages[i]["sent_on"] +
              "</span>" +
              "</p>" +
              "</li>";
          } else {
            //se crea con delete
            template =
              '<li class="list-group-item" id=pmessage_' +
              messages[i]["id"] +
              ">" +
              "<p>" +
              messages[i].mensaje +
              '<br><a href="/u/jvasquezd/" id="commenter" class="card-link">' +
              messages[i]["user_created"]["username"] +
              "</a> —" +
              "<span>" +
              messages[i]["sent_on"] +
              "</span>" +
              '<a style="color: #007bff;text-decoration: underline;cursor: pointer;" id="delete_comment" data-num="'+messages[i]["id"]+'"><i class="fa fa-trash-o"></i></a>' +
              "</p>" +
              "</li>";
          }

          //console.log(template);

          $("#comments_container").append(template);
          i++;
        });
        console.log(messages);
      });
    });
  });

  $("#comment_form textarea").on("keydown", function (evt) {
    var keyCode = evt.which ? evt.which : evt.keyCode;
    if (keyCode == 13) {
      var form = $("#comment_form");
      var comments_container = $("#comments_container");
      var input = $(this);
      var data_send = {
        mensaje: $(input).val(),
        user_id: user_id,
        post_id: post_id,
      };
      console.log(data_send);

      $.ajax({
        data: JSON.stringify(data_send),
        url: "/post_message",
        type: "post",
        cache: false,
        contentType: "application/json",
        beforeSend: function () {
          $(input).val("");
        },
        success: function (data) {
          if (user_id !== data.user_id) {
            //sin delete.
            template =
              '<li class="list-group-item" id=pmessage_' +
              data["id"] +
              ">" +
              "<p>" +
              data.mensaje +
              '<br><a title="view profile" id="commenter" class="card-link">' +
              data["user_created"]["username"] +
              "</a>—" +
              "<span>" +
              data["sent_on"] +
              "</span>" +
              "</p>" +
              "</li>";
          } else {
            //se crea con delete
            template =
              '<li class="list-group-item" id=pmessage_' +
              data["id"] +
              ">" +
              "<p>" +
              data.mensaje +
              '<br><a href="/u/jvasquezd/" id="commenter" class="card-link">' +
              data["user_created"]["username"] +
              "</a> —" +
              "<span>" +
              data["sent_on"] +
              "</span>" +
              '<a style="color: #007bff;text-decoration: underline;cursor: pointer;" id="delete_comment" data-num="'+data["id"]+'"><i class="fa fa-trash-o"></i></a>' +
              "</p>" +
              "</li>";
          }

          $("#contador").empty();
          message_legth = message_legth + 1;
          $("#contador").append(
            '<i class="fa fa-comment fa-md" aria-hidden="true"></i> ' +
              message_legth +
              " Comments </a>"
          );

          $(comments_container).find("#no_comments").fadeOut();
          $(comments_container).append(template);
          $("html, body")
            .stop()
            .animate(
              {
                scrollTop: input.offset().top - 40,
              },
              500,
              "swing"
            );
          input.focus();
        },
      });
      return false;
    }
  });
});

function find_user(id, likes) {
  for (var i = 0; i < likes.length; i++) {
    if (likes[i].user_id == id) {
      return true;
    }
  }
  return false;
}
