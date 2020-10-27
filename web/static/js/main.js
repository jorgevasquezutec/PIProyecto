var user_id;
$(function () {

   $.getJSON("/current", function (data) {
      user_id=data.id;
      getPosts(data);
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


});

function getPosts(user){

    $("#currentuser").empty();
    $("#container_post").empty();
    var i = 0;
    cur ='<a href="#" role="button" id="user_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Profile and settings">'+user["name"] +
    " " +
    user["fullname"] +'</a>'+'</a>'+
         '<div class="dropdown-menu" aria-labelledby="user_dropdown" style="right:0; left:auto;">'+
         '<a class="dropdown-item" href="/logout">Sign out</a>'
         '</div>';
         $("#currentuser").append(cur);

         $.getJSON("/post", function (data) {
            //console.log(data);
             $.each(data, function () {
                div='<div class="card card-styling">'+
                '<div class="card-body card-body-styling">'+
                   '<div class="star-partition">'+
                      '<a href="/b/hack_here/like/" style="text-decoration:none;" title="2 points" id="js-star-subject" data-num="'+data[i].id+'">';

                  //si encuentro mi usario en likes.
                  if(find_user(user_id,data[i].likes)){
                     div=div+ '<i class="fa fa-star fa-lg" aria-hidden="true" id="star_icon"></i>';
                  }else{
                     div=div+ '<i class="fa fa-star-o fa-lg" aria-hidden="true" id="star_icon"></i>';
                  }
                                     
                div=div+'<br>'+
                      '<span id="js-star-count" style="margin-left: 5px;">  '+data[i].likes.length+'</span>'+
                      '</a>'+
                   '</div>'+
                   '<div class="body-partition">'+
                      '<p class="post-info text-muted">'+
                         '<a  title="visit board" class="board-link"></a>Posted by'+
                         '<a  style="color: #007bff;text-decoration: underline" title="view profile" class="profile-link"> '+data[i].user_created.username+' </a>'+
                         '<span>'+
                         data[i].fecha_post+
                         '</span>'+
                      '</p>'+
                      '<h5><a  style="color: #007bff;text-decoration: underline;cursor: pointer;" onclick="getinfo('+data[i].id+')" class="card-link">'+ data[i].titulo+'</a></h5>'+
                      '<p>'+data[i].contenido+'</p>'+
                   '</div>'+
                '</div>'+
             '</div>';

               // console.log(div);
                $("#container_post").append(div);
                i++;
            })

            $("#container_post").data("num", data);
         })

     $("#search").keyup(function(){
      var text=$('#search').val();
      var data_post=$("#container_post").data("num");
      console.log(data_post);
      
      var nueva_data=filterItems(text, "titulo", data_post);
      $("#container_post").empty();
      var i=0;
      $.each(nueva_data, function () {

         div='<div class="card card-styling">'+
         '<div class="card-body card-body-styling">'+
            '<div class="star-partition">'+
               '<a href="/b/hack_here/like/" style="text-decoration:none;" title="2 points" id="js-star-subject">';

           if(find_user(user_id,nueva_data[i].likes)){
              div=div+ '<i id="star_'+nueva_data[i].id+'" class="fa fa-star fa-lg" aria-hidden="true" id="star_icon"></i>';
           }else{
              div=div+ '<i id="star_'+nueva_data[i].id+'" class="fa fa-star-o fa-lg" aria-hidden="true" id="star_icon"></i>';
           }
                              
         div=div+'<br>'+
               '<span id="js-star-count" style="margin-left: 5px;">  '+nueva_data[i].likes.length+'</span>'+
               '</a>'+
            '</div>'+
            '<div class="body-partition">'+
               '<p class="post-info text-muted">'+
                  '<a  title="visit board" class="board-link"></a>Posted by'+
                  '<a  style="color: #007bff;text-decoration: underline" title="view profile" class="profile-link"> '+nueva_data[i].user_created.username+' </a>'+
                  '<span>'+
                  nueva_data[i].fecha_post+
                  '</span>'+
               '</p>'+
               '<h5><a  style="color: #007bff;text-decoration: underline;cursor: pointer;" onclick="getinfo('+nueva_data[i].id+')" class="card-link">'+ nueva_data[i].titulo+'</a></h5>'+
               '<p>'+nueva_data[i].contenido+'</p>'+
            '</div>'+
         '</div>'+
      '</div>';


      $("#container_post").append(div);
      i++;
      });
     });
}


function find_user(id,likes){
      for(var i=0;i<likes.length;i++){
            if(likes[i].user_id==id){
               return true;
            }
      }
      return false;
}

function getinfo(id){
   console.log(id);
   var url = "/static/html/info.html?id=" + encodeURIComponent(id);
   window.location.href = url;
}

function filterItems(query, value, data_user) {
   if (query != "" || query != undefined) {
     return data_user.filter(function (el) {
       return el[value].toLowerCase().indexOf(query.toLowerCase()) > -1;
     });
   }
   return data_user;
 }


 function formatDate(date) {
   var hours = date.getHours();
   var minutes = date.getMinutes();
   var month = date.getMonth() + 1;
   var day = date.getDate();
   var ampm = hours >= 12 ? "pm" : "am";
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? "0" + minutes : minutes;
   var strTime = hours + ":" + minutes + " " + ampm;
   month = month < 10 ? "0" + month : month;
   day = day < 10 ? "0" + day : day;
   return day + "/" + month + "/" + date.getFullYear() + " " + strTime;
 }