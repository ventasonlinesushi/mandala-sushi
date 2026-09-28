/* ============================================================
   CONFIGURACIÓN DE MARCA
   Edita aquí: negocio, WhatsApp, teléfono y prefijo de almacenamiento.
   ============================================================ */
(function (global) {
  "use strict";

  global.PosApp = global.PosApp || {};
  global.PosApp.brandConfig = {
    business: "Mandala Sushi Caucel",
    marca: "mandala",
    address: "",
    whatsapp: "529993168027",
    phoneDisplay: "999 316 8027",
    banner: "Pide por WhatsApp",
    storagePrefix: "mandala",
    /* Horario semanal de atención (formato 24 h). */
    hours: {
      weekly: {
        sun: { open: "14:00", close: "23:00" },
        mon: { open: "14:30", close: "23:00" },
        tue: { closed: true },
        wed: { open: "14:30", close: "23:00" },
        thu: { open: "14:30", close: "23:00" },
        fri: { open: "14:30", close: "23:00" },
        sat: { open: "14:00", close: "23:00" }
      }
    },
    timezone: "America/Merida",
    /* Opcional: URL de un Apps Script de Google Sheets para recibir
       cada pedido como fila (POST JSON). Déjalo "" si no lo usas. */
    sheetsUrl: "",
    /* Panel admin (Supabase). Pega aquí la URL y la anon key del proyecto
       (configuración → API). Con esto cada pedido se guarda en la nube y
       lo ves en el dashboard admin/. Déjalo en blanco para desactivarlo. */
    supabase: {
      url: "https://edquyomwiiaawqslsisd.supabase.co",
      key: "sb_publishable_aIIwHt4T8cDIeZjy48hRxQ_sdY7_QIf"
    }
  };
})(window);
