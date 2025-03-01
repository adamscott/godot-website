import{gsap}from"../modules/gsap@3.12.5.min.mjs";import{ScrollTrigger}from"../modules/gsap@3.12.5_ScrollTrigger.min.mjs";import detectPlatform from"../modules/detect-browser.mjs";gsap.registerPlugin(ScrollTrigger);const releaseHeaderBackground=document.querySelector(".release-header-background");gsap.to(releaseHeaderBackground,{scrollTrigger:{trigger:".release-header",start:"top 0%+=64px",end:"bottom 0%",onUpdate:e=>{const t=e.progress;releaseHeaderBackground.style.transform=`
				translateY(${t*releaseHeaderBackground.getBoundingClientRect().height}px)
				translateZ(-1px)
				scale(2)
			`}}});const windowHeight=window.innerHeight,elements=Array.from(gsap.utils.toArray(".release-cards .release-card, .release-content .section .section-title"));for(const e of elements){if(e.getBoundingClientRect().top<windowHeight)continue;const t=gsap.timeline({scrollTrigger:{trigger:e,start:"top bottom"}});t.from(e,{y:"+=50",duration:.5,opacity:0})}const platformData=detectPlatform(navigator.userAgent,navigator.userAgentData);let platformName="windows";switch(platformData.os){case"mac":case"iphone":case"ipad":platformName="macos";break;case"linux":platformName="linux";break;case"android":platformName="android";break;case"windows":default:break}const releasePlatformContainer=document.querySelector(".release-platform-container");if(releasePlatformContainer!=null){const e=releasePlatformContainer.querySelector(`.release-platform-${platformName}`);e!=null&&e.classList.add("active")}const downloadOther=document.querySelector(".card-download-other");downloadOther!=null&&(downloadOther.textContent="More downloads");const authors=Array.from(document.querySelectorAll("#special-thanks-release-authors .release-card-authors .release-card-author"));let max_prs=0;for(const e of authors)max_prs=Math.max(max_prs,Number(e.dataset.prs));const scales=new Array(5);for(let e=scales.length-1;e>=0;e--)e+1==scales.length?scales[e]=Math.floor(max_prs/2):scales[e]=Math.floor(scales[e+1]/2);for(const e of authors){const t=Number(e.dataset.prs);for(let n=0;n<scales.length;n++){if(t>=scales[n]){if(n+1==scales.length){e.classList.add(`size-${n+1}`);break}continue}if(n===0)break;e.classList.add(`size-${n+1}`);break}}let popoverAnimationFrame=0;function computePosition(e,t){const s=e.getBoundingClientRect(),o=t.getBoundingClientRect(),a={width:window.innerWidth,height:window.innerHeight},i=10,n={x:s.x-o.width/2,y:s.y-o.height-i};return n.x=Math.min(Math.max(n.x,0),a.width-o.width),n.y<0&&(n.y=s.y+s.height+i),n}function positionPopover(e){if(e.newState!=="open"){cancelAnimationFrame(popoverAnimationFrame),popoverAnimationFrame=0;return}const t=e.target,n=document.querySelector(`[popovertarget="${t.getAttribute("id")}"`),{x:o,y:i}=computePosition(n,t);Object.assign(t.style,{left:`${o}px`,top:`${i}px`}),popoverAnimationFrame>0&&cancelAnimationFrame(popoverAnimationFrame);const s=()=>{const{x:e,y:o}=computePosition(n,t);Object.assign(t.style,{left:`${e}px`,top:`${o}px`}),popoverAnimationFrame=requestAnimationFrame(s)};popoverAnimationFrame=requestAnimationFrame(s)}const popovers=document.querySelectorAll("[popover]");for(const e of popovers)e.addEventListener("toggle",positionPopover);const lazyVideoObserver=new IntersectionObserver((e,t)=>{for(const o of e){if(!o.isIntersecting)continue;const n=o.target,s=n.querySelector(":scope > source");if(s==null)continue;n.classList.remove("lazy"),s.src=s.dataset.src,delete s.dataset.src,n.load(),t.unobserve(n)}}),releaseCardVideoContainers=Array.from(document.querySelectorAll(".release-card-video-container"));for(const s of releaseCardVideoContainers){const t=s.querySelector(":scope > noscript");if(t==null)throw new Error("`.release-card-video-container > noscript` is null");const o=document.implementation.createHTMLDocument();o.write(t.innerHTML);const e=o.body.querySelector(":scope > .release-card-video");if(e==null)throw new Error("`.release-card-video-container > noscript > .release-card-video` is null");e.classList.add("lazy");const n=e.querySelector(":scope > source");if(n==null)throw new Error("`.release-card-video-container > noscript > .release-card-video > source` is null");n.dataset.src=n.src,n.src="",s.insertBefore(e,t),t.remove(),lazyVideoObserver.observe(e)}const linksElement=document.querySelector("#links"),scrollToTopElement=document.querySelector("#scroll-to-top");let scrollToTopTween=null,scrollState="";const showScrollToTop=()=>{if(scrollState==="show")return;scrollState="show",scrollToTopTween!=null&&scrollToTopTween.kill(),scrollToTopElement.style.display="block",scrollToTopTween=gsap.to(scrollToTopElement,{opacity:1,duration:.5})},hideScrollToTop=()=>{if(scrollState==="hide")return;scrollState="hide",scrollToTopTween!=null&&scrollToTopTween.kill(),scrollToTopTween=gsap.to(scrollToTopElement,{opacity:0,duration:.5,onComplete:()=>{scrollToTopElement.style.display="none"}})},scrollToTopObserver=new IntersectionObserver((e)=>{const n=e[0];if(n.isIntersecting)hideScrollToTop();else{const e=linksElement.getBoundingClientRect();e.y>window.innerHeight?hideScrollToTop():showScrollToTop()}});scrollToTopObserver.observe(linksElement);const releaseCardMediaElements=Array.from(document.querySelectorAll(".release-card-media"));for(const t of releaseCardMediaElements){const e=t.querySelector(".comparison-range");if(e==null)continue;const o=t.querySelector(".comparison-range-indicator");if(o==null)continue;const i=t.querySelector(".image-comparison-b, .video-comparison-b");if(i==null)continue;const n=()=>{i.style=`--mask-width: ${e.valueAsNumber}%;`},s=()=>{o.style=`left: calc(${e.valueAsNumber}% - (0.25em / 2))`};e.addEventListener("mousemove",t=>{const o=e.getBoundingClientRect(),i=t.clientX-o.left,a=o.width;e.valueAsNumber=i/a*100,n(),s()}),e.addEventListener("change",e=>{n(),s()}),n(),s()}const anchors=Array.from(document.querySelector("main .release-container").querySelectorAll("a"));for(const e of anchors){if(e.classList.contains("download-button"))continue;try{const t=new URL(e.href),n=t.protocol===window.location.protocol&&t.host===window.location.host&&t.port===window.location.port&&t.pathname===window.location.pathname&&t.hash.startsWith("#");n||(e.target="_blank")}catch(t){const e=new Error("Error while setting anchor target to blank.");e.cause=t,console.error(e)}}