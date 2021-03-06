//オブジェクトパーサー(トゥート)
function misskeyParse(obj, mix, acct_id, tlid, popup, mutefilter) {
	var templete = '';
	var actb = localStorage.getItem("action_btns");
	var actb='re,rt,fav,qt,del,pin,red';
	if(actb){
		var actb = actb.split(',');
		var disp={};
		for(var k=0;k<actb.length;k++){
			if(k<4){
				var tp="type-a";
			}else{
				var tp="type-b";
			}
			disp[actb[k]]=tp;
		}
	}
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	var sent = localStorage.getItem("sentence");
	var ltr = localStorage.getItem("letters");
	var gif = localStorage.getItem("gif");
	var imh = localStorage.getItem("img-height");
	//ネイティブ通知
	var native=localStorage.getItem("nativenotf");
	if(!native){
		native="yes";
	}
	//クライアント強調
	var emp = localStorage.getItem("client_emp");
	if(emp){
		var emp = JSON.parse(emp);
	}
	//クライアントミュート
	var mute = localStorage.getItem("client_mute");
	if(mute){
		var mute = JSON.parse(mute);
	}
	//ユーザー強調
	var useremp = localStorage.getItem("user_emp");
	if(useremp){
		var useremp = JSON.parse(useremp);
	}
	//ワード強調
	var wordemp = localStorage.getItem("word_emp");
	if(wordemp){
		var wordemp = JSON.parse(wordemp);
	}
	//ワードミュート
	var wordmute = localStorage.getItem("word_mute");
	if(wordmute){
		var wordmute = JSON.parse(wordmute);
		wordmute = wordmute.concat(mutefilter);
	}else{
		wordmute = mutefilter;
	}
	if (!sent) {
		var sent = 500;
	}
	if (!ltr) {
		var ltr = 500;
	}
	if (!nsfwtype || nsfwtype == "yes") {
		var nsfw = "ok";
	} else {
		var nsfw;
	}
	var cwtype = localStorage.getItem("cw");
	if (!cwtype || cwtype == "yes") {
		var cw = "ok";
	} else {
		var cw;
	}
	if (!datetype) {
		datetype = "absolute";
	}
	if (!gif) {
		var gif = "yes";
	}
	if (!imh) {
		var imh = "200";
	}
	if(!emp){
		var emp=[];
	}
	if(!mute){
		var mute=[];
	}
	if(!useremp){
		var useremp=[];
	}
	if(!wordemp){
		var wordemp=[];
	}
	if(!wordmute){
		var wordmute=[];
	}
	//via通知
	var viashow=localStorage.getItem("viashow");
	if(!viashow){
		viashow="via-hide";
	}
	if(viashow=="hide"){
		viashow="via-hide";
	}
	//認証なしTL
	if(mix=="noauth"){
		var noauth="hide";
		var antinoauth="";
	}else{
		var noauth="";
		var antinoauth="hide";
	}
	//マウスオーバーのみ
	var mouseover=localStorage.getItem("mouseover");
	if(!mouseover){
		mouseover="";
	}else if(mouseover=="yes"){
		mouseover="hide";
	}else if(mouseover=="no"){
		mouseover="";
	}
	var local = [];
	var times=[];
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
        var dis_name=toot.user.name;
        if(dis_name){
            dis_name=escapeHTML(dis_name);
        }
		if (mix == "notf") {
			if (toot.type == "reply") {
				var what = lang_parse_mentioned[lang];
				var icon = '<i class="big-text fa fa-share teal"></i>';
			} else if (toot.type == "renote") {
				var what = lang_misskeyparse_renoted[lang];
				var icon = '<i class="big-text fa fa-retweet light-blue-text"></i>';
			}  else if (toot.type == "quote") {
				var what = lang_misskeyparse_quoted[lang];
				var icon = '<i class="big-text fa fa-quote-right orange-text"></i>';
			} else if (toot.type == "reaction") {
				var what = lang_misskeyparse_reaction[lang];
				var reactions={
					"like":"👍",
					"love":"💓",
					"laugh":"😁",
					"hmm":"🤔",
					"surprise":"😮",
					"congrats":"🎉",
					"amgry":"💢",
					"confused":"😥",
					"pudding":"🍮"
				}
				var icon=reactions[toot.reaction];
			}
			var noticetext = '<span class="cbadge cbadge-hover"title="' + date(toot.createdAt,
				'absolute') + '('+lang_parse_notftime[lang]+')"><i class="fa fa-clock-o"></i>' + date(toot.createdAt,
				datetype) +
			'</span>'+icon+'<a onclick="udg(\'' + toot.user.username +
				'\',\'' + acct_id + '\')" class="pointer grey-text">' + dis_name +
				"(@" + toot.user.username +
				")</a>";
			var notice = noticetext;
			var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				if (toot.type == "reply") {
					$(".notf-reply_" + acct_id).text($(".notf-reply_" + acct_id+":eq(0)").text()*1+1);
					$(".notf-reply_" + acct_id).removeClass("hide")
				}else if (toot.type == "renote" || toot.type=="quote") {
					$(".notf-bt_" + acct_id).text($(".notf-bt_" + acct_id+":eq(0)").text()*1+1);
					$(".notf-bt_" + acct_id).removeClass("hide")
				}else if (toot.type == "reaction") {
					$(".notf-fav_" + acct_id).text($(".notf-fav_" + acct_id+":eq(0)").text()*1+1);
					$(".notf-fav_" + acct_id).removeClass("hide")
				}
				var domain = localStorage.getItem("domain_" + acct_id);
				if(popup>0){
					Materialize.toast("["+domain+"]"+escapeHTML(toot.user.name)+what, popup * 1000);
				}
				if(native=="yes"){
					var electron = require("electron");
					var ipc = electron.ipcRenderer;
					var os = electron.remote.process.platform;
					var options = {
						body: toot.user.name+"(" + toot.user.username +")"+what+"\n\n"+$.strip_tags(toot.note.text),
						icon: toot.user.avatarUrl
					  };
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', ['TheDesk:'+domain,toot.user.name+"(" + toot.account.acct +")"+what+"\n\n"+$.strip_tags(toot.note.text),toot.user.avatarUrl]);
					}
				}
				$(".notf-icon_" + acct_id).addClass("red-text");
				localStorage.setItem("notice-mem", noticetext);
				noticetext = "";
			}
			var if_notf='data-notfIndv="'+acct_id+"_"+toot.id+'"';
			var toot = toot.note;
			var dis_name=escapeHTML(toot.user.name);
		}else{
			var if_notf="";
			if (toot.renote) {
				var rebtxt = lang_parse_btedsimple[lang];
				var rticon = "fa-retweet light-blue-text";
				var notice = '<i class="big-text fa '+rticon+'"></i>'+ dis_name + "(@" + toot.user.username +
					")<br>";
					var boostback = "shared";
				var uniqueid=toot.id;
				var toot = toot.renote;
				var dis_name=escapeHTML(toot.user.name);
			    var uniqueid=toot.id;
				var actemojick=false
			} else {
				var uniqueid=toot.id;
				var notice = "";
				var boostback = "";
				//ユーザー強調
				if(toot.user.host){
					var fullname=toot.user.username+"@"+toot.user.host;
				}else{
					var domain = localStorage.getItem("domain_" + acct_id);
					var fullname=toot.user.username+"@"+domain;
				}
				if(useremp){
					Object.keys(useremp).forEach(function(key10) {
					var user = useremp[key10];
					if(user==fullname){
						boostback = "emphasized";
					}
					});
				}
			}
		}
		var id = toot.id;
		if (mix == "home") {
			var home = ""
			var divider = '<div class="divider"></div>';
		} else {
			var home = "";
			var divider = '<div class="divider"></div>';
        }
        /*
		if (toot.account.locked) {
			var locked = ' <i class="fa fa-lock red-text"></i>';
		} else {
			var locked = "";
        }
        */
		if (!toot.app) {
            if(toot.viaMobile){
                var via = '<span style="font-style: italic;">Mobile</span>';
            }else{
                var via = '<span style="font-style: italic;">Unknown</span>';
            }
		} else {
			var via = toot.app.name;
			//強調チェック
			Object.keys(emp).forEach(function(key6) {
				var cli = emp[key6];
				if(cli == via){
					boostback = "emphasized";
				}
			});
			//ミュートチェック
			Object.keys(mute).forEach(function(key7) {
				var cli = mute[key7];
				if(cli == via){
					boostback = "hide";
				}
			});
		}
		if ((toot.cw || toot.cw=="") && cw) {
			var content = toot.text;
			var spoil = escapeHTML(toot.cw);
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">'+lang_parse_cwshow[lang]+'</a><br>';
		} else {
			var ct1 =  nl2br(toot.text).split('<br />').length -2;
			var ct2 =  nl2br(toot.text).split('<br>').length -2;
			if(ct1>ct2){ var ct= ct1; }else{ var ct= ct2;  }
			if ((sent < ct && $.mb_strlen($.strip_tags(toot.text)) > 5) || ($.strip_tags(toot.text).length > ltr && $.mb_strlen($.strip_tags(toot.text)) > 5)) {
				var content = '<span class="gray">'+lang_parse_fulltext[lang]+'</span><br>' + toot.text
				var spoil = '<span class="cw-long-' + toot.id + '">' + $.mb_substr($.strip_tags(
						toot.text), 0, 100) +
					'</span><span class="gray">'+lang_parse_autofold[lang]+'</span>';
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">'+lang_parse_more[lang]+'</a><br>';
			} else {
                var content = toot.text;
                if(toot.cw){
                    var spoil = escapeHTML(toot.cw);
                }else{
                    var spoil="";
                }
				
				var spoiler = "";
				var spoiler_show = "";
			}
		}
		var analyze = '';
		var viewer = "";
		var hasmedia = "";
		var youtube = "";
		if(toot.emojis){
			var emojick = toot.emojis[0];
		}else{
			var emojick=false;
        }
        //デフォ絵文字
        if(content){
			content=content.replace(/(http(s)?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>")
            content=twemoji.parse(content);
        }else{
            content="";
        }
		
		if(dis_name){
			dis_name=twemoji.parse(dis_name);
		}
		if(spoil){
			spoil=twemoji.parse(spoil);
		}
		if(noticetext){
			noticetext=twemoji.parse(noticetext);
		}
		if(notice){
			notice=twemoji.parse(notice);
		}
		var mediack = toot.media[0];
		//メディアがあれば
		var media_ids="";
		if (mediack) {
			hasmedia = "hasmedia";
			var cwdt = 100 / toot.media.length;
			Object.keys(toot.media).forEach(function(key2) {
				var media = toot.media[key2];
				var purl = media.url;
				media_ids=media_ids+media.id+",";
				var url = media.url;
				if (media.isSensitive && nsfw) {
					var sense = "sensitive"
				} else {
					var sense = ""
				}
				viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',' +
					acct_id + ')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="image" class="img-parsed"><img src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="width:' + cwdt + '%; height:'+imh+'px;"></a></span>';
			});
			media_ids = media_ids.slice(0, -1) ;
		} else {
			viewer = "";
			hasmedia = "nomedia";
		}
		var menck = toot.reply;
		var mentions = "";
		//メンションであれば
		if (menck) {
			mentions = '<div style="float:right"><a onclick="udg(\'' + menck.user.username + '\',' +
            acct_id + ')" class="pointer">@' + menck.user.username + '</a></div>';
		}
		var tagck = toot.tags[0];
		var tags = "";
		//タグであれば
		if (tagck) {
			Object.keys(toot.tags).forEach(function(key4) {
				var tag = toot.tags[key4];
				var tags =  '<a onclick="tagShow(\'' + tag + '\')" class="pointer">#' + tag + '</a><span class="hide" data-tag="' + tag + '">#' + tag + ':<a onclick="tl(\'tag\',\'' + tag + '\',' + acct_id +
					',\'add\')" class="pointer" title="' +lang_parse_tagTL[lang].replace("{{tag}}" ,'#'+tag)+ '">TL</a>　<a onclick="brInsert(\'#' + tag + '\')" class="pointer" title="' + lang_parse_tagtoot[lang].replace("{{tag}}" ,'#'+tag) + '">Toot</a>　'+
                    '<a onclick="tagPin(\'' + tag + '\')" class="pointer" title="' +lang_parse_tagpin[lang].replace("{{tag}}" ,'#'+tag)+ '">Pin</a></span> ';
                content=content.replace("#"+tag,tags);
			});
			//tags = '<div style="float:right">' + tags + '</div>';
		}
		//公開範囲を取得
		var vis = "";
		var visen = toot.visibility;
		if (visen == "public") {
			var vis =
				'<i class="text-darken-3 material-icons gray sml vis-data pointer" title="'+lang_parse_public[lang]+'('+lang_parse_clickcopy[lang]+')" data-vis="public" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">public</i>';
			var can_rt = "";
		} else if (visen == "home") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text vis-data pointer" title="'+lang_misskeyparse_home[lang]+'('+lang_parse_clickcopy[lang]+')" data-vis="unlisted" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock_open</i>';
			var can_rt = "";
		} else if (visen == "followers") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text vis-data pointer" title="'+lang_misskeyparse_followers[lang]+'('+lang_parse_clickcopy[lang]+')" data-vis="unlisted" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">people</i>';
			var can_rt = "";
		} else if (visen == "private") {
			var vis =
				'<i class="text-darken-3 material-icons orange-text vis-data pointer" title="'+lang_parse_private[lang]+'('+lang_parse_clickcopy[lang]+')" data-vis="private" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock</i>';
			var can_rt = "";
		} else if (visen == "specified") {
			var vis =
				'<i class="text-darken-3 material-icons red-text vis-data pointer" title="'+lang_misskeyparse_specified[lang]+'('+lang_parse_clickcopy[lang]+')" data-vis="direct" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">mail</i>';
			var can_rt = "hide";
		}
		if (toot.user.username == localStorage.getItem("user_" + acct_id)) {
			var if_mine = "";
			var mine_via="type-b";
		} else {
			var if_mine = "hide";
			var mine_via="";
		}
		if (toot.myReaction) {
			var if_fav = " yellow-text";
			var fav_app = "faved";
		} else {
			var if_fav = "";
			var fav_app = "";
        }
        var if_rt = "";
        var rt_app = "";
        /*
		if (toot.reblogged) {
			var if_rt = "teal-text";
			var rt_app = "rted";
		} else {
			var if_rt = "";
			var rt_app = "";
        }
        */
		//アバター
		var avatar = toot.user.avatarUrl;
		//ワードミュート
		if(wordmute){
			Object.keys(wordmute).forEach(function(key8) {
				var worde = wordmute[key8];
				if(worde){
					if(worde.tag){
						var word=worde.tag;
					}else{
						var word=worde
					}
					var regExp = new RegExp( word, "g" ) ;
					if($.strip_tags(content).match(regExp)){
						boostback = "hide by_filter";
					}
				}
			});
		}
		//ワード強調
		if(wordemp){
			Object.keys(wordemp).forEach(function(key9) {
				var word = wordemp[key9];
				if(word){
					var word=word.tag;
					var regExp = new RegExp( word, "g" ) ;
					content=content.replace(regExp,'<span class="emp">'+word+"</span>");
				}
			});
        }
        //Reactions
        if(toot.reactionCounts){
        if(toot.reactionCounts.like){
            var like=toot.reactionCounts.like;
            var likehide="";
        }else{
            var like=0;
            var likehide="hide";
        }
        if(toot.reactionCounts.love){
            var love=toot.reactionCounts.love;
            var lovehide="";
        }else{
            var love=0;
            var lovehide="hide";
        }
        if(toot.reactionCounts.laugh){
            var laugh=toot.reactionCounts.laugh;
            var laughhide="";
        }else{
            var laugh=0;
            var laughhide="hide";
        }
        if(toot.reactionCounts.hmm){
            var hmm=toot.reactionCounts.hmm;
            var hmmhide="";
        }else{
            var hmm=0;
            var hmmhide="hide";
        }
        if(toot.reactionCounts.surprise){
            var surprise=toot.reactionCounts.surprise;
            var suphide="";
        }else{
            var suphide="hide";
            var surprise=0;
        }
        if(toot.reactionCounts.congrats){
            var congrats=toot.reactionCounts.congrats;
            var conghide="";
        }else{
            var congrats=0;
            var conghide="hide";
        }
        if(toot.reactionCounts.angry){
            var angry=toot.reactionCounts.angry;
            var anghide="";
        }else{
            var angry=0;
            var anghide="hide";
        }
        if(toot.reactionCounts.confused){
            var confhide="";
            var confused=toot.reactionCounts.confused;
        }else{
            var confused=0;
            var confhide="hide";
        }
        if(toot.reactionCounts.pudding){
            var pudding=toot.reactionCounts.pudding;
            var pudhide="";
        }else{
            var pudding=0;
            var pudhide="hide";
        }
        var fullhide="";
        }else{
            var like=0;var love=0;var laugh=0;var hmm=0;var surprise=0;var congrats=0;var angry=0;var confused=0;var pudding=0;
            var likehide="hide";var lovehide="hide";var laughhide="hide";var hmmhide="hide";var suphide="hide";var conghide="hide";var anghide="hide";var confhide="hide";var pudhide="hide";
            var fullhide="hide";
        }
        if(toot.myReaction){
            var reacted=toot.myReaction;
        }else{
            var reacted="";
        }
        content=nl2br(content);
		var trans="";
		templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
			boostback + ' ' + fav_app + ' ' + rt_app + '  ' + hasmedia + '" toot-id="' + id + '" unique-id="' + uniqueid + '" data-medias="'+media_ids+' " unixtime="' + date(obj[
				key].created_at, 'unix') + '" '+if_notf+' onmouseover="mov(\'' + toot.id + '\',\''+tlid+'\')" onmouseout="resetmv()" reacted="'+reacted+'">' +
			'<div class="area-notice"><span class="gray sharesta">' + notice + home +
			'</span></div>' +
			'<div class="area-icon"><a onclick="udg(\'' + toot.user.id +
			'\',' + acct_id + ');" user="' + toot.user.username + '" class="udg">' +
			'<img src="' + avatar +
			'" width="40" class="prof-img" user="' + toot.user.username +
			'"></a></div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name +
			'</span><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"> @' +
			toot.user.username + '</span></div>' +
			'<div class="flex-time"><span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy(\'' +
			toot.url + '\');" title="' + date(toot.createdAt, 'absolute') +
			'('+lang_parse_clickcopyurl[lang]+')"><i class="fa fa-clock-o"></i>' +
			date(toot.createdAt, datetype) + '</span>' +
			'</div></div>' +
			'<div class="area-toot"><span class="toot ' + spoiler + '">' + content +
			'</span><span class="' +
			api_spoil + ' cw_text_' + toot.id + '">' + spoil + spoiler_show +
			'</span>' +
			'' + viewer + '' +
            '</div><div class="area-additional"><span class="additional">'+
            '<div class="reactions '+fullhide+'" style="height: 20px;"><span class="'+likehide+' reaction re-like"><a onclick="reaction(\'like\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat" style="padding:0">'+twemoji.parse("👍")+'</a><span class="re-likect">'+like+
            '</span></span><span class="'+lovehide+' reaction re-love"><a onclick="reaction(\'love\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("💓")+'</a><span class="re-lovect">'+love+
            '</span></span><span class="'+laughhide+' reaction re-laugh"><a onclick="reaction(\'laugh\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("😁")+'</a><span class="re-laughct">'+laugh+
            '</span></span><span class="'+hmmhide+' reaction re-hmm"><a onclick="reaction(\'hmm\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("🤔")+'</a><span class="re-hmmct">'+hmm+
            '</span></span><span class="'+suphide+' reaction re-surprise"><a onclick="reaction(\'surprise\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("😮")+'</a><span class="re-surprisect">'+surprise+
            '</span></span><span class="'+conghide+' reaction  re-congrats"><a onclick="reaction(\'congrats\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("🎉")+'</a><span class="re-congratsct">'+congrats+
            '</span></span><span class="'+anghide+' reaction re-angry"><a onclick="reaction(\'angry\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("💢")+'</a><span class="re-angryct">'+angry+
            '</span></span><span class="'+confhide+' reaction re-confused"><a onclick="reaction(\'confused\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("😥")+'</a><span class="re-confusedct">'+confused+
            '</span></span><span class="'+pudhide+' reaction re-pudding"><a onclick="reaction(\'pudding\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0">'+twemoji.parse("🍮")+'</a><span class="re-puddingct">'+pudding+
			'</span></div>' + mentions + tags + '</div>' +
			'<div class="area-vis"></div>'+
			'<div class="area-actions '+mouseover+'">' +
			'<div class="action">'+vis+'</div>'+
			'<div class="action '+antinoauth+'"><a onclick="detEx(\'https://misskey.xyz/notes/'+toot.id+'\',\'main\')" class="waves-effect waves-dark details" style="padding:0">'+lang_parse_det[lang]+'</a></div>' +
			'<div class="action '+disp["re"]+' '+noauth+'"><a onclick="misskeyreply(\'' + toot.id +
			'\',\'' + acct_id + '\',' +
			acct_id + ',\''+visen+
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_parse_replyto[lang]+'"><i class="fa fa-share"></i></a></div>' +
			'<div class="action '+can_rt+' '+disp["rt"]+' '+noauth+'"><a onclick="renote(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_misskeyparse_renote[lang]+'"><i class="text-darken-3 fa fa-retweet ' +
			if_rt + ' rt_' + toot.id + '"></i><span class="rt_ct"></span></a></div>' +
			'<div class="action '+can_rt+' '+disp["qt"]+' '+noauth+'"><a onclick="renoteqt(\'' + toot.id + '\',' + acct_id +
			',\'misskey.xyz\',\'misskey.xyz\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_misskeyparse_renoteqt[lang]+'"><i class="text-darken-3 fa fa-quote-right"></i></a></div>' +
			'<div class="action '+disp["fav"]+' '+noauth+'"><a onclick="reactiontoggle(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_misskeyparse_reaction[lang]+'"><i class="fa text-darken-3 fa-plus' +
			if_fav + ' fav_' + toot.id + '"></i></div>' +
			'<div class="' + if_mine + ' action '+disp["del"]+' '+noauth+'"><a onclick="del(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_parse_del[lang]+'"><i class="fa fa-trash-o"></i></a></div>' +
			'<div class="' + if_mine + ' action pin '+disp["pin"]+' '+noauth+'"><a onclick="pin(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_parse_pin[lang]+'"><i class="fa fa-map-pin pin_' + toot.id + '"></i></a></div>' 
			+'<div class="' + if_mine + ' action '+disp["red"]+' '+noauth+'"><a onclick="redraft(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang_parse_redraft[lang]+'"><i class="material-icons">redo</i></a></div>'+trans+
			'<span class="cbadge viabadge waves-effect '+viashow+' '+mine_via+'" onclick="client(\''+$.strip_tags(via)+'\')" title="via ' + $.strip_tags(via) + '">via ' +
			via +
			'</span>'+
			'</div><div class="area-side"><div class="action ' + if_mine + ' '+noauth+'"><a onclick="toggleAction(\'' + toot.id + '\',\''+tlid+'\',\''+acct_id+'\')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="text-darken-3 material-icons act-icon">expand_more</i></a></div>' +
			'<div class="action '+noauth+'"><a onclick="details(\'' + toot.id + '\',' + acct_id +
			',\''+tlid+'\')" class="waves-effect waves-dark btn-flat details" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i></a></div>' +
			'</div></div>' +
			'</div></div>';
	});
	return templete;
}

