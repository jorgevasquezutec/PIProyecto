function search_post(data){
  var text=$('#key_word').val();
  console.log(text);

  var data_user=$("#listcontact").data("titulo");
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

function liposts(){
    $.getJSON("/posts", function (data) {
        search_post(data);
      });
}