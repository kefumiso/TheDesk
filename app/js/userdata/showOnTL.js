//ユーザーデータ表示
localStorage.removeItem("history");
//コード受信
if(location.search){
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/);
	var mode=m[1];
	var codex=m[2];
	if(mode=="user"){
		udgEx(codex,'main');
	}
}
function udgEx(user,acct_id){
	if(user=="selector"){
		user = $("#his-acct").attr('fullname');
	}
	if(acct_id=="selector"){
		acct_id = $("#user-acct-sel").val();
	}
	if(acct_id=="main"){
		acct_id = localStorage.getItem("main");
	}
	console.log(user);
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="misskey.xyz"){ return false; }
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/v1/search?resolve=true&q="+user
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		}
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var id=json.accounts[0].id;
		udg(id,acct_id);
	});
	return;
}
function udg(user, acct_id) {
	reset();
	if (!user) {
		user = localStorage.getItem("user-id_"+acct_id);
		console.log(user);
	}
	todo("User Data Loading...");
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="misskey.xyz"){
		misskeyUdg(user, acct_id)
		return;
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + user;
	console.log(start);
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		//一つ前のユーザーデータ
		if (!localStorage.getItem("history")){
			$("#his-history-btn").prop("disabled",true);
		}else{
			$("#his-history-btn").prop("disabled",false);
			$('#his-data').attr("history", localStorage.getItem("history"));
		}
		//moved設定時
		if (json.moved) {
			Materialize.toast(
				lang_showontl_movetxt[lang]+'<button class="btn-flat toast-action" onclick="udg(\"' +
				json.moved + ','+acct_id+'\")">'+lang_showontl_movebtn[lang]+'</button>', 4000)
		} else {
			$('#his-data').modal('open');
			$('#his-data').attr("user-id", user);
			$('#his-data').attr("use-acct", acct_id);
			if(json.username!=json.acct){
				//Remote
				$('#his-data').attr("remote", "true");
				var fullname=json.acct;
			}else{
				$('#his-data').attr("remote", "false");
				var fullname=json.acct+"@"+domain;
			}
			utl(json.id, '', acct_id);
			flw(json.id, '', acct_id);
			fer(json.id, '', acct_id);
			var dis_name=escapeHTML(json.display_name);
			dis_name=twemoji.parse(dis_name);
			if(json.emojis){
				var actemojick = json.emojis[0];
			}else{
				var actemojick=false;
			}
			//絵文字があれば
			if (actemojick) {
				Object.keys(json.emojis).forEach(function(key5) {
					var emoji = json.emojis[key5];
					var shortcode = emoji.shortcode;
					var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img" data-emoji="'+shortcode+'">';
					var regExp = new RegExp(":" + shortcode + ":", "g");
					dis_name = dis_name.replace(regExp, emoji_url);
				});
			}
			$("#his-name").html(dis_name);
			$("#his-acct").text(json.acct);
			$("#his-acct").attr("fullname",fullname);
			$("#his-prof").attr("src", json.avatar);
			$('#his-data').css('background-image', 'url(' + json.header + ')');
			$("#his-sta").text(json.statuses_count);
			$("#his-follow").text(json.following_count);
			$("#his-follower").text(json.followers_count);
			$("#his-since").text(crat(json.created_at));
			var note=json.note;
			if(json.fields){
				if(json.fields.length>0){
					var note=json.note+'My Fields<br><table style="vertical-align: baseline; text-align:center; padding:0;">'
					for(var i=0;i<json.fields.length;i++){
						var fname=json.fields[i].name;
						var fval=json.fields[i].value;
						fval=twemoji.parse(fval);
						note=note+'<tr style="height:1.5rem; padding:0;"><td style="height:1.5rem; padding:0; background-color:#757575; text-align:center; ">'+fname+'</td><td style="height:1.5rem; padding:0; padding-left:5px;">'+fval+'</td></tr>';
					}
					note=note+'</table>'
					$("#his-des").html(twemoji.parse(note));
				}else{
					$("#his-des").html(twemoji.parse(note));
				}
			}else{
				$("#his-des").html(twemoji.parse(note));
			}
			if(json.bot){
				$("#his-bot").html(lang_showontl_botacct[lang]);
			}
			$('#his-data').css('background-size', 'cover');
			localStorage.setItem("history" , user);
			//自分の時
			if (json.acct == localStorage.getItem("user_"+acct_id)) {
				showFav('', acct_id);
				showBlo('', acct_id);
				showMut('', acct_id);
				showDom('', acct_id);
				showReq('', acct_id);
				showFrl('', acct_id);
				$("#his-name-val").val(json.display_name);
				if(json.fields.length>0){
					$("#his-f1-name").val(json.fields[0].name); $("#his-f1-val").val($.strip_tags(json.fields[0].value));
					$("#his-f2-name").val(json.fields[1].name); $("#his-f2-val").val($.strip_tags(json.fields[1].value));
					$("#his-f3-name").val(json.fields[2].name); $("#his-f3-val").val($.strip_tags(json.fields[2].value));
					$("#his-f4-name").val(json.fields[3].name); $("#his-f4-val").val($.strip_tags(json.fields[3].value));
				}
				var des = json.note;
				des = des.replace(/<br \/>/g, "\n")
				des = $.strip_tags(des);
				$("#his-des-val").val(des);
				$("#his-follow-btn").hide();
				$("#his-block-btn").hide();
				$("#his-mute-btn").hide();
				$("#his-notf-btn").hide();
				$("#his-domain-btn").hide();
				$("#his-emp-btn").hide();
				$(".only-my-data").show();
				$(".only-his-data").hide();
			} else {
				relations(user, acct_id);
				$(".only-my-data").hide();
				$(".only-his-data").show();
			}
		}
		todc();
	});
}
function misskeyUdg(user, acct_id) {
	reset();
	if (!user) {
		user = localStorage.getItem("user-id_"+acct_id);
		console.log(user);
	}
	todo("User Data Loading...");
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain!="misskey.xyz"){
		udg(user, acct_id)
		return;
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/users/show";
	console.log(user);
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			i:at,
			userId:user
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		//一つ前のユーザーデータ
		if (!localStorage.getItem("history")){
			$("#his-history-btn").prop("disabled",true);
		}else{
			$("#his-history-btn").prop("disabled",false);
			$('#his-data').attr("history", localStorage.getItem("history"));
		}
			$('#his-data').modal('open');
			$('#his-data').attr("user-id", user);
			$('#his-data').attr("use-acct", acct_id);
			if(json.host){
				//Remote
				$('#his-data').attr("remote", "false");
				var fullname=json.username+"@"+json.host;
			}else{
				$('#his-data').attr("remote", "false");
				var fullname=json.acct+"@"+domain;
			}
			utl(json.id, '', acct_id);
			flw(json.id, '', acct_id);
			fer(json.id, '', acct_id);
			if(json.name){
				var dis_name=escapeHTML(json.name);
				dis_name=twemoji.parse(dis_name);
			}else{
				var dis_name=json.name
			}
			$("#his-name").html(dis_name);
			$("#his-acct").text(json.username);
			$("#his-acct").attr("fullname",fullname);
			$("#his-prof").attr("src", json.avatarUrl);
			$('#his-data').css('background-image', 'url(' + json.bannerUrl + ')');
			$("#his-sta").text(json.notesCount);
			$("#his-follow").text(json.followingCount);
			$("#his-follower").text(json.followersCount);
			$("#his-since").text(crat(json.createdAt));
			var note=json.description;
			$("#his-des").html(twemoji.parse(note));
			if(json.isCat){
				$("#his-bot").html("Cat"+twemoji.parse("😺"));
			}
			$('#his-data').css('background-size', 'cover');
			localStorage.setItem("history" , user);
			//自分の時
			if (json.username == localStorage.getItem("user_"+acct_id) && !json.host) {
				//showFav('', acct_id);
				//showMut('', acct_id);
				//showReq('', acct_id);
				showFrl('', acct_id);
				$("#his-name-val").val(json.name);
				var des = json.note;
				des = nl2br(des)
				des = $.strip_tags(des);
				$("#his-des-val").val(des);
				$("#his-follow-btn").hide();
				$("#his-block-btn").hide();
				$("#his-mute-btn").hide();
				$("#his-notf-btn").hide();
				$("#his-domain-btn").hide();
				$("#his-emp-btn").hide();
				$(".only-my-data").show();
				$(".only-his-data").hide();
			} else {
				if (json.isFollowing) {
					//自分がフォローしている
					$("#his-data").addClass("following");
					$("#his-follow-btn").text(lang_status_unfollow[lang]);
					hisList(user,acct_id);
				}else{
					$("#his-follow-btn").text(lang_status_follow[lang]);
				}
				if (json.isFollowed) {
					//フォローされてる
					$("#his-relation").text(lang_showontl_followed[lang]);
				}
				$("#his-block-btn").hide();
				if (json.isMuted) {
					$("#his-data").addClass("muting");
					$("#his-mute-btn").text(lang_status_unmute[lang]);
				}else{
					$("#his-mute-btn").text(lang_status_mute[lang]);
				}
				$(".only-my-data").hide();
				$(".only-his-data").show();
			}
		todc();
	});
}
//一つ前のユーザーデータ表示
function historyShow(){
	var acct_id=$('#his-data').attr("use-acct");
	var user=$('#his-data').attr("history");
	udg(user, acct_id, "true")
}
//選択アカウントのプロフ
function profShow(){
	var acct_id = $("#post-acct-sel").val();
	var user = localStorage.getItem("user-id_"+acct_id);
	console.log("user-id_"+acct_id+":"+user);
	udg(user, acct_id)
	hide();
}

