function notify(user,msg){
	Push.create(user, {
        body: msg,
        icon: "/images/2.jpg",
        timeout: 5000,
        onClick: function() {
            console.log(this);
        }
    });
}


$(function(){
	const socket = io();
	$('form').on('submit',function(event){
		var msg = $('#message').val();
		$('#message').val('');
		const user = $("input[name='name']").val();
		var d = new Date();
		const time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
		socket.emit('chat',msg,socket.id,user,time);
		event.preventDefault();
	});
	socket.on('chat',function(msg,person,user,time){
		console.log("current_id: "+socket.id);
		console.log("passed_id: "+person);
		var user_style_li_id = 'msg_li_1';
		var user_style_div_id = 'msg_div_1';
		if (person!=socket.id) {
			user='You';
			user_style_li_id = 'msg_li_2';
			user_style_div_id = 'msg_div_2';
			notify(user,msg);
		}
		const message = '<li><div class="row"><div class="col s5 '+user_style_div_id+'"><p class="white-text" id="'+user_style_li_id+'">'+user+' : '+msg+'<i id="sent_time">'+time+'</i></p><div></div></li>';
		$('#msgbox').append(message);
		$('#msgbox').animate({scrollTop:$('#msgbox').prop('scrollHeight')},500);
	});

	$('#message').keypress(function(event) {
		const user = $("input[name='name']").val();
		socket.emit('typing',socket.id,user);
	});

	socket.on('typing',function(person,user){
		if (person!=socket.id) {
			var i=0;
			var user_action = user+' is typing';
			var len = user_action.length;
			var setInt = setInterval(function(){
					if(i==0){
						$('#typing').text(user_action);
					}
					if(i<3 && $('#typing').text().length<len+3 && $('#typing').text().length>=len){
						$('#typing').append('.');
					}
					if(i==5){
						i=-1;
					}
					i++;
				},500);

			setTimeout(function(){
				clearInterval(setInt);
				$('#typing').text('');
				return false;
			},4500);
		}		
	});
});

document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.fixed-action-btn');
	var instances = M.FloatingActionButton.init(elems, {
	  direction: 'left',
	  hoverEnabled: false
	});
});
