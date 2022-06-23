
var js_measurement_id_global = document.currentScript.getAttribute('measurement-id');
var js_measurement_id = document.currentScript.getAttribute('measurement-id-global');

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', js_measurement_id_global);  
gtag('config', js_measurement_id);  