//FF関係取得
function relations(user, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/v1/accounts/relationships?id=" + user;
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var json = json[0];
		console.log(json);
		if (json.following) {
			//自分がフォローしている
			$("#his-data").addClass("following");
			$("#his-follow-btn").text(lang_status_unfollow[lang]);
			hisList(user,acct_id);
		}else{
			$("#his-follow-btn").text(lang_status_follow[lang]);
		}
		if (json.followed_by) {
			//フォローされてる
			$("#his-relation").text(lang_showontl_followed[lang]);
		}
		if (json.blocking) {
			$("#his-data").addClass("blocking");
			$("#his-block-btn").text(lang_status_unblock[lang]);
		}else{
			$("#his-block-btn").text(lang_status_block[lang]);
		}
		if (json.muting) {
			$("#his-data").addClass("muting");
			$("#his-mute-btn").text(lang_status_unmute[lang]);
		}else{
			$("#his-mute-btn").text(lang_status_mute[lang]);
		}
		if (json.muting_notifications) {
			$("#his-data").addClass("mutingNotf");
			$("#his-notf-btn").text(lang_showontl_notf[lang]+lang_status_unmute[lang]);
		}else{
			$("#his-notf-btn").text(lang_showontl_notf[lang]+lang_status_mute[lang]);
		}
		if (json.domain_blocking) {
			$("#his-data").addClass("blockingDom");
			$("#his-domain-btn").text(lang_showontl_domain[lang]+lang_status_unblock[lang]);
		}else{
			$("#his-domain-btn").text(lang_showontl_domain[lang]+lang_status_block[lang]);
		}

	});
}

