importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");const matchCb=({url:a,request:b,event:c})=>a.origin==="https://adamscott.github.io"&&a.pathname.startsWith("/")&&!a.pathname.startsWith("/godot-website"),handlerCb=async({url:b,request:a,event:e,params:f})=>{const c=new Request(b.origin+"/godot-website"+b.pathname,{body:a.body,cache:a.cache,credentials:a.credentials,headers:a.headers,integrity:a.integrity,keepalive:a.keepalive,method:a.method,mode:a.mode,redirect:a.redirect,referrer:a.referrer,referrerPolicy:a.referrerPolicy,signal:a.signal}),d=await fetch(c,{cache:"no-cache"});return d};workbox.routing.registerRoute(matchCb,handlerCb)