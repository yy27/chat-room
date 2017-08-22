$(function(){
  var socket = io();
  var send = $("#submit");
  var chatname = '';
  var chaticon = '';
  var chatcolor = '';
  var color = ['#F9ABA7','#BD6758','#F05B71','#F57921','#FFDBBE','#613B24','#B8B96D','#4D4F37','#295CAB','#131A2C','#436BB3','#DEAC8B']
  var user_icon = '/images/user.jpg';
  socket.emit('userlist');
  $('#name').focus();
  //输入昵称 enter确定
  $('#name').keydown(function(){
    var _this = this;
    var event = event || window.event;
    var color_num = Math.ceil(Math.random()*12)-1;
    var icon = '/images/user/user_'+Math.ceil(Math.random()*20)+'.png';
    console.log(color_num+'----'+icon);
    if(event.keyCode == 13){
      chatname = $(_this).val();
      chaticon = icon;
      chatcolor = color[color_num];
      if(chatname != ''){
        var user_top = '<div class="user-img">'
            +'<img src="'+icon+'" style="background-color:'+color[color_num]+'"/>'
            +'</div>'
            +'<p>'+chatname+'</p>';
        $('.user-top').prepend(user_top);
        $('#chat_msg').focus();
        $('.window-user').hide();
        socket.emit('login',{'sid':'','name':$(_this).val(),'icon':icon,'color':color[color_num]});
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
        socket.emit('chat message', {'name':chatname,'icon':chaticon,'color':chatcolor,'msg':$('#chat_msg').val()});
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
  $('.exit').click(function(){
    socket.emit('disconnect',{'name':chatname});
    alert('sss');
  });
  $('.friend-g .f-wrap').mouseover(function(){
    $('.f-wrap').removeClass('over');
    $(this).addClass('over');
    // console.log($(this).find('p').text());
  });
  $('.friend-g .f-wrap').mouseout(function(){
    $('.f-wrap').removeClass('over');
  });
  socket.on('chat message',function(data){
    if(data.name == chatname){
      msg_right(data.msg,data.icon,data.name,data.color);
    } else {
      msg_left(data.msg,data.icon,data.name,data.color);
    }
  });
  socket.on('login',function(data){  
    var user_group = '<div class="f-wrap '+data.sid+'" onmouseover="f_over(&quot;'+data.sid+'&quot;)" onmouseout="f_out()">'
          +'<div class="user-img">'
          +'<img src="'+data.icon+'" style="background-color:'+data.color+'" />'
          +'</div>'
          +'<p>'+data.name+'</p>'
          +'</div>';
    
    $('.friend-g').append(user_group);
    var loginHtml = '<div class="add-chat">'+data.name+'加入聊天室</div>';
    app_html(loginHtml);
  });
  socket.on('userlist',function(data){
    var u_list = data.userlist;
    var user_list='';
    for(var i=0;i<u_list.length;i++){
      user_list+= '<div class="f-wrap '+u_list[i].sid+'" onmouseover="f_over(&quot;'+u_list[i].sid+'&quot;)" onmouseout="f_out()">'
          +'<div class="user-img">'
          +'<img src="'+u_list[i].icon+'" style="background-color:'+u_list[i].color+'" />'
          +'</div>'
          +'<p>'+u_list[i].name+'</p>'
          +'</div>';
    }
    $('.friend-g').html(user_list);
    console.log(user_list);
  });
  socket.on('exit',function(data){
    $('.'+data.sid).remove();
    var loginHtml = '<div class="add-chat">'+data.name+'退出聊天室</div>';
    app_html(loginHtml);
  });
 
});
function leavePage(){
  alert('7888');
  
}
function f_over(sid){
  $('.f-wrap').removeClass('over');
  console.log(sid);
  $('.'+sid).addClass('over');
}
function f_out(){
  $('.f-wrap').removeClass('over');
}

//不是本人发的消息，显示在左边
function msg_left(message,img,chatName,color){
  var htmlleft = '<div class="log-left">'
                +'<div class="user-img">'
                +'<img src="'+img+'" title="'+chatName+'" style="background-color:'+color+'"/>'
                +'</div>'
                +'<div class="chat-content">'
                +'<div class="content">'+message+'</div>'
                +'</div>'
                +'</div>';
  app_html(htmlleft);
}
//本人发的消息，显示在右边
function msg_right(message,img,chatName,color){
  var htmlright = '<div class="log-left my-msg">'
                +'<div class="chat-content">'
                +'<div class="content">'+message+'</div>'
                +'</div>'
                +'<div class="user-img">'
                +'<img src="'+img+'" title="'+chatName+'" style="background-color:'+color+'"/>'
                +'</div>'
                +'</div>';
  app_html(htmlright);
}
function app_html(html){
  $('.chat-log').append(html);
  $('.chat-log').scrollTop( $('.chat-log').height() );
}