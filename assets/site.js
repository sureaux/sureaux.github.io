(function(){
  var root=document.documentElement;
  var themeToggle=document.querySelector("[data-theme-toggle]");
  var search=document.querySelector("[data-project-search-input]");
  var items=[].slice.call(document.querySelectorAll("[data-project-item]"));
  var empty=document.querySelector("[data-project-search-empty]");
  function readWindowPreferences(){
    try{return JSON.parse(window.name||"{}")||{}}catch(e){return {}}
  }
  function readPreference(key,fallback){
    try{
      var query=new URLSearchParams(window.location.search).get(key);
      if(query) return query;
    }catch(e){}
    try{
      var stored=localStorage.getItem(key);
      if(stored) return stored;
    }catch(e){}
    try{
      var session=sessionStorage.getItem(key);
      if(session) return session;
    }catch(e){}
    var windowPreferences=readWindowPreferences();
    return windowPreferences[key]||fallback;
  }
  function store(key,value){
    try{localStorage.setItem(key,value)}catch(e){}
    try{sessionStorage.setItem(key,value)}catch(e){}
    try{
      var windowPreferences=readWindowPreferences();
      windowPreferences[key]=value;
      window.name=JSON.stringify(windowPreferences);
    }catch(e){}
  }
  function decorateLink(link){
    var theme=root.dataset.theme||"light";
    var raw=link.getAttribute("href");
    if(!raw||raw.charAt(0)==="#"||/^[a-z][a-z0-9+.-]*:/i.test(raw)||raw.indexOf(".html")===-1) return;
    try{
      var hash="";
      var query="";
      var path=raw;
      var hashIndex=path.indexOf("#");
      if(hashIndex!==-1){
        hash=path.slice(hashIndex);
        path=path.slice(0,hashIndex);
      }
      var queryIndex=path.indexOf("?");
      if(queryIndex!==-1){
        query=path.slice(queryIndex);
        path=path.slice(0,queryIndex);
      }
      var params=new URLSearchParams(query);
      params.set("theme",theme);
      link.setAttribute("href",path+"?"+params.toString()+hash);
    }catch(e){}
  }
  function decorateInternalLinks(){
    document.querySelectorAll("a[href]").forEach(function(link){
      decorateLink(link);
    });
  }
  function applyTheme(theme){
    root.dataset.theme=theme;
    if(themeToggle){
      var dark=theme==="dark";
      themeToggle.textContent=dark?"Light":"Dark";
      themeToggle.setAttribute("aria-pressed",dark?"true":"false");
    }
    decorateInternalLinks();
  }
  root.dataset.theme=readPreference("theme",root.dataset.theme||"light");
  applyTheme(root.dataset.theme);
  store("theme",root.dataset.theme);
  document.addEventListener("click",function(event){
    var target=event.target;
    var link=target&&target.closest?target.closest("a[href]"):null;
    if(link) decorateLink(link);
  },true);
  if(themeToggle){
    themeToggle.addEventListener("click",function(){
      var next=root.dataset.theme==="dark"?"light":"dark";
      applyTheme(next);
      store("theme",next);
    });
  }
  if(search&&items.length){
    search.addEventListener("input",function(){
      var query=search.value.trim().toLowerCase();
      var visible=0;
      items.forEach(function(item){
        var match=!query||item.textContent.toLowerCase().indexOf(query)!==-1;
        item.hidden=!match;
        if(match) visible+=1;
      });
      if(empty) empty.hidden=visible!==0||!query;
    });
  }
})();
