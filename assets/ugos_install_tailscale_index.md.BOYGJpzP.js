import{_ as a,c as e,a2 as i,o as t}from"./chunks/framework.C57abF2z.js";const k=JSON.parse('{"title":"Setting up tailscale for external access","description":"","frontmatter":{},"headers":[],"relativePath":"ugos/install/tailscale/index.md","filePath":"ugos/install/tailscale/index.md"}'),l={name:"ugos/install/tailscale/index.md"};function n(r,s,h,c,p,o){return t(),e("div",null,s[0]||(s[0]=[i(`<h1 id="setting-up-tailscale-for-external-access" tabindex="-1">Setting up tailscale for external access <a class="header-anchor" href="#setting-up-tailscale-for-external-access" aria-label="Permalink to &quot;Setting up tailscale for external access&quot;">​</a></h1><h2 id="instructions" tabindex="-1">Instructions <a class="header-anchor" href="#instructions" aria-label="Permalink to &quot;Instructions&quot;">​</a></h2><p>First, you need to log in via SSH:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> USERNAME@IP</span></span></code></pre></div><p>When asked for a password, use your account password.</p><p>Next, download and install tailscale as described <a href="https://tailscale.com/download/linux" target="_blank" rel="noreferrer">here</a> with this command:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fsSL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://tailscale.com/install.sh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> sh</span></span></code></pre></div><p>Finally, start tailscale with</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tailscale</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span></span></code></pre></div><p>After starting tailscale, I noticed that the NAS could not access any resources on the internet due to a broken DNS configuration. The cause for this issue is that UGOS uses the file <code>/etc/resolv.conf</code> to store the default nameserver but tailscale overrides it when launching.</p><p>To fix it, I had to restart tailscale with <a href="https://tailscale.com/kb/1241/tailscale-up" target="_blank" rel="noreferrer">disabled DNS configuration</a></p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tailscale</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> down</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tailscale</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --accept-dns=false</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">Credit</p><p>This guide was originally created by <a href="https://www.reddit.com/user/RealMrCr4cker/" target="_blank" rel="noreferrer">RealMrCr4cker</a> (<a href="https://github.com/ln-12/UGOS_scripts/" target="_blank" rel="noreferrer">Github repo</a>) and is under an MIT Licence</p></div>`,13)]))}const u=a(l,[["render",n]]);export{k as __pageData,u as default};
