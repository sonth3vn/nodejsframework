!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],function(e){return t(e)}):"object"==typeof exports?module.exports=t(require("jquery")):t(jQuery)}(this,function(){!function(e){"use strict";function t(t){var i=[{re:/[\xC0-\xC6]/g,ch:"A"},{re:/[\xE0-\xE6]/g,ch:"a"},{re:/[\xC8-\xCB]/g,ch:"E"},{re:/[\xE8-\xEB]/g,ch:"e"},{re:/[\xCC-\xCF]/g,ch:"I"},{re:/[\xEC-\xEF]/g,ch:"i"},{re:/[\xD2-\xD6]/g,ch:"O"},{re:/[\xF2-\xF6]/g,ch:"o"},{re:/[\xD9-\xDC]/g,ch:"U"},{re:/[\xF9-\xFC]/g,ch:"u"},{re:/[\xC7-\xE7]/g,ch:"c"},{re:/[\xD1]/g,ch:"N"},{re:/[\xF1]/g,ch:"n"}];return e.each(i,function(){t=t.replace(this.re,this.ch)}),t}function i(e){var t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},i="(?:"+Object.keys(t).join("|")+")",n=new RegExp(i),s=new RegExp(i,"g"),o=null==e?"":""+e;return n.test(o)?o.replace(s,function(e){return t[e]}):o}function n(t,i){var n=arguments,o=t,a=i;[].shift.apply(n);var l,r=this.each(function(){var t=e(this);if(t.is("select")){var i=t.data("selectpicker"),r="object"==typeof o&&o;if(i){if(r)for(var d in r)r.hasOwnProperty(d)&&(i.options[d]=r[d])}else{var h=e.extend({},s.DEFAULTS,e.fn.selectpicker.defaults||{},t.data(),r);t.data("selectpicker",i=new s(this,h,a))}"string"==typeof o&&(l=i[o]instanceof Function?i[o].apply(i,n):i.options[o])}});return"undefined"!=typeof l?l:r}String.prototype.includes||!function(){var e={}.toString,t=function(){try{var e={},t=Object.defineProperty,i=t(e,e,e)&&t}catch(n){}return i}(),i="".indexOf,n=function(t){if(null==this)throw TypeError();var n=String(this);if(t&&"[object RegExp]"==e.call(t))throw TypeError();var s=n.length,o=String(t),a=o.length,l=arguments.length>1?arguments[1]:void 0,r=l?Number(l):0;r!=r&&(r=0);var d=Math.min(Math.max(r,0),s);return a+d>s?!1:-1!=i.call(n,o,r)};t?t(String.prototype,"includes",{value:n,configurable:!0,writable:!0}):String.prototype.includes=n}(),String.prototype.startsWith||!function(){var e=function(){try{var e={},t=Object.defineProperty,i=t(e,e,e)&&t}catch(n){}return i}(),t={}.toString,i=function(e){if(null==this)throw TypeError();var i=String(this);if(e&&"[object RegExp]"==t.call(e))throw TypeError();var n=i.length,s=String(e),o=s.length,a=arguments.length>1?arguments[1]:void 0,l=a?Number(a):0;l!=l&&(l=0);var r=Math.min(Math.max(l,0),n);if(o+r>n)return!1;for(var d=-1;++d<o;)if(i.charCodeAt(r+d)!=s.charCodeAt(d))return!1;return!0};e?e(String.prototype,"startsWith",{value:i,configurable:!0,writable:!0}):String.prototype.startsWith=i}(),Object.keys||(Object.keys=function(e,t,i){i=[];for(t in e)i.hasOwnProperty.call(e,t)&&i.push(t);return i}),e.expr[":"].icontains=function(t,i,n){var s=e(t),o=(s.data("tokens")||s.text()).toUpperCase();return o.includes(n[3].toUpperCase())},e.expr[":"].ibegins=function(t,i,n){var s=e(t),o=(s.data("tokens")||s.text()).toUpperCase();return o.startsWith(n[3].toUpperCase())},e.expr[":"].aicontains=function(t,i,n){var s=e(t),o=(s.data("tokens")||s.data("normalizedText")||s.text()).toUpperCase();return o.includes(n[3].toUpperCase())},e.expr[":"].aibegins=function(t,i,n){var s=e(t),o=(s.data("tokens")||s.data("normalizedText")||s.text()).toUpperCase();return o.startsWith(n[3].toUpperCase())};var s=function(t,i,n){n&&(n.stopPropagation(),n.preventDefault()),this.$element=e(t),this.$newElement=null,this.$button=null,this.$menu=null,this.$lis=null,this.options=i,null===this.options.title&&(this.options.title=this.$element.attr("title")),this.val=s.prototype.val,this.render=s.prototype.render,this.refresh=s.prototype.refresh,this.setStyle=s.prototype.setStyle,this.selectAll=s.prototype.selectAll,this.deselectAll=s.prototype.deselectAll,this.destroy=s.prototype.remove,this.remove=s.prototype.remove,this.show=s.prototype.show,this.hide=s.prototype.hide,this.init()};s.VERSION="1.7.2",s.DEFAULTS={noneSelectedText:"---- Chọn ----",noneResultsText:"No results matched {0}",countSelectedText:function(e,t){return 1==e?"{0} item selected":"{0} items selected"},maxOptionsText:function(e,t){return[1==e?"Limit reached ({n} item max)":"Limit reached ({n} items max)",1==t?"Group limit reached ({n} item max)":"Group limit reached ({n} items max)"]},selectAllText:"Select All",deselectAllText:"Deselect All",doneButton:!1,doneButtonText:"Close",multipleSeparator:", ",styleBase:"btn",style:"btn-default",size:"auto",title:null,selectedTextFormat:"values",width:!1,container:!1,hideDisabled:!1,showSubtext:!1,showIcon:!0,showContent:!0,dropupAuto:!0,header:!1,liveSearch:!1,liveSearchPlaceholder:null,liveSearchNormalize:!1,liveSearchStyle:"contains",actionsBox:!1,iconBase:"glyphicon",tickIcon:"glyphicon-ok",maxOptions:!1,mobile:!1,selectOnTab:!1,dropdownAlignRight:!1},s.prototype={constructor:s,init:function(){var t=this,i=this.$element.attr("id");this.$element.addClass("bs-select-hidden"),this.liObj={},this.multiple=this.$element.prop("multiple"),this.autofocus=this.$element.prop("autofocus"),this.$newElement=this.createView(),this.$element.after(this.$newElement),this.$button=this.$newElement.children("button"),this.$menu=this.$newElement.children(".dropdown-menu"),this.$menuInner=this.$menu.children(".inner"),this.$searchbox=this.$menu.find("input"),this.options.dropdownAlignRight&&this.$menu.addClass("dropdown-menu-right"),"undefined"!=typeof i&&(this.$button.attr("data-id",i),e('label[for="'+i+'"]').click(function(e){e.preventDefault(),t.$button.focus()})),this.checkDisabled(),this.clickListener(),this.options.liveSearch&&this.liveSearchListener(),this.render(),this.setStyle(),this.setWidth(),this.options.container&&this.selectPosition(),this.$menu.data("this",this),this.$newElement.data("this",this),this.options.mobile&&this.mobile(),this.$newElement.on("hide.bs.dropdown",function(e){t.$element.trigger("hide.bs.select",e)}),this.$newElement.on("hidden.bs.dropdown",function(e){t.$element.trigger("hidden.bs.select",e)}),this.$newElement.on("show.bs.dropdown",function(e){t.$element.trigger("show.bs.select",e)}),this.$newElement.on("shown.bs.dropdown",function(e){t.$element.trigger("shown.bs.select",e)}),setTimeout(function(){t.$element.trigger("loaded.bs.select")})},createDropdown:function(){var t=this.multiple?" show-tick":"",n=this.$element.parent().hasClass("input-group")?" input-group-btn":"",s=this.autofocus?" autofocus":"",o=this.options.header?'<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>'+this.options.header+"</div>":"",a=this.options.liveSearch?'<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"'+(null===this.options.liveSearchPlaceholder?"":' placeholder="'+i(this.options.liveSearchPlaceholder)+'"')+"></div>":"",l=this.multiple&&this.options.actionsBox?'<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">'+this.options.selectAllText+'</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">'+this.options.deselectAllText+"</button></div></div>":"",r=this.multiple&&this.options.doneButton?'<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">'+this.options.doneButtonText+"</button></div></div>":"",d='<div class="btn-group bootstrap-select'+t+n+'"><button type="button" class="'+this.options.styleBase+' dropdown-toggle" data-toggle="dropdown"'+s+'><span class="filter-option pull-left"></span>&nbsp;<span class="caret"></span></button><div class="dropdown-menu open">'+o+a+l+'<ul class="dropdown-menu inner" role="menu"></ul>'+r+"</div></div>";return e(d)},createView:function(){var e=this.createDropdown(),t=this.createLi();return e.find("ul")[0].innerHTML=t,e},reloadLi:function(){this.destroyLi();var e=this.createLi();this.$menuInner[0].innerHTML=e},destroyLi:function(){this.$menu.find("li").remove()},createLi:function(){var n=this,s=[],o=0,a=document.createElement("option"),l=-1,r=function(e,t,i,n){return"<li"+("undefined"!=typeof i&""!==i?' class="'+i+'"':"")+("undefined"!=typeof t&null!==t?' data-original-index="'+t+'"':"")+("undefined"!=typeof n&null!==n?'data-optgroup="'+n+'"':"")+">"+e+"</li>"},d=function(e,s,o,a){return'<a tabindex="0"'+("undefined"!=typeof s?' class="'+s+'"':"")+("undefined"!=typeof o?' style="'+o+'"':"")+(n.options.liveSearchNormalize?' data-normalized-text="'+t(i(e))+'"':"")+("undefined"!=typeof a||null!==a?' data-tokens="'+a+'"':"")+">"+e+'<span class="'+n.options.iconBase+" "+n.options.tickIcon+' check-mark"></span></a>'};if(this.options.title&&!this.multiple&&(l--,!this.$element.find(".bs-title-option").length)){var h=this.$element[0];a.className="bs-title-option",a.appendChild(document.createTextNode(this.options.title)),a.value="",h.insertBefore(a,h.firstChild),null===h.options[h.selectedIndex].getAttribute("selected")&&(a.selected=!0)}return this.$element.find("option").each(function(t){var i=e(this);if(l++,!i.hasClass("bs-title-option")){var a=this.className||"",h=this.style.cssText,c=i.data("content")?i.data("content"):i.html(),p=i.data("tokens")?i.data("tokens"):null,u="undefined"!=typeof i.data("subtext")?'<small class="text-muted">'+i.data("subtext")+"</small>":"",m="undefined"!=typeof i.data("icon")?'<span class="'+n.options.iconBase+" "+i.data("icon")+'"></span> ':"",f=this.disabled||"OPTGROUP"===this.parentElement.tagName&&this.parentElement.disabled;if(""!==m&&f&&(m="<span>"+m+"</span>"),n.options.hideDisabled&&f)return void l--;if(i.data("content")||(c=m+'<span class="text">'+c+u+"</span>"),"OPTGROUP"===this.parentElement.tagName&&i.data("divider")!==!0){if(0===i.index()){o+=1;var g=this.parentElement.label,v="undefined"!=typeof i.parent().data("subtext")?'<small class="text-muted">'+i.parent().data("subtext")+"</small>":"",b=i.parent().data("icon")?'<span class="'+n.options.iconBase+" "+i.parent().data("icon")+'"></span> ':"",$=" "+this.parentElement.className||"";g=b+'<span class="text">'+g+v+"</span>",0!==t&&s.length>0&&(l++,s.push(r("",null,"divider",o+"div"))),l++,s.push(r(g,null,"dropdown-header"+$,o))}s.push(r(d(c,"opt "+a+$,h,p),t,"",o))}else i.data("divider")===!0?s.push(r("",t,"divider")):i.data("hidden")===!0?s.push(r(d(c,a,h,p),t,"hidden is-hidden")):(this.previousElementSibling&&"OPTGROUP"===this.previousElementSibling.tagName&&(l++,s.push(r("",null,"divider",o+"div"))),s.push(r(d(c,a,h,p),t)));n.liObj[t]=l}}),this.multiple||0!==this.$element.find("option:selected").length||this.options.title||this.$element.find("option").eq(0).prop("selected",!0).attr("selected","selected"),s.join("")},findLis:function(){return null==this.$lis&&(this.$lis=this.$menu.find("li")),this.$lis},render:function(t){var i,n=this;t!==!1&&this.$element.find("option").each(function(e){var t=n.findLis().eq(n.liObj[e]);n.setDisabled(e,this.disabled||"OPTGROUP"===this.parentElement.tagName&&this.parentElement.disabled,t),n.setSelected(e,this.selected,t)}),this.tabIndex();var s=this.$element.find("option").map(function(){if(this.selected){if(n.options.hideDisabled&&(this.disabled||"OPTGROUP"===this.parentElement.tagName&&this.parentElement.disabled))return!1;var t,i=e(this),s=i.data("icon")&&n.options.showIcon?'<i class="'+n.options.iconBase+" "+i.data("icon")+'"></i> ':"";return t=n.options.showSubtext&&i.data("subtext")&&!n.multiple?' <small class="text-muted">'+i.data("subtext")+"</small>":"","undefined"!=typeof i.attr("title")?i.attr("title"):i.data("content")&&n.options.showContent?i.data("content"):s+i.html()+t}}).toArray(),o=this.multiple?s.join(this.options.multipleSeparator):s[0];if(this.multiple&&this.options.selectedTextFormat.indexOf("count")>-1){var a=this.options.selectedTextFormat.split(">");if(a.length>1&&s.length>a[1]||1==a.length&&s.length>=2){i=this.options.hideDisabled?", [disabled]":"";var l=this.$element.find("option").not('[data-divider="true"], [data-hidden="true"]'+i).length,r="function"==typeof this.options.countSelectedText?this.options.countSelectedText(s.length,l):this.options.countSelectedText;o=r.replace("{0}",s.length.toString()).replace("{1}",l.toString())}}void 0==this.options.title&&(this.options.title=this.$element.attr("title")),"static"==this.options.selectedTextFormat&&(o=this.options.title),o||(o="undefined"!=typeof this.options.title?this.options.title:this.options.noneSelectedText),this.$button.attr("title",e.trim(o.replace(/<[^>]*>?/g,""))),this.$button.children(".filter-option").html(o),this.$element.trigger("rendered.bs.select")},setStyle:function(e,t){this.$element.attr("class")&&this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi,""));var i=e?e:this.options.style;"add"==t?this.$button.addClass(i):"remove"==t?this.$button.removeClass(i):(this.$button.removeClass(this.options.style),this.$button.addClass(i))},liHeight:function(t){if(t||this.options.size!==!1&&!this.sizeInfo){var i=document.createElement("div"),n=document.createElement("div"),s=document.createElement("ul"),o=document.createElement("li"),a=document.createElement("li"),l=document.createElement("a"),r=document.createElement("span"),d=this.options.header?this.$menu.find(".popover-title")[0].cloneNode(!0):null,h=this.options.liveSearch?document.createElement("div"):null,c=this.options.actionsBox&&this.multiple?this.$menu.find(".bs-actionsbox")[0].cloneNode(!0):null,p=this.options.doneButton&&this.multiple?this.$menu.find(".bs-donebutton")[0].cloneNode(!0):null;if(r.className="text",i.className=this.$menu[0].parentNode.className+" open",n.className="dropdown-menu open",s.className="dropdown-menu inner",o.className="divider",r.appendChild(document.createTextNode("Inner text")),l.appendChild(r),a.appendChild(l),s.appendChild(a),s.appendChild(o),d&&n.appendChild(d),h){var u=document.createElement("span");h.className="bs-searchbox",u.className="form-control",h.appendChild(u),n.appendChild(h)}c&&n.appendChild(c),n.appendChild(s),p&&n.appendChild(p),i.appendChild(n),document.body.appendChild(i);var m=l.offsetHeight,f=d?d.offsetHeight:0,g=h?h.offsetHeight:0,v=c?c.offsetHeight:0,b=p?p.offsetHeight:0,$=e(o).outerHeight(!0),x=getComputedStyle?getComputedStyle(n):!1,y=x?e(n):null,w=parseInt(x?x.paddingTop:y.css("paddingTop"))+parseInt(x?x.paddingBottom:y.css("paddingBottom"))+parseInt(x?x.borderTopWidth:y.css("borderTopWidth"))+parseInt(x?x.borderBottomWidth:y.css("borderBottomWidth")),C=w+parseInt(x?x.marginTop:y.css("marginTop"))+parseInt(x?x.marginBottom:y.css("marginBottom"))+2;document.body.removeChild(i),this.sizeInfo={liHeight:m,headerHeight:f,searchHeight:g,actionsHeight:v,doneButtonHeight:b,dividerHeight:$,menuPadding:w,menuExtras:C}}},setSize:function(){this.findLis(),this.liHeight();var t,i,n,s,o=this,a=this.$menu,l=this.$menuInner,r=e(window),d=this.$newElement[0].offsetHeight,h=this.sizeInfo.liHeight,c=this.sizeInfo.headerHeight,p=this.sizeInfo.searchHeight,u=this.sizeInfo.actionsHeight,m=this.sizeInfo.doneButtonHeight,f=this.sizeInfo.dividerHeight,g=this.sizeInfo.menuPadding,v=this.sizeInfo.menuExtras,b=this.options.hideDisabled?".disabled":"",$=function(){n=o.$newElement.offset().top-r.scrollTop(),s=r.height()-n-d};if($(),this.options.header&&a.css("padding-top",0),"auto"===this.options.size){var x=function(){var r,d=function(t,i){return function(n){return i?n.classList?n.classList.contains(t):e(n).hasClass(t):!(n.classList?n.classList.contains(t):e(n).hasClass(t))}},f=o.$menuInner[0].getElementsByTagName("li"),b=Array.prototype.filter?Array.prototype.filter.call(f,d("hidden",!1)):o.$lis.not(".hidden"),x=Array.prototype.filter?Array.prototype.filter.call(b,d("dropdown-header",!0)):b.filter(".dropdown-header");$(),t=s-v,o.options.container?(a.data("height")||a.data("height",a.height()),i=a.data("height")):i=a.height(),o.options.dropupAuto&&o.$newElement.toggleClass("dropup",n>s&&i>t-v),o.$newElement.hasClass("dropup")&&(t=n-v),r=b.length+x.length>3?3*h+v-2:0,a.css({"max-height":t+"px",overflow:"hidden","min-height":r+c+p+u+m+"px"}),l.css({"max-height":t-c-p-u-m-g+"px","overflow-y":"auto","min-height":Math.max(r-g,0)+"px"})};x(),this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize",x),r.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize",x)}else if(this.options.size&&"auto"!=this.options.size&&this.$lis.not(b).length>this.options.size){var y=this.$lis.not(".divider").not(b).children().slice(0,this.options.size).last().parent().index(),w=this.$lis.slice(0,y+1).filter(".divider").length;t=h*this.options.size+w*f+g,o.options.container?(a.data("height")||a.data("height",a.height()),i=a.data("height")):i=a.height(),o.options.dropupAuto&&this.$newElement.toggleClass("dropup",n>s&&i>t-v),a.css({"max-height":t+c+p+u+m+"px",overflow:"hidden","min-height":""}),l.css({"max-height":t-g+"px","overflow-y":"auto","min-height":""})}},setWidth:function(){if("auto"===this.options.width){this.$menu.css("min-width","0");var e=this.$menu.parent().clone().appendTo("body"),t=this.options.container?this.$newElement.clone().appendTo("body"):e,i=e.children(".dropdown-menu").outerWidth(),n=t.css("width","auto").children("button").outerWidth();e.remove(),t.remove(),this.$newElement.css("width",Math.max(i,n)+"px")}else"fit"===this.options.width?(this.$menu.css("min-width",""),this.$newElement.css("width","").addClass("fit-width")):this.options.width?(this.$menu.css("min-width",""),this.$newElement.css("width",this.options.width)):(this.$menu.css("min-width",""),this.$newElement.css("width",""));this.$newElement.hasClass("fit-width")&&"fit"!==this.options.width&&this.$newElement.removeClass("fit-width")},selectPosition:function(){var t,i,n=this,s="<div />",o=e(s),a=function(e){o.addClass(e.attr("class").replace(/form-control|fit-width/gi,"")).toggleClass("dropup",e.hasClass("dropup")),t=e.offset(),i=e.hasClass("dropup")?0:e[0].offsetHeight,o.css({top:t.top+i,left:t.left,width:e[0].offsetWidth,position:"absolute"})};this.$newElement.on("click",function(){n.isDisabled()||(a(e(this)),o.appendTo(n.options.container),o.toggleClass("open",!e(this).hasClass("open")),o.append(n.$menu))}),e(window).on("resize scroll",function(){a(n.$newElement)}),this.$element.on("hide.bs.select",function(){n.$menu.data("height",n.$menu.height()),o.detach()})},setSelected:function(e,t,i){if(!i)var i=this.findLis().eq(this.liObj[e]);i.toggleClass("selected",t)},setDisabled:function(e,t,i){if(!i)var i=this.findLis().eq(this.liObj[e]);t?i.addClass("disabled").children("a").attr("href","#").attr("tabindex",-1):i.removeClass("disabled").children("a").removeAttr("href").attr("tabindex",0)},isDisabled:function(){return this.$element[0].disabled},checkDisabled:function(){var e=this;this.isDisabled()?(this.$newElement.addClass("disabled"),this.$button.addClass("disabled").attr("tabindex",-1)):(this.$button.hasClass("disabled")&&(this.$newElement.removeClass("disabled"),this.$button.removeClass("disabled")),-1!=this.$button.attr("tabindex")||this.$element.data("tabindex")||this.$button.removeAttr("tabindex")),this.$button.click(function(){return!e.isDisabled()})},tabIndex:function(){this.$element.is("[tabindex]")&&(this.$element.data("tabindex",this.$element.attr("tabindex")),this.$button.attr("tabindex",this.$element.data("tabindex")))},clickListener:function(){var t=this,i=e(document);this.$newElement.on("touchstart.dropdown",".dropdown-menu",function(e){e.stopPropagation()}),i.data("spaceSelect",!1),this.$button.on("keyup",function(e){/(32)/.test(e.keyCode.toString(10))&&i.data("spaceSelect")&&(e.preventDefault(),i.data("spaceSelect",!1))}),this.$newElement.on("click",function(){t.setSize(),t.$element.on("shown.bs.select",function(){if(t.options.liveSearch||t.multiple){if(!t.multiple){var e=t.liObj[t.$element[0].selectedIndex];if("number"!=typeof e)return;var i=t.$lis.eq(e)[0].offsetTop-t.$menuInner[0].offsetTop;i=i-t.$menuInner[0].offsetHeight/2+t.sizeInfo.liHeight/2,t.$menuInner[0].scrollTop=i}}else t.$menu.find(".selected a").focus()})}),this.$menu.on("click","li a",function(i){var n=e(this),s=n.parent().data("originalIndex"),o=t.$element.val(),a=t.$element.prop("selectedIndex");if(t.multiple&&i.stopPropagation(),i.preventDefault(),!t.isDisabled()&&!n.parent().hasClass("disabled")){var l=t.$element.find("option"),r=l.eq(s),d=r.prop("selected"),h=r.parent("optgroup"),c=t.options.maxOptions,p=h.data("maxOptions")||!1;if(t.multiple){if(r.prop("selected",!d),t.setSelected(s,!d),n.blur(),c!==!1||p!==!1){var u=c<l.filter(":selected").length,m=p<h.find("option:selected").length;if(c&&u||p&&m)if(c&&1==c)l.prop("selected",!1),r.prop("selected",!0),t.$menu.find(".selected").removeClass("selected"),t.setSelected(s,!0);else if(p&&1==p){h.find("option:selected").prop("selected",!1),r.prop("selected",!0);var f=n.parent().data("optgroup");t.$menu.find('[data-optgroup="'+f+'"]').removeClass("selected"),t.setSelected(s,!0)}else{var g="function"==typeof t.options.maxOptionsText?t.options.maxOptionsText(c,p):t.options.maxOptionsText,v=g[0].replace("{n}",c),b=g[1].replace("{n}",p),$=e('<div class="notify"></div>');g[2]&&(v=v.replace("{var}",g[2][c>1?0:1]),b=b.replace("{var}",g[2][p>1?0:1])),r.prop("selected",!1),t.$menu.append($),c&&u&&($.append(e("<div>"+v+"</div>")),t.$element.trigger("maxReached.bs.select")),p&&m&&($.append(e("<div>"+b+"</div>")),t.$element.trigger("maxReachedGrp.bs.select")),setTimeout(function(){t.setSelected(s,!1)},10),$.delay(750).fadeOut(300,function(){e(this).remove()})}}}else l.prop("selected",!1),r.prop("selected",!0),t.$menu.find(".selected").removeClass("selected"),t.setSelected(s,!0);t.multiple?t.options.liveSearch&&t.$searchbox.focus():t.$button.focus(),(o!=t.$element.val()&&t.multiple||a!=t.$element.prop("selectedIndex")&&!t.multiple)&&(t.$element.change(),t.$element.trigger("changed.bs.select",[s,r.prop("selected"),d]))}}),this.$menu.on("click","li.disabled a, .popover-title, .popover-title :not(.close)",function(i){i.currentTarget==this&&(i.preventDefault(),i.stopPropagation(),t.options.liveSearch&&!e(i.target).hasClass("close")?t.$searchbox.focus():t.$button.focus())}),this.$menu.on("click","li.divider, li.dropdown-header",function(e){e.preventDefault(),e.stopPropagation(),t.options.liveSearch?t.$searchbox.focus():t.$button.focus()}),this.$menu.on("click",".popover-title .close",function(){t.$button.click()}),this.$searchbox.on("click",function(e){e.stopPropagation()}),this.$menu.on("click",".actions-btn",function(i){t.options.liveSearch?t.$searchbox.focus():t.$button.focus(),i.preventDefault(),i.stopPropagation(),e(this).hasClass("bs-select-all")?t.selectAll():t.deselectAll(),t.$element.change()}),this.$element.change(function(){t.render(!1)})},liveSearchListener:function(){var n=this,s=e('<li class="no-results"></li>');this.$newElement.on("click.dropdown.data-api touchstart.dropdown.data-api",function(){n.$menuInner.find(".active").removeClass("active"),n.$searchbox.val()&&(n.$searchbox.val(""),n.$lis.not(".is-hidden").removeClass("hidden"),s.parent().length&&s.remove()),n.multiple||n.$menuInner.find(".selected").addClass("active"),setTimeout(function(){n.$searchbox.focus()},10)}),this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api",function(e){e.stopPropagation()}),this.$searchbox.on("input propertychange",function(){if(n.$searchbox.val()){var o=n.$lis.not(".is-hidden").removeClass("hidden").children("a");o=n.options.liveSearchNormalize?o.not(":a"+n._searchStyle()+"("+t(n.$searchbox.val())+")"):o.not(":"+n._searchStyle()+"("+n.$searchbox.val()+")"),o.parent().addClass("hidden"),n.$lis.filter(".dropdown-header").each(function(){var t=e(this),i=t.data("optgroup");0===n.$lis.filter("[data-optgroup="+i+"]").not(t).not(".hidden").length&&(t.addClass("hidden"),n.$lis.filter("[data-optgroup="+i+"div]").addClass("hidden"))});var a=n.$lis.not(".hidden");a.each(function(t){var i=e(this);i.hasClass("divider")&&(i.index()===a.eq(0).index()||i.index()===a.last().index()||a.eq(t+1).hasClass("divider"))&&i.addClass("hidden")}),n.$lis.not(".hidden, .no-results").length?s.parent().length&&s.remove():(s.parent().length&&s.remove(),s.html(n.options.noneResultsText.replace("{0}",'"'+i(n.$searchbox.val())+'"')).show(),n.$menuInner.append(s))}else n.$lis.not(".is-hidden").removeClass("hidden"),s.parent().length&&s.remove();n.$lis.filter(".active").removeClass("active"),n.$lis.not(".hidden, .divider, .dropdown-header").eq(0).addClass("active").children("a").focus(),e(this).focus()})},_searchStyle:function(){var e="icontains";switch(this.options.liveSearchStyle){case"begins":case"startsWith":e="ibegins";break;case"contains":}return e},val:function(e){return"undefined"!=typeof e?(this.$element.val(e),this.render(),this.$element):this.$element.val()},selectAll:function(){this.findLis(),this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected",!0),this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").addClass("selected"),this.render(!1)},deselectAll:function(){this.findLis(),this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected",!1),this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").removeClass("selected"),this.render(!1)},keydown:function(i){var n,s,o,a,l,r,d,h,c,p=e(this),u=p.is("input")?p.parent().parent():p.parent(),m=u.data("this"),f=":not(.disabled, .hidden, .dropdown-header, .divider)",g={32:" ",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9"};if(m.options.liveSearch&&(u=p.parent().parent()),m.options.container&&(u=m.$menu),n=e("[role=menu] li a",u),c=m.$menu.parent().hasClass("open"),!c&&(i.keyCode>=48&&i.keyCode<=57||event.keyCode>=65&&event.keyCode<=90)&&(m.options.container?m.$newElement.trigger("click"):(m.setSize(),m.$menu.parent().addClass("open"),c=!0),m.$searchbox.focus()),m.options.liveSearch&&(/(^9$|27)/.test(i.keyCode.toString(10))&&c&&0===m.$menu.find(".active").length&&(i.preventDefault(),m.$menu.parent().removeClass("open"),m.options.container&&m.$newElement.removeClass("open"),m.$button.focus()),n=e("[role=menu] li:not(.disabled, .hidden, .dropdown-header, .divider)",u),p.val()||/(38|40)/.test(i.keyCode.toString(10))||0===n.filter(".active").length&&(n=m.$newElement.find("li"),n=m.options.liveSearchNormalize?n.filter(":a"+m._searchStyle()+"("+t(g[i.keyCode])+")"):n.filter(":"+m._searchStyle()+"("+g[i.keyCode]+")"))),n.length){if(/(38|40)/.test(i.keyCode.toString(10)))s=n.index(n.filter(":focus")),a=n.parent(f).first().data("originalIndex"),l=n.parent(f).last().data("originalIndex"),o=n.eq(s).parent().nextAll(f).eq(0).data("originalIndex"),r=n.eq(s).parent().prevAll(f).eq(0).data("originalIndex"),d=n.eq(o).parent().prevAll(f).eq(0).data("originalIndex"),m.options.liveSearch&&(n.each(function(t){e(this).hasClass("disabled")||e(this).data("index",t)}),s=n.index(n.filter(".active")),a=n.first().data("index"),l=n.last().data("index"),o=n.eq(s).nextAll().eq(0).data("index"),r=n.eq(s).prevAll().eq(0).data("index"),d=n.eq(o).prevAll().eq(0).data("index")),h=p.data("prevIndex"),38==i.keyCode?(m.options.liveSearch&&(s-=1),s!=d&&s>r&&(s=r),a>s&&(s=a),s==h&&(s=l)):40==i.keyCode&&(m.options.liveSearch&&(s+=1),-1==s&&(s=0),s!=d&&o>s&&(s=o),s>l&&(s=l),s==h&&(s=a)),p.data("prevIndex",s),m.options.liveSearch?(i.preventDefault(),p.hasClass("dropdown-toggle")||(n.removeClass("active").eq(s).addClass("active").children("a").focus(),p.focus())):n.eq(s).focus();else if(!p.is("input")){var v,b,$=[];n.each(function(){e(this).parent().hasClass("disabled")||e.trim(e(this).text().toLowerCase()).substring(0,1)==g[i.keyCode]&&$.push(e(this).parent().index())}),v=e(document).data("keycount"),v++,e(document).data("keycount",v),b=e.trim(e(":focus").text().toLowerCase()).substring(0,1),b!=g[i.keyCode]?(v=1,e(document).data("keycount",v)):v>=$.length&&(e(document).data("keycount",0),v>$.length&&(v=1)),n.eq($[v-1]).focus()}if((/(13|32)/.test(i.keyCode.toString(10))||/(^9$)/.test(i.keyCode.toString(10))&&m.options.selectOnTab)&&c){if(/(32)/.test(i.keyCode.toString(10))||i.preventDefault(),m.options.liveSearch)/(32)/.test(i.keyCode.toString(10))||(m.$menu.find(".active a").click(),p.focus());else{var x=e(":focus");x.click(),x.focus(),i.preventDefault(),e(document).data("spaceSelect",!0)}e(document).data("keycount",0)}(/(^9$|27)/.test(i.keyCode.toString(10))&&c&&(m.multiple||m.options.liveSearch)||/(27)/.test(i.keyCode.toString(10))&&!c)&&(m.$menu.parent().removeClass("open"),m.options.container&&m.$newElement.removeClass("open"),m.$button.focus())}},mobile:function(){this.$element.addClass("mobile-device").appendTo(this.$newElement),this.options.container&&this.$menu.hide()},refresh:function(){this.$lis=null,this.reloadLi(),this.render(),this.checkDisabled(),this.liHeight(!0),this.setStyle(),this.setWidth(),this.$lis&&this.$searchbox.trigger("propertychange"),this.$element.trigger("refreshed.bs.select")},hide:function(){this.$newElement.hide()},show:function(){this.$newElement.show()},remove:function(){this.$newElement.remove(),this.$element.remove()}};var o=e.fn.selectpicker;e.fn.selectpicker=n,e.fn.selectpicker.Constructor=s,e.fn.selectpicker.noConflict=function(){return e.fn.selectpicker=o,this},e(document).data("keycount",0).on("keydown",'.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input',s.prototype.keydown).on("focusin.modal",'.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input',function(e){e.stopPropagation()}),e(window).on("load.bs.select.data-api",function(){e(".selectpicker").each(function(){var t=e(this);n.call(t,t.data())})})}(jQuery)});