//オブジェクトパーサー(ユーザーデータ)
function misskeyUserparse(obj, auth, acct_id, tlid, popup) {
	if(popup > 0 || popup==-1){
		
	}else{
		var obj = obj.users;
	}
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		var locked = "";
		if (auth) {
			var auth = '<i class="material-icons gray pointer" onclick="misskeyRequest(\'' +
				toot.id + '\',\'accept\',' + acct_id + ')">person_add</i>';
		} else {
			var auth = "";
		}
		var ftxt=lang_parse_followed[lang];
		if(popup > 0 || popup==-1){
			var notftext='<span class="cbadge"title="' + date(toot.createdAt,
				'absolute') + '('+lang_parse_notftime[lang]+')"><i class="fa fa-clock-o"></i>' + date(toot.createdAt,
				datetype) +
			'</span>'+ftxt+'<br>';
			var toot = toot.user;
		}else{
			var notftext="";
		}
		var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && notftext != memory) {
				Materialize.toast(escapeHTML(toot.name)+":"+ftxt, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem", notftext);
				notftext = "";
			}
			if(toot.name){
				var dis_name=escapeHTML(toot.name);
				dis_name=twemoji.parse(dis_name);
			}else{
				var dis_name=toot.name;
			}
		console.log(dis_name)
		templete = templete +
			'<div class="cvo" style="padding-top:5px;" user-id="' + toot.id + '"><div class="area-notice">' +
			notftext +
			'</div><div class="area-icon"><a onclick="udg(\'' + toot.id + '\',' +
			acct_id + ');" user="' + toot.username + '" class="udg">' +
			'<img src="' + toot.avatarUrl + '" width="40" class="prof-img" user="' + toot
			.username + '"></a></div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name + '</span>' +
			'<span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"> @' +
			toot.username + auth +'</span>' +
			'</div>' +
			'</div>' +
			'<div style="justify-content:space-around" class="area-toot"> <div class="cbadge" style="width:100px;">Follows:' +
			toot.followingCount +
			'</div><div class="cbadge" style="width:100px;">Followers:' + toot.followersCount +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>';

	});
	return templete;
}