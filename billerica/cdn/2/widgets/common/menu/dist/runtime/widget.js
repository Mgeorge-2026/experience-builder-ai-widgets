System.register(["jimu-core/emotion","jimu-core","jimu-ui","jimu-theme","jimu-core/react"],function(e,t){var n={},o={},r={},i={},a={};return{setters:[function(e){n.jsx=e.jsx,n.jsxs=e.jsxs},function(e){o.BaseVersionManager=e.BaseVersionManager,o.BrowserSizeMode=e.BrowserSizeMode,o.Immutable=e.Immutable,o.LinkType=e.LinkType,o.PageType=e.PageType,o.React=e.React,o.ReactRedux=e.ReactRedux,o.WIDGET_PREFIX_FOR_A11Y_SKIP=e.WIDGET_PREFIX_FOR_A11Y_SKIP,o.css=e.css,o.hooks=e.hooks,o.polished=e.polished},function(e){r.Button=e.Button,r.Drawer=e.Drawer,r.Icon=e.Icon,r.Navigation=e.Navigation,r.PanelHeader=e.PanelHeader,r.defaultMessages=e.defaultMessages,r.utils=e.utils},function(e){i.getBoxStyles=e.getBoxStyles,i.getThemeModule=e.getThemeModule,i.mapping=e.mapping},function(e){a.default=e.default||e}],execute:function(){e((()=>{var e={21015(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill="#000" fill-rule="nonzero" d="M1 0h3a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m0 1v10h10V3H4V1zm0 3.5h10v1H1z"></path></svg>'},18627(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill-rule="nonzero" d="M7.42 8.839a.5.5 0 0 1 0 .71L6 10.966a3.5 3.5 0 0 1-4.967 0 3.5 3.5 0 0 1 0-4.966l1.416-1.422a.504.504 0 0 1 .713.712L1.746 6.713a2.497 2.497 0 0 0-.003 3.545c.983.983 2.56.98 3.544-.003l1.42-1.42a.504.504 0 0 1 .712.004m1.415-2.132 1.422-1.416a2.5 2.5 0 0 0 0-3.547 2.5 2.5 0 0 0-3.547 0L5.29 3.163a.504.504 0 0 1-.713-.712l1.42-1.42a3.506 3.506 0 0 1 4.97.003 3.5 3.5 0 0 1 0 4.967L9.547 7.42a.504.504 0 0 1-.713-.712m-4.967.71 3.548-3.548a.504.504 0 0 1 .713.713L4.58 8.129a.504.504 0 0 1-.713-.712"></path></svg>'},85106(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 12"><path fill="#000" fill-rule="nonzero" d="M1 0h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m0 1v10h8V1zm2 2h4a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1m0 2.5h4a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1"></path></svg>'},79244(e){"use strict";e.exports=o},67386(e){"use strict";e.exports=n},68972(e){"use strict";e.exports=a},1888(e){"use strict";e.exports=i},14321(e){"use strict";e.exports=r}},t={};function l(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,l),r.exports}l.d=(e,t)=>{for(var n in t)l.o(t,n)&&!l.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.p="";var s={};return l.p=window.jimuConfig.baseUrl,(()=>{"use strict";l.r(s),l.d(s,{__set_webpack_public_path__:()=>H,default:()=>B});var e,t=l(67386),n=l(79244),o=l(14321);!function(e){e.Icon="ICON",e.Vertical="VERTICAL",e.Horizontal="HORIZONTAL"}(e||(e={}));const r={type:"HORIZONTAL",subOpenMode:"FOLDABLE",main:{alignment:"center",space:{distance:0,unit:"px"},showText:!0,showIcon:!1,iconPosition:"start"},navType:"default",advanced:!1},i=t=>{var o,r,i,a,l,s,d;if(!t)return;const u=t,c=(0,n.Immutable)({}),v=u.type===e.Icon?"drawer":"nav",p=u.navType,m=u.type!==e.Horizontal,g=null==u?void 0:u.icon,h=null==u?void 0:u.drawerDirection,b=(y=u.type,f=u.subOpenMode,y===e.Horizontal?"dropdown":"EXPAND"===f?"static":"foldable");var y,f;const w=null===(o=null==u?void 0:u.main)||void 0===o?void 0:o.alignment,x=null===(r=null==u?void 0:u.main)||void 0===r?void 0:r.showText,$=null===(i=null==u?void 0:u.main)||void 0===i?void 0:i.showIcon,j=null===(a=null==u?void 0:u.main)||void 0===a?void 0:a.iconPosition,O=null!==(s=null===(l=null==u?void 0:u.main)||void 0===l?void 0:l.space)&&void 0!==s?s:{distance:0,unit:"px"},T={icon:g,anchor:h,submenuMode:b,textAlign:w,showIcon:$,showText:x,iconPosition:j,gap:`${null==O?void 0:O.distance}${null==O?void 0:O.unit}`},I=u.advanced,S=u.paper,k=((e,t)=>{if(!e)return;const n=null==e?void 0:e[t];if(!n)return;let o=n;return n.bg&&(o=o.setIn(["root","bg"],n.bg),o=o.without("bg")),o})(null===(d=null==u?void 0:u.main)||void 0===d?void 0:d.variants,u.navType);return c.set("type",v).set("menuStyle",p).set("vertical",m).set("standard",T).set("advanced",I).set("paper",S).set("variant",k)};class a extends n.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.0.0",description:"The first release.",upgrader:e=>{var t;if(!e)return r;let n=e;return(null===(t=null==e?void 0:e.main)||void 0===t?void 0:t.variants)&&(n=n.set("advanced",!0)),n}},{version:"1.1.0",description:"Version manager for release 1.1",upgrader:e=>i(e||r)},{version:"1.13.0",description:"Change borderRadius from 50rem to 6.25rem in pills style",upgrader:e=>{var t;if("pills"!==(null==e?void 0:e.menuStyle)||!(null==e?void 0:e.advanced))return e;let n=e;return Object.keys((null===(t=null==n?void 0:n.variant)||void 0===t?void 0:t.item)||{}).forEach(e=>{var t;"50rem"===(null===(t=n.variant.item[e])||void 0===t?void 0:t.borderRadius)&&(n=n.setIn(["variant","item",e,"borderRadius"],"6.25rem"))}),n}}]}}const d=new a;var u=l(1888);const{useState:c,useEffect:v,useMemo:p}=n.React,{useSelector:m}=n.ReactRedux,g=l(85106),h=l(18627),b=l(21015),y={[n.PageType.Normal]:g,[n.PageType.Link]:h,[n.PageType.Folder]:b},f=(e,t)=>(e=((e,t)=>(e=e.filter(e=>{const n=Object.keys(e)[0];return(null==t?void 0:t[n]).isVisible})).map(e=>{const n=Object.entries(e)[0],o=n[0];let r=n[1];return r=r.filter(e=>(null==t?void 0:t[e]).isVisible),e.set(o,r)}))(e,t),e.map(e=>{const n=Object.entries(e)[0],o=n[0],r=n[1],i=t[o],a=w(i),l=r.map(e=>{const n=t[e];return w(n)});return a.set("subs",l)})),w=e=>{const t=x(e),r=$(e),i=e.icon||y[e.type];return(0,n.Immutable)({linkType:t,value:r,icon:"[object Object]"===Object.prototype.toString.call(i)?i:o.utils.toIconResult(i,e.type,16),target:e.openTarget,name:e.label})},x=e=>e.type===n.PageType.Link?n.LinkType.WebAddress:e.type===n.PageType.Normal?n.LinkType.Page:e.type===n.PageType.Folder?n.LinkType.None:void 0,$=e=>e.type===n.PageType.Link?e.linkUrl:e.type===n.PageType.Normal?e.id:e.type===n.PageType.Folder?"#":void 0,j=e=>{var t,o,r,i;const{borderTop:a,borderBottom:l,borderLeft:s,borderRight:d}=e;return n.css`
    ${a&&`\n      border-top-width: ${a.width};\n      ${a.width&&`border-top-style: ${null!==(t=null==a?void 0:a.type)&&void 0!==t?t:"solid"};`}\n      border-top-color: ${a.color};\n    `}
    ${l&&`\n      border-bottom-width: ${l.width};\n      ${l.width&&`border-bottom-style: ${null!==(o=null==l?void 0:l.type)&&void 0!==o?o:"solid"};`}\n      border-bottom-color: ${l.color};\n    `}
    ${s&&`\n      border-left-width: ${s.width};\n      ${s.width&&`border-left-style: ${null!==(r=null==s?void 0:s.type)&&void 0!==r?r:"solid"};`}\n      border-left-color: ${s.color};\n    `}
    ${d&&`\n      border-right-width: ${d.width};\n      ${d.width&&`border-right-style: ${null!==(i=null==d?void 0:d.type)&&void 0!==i?i:"solid"};`}\n      border-right-color: ${d.color};\n    `}
  `},O=e=>{var t,o;return n.css`
    font-size: ${(null==e?void 0:e.size)?`${n.polished.rem(e.size)}!important`:""};
    ${e.icon&&`.jimu-nav-link-wrapper > .jimu-icon, .jimu-icon-img {\n      ${(null===(t=null==e?void 0:e.icon)||void 0===t?void 0:t.size)&&`\n        width: ${n.polished.rem(e.icon.size)};\n        height: ${n.polished.rem(e.icon.size)};\n      `};\n      ${(null===(o=null==e?void 0:e.icon)||void 0===o?void 0:o.color)&&`color: ${e.icon.color}`};\n    }`}
 `},T=(e,t,o,r,i)=>p(()=>{var a,l;return e?n.css`
      &.menu-navigation {
        .jimu-nav,
        &.jimu-nav {
          ${(null===(a=null==o?void 0:o.root)||void 0===a?void 0:a.bg)&&`background-color: ${o.root.bg};`}
          border-radius: ${(null===(l=null==o?void 0:o.root)||void 0===l?void 0:l.borderRadius)||"0px"};
          ${(e=>{if(!(null==e?void 0:e.item))return null;const{default:t,hover:o,active:r}=e.item,i=(null==t?void 0:t.merge(o||{},{deep:!0}))||o,a=(null==t?void 0:t.merge(r||{},{deep:!0}))||r;return n.css`
    .nav-item>.nav-link {
      ${t&&n.css`
        &:not(:hover):not(.active) {
          ${(0,u.getBoxStyles)(t)}
          ${j(t)}
          ${O(t)}
        }
      `}
      ${i&&n.css`
        &:hover:not(.active) {
          ${(0,u.getBoxStyles)(i)}
          ${j(i)}
          ${O(i)}
        }
      `}
      ${a&&n.css`
        &:not(:disabled):not(.disabled).active {
          ${(0,u.getBoxStyles)(a)}
          ${j(a)}
          ${O(a)}
        }
      `}
    }
  `})(o)}
          ${((e,t)=>{const o=t?"left":"bottom",r=["top","bottom","left","right"].map(e=>o===e?"":`border-${e}-width: 0 !important;`).join("");return"underline"===e&&n.css`
    &.nav-underline {
      ${r}
      .nav-link {
        ${r}
      }
      ${t&&"\n        .nav-item {\n          margin-left: -1px;\n        }\n      "}
  `})(t,r)}
          ${(e=>{if(!e)return null;const{default:t,hover:o,disabled:r}=e;return n.css`
    .jimu-nav-button-group {
      .jimu-page-item {
        .direction-button {
          ${t&&`&:not(:hover):not(:disabled) {\n            color: ${t};\n          }`}
          ${o&&`&:hover {\n            color: ${o};\n          }`}
          ${r&&`&:disabled {\n            color: ${r};\n          }`}
        }
      }
    }
  `})(i)}
        }
      }
    `:null},[e,t,i,o,r]);var I=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const S=e=>{var r,i;const[a,l]=n.React.useState(!1),{icon:s,anchor:d,advanced:u,type:c,variant:v,paper:m,vertical:g,id:h,role:b="button","aria-label":y}=e,f=I(e,["icon","anchor","advanced","type","variant","paper","vertical","id","role","aria-label"]),w=()=>{l(e=>!e)},x=((e,t)=>{var o,r;const i=null==t?void 0:t.bg,a=null===(r=null===(o=null==e?void 0:e.item)||void 0===o?void 0:o.default)||void 0===r?void 0:r.color;return p(()=>n.css`
      .jimu-drawer-paper {
        background: ${i||"var(--sys-color-surface-overlay)"};
        .header {
          color: ${a||"var(--sys-color-surface-overlay-text)"};
          padding: ${n.polished.rem(8)};
        }
        .nav-link:not(:hover):not(.active) {
          color: var(--sys-color-surface-overlay-text);
        }
      }
    `,[i,a])})(v,m),$=T(u,c,v,!0),j=(e=>p(()=>{const t=n.css`
      .jimu-nav-link-wrapper {
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        white-space: nowrap;
      }
      .nav-link {
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      }
    `;return e?t:n.css`
        &{
          min-width: ${n.polished.rem(240)};
          max-width: ${n.polished.rem(320)};
        }
        ${t}
      `},[e]))(n.hooks.useCheckSmallBrowserSizeMode()),O=n.ReactRedux.useSelector(e=>e.appRuntimeInfo.currentPageId);return n.React.useEffect(()=>{l(!1)},[O]),(0,t.jsxs)(n.React.Fragment,{children:[(0,t.jsx)("div",{className:"drawer-menu-button-container w-100 h-100 d-flex align-items-center justify-content-center",children:(0,t.jsx)(o.Button,{className:"jimu-outline-inside",icon:!0,variant:"text",color:"inherit",onClick:w,id:h,"aria-label":y,role:b,"aria-haspopup":"menu",children:(0,t.jsx)(o.Icon,{className:"caret-icon",icon:null==s?void 0:s.svg,size:null===(r=null==s?void 0:s.properties)||void 0===r?void 0:r.size,color:(null===(i=null==s?void 0:s.properties)||void 0===i?void 0:i.color)||"inherit"})})}),(0,t.jsxs)(o.Drawer,{anchor:d,open:a,toggle:w,autoFlip:!1,css:x,"aria-label":y,backdrop:!0,children:[(0,t.jsx)(o.PanelHeader,{className:"header",title:"",onClose:w}),(0,t.jsx)("nav",{"aria-label":y,className:"menu-navigation",css:[j,$],children:(0,t.jsx)(o.Navigation,Object.assign({role:"navigation",vertical:g,type:c,showTitle:!0,isUseNativeTitle:!0,right:!0},f))})]})]})};var k=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const{useMemo:M}=n.React,P=e=>{const{type:r,menuStyle:i,vertical:a,standard:l,advanced:s,paper:d,variant:p,navArrowColor:g,theme:h,a11yLandmark:b,addToA11ySkip:y,ariaLabel:w,widgetId:x}=e,$=(()=>{const[e,t]=c([]),n=m(e=>{var t;return null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.pages}),o=m(e=>{var t;return null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.pageStructure});return v(()=>{const e=f(o,n);t(e)},[n,o]),e})(),j=(()=>{const e=m(e=>{var t;return null===(t=null==e?void 0:e.appRuntimeInfo)||void 0===t?void 0:t.currentPageId});return n.React.useCallback(t=>(e=>{if(!(null==e?void 0:e.value))return"";const t=e.value.split(",");return(null==t?void 0:t.length)?t[0]:""})(t)===e,[e])})(),O=l.asMutable({deep:!0}),{icon:I,anchor:P}=O,R=k(O,["icon","anchor"]),z=(e=>m(t=>(null==t?void 0:t.browserSizeMode)===n.BrowserSizeMode.Small?"full":e))(P),L=n.React.useMemo(()=>{var e,t,n,o,a,l,s,d,c,v,p,m,g;const b=(0,u.getThemeModule)(null==h?void 0:h.uri),y=u.mapping.whetherIsNewTheme(b);return{isNewTheme:y,navVar:"drawer"===r||y?"":(null===(s=null===(l=null===(a=null===(o=null===(n=null===(t=null===(e=null==b?void 0:b.variables)||void 0===e?void 0:e.components)||void 0===t?void 0:t.nav)||void 0===n?void 0:n.variants)||void 0===o?void 0:o[i])||void 0===a?void 0:a.item)||void 0===l?void 0:l.default)||void 0===s?void 0:s.color)||"",tertiaryButtonVar:"drawer"!==r||y?"":(null===(g=null===(m=null===(p=null===(v=null===(c=null===(d=null==b?void 0:b.variables)||void 0===d?void 0:d.components)||void 0===c?void 0:c.button)||void 0===v?void 0:v.variants)||void 0===p?void 0:p.tertiary)||void 0===m?void 0:m.default)||void 0===g?void 0:g.color)||""}},[i,null==h?void 0:h.uri,r]),N=((e,t,o,r)=>M(()=>n.css`
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      ${t?"":`\n        ${o?"":".nav-link:not(:hover):not(.active) {\n          color: var(--sys-color-action-text);\n        }"}\n        .direction-button:not(:hover):not(.active):not(:disabled) {\n          color: var(--sys-color-action-text);\n        }\n        .drawer-menu-button-container .jimu-btn {\n          ${r?`color: ${r};`:"color: var(--sys-color-action-text);"}\n        }\n      `}
      .nav-item {
        ${!e&&'\n          .nav-link:hover {\n            position: relative;\n            &::before {\n              content: "";\n              position: absolute;\n              left: 0;\n              right: 0;\n              top: -1000px;\n              bottom: 100%;\n            }\n            &::after {\n              content: "";\n              position: absolute;\n              left: 0;\n              right: 0;\n              top: 100%;\n              bottom: -1000px;\n            }\n          }\n        '}
      }
    `,[t,o,r,e]))(a,L.isNewTheme,L.navVar,L.tertiaryButtonVar),A=T(s,i,p,a,g),B=n.React.useMemo(()=>{const e={role:b||("nav"===r?"navigation":void 0),"aria-label":w};if(y){const t=`${n.WIDGET_PREFIX_FOR_A11Y_SKIP}${x}`;return"nav"===r?Object.assign(Object.assign({},e),{id:t,tabIndex:-1}):Object.assign(Object.assign({},e),{id:t})}return e},[y,x,w,b,r]);return(0,t.jsxs)("div",{className:"menu-navigation",css:[N,A],children:["nav"===r&&(0,t.jsx)(o.Navigation,Object.assign({data:$,vertical:a,isActive:j,showTitle:!0,isUseNativeTitle:!0,scrollable:!0,right:!0},R,{type:i},B)),"drawer"===r&&(0,t.jsx)(S,Object.assign({data:$,advanced:s,variant:p,paper:d,type:i,vertical:a,isActive:j,scrollable:!1,icon:I,anchor:z},R,B))]})};var R=l(68972);function z(e){return{svg:'<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="css-1i7frhi jimu-icon"><path d="M2 1a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4z" fill="currentColor" fill-rule="nonzero"></path></svg>',properties:{color:"inherit",size:20,inlineSvg:!0,filename:e("menu")}}}function L(e){switch(e){case"anchor":return"left";case"textAlign":return"center";case"showIcon":return!1;case"gap":return"0px";case"submenuMode":return"foldable";default:return null}}const N=(t,o,r)=>R.default.useMemo(()=>function(t=e.Horizontal,o){switch(t){case e.Horizontal:return(0,n.Immutable)({type:"nav",menuStyle:"default",vertical:!1,advanced:!1,standard:{gap:L("gap"),textAlign:L("textAlign")}});case e.Vertical:return(0,n.Immutable)({type:"nav",menuStyle:"default",vertical:!0,advanced:!1,standard:{submenuMode:L("submenuMode"),gap:L("gap"),textAlign:L("textAlign")}});case e.Icon:return(0,n.Immutable)({type:"drawer",menuStyle:"default",vertical:!0,advanced:!1,standard:{anchor:L("anchor"),submenuMode:L("submenuMode"),icon:z(o),gap:L("gap"),textAlign:L("textAlign")}})}}(o,r).merge(t,{deep:!0}),[t,o,r]),A=r=>{const{id:i,config:a,theme:l,a11yLandmark:s,addToA11ySkip:d,label:u,a11yLabel:c}=r,v=n.hooks.useTranslation(o.defaultMessages),p=(t=>R.default.useMemo(()=>"drawer"===t.type?e.Icon:t.vertical?e.Vertical:e.Horizontal,[t.type,t.vertical]))(a),m=N(a,p,v),g=c||u;return(0,t.jsx)("div",{className:"widget-menu jimu-widget",children:(0,t.jsx)(P,Object.assign({},m.asMutable(),{theme:l,a11yLandmark:s,addToA11ySkip:d,ariaLabel:g,widgetId:i}))})};A.versionManager=d;const B=A;function H(e){l.p=e}})(),s})())}}});