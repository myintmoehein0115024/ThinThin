/**
 * ThinThin Love page — romantic flow, responsive heart mosaic and music controls.
 */
(function($){
  "use strict";

  var secretWord = "koko";
  var loveIndex = 0;
  var finaleStarted = false;
  var bgIndex = 1;
  var bgEnd = 12;
  var bgBusy = false;
  var bgLayers = [];
  var bgActiveLayer = 0;
  var bgCache = {};
  var bgPromises = {};
  var heartCache = {};
  var heartPromises = {};
  var heartTimer = null;
  var trailHost = null;
  var trailLast = 0;
  var touchTrailBound = false;
  var bgTimer = null;
  var bgTransitionMs = 920;
  var bgCycleMs = 3180;
  var progressTotal = 25;
  var storyHoldMs = 4100;
  var storyRaf = 0;
  var storyNextAt = 0;
  var storyRunning = false;
  var imageEnd = 12;
  var imgFormat = "jpg";
  var heartImageFormat = "jpg";
  var heartImagePrefix = "1_";
  var heartPlaceholders = {1:true,4:true,7:true,22:true,28:true,29:true,30:true,34:true,35:true,36:true,37:true,38:true,40:true,41:true,42:true};

  var loves = [
    {k:"JUST FOR YOU", t:"“Give me the length of a song”"},
    {k:"MY FAVORITE PERSON", t:"You are not just my love, you are my life💝"},
    {k:"ONE LITTLE SURPRISE", t:"Only a surprise waiting at the end🧡"},
    {k:"COME CLOSER", t:"Get ready, Chit Chit💞Is about to start"},
    {k:"MYANMAR", t:"ရမ်းချစ်တယ်(Myanmar)[Yan Chit Tl]"},
    {k:"CHINESE", t:"我爱你（Chinese）[ဝေါအိုင်နီ]"},
    {k:"KOREAN", t:"사랑해요（Korean）[ဆာလန်ငယ်ရော]"},
    {k:"JAPANESE", t:"愛してます（Japanese）[အိုက်ရှိတယ်မာစ်]"},
    {k:"FRENCH", t:"Je t`aime（French）[ဂျီတီမစ်ဆီ]"},
    {k:"GERMAN", t:"Ich liebe Dich（German）[အစ်ရှလီဘဒစ်]"},
    {k:"FINNISH", t:"Minä Rakastan sinua（Finnish）[မိနာရာကပ်စတမ်စီနူဝါ]"},
    {k:"DUTCH", t:"IK hou van jou（Dutch）[အစ်ခေါင်ဖွာယောက်]"},
    {k:"CZECH", t:"Miluji te（Czech）[မြူရီတယ်]"},
    {k:"DANISH", t:"Jeg elsker dig（Danish）[ရာအယ်စကပ်တိုင်]"},
    {k:"TURKISH", t:"Seni seviyorum（Turkish）[ဆီနီဆီဗီရာ]"},
    {k:"UKRAINE", t:"Я люблю тебе（Ukraine）[ရာလူဘူတယ်ဘိုင်]"},
    {k:"MALAY", t:"saya sayang awak（Malay）[စရ ဆာရမ်အဝေါ့]"},
    {k:"GREEK", t:"S`agapo（Greek）[အယ်ဆာဂါဗို]"},
    {k:"HAUSA", t:"Ina son ku（Hausa）[အင်နာ]"},
    {k:"THAI", t:"ฉันรักคุณ（Thai）[ချန်ရခွန်]"},
    {k:"ITALIAN", t:"ti amo（Italian）[တီအမို]"},
    {k:"SHAN", t:"Hao Ha Su（Shan）[ဟောင်ဟက်ဆူ]"},
    {k:"FROM MY HEART", t:"လူသားတိုင်းက ကို့ချစ်သူကို “ချစ်တယ်” လို့ပြောပေမယ့်"},
    {k:"NO OTHER WORDS", t:"ကို ခုပြောမယ့်စကားနဲ့တော့ ဘယ်လိုမှနှိုင်းယှဥ်လို့မရဘူး"},
    {k:"FOREVER", t:"💞ကိုမင်းကိုချစ်တယ် [ထာဝရသာအတွက်ချစ်တယ်]💞"}
  ];

  var loveWhispers = [
    "for the smile I never get tired of",
    "the person my heart looks for first",
    "a tiny secret, kept just for you",
    "come a little closer to my heart",
    "love sounds sweetest in every language",
    "a softer way to say what I feel",
    "one quiet beat, one more reason",
    "today, tomorrow, and all our small tomorrows",
    "some feelings simply bloom into words",
    "wherever you are, you feel like home",
    "one promise I want to keep gently",
    "stay close, even on ordinary days",
    "my favorite person, my favorite place",
    "there are still a thousand moments to share",
    "my heart always knows the way back",
    "through every season, still us",
    "a quiet wish for the life we keep building",
    "distance is only part of the story",
    "you make the quiet feel brighter",
    "one heart, two places, the same feeling",
    "my favorite chapter is the one called us",
    "from the very beginning, it was you",
    "just a little reminder, because you matter",
    "some love is too big for one sentence",
    "and this is the part where I say it again"
  ];

  var finalOrbitHost = null;

  var romanticHeartSeeds = [
    [8,18,18,-2.8,-1.2],[16,76,13,2.2,-2.1],[28,26,10,-1.5,-3.8],[38,84,15,2.8,-1.6],
    [49,11,12,1.7,-4.6],[59,77,17,-2.4,-2.8],[70,23,11,2.1,-3.5],[81,69,16,-2.6,-4.2],
    [90,31,10,1.9,-1.9],[6,53,12,2.5,-5.2],[22,92,9,-1.6,-3.0],[76,90,12,1.5,-4.8],
    [94,83,14,-2.1,-2.5],[32,8,8,1.2,-1.4],[65,8,9,-1.8,-3.3],[52,93,11,2.4,-4.0],
    [12,36,8,-1.2,-2.9],[86,54,9,1.4,-4.9]
  ];

  function initRomanticHearts(){
    var host = document.querySelector('.romantic-hearts');
    if(!host || host.getAttribute('data-ready') === '1') return;
    host.setAttribute('data-ready','1');
    for(var i=0;i<romanticHeartSeeds.length;i++){
      var seed = romanticHeartSeeds[i];
      var heart = document.createElement('span');
      heart.className = 'romantic-heart';
      heart.textContent = (i % 4 === 0) ? '♥' : '♡';
      heart.style.left = seed[0] + '%';
      heart.style.top = seed[1] + '%';
      heart.style.setProperty('--heart-size', seed[2] + 'px');
      heart.style.setProperty('--heart-drift', seed[3] + 'vw');
      heart.style.setProperty('--heart-delay', seed[4] + 's');
      heart.style.setProperty('--heart-duration', (7.5 + (i % 5) * 1.1) + 's');
      heart.style.opacity = (0.16 + (i % 5) * 0.035).toFixed(2);
      host.appendChild(heart);
    }
  }

  function romanticBurst(){
    var host = document.querySelector('.romantic-hearts');
    if(!host) return;
    var count = 7 + (loveIndex % 3);
    var burstOffsets = [[-60,-16],[-34,-58],[4,-70],[58,-20],[42,26],[10,62],[-48,42],[-74,4],[76,34]];
    for(var i=0;i<count;i++){
      var heart = document.createElement('span');
      heart.className = 'romantic-heart romantic-heart-burst';
      heart.textContent = (i % 3 === 0) ? '♥' : ((i % 3 === 1) ? '♡' : '✦');
      var offset = burstOffsets[i % burstOffsets.length];
      heart.style.setProperty('--burst-x', offset[0] + 'px');
      heart.style.setProperty('--burst-y', offset[1] + 'px');
      heart.style.setProperty('--burst-delay', (i * 38) + 'ms');
      host.appendChild(heart);
      window.setTimeout(function(node){ return function(){ if(node && node.parentNode) node.parentNode.removeChild(node); }; }(heart), 1900);
    }
  }

  function createTrailHeart(x, y, strong){
    if(!trailHost) return;
    var h = document.createElement('span');
    h.className = 'cursor-heart-trail' + (strong ? ' is-strong' : '');
    h.textContent = strong ? '♥' : (Math.random() > .72 ? '♥' : '♡');
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.setProperty('--trail-rotate', ((Math.random() * 30) - 15).toFixed(1) + 'deg');
    h.style.setProperty('--trail-scale', (0.82 + Math.random() * 0.42).toFixed(2));
    trailHost.appendChild(h);
    window.setTimeout(function(node){
      return function(){ if(node && node.parentNode) node.parentNode.removeChild(node); };
    }(h), strong ? 1250 : 980);
  }

  function initHeartTrail(){
    trailHost = document.querySelector('.romantic-hearts');
    if(!trailHost || trailHost.getAttribute('data-trail-ready') === '1') return;
    trailHost.setAttribute('data-trail-ready','1');

    document.addEventListener('pointermove', function(event){
      if(window.matchMedia && window.matchMedia('(hover: none)').matches) return;
      var now = performance.now();
      if(now - trailLast < 155) return;
      trailLast = now;
      createTrailHeart(event.clientX, event.clientY, false);
    }, {passive:true});

    document.addEventListener('pointerdown', function(event){
      if(window.matchMedia && window.matchMedia('(hover: none)').matches) return;
      if(event.target && event.target.closest && event.target.closest('#music-control, .thinthin-return, .love_btn, .love_text')) return;
      for(var i=0;i<2;i++){
        (function(index){
          window.setTimeout(function(){
            createTrailHeart(event.clientX + (index ? 10 : -10), event.clientY + (index ? -6 : 7), index === 0);
          }, index * 55);
        })(i);
      }
    }, {passive:true});

    if(!touchTrailBound){
      touchTrailBound = true;
      document.addEventListener('touchend', function(event){
        var t = event.changedTouches && event.changedTouches[0];
        if(!t) return;
        if(event.target && event.target.closest && event.target.closest('#music-control, .thinthin-return, .love_btn, .love_text')) return;
        createTrailHeart(t.clientX, t.clientY, true);
      }, {passive:true});
    }
  }

  function setRomanticMoment(index){
    var page = document.body;
    if(!page) return;
    page.classList.remove('moment-1','moment-2','moment-3','moment-4','moment-5');
    page.classList.add('moment-' + (((index - 1) % 5) + 1));
  }

  function setMusicControl(){
    var audio = document.getElementById("bgm");
    var button = document.getElementById("music-control");
    if(!audio || !button || button.dataset.ready === "1") return;
    button.dataset.ready = "1";

    var icon = button.querySelector(".music-control-icon");
    var label = button.querySelector(".music-control-text");

    function render(){
      var paused = audio.paused;
      button.classList.toggle("is-paused", paused);
      button.setAttribute("aria-pressed", paused ? "true" : "false");
      button.setAttribute("aria-label", paused ? "Play song" : "Pause song");
      if(label) label.textContent = paused ? "Play Song" : "Pause Song";
      if(icon) icon.textContent = paused ? "▶" : "♫";
    }

    button.addEventListener("click", function(event){
      event.preventDefault();
      event.stopPropagation();
      if(audio.paused){
        var playPromise = audio.play();
        if(playPromise && typeof playPromise.catch === "function") playPromise.catch(function(){});
      }else{
        audio.pause();
      }
      render();
    });

    audio.addEventListener("play", render);
    audio.addEventListener("pause", render);
    render();

    function tryUnlock(event){
      if(event && event.target && event.target.closest && event.target.closest("#music-control, .thinthin-return")) return;
      if(audio.paused){
        var p = audio.play();
        if(p && typeof p.catch === "function") p.catch(function(){});
      }
      document.removeEventListener("pointerdown", tryUnlock);
    }
    document.addEventListener("pointerdown", tryUnlock, {passive:true});
  }

  function bindSecret(){
    var button = document.querySelector(".love_btn");
    var input = document.querySelector(".love_text");
    if(!button || !input) return;

    function openLove(){
      var value = (input.value || "").trim();
      if(value === secretWord){
        button.disabled = true;
        window.location.href = "love.html";
      }else{
        input.classList.remove("is-error");
        void input.offsetWidth;
        input.classList.add("is-error");
        input.focus();
      }
    }

    button.addEventListener("click", openLove);
    input.addEventListener("keydown", function(event){
      if(event.key === "Enter") openLove();
    });
  }

  function preloadBackgrounds(){
    for(var i=1;i<=imageEnd;i++){
      (function(index){
        var url = "images/" + index + "." + imgFormat;
        var img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        bgCache[index] = img;
        bgPromises[index] = new Promise(function(resolve){
          var done = false;
          function finish(){
            if(done) return;
            done = true;
            resolve(img);
          }
          img.onload = function(){
            // Decode during preload so the visible transition only has to animate opacity.
            if(typeof img.decode === "function"){
              img.decode().catch(function(){}).finally(finish);
            }else{
              finish();
            }
          };
          img.onerror = finish;
          img.src = url;
          if(img.complete && img.naturalWidth){
            if(typeof img.decode === "function"){
              img.decode().catch(function(){}).finally(finish);
            }else{
              finish();
            }
          }
        });
      })(i);
    }
  }

  function layerUrl(index){
    var cache = bgCache[index];
    return cache ? (cache.currentSrc || cache.src) : ("images/" + index + "." + imgFormat);
  }

  function prepareBackgroundLayer(layer, index){
    if(!layer) return Promise.resolve();
    if(Number(layer.dataset.preparedIndex || 0) === index) return Promise.resolve();

    var p = bgPromises[index] || Promise.resolve();
    return p.then(function(){
      if(!layer || finaleStarted) return;
      layer.src = layerUrl(index);
      layer.classList.remove("bgImg_2");
      if(document.body.classList.contains("final-stage")) layer.classList.add("bgImg_2");
      layer.style.opacity = "0";
      layer.dataset.preparedIndex = String(index);
      if(typeof layer.decode === "function") return layer.decode().catch(function(){});
    });
  }

  function initBackgroundLayers(){
    var first = document.querySelector(".bgImg");
    if(!first) return null;
    var second = document.querySelector(".bgImg-alt");
    if(!second){
      second = first.cloneNode(false);
      second.classList.add("bgImg-alt");
      second.removeAttribute("src");
      second.style.opacity = "0";
      first.parentNode.insertBefore(second, first.nextSibling);
    }
    first.style.opacity = "1";
    first.style.willChange = "opacity";
    second.style.willChange = "opacity";
    first.dataset.preparedIndex = "1";
    bgLayers = [first, second];
    bgActiveLayer = 0;
    // Prime the very next chapter before the first visual transition happens.
    prepareBackgroundLayer(second, 2);
    return bgLayers;
  }

  function initImg(){
    preloadHeartImages();
    preloadBackgrounds();
    initBackgroundLayers();
  }

  function clearBackgroundTimer(){
    if(bgTimer){
      window.clearTimeout(bgTimer);
      bgTimer = null;
    }
  }

  function scheduleBackgroundCycle(delay){
    clearBackgroundTimer();
    if(finaleStarted) return;
    bgTimer = window.setTimeout(cycleBackgrounds, delay == null ? bgCycleMs : delay);
  }

  function updateMemoryProgress(index){
    var count = document.getElementById("memory-progress-count");
    var fill = document.getElementById("memory-progress-fill");
    var header = document.querySelector(".memory-header");
    var safeIndex = Math.max(1, Math.min(progressTotal, Number(index) || 1));
    if(count) count.textContent = (safeIndex < 10 ? "0" : "") + safeIndex + " / " + progressTotal;
    if(fill) fill.style.width = ((safeIndex / progressTotal) * 100).toFixed(2) + "%";
    if(header) header.classList.toggle("is-final", safeIndex >= progressTotal);
  }

  function cycleBackgrounds(){
    if(finaleStarted || bgBusy) return;
    if(!bgLayers.length) initBackgroundLayers();
    if(bgLayers.length < 2) return;

    bgBusy = true;
    var nextIndex = bgIndex;
    updateMemoryProgress(nextIndex);
    bgIndex = bgIndex >= bgEnd ? 1 : bgIndex + 1;

    var active = bgLayers[bgActiveLayer];
    var next = bgLayers[bgActiveLayer ? 0 : 1];
    var prepared = Number(next.dataset.preparedIndex || 0) === nextIndex;

    function finishSwitch(){
      if(finaleStarted){
        bgBusy = false;
        return;
      }
      bgActiveLayer = bgActiveLayer ? 0 : 1;
      bgBusy = false;

      // Prepare the following chapter only after the current crossfade is complete,
      // keeping decode/paint work away from the visual transition itself.
      var following = bgIndex;
      var spare = bgLayers[bgActiveLayer ? 0 : 1];
      window.setTimeout(function(){
        if(finaleStarted) return;
        prepareBackgroundLayer(spare, following);
      }, 60);

      scheduleBackgroundCycle(2200);
    }

    function crossfade(){
      if(finaleStarted){ bgBusy = false; return; }
      // The hidden layer already contains the decoded next image. No src swap here.
      next.style.opacity = "0";
      void next.offsetWidth;
      window.requestAnimationFrame(function(){
        next.style.opacity = "1";
        active.style.opacity = "0";
      });
      window.setTimeout(finishSwitch, bgTransitionMs + 35);
    }

    if(prepared){
      // Keep the switch on a clean frame boundary.
      window.requestAnimationFrame(function(){ crossfade(); });
    }else{
      // First pass only: wait for decode, then crossfade. Later passes are pre-primed.
      prepareBackgroundLayer(next, nextIndex).then(function(){
        if(finaleStarted){ bgBusy = false; return; }
        crossfade();
      });
    }
  }

  function ensureChapterWhisper($text, lineIndex){
    if(!$text || !$text.length) return;
    var existing = $text.find('.love-copy-whisper');
    var whisper = loveWhispers[(lineIndex - 1) % loveWhispers.length] || '';
    if(!existing.length){
      existing = $('<span class="love-copy-whisper"></span>');
      $text.find('.love-copy-kicker').after(existing);
    }
    existing.text(whisper);
  }

  function renderLoveLine(){
    if(finaleStarted) return false;
    var $text = $(".love_you");
    if(!$text.length) return false;

    var line = loves[loveIndex];
    if(!line) return false;

    loveIndex += 1;
    var currentIndex = loveIndex;
    var variant = ['a','b','c'][(currentIndex - 1) % 3];

    setRomanticMoment(currentIndex);
    updateMemoryProgress(currentIndex);
    $text.stop(true,true);
    $text.removeClass('line-animate line-variant-a line-variant-b line-variant-c');

    // Render every character in one operation. Nothing from the previous
    // chapter is allowed to remain partially rendered.
    $text.empty();
    $('<span class="love-copy-kicker"></span>').text('♡ ' + line.k + ' ♡').appendTo($text);
    $('<span class="love-copy-main"></span>').text(line.t).appendTo($text);
    ensureChapterWhisper($text, currentIndex);
    $text.attr('data-chapter', String(currentIndex));
    $text.addClass('line-variant-' + variant);
    $text.css({display:'block',opacity:1,visibility:'visible'});

    // Animate only the new words, never the whole message card.
    void $text[0].offsetWidth;
    $text.addClass('line-animate');
    try{ romanticBurst(); }catch(e){}

    if(currentIndex >= loves.length){
      storyNextAt = performance.now() + storyHoldMs;
    }
    return true;
  }

  function storyTick(now){
    if(!storyRunning || finaleStarted){
      storyRaf = 0;
      return;
    }

    if(storyNextAt <= 0){
      if(renderLoveLine()) storyNextAt = now + storyHoldMs;
    }else if(now >= storyNextAt){
      if(loveIndex >= loves.length){
        storyRunning = false;
        storyRaf = 0;
        ILoveYou();
        return;
      }
      // Catch up by exactly one chapter per frame. This prevents a dropped
      // timeout from permanently freezing the story on one line.
      if(renderLoveLine()) storyNextAt = now + storyHoldMs;
      else storyRunning = false;
    }

    storyRaf = window.requestAnimationFrame(storyTick);
  }

  function startLoveSequence(){
    if(storyRunning || finaleStarted) return;
    storyRunning = true;
    storyNextAt = 0;
    if(storyRaf) window.cancelAnimationFrame(storyRaf);
    storyRaf = window.requestAnimationFrame(storyTick);
  }

  function showLoveLine(){
    if(storyRunning || finaleStarted) return;
    storyRunning = true;
    storyNextAt = performance.now() + storyHoldMs;
    renderLoveLine();
    if(storyRaf) window.cancelAnimationFrame(storyRaf);
    storyRaf = window.requestAnimationFrame(storyTick);
  }

  function show(){ showLoveLine(); }

  function preloadHeartImages(){
    for(var n=1;n<=42;n++){
      if(heartPlaceholders[n]) continue;
      (function(index){
        if(heartPromises[index]) return;
        var number = index < 10 ? "0" + index : String(index);
        var img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        if("fetchPriority" in img) img.fetchPriority = "low";
        heartCache[index] = img;
        heartPromises[index] = new Promise(function(resolve){
          var settled = false;
          function finish(){
            if(settled) return;
            settled = true;
            resolve(img);
          }
          img.onload = function(){
            if(typeof img.decode === "function") img.decode().catch(function(){}).finally(finish);
            else finish();
          };
          img.onerror = finish;
          img.src = "images/map/" + heartImagePrefix + number + "." + heartImageFormat;
          if(img.complete && img.naturalWidth){
            if(typeof img.decode === "function") img.decode().catch(function(){}).finally(finish);
            else finish();
          }
        });
      })(n);
    }
  }

  function buildHeart(){
    var $heart = $(".love_heart");
    if(!$heart.length || $heart.find(".heart-grid").length) return;

    preloadHeartImages();
    var $grid = $("<div class='heart-grid' aria-hidden='true'></div>");
    for(var n=1;n<=42;n++){
      var $cell = $("<div class='heart-cell'></div>");
      if(!heartPlaceholders[n]){
        var number = n < 10 ? "0" + n : String(n);
        var $img = $("<img>");
        var cached = heartCache[n];
        $img.attr("src", cached && (cached.currentSrc || cached.src) || ("images/map/" + heartImagePrefix + number + "." + heartImageFormat));
        $img.attr("alt", "");
        $img.attr("decoding", "async");
        $img.css("animation-delay", (n * 28) + "ms");
        $cell.append($img);
      }
      $grid.append($cell);
    }
    $heart.append($grid);
  }

  function initFinalOrbit(){
    if(finalOrbitHost) return;
    var host = document.querySelector('.love-final-page');
    if(!host) return;
    finalOrbitHost = document.createElement('div');
    finalOrbitHost.className = 'final-orbit-hearts';
    finalOrbitHost.setAttribute('aria-hidden','true');
    var chars = ['♡','♥','✦','♡','♥','✧'];
    for(var i=0;i<chars.length;i++){
      var h=document.createElement('span');
      h.textContent=chars[i];
      h.style.setProperty('--orbit-i',i);
      finalOrbitHost.appendChild(h);
    }
    host.appendChild(finalOrbitHost);
  }

  function showLoveHeart(){ buildHeart(); }

  function showFlower(){
    if(!$ || !$.fn || !$.fn.snowfall) return;
    $("body").snowfall("clear");
    $("body").snowfall({
      image:"images/huaban.png",
      flakeCount:24,
      minSize:5,
      maxSize:18
    });
  }

  function ILoveYou(){
    if(finaleStarted) return;
    finaleStarted = true;
    clearBackgroundTimer();
    document.body.classList.add("finale-mode");
    document.body.classList.add("final-stage");
    updateMemoryProgress(progressTotal);
    document.title = "Forever, Chit Chit ♡";
    var progressHeader = document.querySelector(".memory-header");
    if(progressHeader) progressHeader.setAttribute("aria-label", "Our little chapter, complete");

    $(".love_you").stop(true,true).fadeOut(900);
    $(".bgImg, .bgImg-alt").addClass("bgImg_2").stop(true,true).fadeTo(1200,0);

    initFinalOrbit();
    showLoveHeart();
    showFlower();

    window.setTimeout(function(){
      $(".love_heart").stop(true,true).fadeIn(1800);
    }, 700);
  }

  function init(){
    initRomanticHearts();
    initHeartTrail();
    setMusicControl();
    updateMemoryProgress(1);
    preloadBackgrounds();
    preloadHeartImages();
    initBackgroundLayers();
    var first = document.querySelector(".bgImg");
    if(first){
      first.style.opacity = "0";
      requestAnimationFrame(function(){
        first.style.opacity = "1";
      });
      scheduleBackgroundCycle(2850);
      startLoveSequence();
    }else{
      showLoveLine();
    }
  }

  $(function(){
    initRomanticHearts();
    initHeartTrail();
    bindSecret();
    setMusicControl();
  });

  window.showFlower = showFlower;
  window.initImg = initImg;
  window.init = init;
  window.show = show;
  window.showLoveHeart = showLoveHeart;
  window.ILoveYou = ILoveYou;

})(jQuery);
