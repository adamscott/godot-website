import{gsap}from"../modules/gsap@3.12.5.min.mjs";import{ScrollTrigger}from"../modules/gsap@3.12.5_ScrollTrigger.min.mjs";import detectPlatform from"../modules/detect-browser.mjs";gsap.registerPlugin(ScrollTrigger);const RELEASE_NUMBERS_INITIAL_DELAY_S=1,RELEASE_NUMBERS_DURATION_S=1,RELEASE_NUMBERS_EASE_NAME="power2.out",RELEASE_NUMBERS_MAX_BAR_WIDTH_PX=200,releaseNumbersEase=gsap.parseEase(RELEASE_NUMBERS_EASE_NAME),numberFormat=new Intl.NumberFormat("en-US");for(const t of["commits","contributors"]){const n=gsap.timeline(),e=gsap.utils.toArray(`.release-header .header-numbers-${t} .header-numbers-line`).reverse();for(let s=0;s<e.length;s++){const t=e[s],o=gsap.timeline();o.to(t.querySelector(".bar"),{delay:s==0?RELEASE_NUMBERS_INITIAL_DELAY_S:0,duration:RELEASE_NUMBERS_DURATION_S,ease:RELEASE_NUMBERS_EASE_NAME,width:`${Number(t.dataset.value)/Number(t.dataset.max)*RELEASE_NUMBERS_MAX_BAR_WIDTH_PX}px`,onUpdate:()=>{t.querySelector(".number").innerText=numberFormat.format(Math.round(releaseNumbersEase(o.progress())*Number(t.dataset.value)))},onComplete:()=>{t.querySelector(".number").innerText=numberFormat.format(Number(t.dataset.value))}}),n.add(o),t.querySelector(".number").innerText="0"}}const windowHeight=window.innerHeight,elements=Array.from(gsap.utils.toArray(".release-cards .release-card, .release-content .section .section-title"));for(const e of elements){if(e.getBoundingClientRect().top<windowHeight)continue;const t=gsap.timeline({scrollTrigger:{trigger:e,start:"top bottom"}});t.from(e,{y:"+=50",duration:.5,opacity:0})}const platformData=detectPlatform(navigator.userAgent,navigator.userAgentData);let platformName="windows";switch(platformData.os){case"mac":case"iphone":case"ipad":platformName="macos";break;case"linux":platformName="linux";break;case"android":platformName="android";break;case"windows":default:break}const releasePlatformContainer=document.querySelector(".release-platform-container");if(releasePlatformContainer!=null){const e=releasePlatformContainer.querySelector(`.release-platform-${platformName}`);e!=null&&e.classList.add("active")}const downloadOther=document.querySelector(".card-download-other");downloadOther!=null&&(downloadOther.textContent="More downloads");const authors=Array.from(document.querySelectorAll("#special-thanks-release-authors .release-card-authors .release-card-author"));let max_prs=0;for(const e of authors)max_prs=Math.max(max_prs,Number(e.dataset.prs));const scales=new Array(5);for(let e=scales.length-1;e>=0;e--)e+1==scales.length?scales[e]=Math.floor(max_prs/2):scales[e]=Math.floor(scales[e+1]/2);for(const e of authors){const t=Number(e.dataset.prs);for(let n=0;n<scales.length;n++){if(t>=scales[n]){if(n+1==scales.length){e.classList.add(`size-${n+1}`);break}continue}if(n===0)break;e.classList.add(`size-${n+1}`);break}}const cLinks=Array.from(document.querySelectorAll(".c-link"));for(const e of cLinks){if(e.dataset.readMore!=null){for(;e.lastChild!=null;)e.lastChild.remove();const t=e.appendChild(document.createElement("a"));t.href=e.dataset.readMore,t.classList.add("c-link-a"),t.textContent="Read more",t.target="_blank"}if(e.dataset.contributors!=null){let a="",t=e.parentElement;for(;t!=document.body;){if(t.classList.contains("release-card")){a=t.id;break}t=t.parentElement}const r=`${a}-contributors`,c=(e,t,n,s)=>n===0?`${e} ${t}`:n<s.length-1?`${e}, ${t}`:n===1&&s.length===2?`${e} and ${t}`:`${e}, and ${t}`;let n=[];try{n=JSON.parse(e.dataset.contributors)}catch(n){const t=new Error(`Could not parse c-link contributors JSON. ${e.dataset.contributors}`);throw t.cause=n,t}const l=e=>e.name===e.github?e.github:`${e.name} (${e.github})`,d=n.map(l),u=d.reduce(c,"Contributed by"),h=n.map(e=>{const t=document.createElement("a");return t.href=`https://github.com/${e.github}`,t.target="_blank",t.textContent=l(e),t.outerHTML}).reduce(c,"Contributed by"),o=e.appendChild(document.createElement("button"));o.classList.add("c-link-popover-button");const s=o.appendChild(document.createElement("span"));n.length===1?s.textContent="person":n.length===2?s.textContent="group":s.textContent="groups",s.classList.add("material-symbols-outlined"),s.style.transform="translateY(5px)",o.title=u,o.setAttribute("popovertarget",r);const i=e.appendChild(document.createElement("div"));i.classList.add("c-link-popover"),i.id=r,i.setAttribute("popover",""),i.innerHTML=h}}let popoverAnimationFrame=0;function computePosition(e,t){const s=e.getBoundingClientRect(),o=t.getBoundingClientRect(),a={width:window.innerWidth,height:window.innerHeight},i=10,n={x:s.x-o.width/2,y:s.y-o.height-i};return n.x=Math.min(Math.max(n.x,0),a.width-o.width),n.y<0&&(n.y=s.y+s.height+i),n}function positionPopover(e){if(e.newState!=="open"){cancelAnimationFrame(popoverAnimationFrame),popoverAnimationFrame=0;return}const t=e.target,n=document.querySelector(`[popovertarget="${t.getAttribute("id")}"`),{x:o,y:i}=computePosition(n,t);Object.assign(t.style,{left:`${o}px`,top:`${i}px`}),popoverAnimationFrame>0&&cancelAnimationFrame(popoverAnimationFrame);const s=()=>{const{x:e,y:o}=computePosition(n,t);Object.assign(t.style,{left:`${e}px`,top:`${o}px`}),popoverAnimationFrame=requestAnimationFrame(s)};popoverAnimationFrame=requestAnimationFrame(s)}const popovers=document.querySelectorAll("[popover]");for(const e of popovers)e.addEventListener("toggle",positionPopover);const lazyVideos=Array.from(document.querySelectorAll("video.lazy")),lazyVideoObserver=new IntersectionObserver((e,t)=>{for(const s of e){if(!s.isIntersecting)continue;for(var n of s.target.children)typeof n.tagName=="string"&&n.tagName==="SOURCE"&&(n.src=n.dataset.src);s.target.load(),s.target.classList.remove("lazy"),t.unobserve(s.target)}});for(const e of lazyVideos)lazyVideoObserver.observe(e);const linksElement=document.querySelector("#links"),scrollToTopElement=document.querySelector("#scroll-to-top");let scrollToTopTween=null,scrollState="";const showScrollToTop=()=>{if(scrollState==="show")return;scrollState="show",scrollToTopTween!=null&&scrollToTopTween.kill(),scrollToTopElement.style.display="block",scrollToTopTween=gsap.to(scrollToTopElement,{opacity:1,duration:.5})},hideScrollToTop=()=>{if(scrollState==="hide")return;scrollState="hide",scrollToTopTween!=null&&scrollToTopTween.kill(),scrollToTopTween=gsap.to(scrollToTopElement,{opacity:0,duration:.5,onComplete:()=>{scrollToTopElement.style.display="none"}})},scrollToTopObserver=new IntersectionObserver((e)=>{const n=e[0];if(n.isIntersecting)hideScrollToTop();else{const e=linksElement.getBoundingClientRect();e.y>window.innerHeight?hideScrollToTop():showScrollToTop()}});scrollToTopObserver.observe(linksElement);const releaseCardMediaElements=Array.from(document.querySelectorAll(".release-card-media"));for(const n of releaseCardMediaElements){const e=n.querySelector(".comparison-range");if(e==null)continue;console.log("comparisonRange",e);const s=n.querySelector(".image-comparison-b");if(s==null)continue;const t=()=>{s.style=`--mask-width: ${e.valueAsNumber}%;`};e.addEventListener("mousemove",n=>{const s=e.getBoundingClientRect(),o=n.clientX-s.left,i=s.width;e.valueAsNumber=o/i*100,t()}),e.addEventListener("change",e=>{t()}),t()}