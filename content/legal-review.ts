/**
 * Internal publication boundary. Never render this file in public routes.
 * Every item must be resolved with verified business or legal input.
 */
export const legalReview = {
  productionReady: false,
  verified: {
    tradingName: "Teselando",
    publicPhone: "+34 952 97 82 16",
    publicEmail: "academia@teselando.es",
    analyticsInstalled: false,
    paymentProviderImplemented: false,
  },
  blockers: [
    "Identidad legal de la persona o entidad titular",
    "NIF o CIF",
    "Domicilio legal público",
    "Confirmación formal del correo que atenderá derechos de privacidad",
    "Inventario exacto de encargados y proveedores: alojamiento, correo, Google Sheets o Workspace, WhatsApp, pagos, analítica y monitorización",
    "Revisión de transferencias internacionales y sus mecanismos aplicables",
    "Plazos operativos de conservación y procesos de borrado",
    "Flujo operativo para solicitudes, contratación y pagos cuando el alumno es menor",
    "Tratamiento fiscal del precio público desde 20 €/h",
    "Proveedor y flujo de pagos cuando se implemente",
    "Revisión jurídica final antes de publicación",
  ],
} as const;
