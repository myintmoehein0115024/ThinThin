/**
 * Created by yi on 2018/2/14.
 */
/*输入koko提交跳转到love页*/
$(function(){
    //按钮单击事件
    $(".love_btn").click(function(){
        //获取文本框的值
        var text = $(".love_text").val();
        if(text == "koko"){
            //输入正确跳转页面
            window.location.href="love.html";
        }else{
            //输入错误弹框提示
            alert("koko Lo Call Pr So！");
        }
    });
})
//文字数组
var loves = new Array(
    "“Give me the length of a song”",
    "You are not just my love, you are my life💝",
    "Only a surprise waiting at the end🧡",
    "Get ready, Chit Chit💞Is about to start",
    "ရမ်းချစ်တယ်(Myanmar)[Yan Chit Tl]",
    "我爱你（Chinese）[ဝေါအိုင်နီ]",
    "사랑해요（Korean）[ဆာလန်ငယ်ရော]",
    "愛してます（Japanese）[အိုက်ရှိတယ်မာစ်]",
    "Je t`aime（French）[ဂျီတီမစ်ဆီ]",
    "Ich liebe Dich（German）[အစ်ရှလီဘဒစ်]",
    "Minä Rakastan sinua（Finnish）[မိနာရာကပ်စတမ်စီနူဝါ]",
    "IK hou van jou（Dutch）[အစ်ခေါင်ဖွာယောက်]",
    "Miluji te（Czech）[မြူရီတယ်]",
    "Jeg elsker dig（Danish）[ရာအယ်စကပ်တိုင်]",
    "Seni seviyorum（Turkish）[ဆီနီဆီဗီရာ]",
    "Я люблю тебе（Ukraine）[ရာလူဘူတယ်ဘိုင်]",
    "saya sayang awak（Malay）[စရ ဆာရမ်အဝေါ့]",
    "S`agapo（Greek）[အယ်ဆာဂါဗို]",
    "Ina son ku（Hausa）[အင်နာ]",
    "ฉันรักคุณ（Thai）[ချန်ရခွန်]",
    "ti amo（Italian）[တီအမို]",
    "Hao Ha Su（Shan）[ဟောင်ဟက်ဆူ]",
    "လူသားတိုင်းက ကို့ချစ်သူကို “ချစ်တယ်” လို့ပြောပေမယ့်",
    "ကို ခုပြောမယ့်စကားနဲ့‌တော့ဘယ်လိုမှနှိုင်းယှဥ်လို့မရဘူး",
    "💞ကိုမင်းကိုချစ်တယ် [ထာဝရသာအတွက်ချစ်တယ်]💞"
);
//初始化文字数组下标
var i = 0;
//文字动态效果显示
function love(){
    $(".love_you").html(loves[i++]);
    if(i == loves.length){
        i = 0;
        ILoveYou();
        return;
    }
    setTimeout(hidden,3500);
}
//显示文字
function show(){
    $(".love_you").fadeIn(3000,love());
}
//隐藏文字
function hidden(){
    $(".love_you").fadeOut(3000);
    setTimeout(show,3500);
}
//初始化图片地址
var img_start = 2;
//最大图片数
var img_end = 12;
//图片格式
var img_format = "jpg";
//显示背景
function showImg(){
    var url = "images/"+(img_start++)+"."+img_format;
    $(".bgImg").attr("src",url);
    if(img_start == img_end){
        img_start = 1;
    }
    setTimeout(himg,3500);
}

//显示背景图片
function simg() {
    $(".bgImg").fadeIn(3000, showImg());
}

//隐藏背景图片
function himg() {
    $(".bgImg").fadeOut(3000);
    setTimeout(simg, 3500);
}

function audioAutoPlay() {
    document.getElementById('bgm').play();
}

//--创建触摸监听，当浏览器打开页面时，触摸屏幕触发事件，进行音频播放
document.addEventListener('touchstart', function () {
    audioAutoPlay();
});
// 点击时
document.addEventListener('click', function () {
    audioAutoPlay();
});

//爱心切片图格式
var heart_img_format = "jpg";
//爱心切片图前缀
var heart_img_pre = "1_";

/**
 * 爱心墙
 * 由42个小矩形（长为110px,宽为100px）7x6排列组成
 * 自定义图片填充小矩形，形成爱心状
 */
function showLoveHeart(){
    for (var k = 0;k < 6;k++){
        var ul = "<ul></ul>";
        $(".love_heart").append(ul);
        for(var i = 0;i < 7;i++){
            var j = k*7+i+1;
            if(j == 1 || j == 4 || j == 7 || j == 22 || j == 28 || j == 29 || j == 30 || j == 34 || j == 35 || j == 36 || j == 37 || j == 38 || j == 40 || j == 41 || j == 42){
                var li = "<li></li>"
                $("ul:eq("+k+")").append(li);
                continue;
            }
            //如果图片名称格式存在01,02,03...09,10,11加入此判断
            if(j < 10){
                j = "0"+j;
            }
            var img = "<li><img src='images/map/"+heart_img_pre+j+"."+heart_img_format+"'></li>";
            $("ul:eq("+k+")").append(img);
        }
    }
}
/*显示爱心墙*/
function ILoveYou(){
    showLoveHeart();
    $(".bgImg").addClass("bgImg_2");
    setTimeout("$('.bgImg').fadeOut(3000,showFlower())",2500);
    $(".love_heart").fadeIn(4000);
    return;
}
/*落花效果*/
function showFlower(){
    //清除落花
    $("body").snowfall('clear');
    //开启落花
    $("body").snowfall({
        image: "images/huaban.png",//自定义落花图片
        flakeCount:35,//落花显示数量
        minSize: 5,//落花最小体积
        maxSize: 22//落花最大体积
    });
}
//初始化
function init(){
    $(".bgImg").fadeOut(2000,function(){
        simg();/*动态加载背景图片效果*/
        show();/*动态显示文字效果*/
    });

}
//初始化图片
function initImg(){
    for(var i = 1;i <= img_end;i++){
        $.get("images/"+i+"."+img_format);
    }
}