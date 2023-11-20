(self.webpackChunkgatsby_starter_minimal_ts=self.webpackChunkgatsby_starter_minimal_ts||[]).push([[141],{4852:function(e){"use strict";e.exports=Object.assign},7837:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Wt}});var i=n(7294),r=n(1989),o=n(5785),s=n(4160);const a=e=>{try{const t=JSON.stringify(e);sessionStorage.setItem("tabsInfo",t)}catch(t){console.log("unexpected error at saveTabsInfo")}},l=()=>{try{const e=sessionStorage.getItem("tabsInfo");return null===e?[]:JSON.parse(e)}catch(e){return console.log("unexpected error at loadTabsInfo"),[]}},c=e=>{try{const t=sessionStorage.getItem("tabsInfo");if(null===t)return console.log("slug does not exist in storage"),!1;const n=JSON.parse(t).filter((t=>t.slug!==e));return sessionStorage.setItem("tabsInfo",JSON.stringify(n)),!0}catch(t){return console.log("unexpected error at removeTabsInfo"),!1}},p=e=>{try{return sessionStorage.setItem("openFolders",JSON.stringify(e)),!0}catch(t){return console.log("unexpected error at addOpenFolders"),!1}},u=e=>{try{sessionStorage.setItem("explorerWidth",JSON.stringify(e))}catch(t){console.log("unexpected error at explorerWidth")}},h=()=>{try{const e=sessionStorage.getItem("explorerWidth");return e?Number(e):275}catch(e){return console.log("unexpected error at explorerWidth"),275}};var d=n(7896);const f=e=>{const t={};return e.forEach((e=>{let{node:n}=e;const i=n.name,r=n.childMarkdownRemark.frontmatter.slug,o=n.childMarkdownRemark.frontmatter.title,s=n.relativePath.split("/").filter(Boolean);let a=t;s.forEach(((e,t)=>{t!==s.length-1?(a[e]||(a[e]={}),a=a[e]):a[i]={title:o,slug:r}}))})),t},m=e=>{let{tree:t,currSlug:n,depth:r,openTrees:o,handleFolderClick:a}=e;const l=[],c=[];for(let i in t)t[i].title?l.push(t[i]):c.push({dirname:i,tree:t[i]});return""===n&&(n="/"),i.createElement(w,null,l.map((e=>i.createElement("li",{key:e.slug},i.createElement(s.rU,{to:e.slug,style:{textDecoration:"none",color:"#ccc"}},i.createElement(b,{selected:n===e.slug},i.createElement(v,{src:"/icons/file-document.svg",alt:"file-icon",depth:r}),e.title))))),c.map((e=>{const t=o.includes(e.dirname);return i.createElement("li",{key:e.dirname},i.createElement(b,{selected:!1,onClick:()=>a(e.dirname)},i.createElement(v,{src:t?"/folder-open.svg":"/folder.svg",depth:r}),e.dirname," (",Object.keys(e.tree).length,")"),i.createElement("div",{style:t?{}:{display:"none"}},i.createElement(m,{tree:e.tree,currSlug:n,depth:r+1,openTrees:o,handleFolderClick:a})))})))};var g=()=>{const e=(0,d.useLocation)(),{0:t,1:n}=(0,i.useState)([]),r=(0,s.K2)("326441978").allFile.edges;(0,i.useEffect)((()=>{const t=(()=>{try{const e=sessionStorage.getItem("openFolders");return null===e?[]:JSON.parse(e)}catch(e){return console.log("unexpected error at loadOpenFolders"),[]}})(),i=((e,t)=>{let n=[];return e.forEach((e=>{let{node:i}=e;i.childMarkdownRemark.frontmatter.slug+"/"===t&&(n=i.relativePath.split("/").filter(Boolean),n.pop())})),n})(r,e.pathname),s=Array.from(new Set([].concat((0,o.Z)(t),(0,o.Z)(i))));n(s),p(s)}),[]);const a=f(r);return i.createElement(i.Fragment,null,i.createElement(x,null,i.createElement(ee,{src:"/icons/arrow-down.svg",alt:"arrow-down"}),"LOCAL (seholee.com)"),i.createElement(y,null,i.createElement(m,{tree:a,currSlug:e.pathname.slice(0,-1),depth:0,openTrees:t,handleFolderClick:e=>{n((t=>{if(t.includes(e)){const n=t.filter((t=>t!==e));return p(n),n}{const n=[].concat((0,o.Z)(t),[e]);return p(n),n}}))}})))};const y=r.Z.div`
  margin-top: 0px;
  font-size: 12px;
`,w=r.Z.ul`
  list-style-type: none;
  margin: 0px 0px;
  padding: 0px 0px;
  color: #ccc;
`,v=r.Z.img`
  margin: 0px 8px;
  width: 16px;
  padding-left: ${e=>8*e.depth+"px"};
`,b=r.Z.div`
  background-color: ${e=>e.selected?"#414339":"transparent"};
  padding: 4px 0px;
  display: flex;
  align-items: center;
  cursor: pointer;
`,x=r.Z.div`
  background-color: #272822;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: 800;
`;var E,S=n(3935),z=(E=function(e,t){return E=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},E(e,t)},function(e,t){function n(){this.constructor=e}E(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),T=function(){return T=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},T.apply(this,arguments)},C={width:"100%",height:"10px",top:"0px",left:"0px",cursor:"row-resize"},O={width:"10px",height:"100%",top:"0px",left:"0px",cursor:"col-resize"},k={width:"20px",height:"20px",position:"absolute"},R={top:T(T({},C),{top:"-5px"}),right:T(T({},O),{left:void 0,right:"-5px"}),bottom:T(T({},C),{top:void 0,bottom:"-5px"}),left:T(T({},O),{left:"-5px"}),topRight:T(T({},k),{right:"-10px",top:"-10px",cursor:"ne-resize"}),bottomRight:T(T({},k),{right:"-10px",bottom:"-10px",cursor:"se-resize"}),bottomLeft:T(T({},k),{left:"-10px",bottom:"-10px",cursor:"sw-resize"}),topLeft:T(T({},k),{left:"-10px",top:"-10px",cursor:"nw-resize"})},A=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.onMouseDown=function(e){t.props.onResizeStart(e,t.props.direction)},t.onTouchStart=function(e){t.props.onResizeStart(e,t.props.direction)},t}return z(t,e),t.prototype.render=function(){return i.createElement("div",{className:this.props.className||"",style:T(T({position:"absolute",userSelect:"none"},R[this.props.direction]),this.props.replaceStyles||{}),onMouseDown:this.onMouseDown,onTouchStart:this.onTouchStart},this.props.children)},t}(i.PureComponent),L=function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},e(t,n)};return function(t,n){function i(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),N=function(){return N=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},N.apply(this,arguments)},M={width:"auto",height:"auto"},j=function(e,t,n){return Math.max(Math.min(e,n),t)},W=function(e,t){return Math.round(e/t)*t},P=function(e,t){return new RegExp(e,"i").test(t)},H=function(e){return Boolean(e.touches&&e.touches.length)},I=function(e,t,n){void 0===n&&(n=0);var i=t.reduce((function(n,i,r){return Math.abs(i-e)<Math.abs(t[n]-e)?r:n}),0),r=Math.abs(t[i]-e);return 0===n||r<n?t[i]:e},_=function(e){return"auto"===(e=e.toString())||e.endsWith("px")||e.endsWith("%")||e.endsWith("vh")||e.endsWith("vw")||e.endsWith("vmax")||e.endsWith("vmin")?e:e+"px"},B=function(e,t,n,i){if(e&&"string"==typeof e){if(e.endsWith("px"))return Number(e.replace("px",""));if(e.endsWith("%"))return t*(Number(e.replace("%",""))/100);if(e.endsWith("vw"))return n*(Number(e.replace("vw",""))/100);if(e.endsWith("vh"))return i*(Number(e.replace("vh",""))/100)}return e},Z=["as","style","className","grid","snap","bounds","boundsByDirection","size","defaultSize","minWidth","minHeight","maxWidth","maxHeight","lockAspectRatio","lockAspectRatioExtraWidth","lockAspectRatioExtraHeight","enable","handleStyles","handleClasses","handleWrapperStyle","handleWrapperClass","children","onResizeStart","onResize","onResizeStop","handleComponent","scale","resizeRatio","snapGap"],F="__resizable_base__",D=function(e){function t(t){var n=e.call(this,t)||this;return n.ratio=1,n.resizable=null,n.parentLeft=0,n.parentTop=0,n.resizableLeft=0,n.resizableRight=0,n.resizableTop=0,n.resizableBottom=0,n.targetLeft=0,n.targetTop=0,n.appendBase=function(){if(!n.resizable||!n.window)return null;var e=n.parentNode;if(!e)return null;var t=n.window.document.createElement("div");return t.style.width="100%",t.style.height="100%",t.style.position="absolute",t.style.transform="scale(0, 0)",t.style.left="0",t.style.flex="0 0 100%",t.classList?t.classList.add(F):t.className+=F,e.appendChild(t),t},n.removeBase=function(e){var t=n.parentNode;t&&t.removeChild(e)},n.ref=function(e){e&&(n.resizable=e)},n.state={isResizing:!1,width:void 0===(n.propsSize&&n.propsSize.width)?"auto":n.propsSize&&n.propsSize.width,height:void 0===(n.propsSize&&n.propsSize.height)?"auto":n.propsSize&&n.propsSize.height,direction:"right",original:{x:0,y:0,width:0,height:0},backgroundStyle:{height:"100%",width:"100%",backgroundColor:"rgba(0,0,0,0)",cursor:"auto",opacity:0,position:"fixed",zIndex:9999,top:"0",left:"0",bottom:"0",right:"0"},flexBasis:void 0},n.onResizeStart=n.onResizeStart.bind(n),n.onMouseMove=n.onMouseMove.bind(n),n.onMouseUp=n.onMouseUp.bind(n),n}return L(t,e),Object.defineProperty(t.prototype,"parentNode",{get:function(){return this.resizable?this.resizable.parentNode:null},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"window",{get:function(){return this.resizable&&this.resizable.ownerDocument?this.resizable.ownerDocument.defaultView:null},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"propsSize",{get:function(){return this.props.size||this.props.defaultSize||M},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"size",{get:function(){var e=0,t=0;if(this.resizable&&this.window){var n=this.resizable.offsetWidth,i=this.resizable.offsetHeight,r=this.resizable.style.position;"relative"!==r&&(this.resizable.style.position="relative"),e="auto"!==this.resizable.style.width?this.resizable.offsetWidth:n,t="auto"!==this.resizable.style.height?this.resizable.offsetHeight:i,this.resizable.style.position=r}return{width:e,height:t}},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"sizeStyle",{get:function(){var e=this,t=this.props.size,n=function(t){if(void 0===e.state[t]||"auto"===e.state[t])return"auto";if(e.propsSize&&e.propsSize[t]&&e.propsSize[t].toString().endsWith("%")){if(e.state[t].toString().endsWith("%"))return e.state[t].toString();var n=e.getParentSize();return Number(e.state[t].toString().replace("px",""))/n[t]*100+"%"}return _(e.state[t])};return{width:t&&void 0!==t.width&&!this.state.isResizing?_(t.width):n("width"),height:t&&void 0!==t.height&&!this.state.isResizing?_(t.height):n("height")}},enumerable:!1,configurable:!0}),t.prototype.getParentSize=function(){if(!this.parentNode)return this.window?{width:this.window.innerWidth,height:this.window.innerHeight}:{width:0,height:0};var e=this.appendBase();if(!e)return{width:0,height:0};var t=!1,n=this.parentNode.style.flexWrap;"wrap"!==n&&(t=!0,this.parentNode.style.flexWrap="wrap"),e.style.position="relative",e.style.minWidth="100%",e.style.minHeight="100%";var i={width:e.offsetWidth,height:e.offsetHeight};return t&&(this.parentNode.style.flexWrap=n),this.removeBase(e),i},t.prototype.bindEvents=function(){this.window&&(this.window.addEventListener("mouseup",this.onMouseUp),this.window.addEventListener("mousemove",this.onMouseMove),this.window.addEventListener("mouseleave",this.onMouseUp),this.window.addEventListener("touchmove",this.onMouseMove,{capture:!0,passive:!1}),this.window.addEventListener("touchend",this.onMouseUp))},t.prototype.unbindEvents=function(){this.window&&(this.window.removeEventListener("mouseup",this.onMouseUp),this.window.removeEventListener("mousemove",this.onMouseMove),this.window.removeEventListener("mouseleave",this.onMouseUp),this.window.removeEventListener("touchmove",this.onMouseMove,!0),this.window.removeEventListener("touchend",this.onMouseUp))},t.prototype.componentDidMount=function(){if(this.resizable&&this.window){var e=this.window.getComputedStyle(this.resizable);this.setState({width:this.state.width||this.size.width,height:this.state.height||this.size.height,flexBasis:"auto"!==e.flexBasis?e.flexBasis:void 0})}},t.prototype.componentWillUnmount=function(){this.window&&this.unbindEvents()},t.prototype.createSizeForCssProperty=function(e,t){var n=this.propsSize&&this.propsSize[t];return"auto"!==this.state[t]||this.state.original[t]!==e||void 0!==n&&"auto"!==n?e:"auto"},t.prototype.calculateNewMaxFromBoundary=function(e,t){var n,i,r=this.props.boundsByDirection,o=this.state.direction,s=r&&P("left",o),a=r&&P("top",o);if("parent"===this.props.bounds){var l=this.parentNode;l&&(n=s?this.resizableRight-this.parentLeft:l.offsetWidth+(this.parentLeft-this.resizableLeft),i=a?this.resizableBottom-this.parentTop:l.offsetHeight+(this.parentTop-this.resizableTop))}else"window"===this.props.bounds?this.window&&(n=s?this.resizableRight:this.window.innerWidth-this.resizableLeft,i=a?this.resizableBottom:this.window.innerHeight-this.resizableTop):this.props.bounds&&(n=s?this.resizableRight-this.targetLeft:this.props.bounds.offsetWidth+(this.targetLeft-this.resizableLeft),i=a?this.resizableBottom-this.targetTop:this.props.bounds.offsetHeight+(this.targetTop-this.resizableTop));return n&&Number.isFinite(n)&&(e=e&&e<n?e:n),i&&Number.isFinite(i)&&(t=t&&t<i?t:i),{maxWidth:e,maxHeight:t}},t.prototype.calculateNewSizeFromDirection=function(e,t){var n=this.props.scale||1,i=this.props.resizeRatio||1,r=this.state,o=r.direction,s=r.original,a=this.props,l=a.lockAspectRatio,c=a.lockAspectRatioExtraHeight,p=a.lockAspectRatioExtraWidth,u=s.width,h=s.height,d=c||0,f=p||0;return P("right",o)&&(u=s.width+(e-s.x)*i/n,l&&(h=(u-f)/this.ratio+d)),P("left",o)&&(u=s.width-(e-s.x)*i/n,l&&(h=(u-f)/this.ratio+d)),P("bottom",o)&&(h=s.height+(t-s.y)*i/n,l&&(u=(h-d)*this.ratio+f)),P("top",o)&&(h=s.height-(t-s.y)*i/n,l&&(u=(h-d)*this.ratio+f)),{newWidth:u,newHeight:h}},t.prototype.calculateNewSizeFromAspectRatio=function(e,t,n,i){var r=this.props,o=r.lockAspectRatio,s=r.lockAspectRatioExtraHeight,a=r.lockAspectRatioExtraWidth,l=void 0===i.width?10:i.width,c=void 0===n.width||n.width<0?e:n.width,p=void 0===i.height?10:i.height,u=void 0===n.height||n.height<0?t:n.height,h=s||0,d=a||0;if(o){var f=(p-h)*this.ratio+d,m=(u-h)*this.ratio+d,g=(l-d)/this.ratio+h,y=(c-d)/this.ratio+h,w=Math.max(l,f),v=Math.min(c,m),b=Math.max(p,g),x=Math.min(u,y);e=j(e,w,v),t=j(t,b,x)}else e=j(e,l,c),t=j(t,p,u);return{newWidth:e,newHeight:t}},t.prototype.setBoundingClientRect=function(){if("parent"===this.props.bounds){var e=this.parentNode;if(e){var t=e.getBoundingClientRect();this.parentLeft=t.left,this.parentTop=t.top}}if(this.props.bounds&&"string"!=typeof this.props.bounds){var n=this.props.bounds.getBoundingClientRect();this.targetLeft=n.left,this.targetTop=n.top}if(this.resizable){var i=this.resizable.getBoundingClientRect(),r=i.left,o=i.top,s=i.right,a=i.bottom;this.resizableLeft=r,this.resizableRight=s,this.resizableTop=o,this.resizableBottom=a}},t.prototype.onResizeStart=function(e,t){if(this.resizable&&this.window){var n,i=0,r=0;if(e.nativeEvent&&function(e){return Boolean((e.clientX||0===e.clientX)&&(e.clientY||0===e.clientY))}(e.nativeEvent)?(i=e.nativeEvent.clientX,r=e.nativeEvent.clientY):e.nativeEvent&&H(e.nativeEvent)&&(i=e.nativeEvent.touches[0].clientX,r=e.nativeEvent.touches[0].clientY),this.props.onResizeStart)if(this.resizable)if(!1===this.props.onResizeStart(e,t,this.resizable))return;this.props.size&&(void 0!==this.props.size.height&&this.props.size.height!==this.state.height&&this.setState({height:this.props.size.height}),void 0!==this.props.size.width&&this.props.size.width!==this.state.width&&this.setState({width:this.props.size.width})),this.ratio="number"==typeof this.props.lockAspectRatio?this.props.lockAspectRatio:this.size.width/this.size.height;var o=this.window.getComputedStyle(this.resizable);if("auto"!==o.flexBasis){var s=this.parentNode;if(s){var a=this.window.getComputedStyle(s).flexDirection;this.flexDir=a.startsWith("row")?"row":"column",n=o.flexBasis}}this.setBoundingClientRect(),this.bindEvents();var l={original:{x:i,y:r,width:this.size.width,height:this.size.height},isResizing:!0,backgroundStyle:N(N({},this.state.backgroundStyle),{cursor:this.window.getComputedStyle(e.target).cursor||"auto"}),direction:t,flexBasis:n};this.setState(l)}},t.prototype.onMouseMove=function(e){var t=this;if(this.state.isResizing&&this.resizable&&this.window){if(this.window.TouchEvent&&H(e))try{e.preventDefault(),e.stopPropagation()}catch(O){}var n=this.props,i=n.maxWidth,r=n.maxHeight,o=n.minWidth,s=n.minHeight,a=H(e)?e.touches[0].clientX:e.clientX,l=H(e)?e.touches[0].clientY:e.clientY,c=this.state,p=c.direction,u=c.original,h=c.width,d=c.height,f=this.getParentSize(),m=function(e,t,n,i,r,o,s){return i=B(i,e.width,t,n),r=B(r,e.height,t,n),o=B(o,e.width,t,n),s=B(s,e.height,t,n),{maxWidth:void 0===i?void 0:Number(i),maxHeight:void 0===r?void 0:Number(r),minWidth:void 0===o?void 0:Number(o),minHeight:void 0===s?void 0:Number(s)}}(f,this.window.innerWidth,this.window.innerHeight,i,r,o,s);i=m.maxWidth,r=m.maxHeight,o=m.minWidth,s=m.minHeight;var g=this.calculateNewSizeFromDirection(a,l),y=g.newHeight,w=g.newWidth,v=this.calculateNewMaxFromBoundary(i,r);this.props.snap&&this.props.snap.x&&(w=I(w,this.props.snap.x,this.props.snapGap)),this.props.snap&&this.props.snap.y&&(y=I(y,this.props.snap.y,this.props.snapGap));var b=this.calculateNewSizeFromAspectRatio(w,y,{width:v.maxWidth,height:v.maxHeight},{width:o,height:s});if(w=b.newWidth,y=b.newHeight,this.props.grid){var x=W(w,this.props.grid[0]),E=W(y,this.props.grid[1]),z=this.props.snapGap||0;w=0===z||Math.abs(x-w)<=z?x:w,y=0===z||Math.abs(E-y)<=z?E:y}var T={width:w-u.width,height:y-u.height};if(h&&"string"==typeof h)if(h.endsWith("%"))w=w/f.width*100+"%";else if(h.endsWith("vw")){w=w/this.window.innerWidth*100+"vw"}else if(h.endsWith("vh")){w=w/this.window.innerHeight*100+"vh"}if(d&&"string"==typeof d)if(d.endsWith("%"))y=y/f.height*100+"%";else if(d.endsWith("vw")){y=y/this.window.innerWidth*100+"vw"}else if(d.endsWith("vh")){y=y/this.window.innerHeight*100+"vh"}var C={width:this.createSizeForCssProperty(w,"width"),height:this.createSizeForCssProperty(y,"height")};"row"===this.flexDir?C.flexBasis=C.width:"column"===this.flexDir&&(C.flexBasis=C.height),(0,S.flushSync)((function(){t.setState(C)})),this.props.onResize&&this.props.onResize(e,p,this.resizable,T)}},t.prototype.onMouseUp=function(e){var t=this.state,n=t.isResizing,i=t.direction,r=t.original;if(n&&this.resizable){var o={width:this.size.width-r.width,height:this.size.height-r.height};this.props.onResizeStop&&this.props.onResizeStop(e,i,this.resizable,o),this.props.size&&this.setState(this.props.size),this.unbindEvents(),this.setState({isResizing:!1,backgroundStyle:N(N({},this.state.backgroundStyle),{cursor:"auto"})})}},t.prototype.updateSize=function(e){this.setState({width:e.width,height:e.height})},t.prototype.renderResizer=function(){var e=this,t=this.props,n=t.enable,r=t.handleStyles,o=t.handleClasses,s=t.handleWrapperStyle,a=t.handleWrapperClass,l=t.handleComponent;if(!n)return null;var c=Object.keys(n).map((function(t){return!1!==n[t]?i.createElement(A,{key:t,direction:t,onResizeStart:e.onResizeStart,replaceStyles:r&&r[t],className:o&&o[t]},l&&l[t]?l[t]:null):null}));return i.createElement("div",{className:a,style:s},c)},t.prototype.render=function(){var e=this,t=Object.keys(this.props).reduce((function(t,n){return-1!==Z.indexOf(n)||(t[n]=e.props[n]),t}),{}),n=N(N(N({position:"relative",userSelect:this.state.isResizing?"none":"auto"},this.props.style),this.sizeStyle),{maxWidth:this.props.maxWidth,maxHeight:this.props.maxHeight,minWidth:this.props.minWidth,minHeight:this.props.minHeight,boxSizing:"border-box",flexShrink:0});this.state.flexBasis&&(n.flexBasis=this.state.flexBasis);var r=this.props.as||"div";return i.createElement(r,N({ref:this.ref,style:n,className:this.props.className},t),this.state.isResizing&&i.createElement("div",{style:this.state.backgroundStyle}),this.props.children,this.renderResizer())},t.defaultProps={as:"div",onResizeStart:function(){},onResize:function(){},onResizeStop:function(){},enable:{top:!0,right:!0,bottom:!0,left:!0,topRight:!0,bottomRight:!0,bottomLeft:!0,topLeft:!0},style:{},grid:[1,1],lockAspectRatio:!1,lockAspectRatioExtraWidth:0,lockAspectRatioExtraHeight:0,scale:1,resizeRatio:1,snapGap:0},t}(i.PureComponent);function U(){const e=(0,s.K2)("326441978").allFile.edges.map((e=>{let{node:t}=e;return{slug:t.childMarkdownRemark.frontmatter.slug,title:t.childMarkdownRemark.frontmatter.title}})),{0:t,1:n}=(0,i.useState)([]);return i.createElement(i.Fragment,null,i.createElement(Y,{type:"text",placeholder:`Filter ${e.length} posts by title`,onChange:t=>{const i=t.target.value.toLowerCase();n(""===i?[]:e.filter((e=>e.title.toLowerCase().includes(i))))}}),i.createElement(q,null,t.map((e=>i.createElement($,null,i.createElement(G,{href:e.slug},i.createElement(K,{src:"/icons/file-document.svg"}),e.title))))))}const Y=r.Z.input`
  margin: 0px 12px;
  background-color: #414339;
  outline: none;
  color: #ccc;
  border: none;
  height: 20px;
  border-radius: 2px;
  padding: 4px 8px;
`,q=r.Z.ul`
  list-style-type: none;
  padding: 0px;
  margin: 12px 12px;
`,$=r.Z.li`
  font-size: 12px;
  padding: 4px 0px;
`,K=r.Z.img`
  width: 16px;
`,G=r.Z.a`
  text-decoration: none;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
`;function J(e){let{showExplorer:t,explorerType:n}=e;const{0:r,1:o}=(0,i.useState)(h());return i.createElement(D,{defaultSize:{width:r,height:"calc(90vh)"},maxWidth:"40%",handleClasses:{top:"pointer-events-none",bottom:"pointer-events-none",left:"pointer-events-none",topRight:"pointer-events-none",bottomRight:"pointer-events-none",bottomLeft:"pointer-events-none",topLeft:"pointer-events-none"},onResizeStop:(e,t,n,i)=>{u(Number(n.style.width.slice(0,-2)))}},i.createElement(X,{doShow:t},i.createElement(V,null,"file"===n?"EXPLORER":"SEARCH"),"file"===n&&i.createElement(g,null),"search"===n&&i.createElement(U,null),i.createElement(Q,{href:"https://d1ykeqyorqdego.cloudfront.net.",rel:"no-follow"},i.createElement(ee,{src:"/icons/arrow-right-1.svg",alt:"arrow-right"}),i.createElement(te,null,"Legacy Website"))))}const X=r.Z.nav`
  background-color: #1e1f1c;
  height: 100%;
  color: #ccc;
  cursor: default;
  user-select: none;
  display: flex;
  flex-direction: column;

  @media (max-width: 1050px) {
    z-index: 10;
    position: fixed;
    top: 48px;
    height: calc(100% - 48px);
    width: 100vw;
    display: ${e=>e.doShow?"flex":"none"};
  }
`,V=r.Z.div`
  padding: 10px 14px;
  font-size: 12px;
`,Q=r.Z.a`
  text-decoration: none;
  display: flex;
  background-color: #272822;
  margin-top: auto;
`,ee=r.Z.img`
  vertical-align: 0%;
  padding-right: 2px;
  width: 10px;
`,te=r.Z.div`
  padding: 4px 2px;
  font-weight: 800;
  color: #ccc;
  font-size: 12px;
  font-size: 12px;
`;function ne(e){let{setShowExplorer:t,setExplorerType:n,explorerType:r}=e;return i.createElement(ie,null,i.createElement(re,{selected:"file"===r},i.createElement(oe,{src:"/icons/folder-menu.svg",onClick:()=>{"file"===r?t((e=>!e)):(t(!0),n("file"))},alt:"folder-icon"})),i.createElement(re,{selected:"search"===r},i.createElement(oe,{src:"/icons/magnify.svg",onClick:()=>{"search"===r?t((e=>!e)):(t(!0),n("search"))},alt:"folder-icon"})),i.createElement(se,null,i.createElement(ae,{href:"https://github.com/seho0808"},i.createElement(oe,{src:"/images/github.png",alt:"github"})),i.createElement(le,{href:"https://www.linkedin.com/in/seho-lee-5922a2173/"},"in")))}const ie=r.Z.nav`
  padding-top: 12px;
  background-color: #272822;
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 12px);
  width: 48px;
  user-select: none;

  @media (max-width: 1050px) {
    padding-top: 0px;
    padding-left: 14px;
    position: fixed;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 48px;
  }
`,re=r.Z.div`
  border-left: ${e=>e.selected?"2px solid #aaa":"2px solid transparent"};
  border-right: 2px solid transparent;
  width: calc(100% - 4px);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1050px) {
    width: fit-content;
    border: none;
  }
`,oe=r.Z.img`
  width: 24px;
  cursor: pointer;
`,se=r.Z.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
  align-items: center;
  gap: 16px;

  @media (max-width: 1050px) {
    flex-direction: row;
    padding: 0px;
    padding-right: 28px;
    justify-content: center;
    margin: 0;
    margin-left: auto;
  }
`,ae=r.Z.a`
  display: flex;
  align-items: center;
  filter: grayscale(100%) brightness(70%) contrast(90%);
`,le=r.Z.a`
  display: block;
  font-size: 24px;
  color: #aaa;
  text-decoration: none;
  font-weight: 600;
`,ce=r.Z.div`
  display: flex;
  background-color: #1e1f1c;
  align-items: stretch;

  @media (max-width: 768px) {
    display: none;
  }
`,pe=r.Z.div`
  padding: 10px 8px 10px 14px;
  font-size: 12px;
  color: #ccc;
  background-color: #34352f;
  display: flex;
  gap: 6px;
  background-color: ${e=>e.isSelected?"#272822":"#34352F"};
  color: ${e=>e.isSelected?"white":"#ccc"};
`,ue=r.Z.div`
  background-color: #34352f;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #aaa;
  padding-right: 14px;
  margin-right: 1px;
  cursor: pointer;
  background-color: ${e=>e.isSelected?"#272822":"#34352F"};
`,he=(0,r.Z)(s.rU)`
  text-decoration: none;
`;function de(e){let{frontmatter:t}=e;const{0:n,1:r}=(0,i.useState)([]),p=t.slug;(0,i.useEffect)((()=>{const e=l();if(e.some((e=>e.slug===t.slug)))r(e);else{const n=[].concat((0,o.Z)(e),[t]);a(n),r(n)}}),[]);return i.createElement(ce,null,n.map((e=>i.createElement(i.Fragment,{key:e.slug},i.createElement(he,{to:e.slug},i.createElement(pe,{isSelected:p===e.slug},e.title)),i.createElement(ue,{isSelected:p===e.slug,onClick:t=>((e,t)=>{if(c(t),t===p){const e=n.filter((e=>e.slug!==t));return 0===e.length?void(0,s.c4)("/"):void(0,s.c4)(e[0].slug)}r((e=>e.filter((e=>e.slug!==t))))})(0,e.slug)},"🗙")))))}const fe=r.Z.div`
  height: 60px;
  padding-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b4b4b4;
  font-size: 14px;
`,me=r.Z.a`
  text-decoration: none;
  color: #a6e22e;
`;function ge(){return i.createElement(fe,null,i.createElement("span",{className:"text-red"},"Copyright "),i.createElement("span",{className:"text-purple"},"© "),i.createElement("span",{className:"text-skyblue"},"2023"),i.createElement(me,{href:"/"}," Seho Lee "),i.createElement("span",{className:"text-orange"},"All Rights Reserved"),i.createElement("span",{className:"text-yellow"},"."))}var ye=e=>{let{contentRef:t,html:n}=e;const r=(0,i.useRef)(null),{0:o,1:s}=(0,i.useState)(!1);(0,i.useEffect)((()=>{if(!t.current)return;const e=()=>{let e=t.current;var n,i,o;e&&(n=e.scrollTop,i=e.scrollHeight,o=e.clientHeight,r.current&&(r.current.style.height=o/i*100+"%",r.current.style.top=n/i*100+"%"))};e();const n=t.current;return n.addEventListener("scroll",e),()=>{n.removeEventListener("scroll",e)}}),[t]);const a=e=>{if(!o)return;if(!r.current||!t.current)return;const n=t.current.scrollHeight,i=(t.current.clientHeight,e.movementY/3/r.current.offsetHeight);t.current.scrollTop+=i*n},l=()=>{s(!1)};return(0,i.useEffect)((()=>(window.addEventListener("mousemove",a),window.addEventListener("mouseup",l),()=>{window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",l)})),[o]),i.createElement("div",{className:"minimap-container hide-on-firefox hide-on-1400","data-nosnippet":!0},i.createElement("div",{className:"minimap-box",onMouseDown:e=>{s(!0),e.preventDefault()},ref:r,style:{backgroundColor:"rgba(0, 0, 0, 0.15)",width:"100%",position:"absolute",right:0,top:0}}),i.createElement("div",{className:"markdown-content",style:{userSelect:"none",padding:"0px 30px"},dangerouslySetInnerHTML:{__html:n}}))};function we(){const{allGitHubCommit:e}=(0,s.K2)("2228436175"),t=e.edges[0].node.commit.author.name,n=e.edges[0].node.commit.author.date,r=e.edges[0].node.id;return i.createElement(ve,null,i.createElement(xe,null,"</>"),i.createElement(be,{href:"https://github.com/seho0808/blog"},i.createElement(Ee,null,i.createElement("div",null,"Latest Commit"),i.createElement("div",null,r)),i.createElement(Se,null,i.createElement("div",null,t),i.createElement("div",null,n))))}const ve=r.Z.div`
  width: 100vw;
  height: 24px;
  background-color: #414339;
  position: fixed;
  bottom: 0;
  display: flex;
  font-size: 12px;
`,be=r.Z.a`
  display: flex;
  text-decoration: none;
  width: 100%;
`,xe=r.Z.div`
  background-color: #1e1f1c;
  color: #ccc;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 6px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`,Ee=r.Z.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 20px;
  color: #ccc;
  gap: 10px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`,Se=(0,r.Z)(Ee)`
  margin-left: auto;
  @media (max-width: 768px) {
    display: none;
  }
`;var ze,Te,Ce,Oe,ke=n(5697),Re=n.n(ke),Ae=n(3524),Le=n.n(Ae),Ne=n(9590),Me=n.n(Ne),je=n(4852),We=n.n(je),Pe="bodyAttributes",He="htmlAttributes",Ie="titleAttributes",_e={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"},Be=(Object.keys(_e).map((function(e){return _e[e]})),"charset"),Ze="cssText",Fe="href",De="http-equiv",Ue="innerHTML",Ye="itemprop",qe="name",$e="property",Ke="rel",Ge="src",Je="target",Xe={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},Ve="defaultTitle",Qe="defer",et="encodeSpecialCharacters",tt="onChangeClientState",nt="titleTemplate",it=Object.keys(Xe).reduce((function(e,t){return e[Xe[t]]=t,e}),{}),rt=[_e.NOSCRIPT,_e.SCRIPT,_e.STYLE],ot="data-react-helmet",st="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},at=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),lt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},ct=function(e,t){var n={};for(var i in e)t.indexOf(i)>=0||Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n},pt=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},ut=function(e){var t=gt(e,_e.TITLE),n=gt(e,nt);if(n&&t)return n.replace(/%s/g,(function(){return Array.isArray(t)?t.join(""):t}));var i=gt(e,Ve);return t||i||void 0},ht=function(e){return gt(e,tt)||function(){}},dt=function(e,t){return t.filter((function(t){return void 0!==t[e]})).map((function(t){return t[e]})).reduce((function(e,t){return lt({},e,t)}),{})},ft=function(e,t){return t.filter((function(e){return void 0!==e[_e.BASE]})).map((function(e){return e[_e.BASE]})).reverse().reduce((function(t,n){if(!t.length)for(var i=Object.keys(n),r=0;r<i.length;r++){var o=i[r].toLowerCase();if(-1!==e.indexOf(o)&&n[o])return t.concat(n)}return t}),[])},mt=function(e,t,n){var i={};return n.filter((function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&xt("Helmet: "+e+' should be of type "Array". Instead found type "'+st(t[e])+'"'),!1)})).map((function(t){return t[e]})).reverse().reduce((function(e,n){var r={};n.filter((function(e){for(var n=void 0,o=Object.keys(e),s=0;s<o.length;s++){var a=o[s],l=a.toLowerCase();-1===t.indexOf(l)||n===Ke&&"canonical"===e[n].toLowerCase()||l===Ke&&"stylesheet"===e[l].toLowerCase()||(n=l),-1===t.indexOf(a)||a!==Ue&&a!==Ze&&a!==Ye||(n=a)}if(!n||!e[n])return!1;var c=e[n].toLowerCase();return i[n]||(i[n]={}),r[n]||(r[n]={}),!i[n][c]&&(r[n][c]=!0,!0)})).reverse().forEach((function(t){return e.push(t)}));for(var o=Object.keys(r),s=0;s<o.length;s++){var a=o[s],l=We()({},i[a],r[a]);i[a]=l}return e}),[]).reverse()},gt=function(e,t){for(var n=e.length-1;n>=0;n--){var i=e[n];if(i.hasOwnProperty(t))return i[t]}return null},yt=(ze=Date.now(),function(e){var t=Date.now();t-ze>16?(ze=t,e(t)):setTimeout((function(){yt(e)}),0)}),wt=function(e){return clearTimeout(e)},vt="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||yt:n.g.requestAnimationFrame||yt,bt="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||wt:n.g.cancelAnimationFrame||wt,xt=function(e){return console&&"function"==typeof console.warn&&console.warn(e)},Et=null,St=function(e,t){var n=e.baseTag,i=e.bodyAttributes,r=e.htmlAttributes,o=e.linkTags,s=e.metaTags,a=e.noscriptTags,l=e.onChangeClientState,c=e.scriptTags,p=e.styleTags,u=e.title,h=e.titleAttributes;Ct(_e.BODY,i),Ct(_e.HTML,r),Tt(u,h);var d={baseTag:Ot(_e.BASE,n),linkTags:Ot(_e.LINK,o),metaTags:Ot(_e.META,s),noscriptTags:Ot(_e.NOSCRIPT,a),scriptTags:Ot(_e.SCRIPT,c),styleTags:Ot(_e.STYLE,p)},f={},m={};Object.keys(d).forEach((function(e){var t=d[e],n=t.newTags,i=t.oldTags;n.length&&(f[e]=n),i.length&&(m[e]=d[e].oldTags)})),t&&t(),l(e,f,m)},zt=function(e){return Array.isArray(e)?e.join(""):e},Tt=function(e,t){void 0!==e&&document.title!==e&&(document.title=zt(e)),Ct(_e.TITLE,t)},Ct=function(e,t){var n=document.getElementsByTagName(e)[0];if(n){for(var i=n.getAttribute(ot),r=i?i.split(","):[],o=[].concat(r),s=Object.keys(t),a=0;a<s.length;a++){var l=s[a],c=t[l]||"";n.getAttribute(l)!==c&&n.setAttribute(l,c),-1===r.indexOf(l)&&r.push(l);var p=o.indexOf(l);-1!==p&&o.splice(p,1)}for(var u=o.length-1;u>=0;u--)n.removeAttribute(o[u]);r.length===o.length?n.removeAttribute(ot):n.getAttribute(ot)!==s.join(",")&&n.setAttribute(ot,s.join(","))}},Ot=function(e,t){var n=document.head||document.querySelector(_e.HEAD),i=n.querySelectorAll(e+"["+ot+"]"),r=Array.prototype.slice.call(i),o=[],s=void 0;return t&&t.length&&t.forEach((function(t){var n=document.createElement(e);for(var i in t)if(t.hasOwnProperty(i))if(i===Ue)n.innerHTML=t.innerHTML;else if(i===Ze)n.styleSheet?n.styleSheet.cssText=t.cssText:n.appendChild(document.createTextNode(t.cssText));else{var a=void 0===t[i]?"":t[i];n.setAttribute(i,a)}n.setAttribute(ot,"true"),r.some((function(e,t){return s=t,n.isEqualNode(e)}))?r.splice(s,1):o.push(n)})),r.forEach((function(e){return e.parentNode.removeChild(e)})),o.forEach((function(e){return n.appendChild(e)})),{oldTags:r,newTags:o}},kt=function(e){return Object.keys(e).reduce((function(t,n){var i=void 0!==e[n]?n+'="'+e[n]+'"':""+n;return t?t+" "+i:i}),"")},Rt=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[Xe[n]||n]=e[n],t}),t)},At=function(e,t,n){switch(e){case _e.TITLE:return{toComponent:function(){return e=t.title,n=t.titleAttributes,(r={key:e})[ot]=!0,o=Rt(n,r),[i.createElement(_e.TITLE,o,e)];var e,n,r,o},toString:function(){return function(e,t,n,i){var r=kt(n),o=zt(t);return r?"<"+e+" "+ot+'="true" '+r+">"+pt(o,i)+"</"+e+">":"<"+e+" "+ot+'="true">'+pt(o,i)+"</"+e+">"}(e,t.title,t.titleAttributes,n)}};case Pe:case He:return{toComponent:function(){return Rt(t)},toString:function(){return kt(t)}};default:return{toComponent:function(){return function(e,t){return t.map((function(t,n){var r,o=((r={key:n})[ot]=!0,r);return Object.keys(t).forEach((function(e){var n=Xe[e]||e;if(n===Ue||n===Ze){var i=t.innerHTML||t.cssText;o.dangerouslySetInnerHTML={__html:i}}else o[n]=t[e]})),i.createElement(e,o)}))}(e,t)},toString:function(){return function(e,t,n){return t.reduce((function(t,i){var r=Object.keys(i).filter((function(e){return!(e===Ue||e===Ze)})).reduce((function(e,t){var r=void 0===i[t]?t:t+'="'+pt(i[t],n)+'"';return e?e+" "+r:r}),""),o=i.innerHTML||i.cssText||"",s=-1===rt.indexOf(e);return t+"<"+e+" "+ot+'="true" '+r+(s?"/>":">"+o+"</"+e+">")}),"")}(e,t,n)}}}},Lt=function(e){var t=e.baseTag,n=e.bodyAttributes,i=e.encode,r=e.htmlAttributes,o=e.linkTags,s=e.metaTags,a=e.noscriptTags,l=e.scriptTags,c=e.styleTags,p=e.title,u=void 0===p?"":p,h=e.titleAttributes;return{base:At(_e.BASE,t,i),bodyAttributes:At(Pe,n,i),htmlAttributes:At(He,r,i),link:At(_e.LINK,o,i),meta:At(_e.META,s,i),noscript:At(_e.NOSCRIPT,a,i),script:At(_e.SCRIPT,l,i),style:At(_e.STYLE,c,i),title:At(_e.TITLE,{title:u,titleAttributes:h},i)}},Nt=Le()((function(e){return{baseTag:ft([Fe,Je],e),bodyAttributes:dt(Pe,e),defer:gt(e,Qe),encode:gt(e,et),htmlAttributes:dt(He,e),linkTags:mt(_e.LINK,[Ke,Fe],e),metaTags:mt(_e.META,[qe,Be,De,$e,Ye],e),noscriptTags:mt(_e.NOSCRIPT,[Ue],e),onChangeClientState:ht(e),scriptTags:mt(_e.SCRIPT,[Ge,Ue],e),styleTags:mt(_e.STYLE,[Ze],e),title:ut(e),titleAttributes:dt(Ie,e)}}),(function(e){Et&&bt(Et),e.defer?Et=vt((function(){St(e,(function(){Et=null}))})):(St(e),Et=null)}),Lt)((function(){return null})),Mt=(Te=Nt,Oe=Ce=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.shouldComponentUpdate=function(e){return!Me()(this.props,e)},t.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case _e.SCRIPT:case _e.NOSCRIPT:return{innerHTML:t};case _e.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},t.prototype.flattenArrayTypeChildren=function(e){var t,n=e.child,i=e.arrayTypeChildren,r=e.newChildProps,o=e.nestedChildren;return lt({},i,((t={})[n.type]=[].concat(i[n.type]||[],[lt({},r,this.mapNestedChildrenToProps(n,o))]),t))},t.prototype.mapObjectTypeChildren=function(e){var t,n,i=e.child,r=e.newProps,o=e.newChildProps,s=e.nestedChildren;switch(i.type){case _e.TITLE:return lt({},r,((t={})[i.type]=s,t.titleAttributes=lt({},o),t));case _e.BODY:return lt({},r,{bodyAttributes:lt({},o)});case _e.HTML:return lt({},r,{htmlAttributes:lt({},o)})}return lt({},r,((n={})[i.type]=lt({},o),n))},t.prototype.mapArrayTypeChildrenToProps=function(e,t){var n=lt({},t);return Object.keys(e).forEach((function(t){var i;n=lt({},n,((i={})[t]=e[t],i))})),n},t.prototype.warnOnInvalidChildren=function(e,t){return!0},t.prototype.mapChildrenToProps=function(e,t){var n=this,r={};return i.Children.forEach(e,(function(e){if(e&&e.props){var i=e.props,o=i.children,s=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[it[n]||n]=e[n],t}),t)}(ct(i,["children"]));switch(n.warnOnInvalidChildren(e,o),e.type){case _e.LINK:case _e.META:case _e.NOSCRIPT:case _e.SCRIPT:case _e.STYLE:r=n.flattenArrayTypeChildren({child:e,arrayTypeChildren:r,newChildProps:s,nestedChildren:o});break;default:t=n.mapObjectTypeChildren({child:e,newProps:t,newChildProps:s,nestedChildren:o})}}})),t=this.mapArrayTypeChildrenToProps(r,t)},t.prototype.render=function(){var e=this.props,t=e.children,n=ct(e,["children"]),r=lt({},n);return t&&(r=this.mapChildrenToProps(t,r)),i.createElement(Te,r)},at(t,null,[{key:"canUseDOM",set:function(e){Te.canUseDOM=e}}]),t}(i.Component),Ce.propTypes={base:Re().object,bodyAttributes:Re().object,children:Re().oneOfType([Re().arrayOf(Re().node),Re().node]),defaultTitle:Re().string,defer:Re().bool,encodeSpecialCharacters:Re().bool,htmlAttributes:Re().object,link:Re().arrayOf(Re().object),meta:Re().arrayOf(Re().object),noscript:Re().arrayOf(Re().object),onChangeClientState:Re().func,script:Re().arrayOf(Re().object),style:Re().arrayOf(Re().object),title:Re().string,titleAttributes:Re().object,titleTemplate:Re().string},Ce.defaultProps={defer:!0,encodeSpecialCharacters:!0},Ce.peek=Te.peek,Ce.rewind=function(){var e=Te.rewind();return e||(e=Lt({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},Oe);Mt.renderStatic=Mt.rewind;const jt=e=>{let{title:t,description:n,pathname:r,children:o}=e;const{title:a,description:l,image:c,siteUrl:p,author:u,twitterUsername:h}=(0,s.K2)("1865044719").site.siteMetadata,d={title:t||a,description:n||l,image:`${p}${c}`,url:`${p}${r||""}`};return i.createElement(Mt,null,i.createElement("title",null,d.title),i.createElement("meta",{name:"description",content:d.description}),i.createElement("meta",{name:"image",content:d.image}),i.createElement("meta",{name:"twitter:card",content:"summary_large_image"}),i.createElement("meta",{name:"twitter:creator",content:h}),i.createElement("meta",{name:"twitter:title",content:d.title}),i.createElement("meta",{name:"twitter:description",content:d.description}),i.createElement("meta",{name:"twitter:image",content:d.image}),i.createElement("meta",{property:"og:type",content:"website"}),i.createElement("meta",{property:"og:title",content:d.title}),i.createElement("meta",{property:"og:description",content:d.description}),i.createElement("meta",{property:"og:image",content:d.image}),i.createElement("meta",{property:"og:url",content:d.url}),i.createElement("meta",{property:"og:site_name",content:a}),i.createElement("link",{rel:"canonical",href:d.url}),i.createElement("meta",{name:"author",content:u}),i.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),i.createElement("link",{rel:"icon",href:"/favicon.ico"}),i.createElement("script",{src:"https://www.googletagmanager.com/gtag/js?id=G-C806LPCFGY"}),o)};function Wt(e){let{data:t}=e;const n=(0,i.useRef)(null),{markdownRemark:r}=t,{frontmatter:o,html:s}=r,{0:a,1:l}=(0,i.useState)(!0),{0:c,1:p}=(0,i.useState)("file");return(0,i.useEffect)((()=>{const e=window.innerWidth<=1050;l(!e);const t=()=>{l(window.innerWidth>1050)};return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[]),i.createElement(Pt,null,i.createElement(jt,{title:o.title,pathname:o.slug,description:o.subtitle}),i.createElement(Ht,null,i.createElement(ne,{setShowExplorer:l,setExplorerType:p,explorerType:c}),i.createElement(J,{showExplorer:a,explorerType:c}),i.createElement(It,null,i.createElement(de,{frontmatter:o}),i.createElement(_t,{ref:n},i.createElement("article",{className:"markdown-content",dangerouslySetInnerHTML:{__html:s}}),i.createElement(ye,{contentRef:n,html:s}),i.createElement(ge,null)))),i.createElement(we,null))}const Pt=r.Z.div`
  display: flex;
  flex-direction: column;
`,Ht=r.Z.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 24px);
  @media (max-width: 1050px) {
    flex-direction: column;
  }
`,It=r.Z.div`
  background-color: #272822;
  flex-grow: 1;

  @media (max-width: 1050px) {
    padding-top: 48px; // menubar
    padding-bottom: 24px; // statusbar
  }
`,_t=r.Z.main`
  position: relative;
  padding: 0px 30px;
  height: calc(100% - 36px);
  overflow-y: auto;

  @media (max-width: 1050px) {
    height: calc(100vh - 36px - 48px - 24px); // tab, menubar, statusbar
  }

  @media (max-width: 768px) {
    height: calc(100vh - 48px - 24px); // menubar, statusbar
  }
`},9590:function(e){var t="undefined"!=typeof Element,n="function"==typeof Map,i="function"==typeof Set,r="function"==typeof ArrayBuffer&&!!ArrayBuffer.isView;function o(e,s){if(e===s)return!0;if(e&&s&&"object"==typeof e&&"object"==typeof s){if(e.constructor!==s.constructor)return!1;var a,l,c,p;if(Array.isArray(e)){if((a=e.length)!=s.length)return!1;for(l=a;0!=l--;)if(!o(e[l],s[l]))return!1;return!0}if(n&&e instanceof Map&&s instanceof Map){if(e.size!==s.size)return!1;for(p=e.entries();!(l=p.next()).done;)if(!s.has(l.value[0]))return!1;for(p=e.entries();!(l=p.next()).done;)if(!o(l.value[1],s.get(l.value[0])))return!1;return!0}if(i&&e instanceof Set&&s instanceof Set){if(e.size!==s.size)return!1;for(p=e.entries();!(l=p.next()).done;)if(!s.has(l.value[0]))return!1;return!0}if(r&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(s)){if((a=e.length)!=s.length)return!1;for(l=a;0!=l--;)if(e[l]!==s[l])return!1;return!0}if(e.constructor===RegExp)return e.source===s.source&&e.flags===s.flags;if(e.valueOf!==Object.prototype.valueOf&&"function"==typeof e.valueOf&&"function"==typeof s.valueOf)return e.valueOf()===s.valueOf();if(e.toString!==Object.prototype.toString&&"function"==typeof e.toString&&"function"==typeof s.toString)return e.toString()===s.toString();if((a=(c=Object.keys(e)).length)!==Object.keys(s).length)return!1;for(l=a;0!=l--;)if(!Object.prototype.hasOwnProperty.call(s,c[l]))return!1;if(t&&e instanceof Element)return!1;for(l=a;0!=l--;)if(("_owner"!==c[l]&&"__v"!==c[l]&&"__o"!==c[l]||!e.$$typeof)&&!o(e[c[l]],s[c[l]]))return!1;return!0}return e!=e&&s!=s}e.exports=function(e,t){try{return o(e,t)}catch(n){if((n.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw n}}},3524:function(e,t,n){"use strict";var i,r=n(7294),o=(i=r)&&"object"==typeof i&&"default"in i?i.default:i;function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a=!("undefined"==typeof window||!window.document||!window.document.createElement);e.exports=function(e,t,n){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof t)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==n&&"function"!=typeof n)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(i){if("function"!=typeof i)throw new Error("Expected WrappedComponent to be a React component.");var l,c=[];function p(){l=e(c.map((function(e){return e.props}))),u.canUseDOM?t(l):n&&(l=n(l))}var u=function(e){var t,n;function r(){return e.apply(this,arguments)||this}n=e,(t=r).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,r.peek=function(){return l},r.rewind=function(){if(r.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=l;return l=void 0,c=[],e};var s=r.prototype;return s.UNSAFE_componentWillMount=function(){c.push(this),p()},s.componentDidUpdate=function(){p()},s.componentWillUnmount=function(){var e=c.indexOf(this);c.splice(e,1),p()},s.render=function(){return o.createElement(i,this.props)},r}(r.PureComponent);return s(u,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(i)+")"),s(u,"canUseDOM",a),u}}}}]);
//# sourceMappingURL=component---src-pages-markdown-remark-frontmatter-slug-tsx-fe835c8315b294b28e14.js.map