//オールリセット
function hisclose() {
	$('#his-data').modal('close');
	reset();
	$('#his-data').attr("history", "");
	localStorage.removeItem("history");
}
function reset(){
	$(".tab-content:eq(0)").show();
	$(".tab-content:gt(0)").hide();
	$(".active-back").removeClass("active-back");
	$(".column-first").addClass("active-back");
	$("#his-name").text("Loading");
	$("#his-acct").text("");
	$("#his-prof").attr("src", "./img/loading.svg");
	$('#his-data').css('background-image', 'url(./img/loading.svg)');
	$("#his-sta").text("");
	$("#his-follow").text("");
	$("#his-follower").text("");
	$("#his-des").html("");
	$('#his-data').css('background-size', 'cover');
	$("#his-since").text("");
	$("#his-data").removeClass("following");
	$("#his-data").removeClass("muting");
	$("#his-data").removeClass("blocking");
	$("#his-data").removeClass("mutingNotf");
	$("#his-data").removeClass("blockingDom");
	$("#his-bot").html("");
	$("#his-follow-btn").show();
	$("#his-block-btn").show();
	$("#his-mute-btn").show();
	$("#his-notf-btn").show();
	$("#his-domain-btn").show();
	$("#his-emp-btn").show();
	$("#his-follow-btn").text(lang_status_follow[lang]);
	$("#his-mute-btn").text(lang_status_mute[lang]);
	$("#his-block-btn").text(lang_status_block[lang]);
	$("#his-notf-btn").text(lang_showontl_notf[lang]+lang_status_mute[lang]);
	$("#his-domain-btn").text(lang_showontl_domain[lang]+lang_status_block[lang]);
	$("#his-relation").text("");
	$(".cont-series").html("");
	$("#domainblock").val("");
	$("#his-lists-a").html(lang_showontl_listwarn[lang]);
	$("#his-lists-b").html('');
	$("#his-name-val").val("");
	$("#his-des-val").val("");
	$("#his-f1-name").val(""); $("#his-f1-val").val("");
	$("#his-f2-name").val(""); $("#his-f2-val").val("");
	$("#his-f3-name").val(""); $("#his-f3-val").val("");
	$("#his-f4-name").val(""); $("#his-f4-val").val("");
}
$('#my-data-nav .custom-tab').on('click',function(){
	var target=$(this).find("a").attr("go");
	$("#my-data-nav .custom-tab").removeClass("active-back");
	$(this).addClass("active-back");
	$(target).show();
	$(".tab-content:not("+target+")").hide();
});