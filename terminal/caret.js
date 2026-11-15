function $(elid) {
    return document.getElementById(elid);
  }
  
  var cursor;
  window.onload = init;
  
  function init() {
    cursor = $("cursor");
    if (cursor) cursor.style.left = "0px";
    startCursorBlink();
  }

  function startCursorBlink() {
    var el = $("cursor");
    if (!el) return;
    var reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}
    el.style.animation = "none";
    if (reduce || typeof gsap === "undefined") {
      el.style.opacity = "1";
      return;
    }
    gsap.set(el, { opacity: 1 });
    gsap.timeline({ repeat: -1 })
      .set(el, { opacity: 1 })
      .to(el, { opacity: 1, duration: 0.5, ease: "none" })
      .set(el, { opacity: 0 })
      .to(el, { opacity: 0, duration: 0.5, ease: "none" });
  }
  
  function nl2br(txt) {
    return txt.replace(/\n/g, '');// <br> avant entre ''
  }
  
  function writeit(from, e) {
    e = e || window.event;
    var w = $("writer");
    var tw = from.value;
    if (!pw){
      w.innerHTML = nl2br(tw);
    }
  }
  
  function moveIt(count, e) {
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    //				alert(count);
    if (keycode == 37 && parseInt(cursor.style.left) >= (0 - ((count - 1) * 10))) {
      cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
    } else if (keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0) {
      cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
    }
  
  }
  
  function alert(txt) {
    console.log(txt);
  }