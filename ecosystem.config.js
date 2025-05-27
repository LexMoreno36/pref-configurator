// ecosystem.config.js
module.exports = {
  apps : [{
    name   : "pref-configurator",
    // Directamente el script CLI de Next.js. Asegúrate de que esta ruta es correcta para tu proyecto.
    // Usamos barras inclinadas '/' que Node.js maneja bien en Windows.
    script : "C:/cloud-ecommerce/node_modules/next/dist/bin/next",
    args   : "start",                 // El comando que queremos que ejecute el CLI de Next ('next start')
    cwd    : "C:/cloud-ecommerce/",   // Ruta absoluta a la raíz de tu proyecto
    watch  : false,
    // 'interpreter: "node"' es a menudo implícito si 'script' es un .js,
    // pero ser explícito puede ayudar en algunos casos.
    // Si el script anterior no tiene extensión .js (a veces los binarios no la tienen),
    // necesitarás 'interpreter: "node"'. El script 'next' en 'dist/bin/' suele ser un .js.
    interpreter: "node",
    env_production: {
      NODE_ENV: "production",
      PORT: 3636
    },
    // Opcional: logs
    // out_file: './logs/out-pref-configurator.log',
    // error_file: './logs/error-pref-configurator.log',
    // merge_logs: true,
    // log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
}