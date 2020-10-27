function get_all_users(user)
{
    $.getJSON("/users", function (data)
    {
        console.log(data);
        var i = 0;
        $("#listcontact").empty();
        $("#profile").empty();
        template = '<div class="wrap">'+
				'<p>username</p>'+'<span class="contact-status online">'+'</span>'+'</div>';
            template = template.replace('username', user['username']);
            template = template.replace('name', user['name']);
            $("#profile").append(template);
        var user_temp = []
        $.each(data, function ()
        {
        if(user.id!==data[i].id){
            template ='<li class="contact active" data-num="" id="user_' +
          data[i].id + '"' +
          'onclick = "get_chat('+data[i].id+')">'+
					'<div class="wrap">'+
						'<span class="contact-status online"></span>'+
						'<div class="meta">'+
							'<p class="name">username</p>'+
						'</div>'+
					'</div>'+
				'</li>'
			template = template.replace('username', data[i]['username']);


            $("#listcontact").append(template);
            $("#user_" + data[i].id + "").data("num", data[i]);
            user_temp.push(data[i])
            }
            i = i + 1;
        });
        $("#listcontact").data("num",user_temp)
    });
}




function get_chat(id){
 var user_to=id;
  $("#user_to_aux").val(id);
  $("#contact-profile").val();
  var datauser = $("#user_" + id + "").data("num");
  console.log(datauser)
  var cur ="<h6>" + datauser["username"] +"</h6>";
    $("#contact-profile").empty();
    $("#contact-profile").append(cur);
  $.getJSON("/current",function(data){
    var user_from=data;
    $("#messages").empty();
    $.get( "/chat/"+user_from['id']+"/"+user_to, function( data ) {
      var i=0
      console.log(data);
      $.each( data, function( ) {
          var template='';


          if(data[i]["user_from_id"]==user_from['id']){
              template+='<li class="replies">'+
                '<p>'+data[i]['content']+'</p>'+
                '</li>';
          }
          else{
            template+='<li class="sent">'+
              '<p>'+data[i]['content']+'</p>'+
            '</li>'
          }
          $("#messages").append(template);
          i++;
      });

  });

 });

}

function send_message(){
  var message=$("#content").val();
  var userto=$("#user_to_aux").val();
  var lleno = false;
      for (var i = 0; i < message.length; ++i)
    {
        if (message[i] != " ")
        {
            lleno = true;
            break;
        }
    }
  console.log(message);
  console.log(userto);
  if (message != null && message != '' && lleno)
    {
  $.getJSON("/current",function(data){
    var data_send={
        content:message,
        user_from_id:data['id'],
        user_to_id: parseInt(userto)
    }

    console.log(data_send);
    $.ajax({
      type: "POST",
      url: '/messages',
      contentType: 'application/json',
      data: JSON.stringify(data_send),
      success: function(data)
      {
        var template='<li class="replies">'+
                '<p>'+message+'</p>'+
                //'<span class="time_date"> '+data[i]['sent_on']+'</span>
                '</li>';
        $("#messages").append(template);
        $("#content").val("");
        console.log(data)
      },
      error: function(data)
      {
        console.error("Error")
      }
    });

  });
  }
    $("#content").val("");
}

function currentuser(){
   $.getJSON("/current",function(data){
         get_all_users(data)

   })
}

currentuser();

function search_user(){
  var text=$('#key_word').val();
  console.log(text);

  var data_user=$("#listcontact").data("num");
  data_user.map(function(obj){
        obj['key_word']=obj['name']+" " +obj['fullname'];
        return  obj;
  })
  var nuevadata=filterItems(text,"username",data_user);

  $("#listcontact").empty();
  var i=0
  $.each( nuevadata, function( ) {
      template ='<li class="contact active" data-num="" id="user_' +
          nuevadata[i].id + '"' +
          'onclick = "get_chat('+nuevadata[i].id+')">'+
					'<div class="wrap">'+
						'<span class="contact-status online"></span>'+
						'<div class="meta">'+
							'<p class="name">username</p>'+
						'</div>'+
					'</div>'+
				'</li>';
				template = template.replace('username', nuevadata[i]['username']);
	    $("#listcontact").append(template);
      $("#user_"+nuevadata[i].id+"").data("num",nuevadata[i]);
    i++;
  });

}


function filterItems(query,value,data_user) {
  if(query!="" || query!=undefined){
    return data_user.filter(function(el) {
      return el[value].toLowerCase().indexOf(query.toLowerCase()) > -1;
     })
  }
  return data_user;
}



function logout(){
$.getJSON("/logout", function(data){
    window.location = '/static/html/login.html';
});
}