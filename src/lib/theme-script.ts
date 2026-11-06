export const STORAGE_THEME_KEY = 'repwise_theme';

/** Inlined in <head> so the stored theme applies before paint. Dark is the default. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_THEME_KEY}');var d=t==='light'?false:t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;
