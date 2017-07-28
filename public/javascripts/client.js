$(function(){
  var socket = io();
  var send = $("#submit");
  var chatname = '';
  var user_icon = '/images/user.jpg';
  //输入昵称 enter确定
  $('#name').keydown(function(){
    var _this = this;
    var event = event || window.event;
    if(event.keyCode == 13){
      chatname = $(_this).val();
      if(chatname != ''){
        var user_top = '<div class="user-img">'
            +'<img src="'+user_icon+'" />'
            +'</div>'
            +'<p>'+chatname+'</p>';
        $('.user-top').prepend(user_top);
        $('.window-user').hide();
        socket.emit('login',{'name':$(_this).val(),'icon':user_icon});
      }
    }
  });
  //发送消息，enter
  $('#chat_msg').keydown(function(){
    var _this = this;
    var event = event || window.event;
    if(event.keyCode == 13 && event.ctrlKey){
      var msg = $('#chat_msg').val();
      $('#chat_msg').val(msg+"\n");
    }else if(event.keyCode == 13){
      event.preventDefault();
      if($('#chat_msg').val() != ''){
        socket.emit('chat message', {'name':chatname,'msg':$('#chat_msg').val()});
        $('#chat_msg').val('');
        return false;
      }
    }
  });
  //发送消息
  send.click(function(){
    if($('#chat_msg').val() != ''){
      socket.emit('chat message', {'name':chatname,'msg':$('#chat_msg').val()});
      $('#chat_msg').val('');
      return false;
    }
  });
  socket.on('chat message',function(data){
    if(data.name == chatname){
      msg_right(data.msg,user_icon,data.name);
    } else {
      msg_left(data.msg,user_icon,data.name);
    }
  });
  socket.on('login',function(data){  
    var user_group = '<div class="f-wrap">'
          +'<div class="user-img">'
          +'<img src="'+data.icon+'" />'
          +'</div>'
          +'<p>'+data.name+'</p>'
          +'</div>';
    
    $('.friend-g').append(user_group);
    var loginHtml = '<div class="add-chat">'+data.name+'加入聊天室</div>';
    app_html(loginHtml);
  });
});
//不是本人发的消息，显示在左边
function msg_left(message,img,chatName){
  var htmlleft = '<div class="log-left">'
                +'<div class="user-img">'
                +'<img src="'+img+'" title="'+chatName+'" />'
                +'</div>'
                +'<div class="chat-content">'
                +'<div class="content">'+message+'</div>'
                +'</div>'
                +'</div>';
  app_html(htmlleft);
}
//本人发的消息，显示在右边
function msg_right(message,img,chatName){
  var htmlright = '<div class="log-left my-msg">'
                +'<div class="chat-content">'
                +'<div class="content">'+message+'</div>'
                +'</div>'
                +'<div class="user-img">'
                +'<img src="'+img+'" title="'+chatName+'" />'
                +'</div>'
                +'</div>';
  app_html(htmlright);
}
function app_html(html){
  $('.chat-log').append(html);
  $('.chat-log').scrollTop( $('.chat-log').height() );
}