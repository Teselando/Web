import { contactDetails } from "@/lib/content";

export type LegalLink = { label: string; href: string };
export type LegalParagraph = string | { parts: readonly (string | LegalLink)[] };
export type LegalSubsection = {
  id: string;
  title: string;
  paragraphs: readonly LegalParagraph[];
};
export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly LegalParagraph[];
  subsections?: readonly LegalSubsection[];
};

export const legalConfig = {
  lastUpdatedIso: "2026-09-05",
  lastUpdatedLabel: "5 de septiembre de 2026",
  company: {
    tradingName: "Teselando",
    legalName: null,
    taxId: null,
    address: null,
    registry: null,
    phoneDisplay: contactDetails.phoneDisplay,
    phoneHref: contactDetails.phoneHref,
    email: contactDetails.email,
    emailHref: contactDetails.emailHref,
    privacyEmail: contactDetails.email,
    privacyEmailHref: contactDetails.emailHref,
  },
} as const;

export const legalNoticeSections: readonly LegalSection[] = [
  {
    id: "titular",
    title: "Identificación del titular",
    paragraphs: ["Teselando ofrece servicios relacionados con clases particulares online y apoyo académico."],
  },
  {
    id: "objeto",
    title: "Objeto del sitio web",
    paragraphs: [
      "Este sitio web tiene como finalidad presentar los servicios de Teselando, facilitar información sobre su funcionamiento y permitir que alumnos, familias y otras personas interesadas puedan ponerse en contacto con la academia o iniciar una solicitud de profesor.",
      "El acceso al sitio web no implica por sí mismo la contratación de ningún servicio.",
      "Cuando una persona solicite ayuda académica, Teselando podrá recabar la información necesaria para conocer su situación, buscar un profesor adecuado y presentar una propuesta antes de que el usuario decida si desea comenzar las clases.",
    ],
  },
  {
    id: "uso",
    title: "Uso del sitio web",
    paragraphs: [
      "La persona usuaria se compromete a utilizar este sitio web de forma lícita, responsable y conforme a la buena fe.",
      "No está permitido utilizar el sitio para realizar actividades ilícitas, introducir código malicioso, intentar acceder sin autorización a sistemas o datos, interferir en el funcionamiento de la web o vulnerar los derechos de Teselando o de terceros.",
      "Teselando podrá adoptar las medidas razonablemente necesarias para proteger el funcionamiento y la seguridad del sitio.",
    ],
  },
  {
    id: "servicios",
    title: "Información sobre los servicios",
    paragraphs: [
      "Teselando procura que la información publicada sea clara, correcta y esté actualizada.",
      "Las características concretas de cada servicio, profesor, disponibilidad, precio o condición aplicable podrán depender de la situación del alumno y se comunicarán antes de que este acepte la propuesta correspondiente.",
      "La información general publicada en el sitio web no sustituye las condiciones concretas que, cuando proceda, se comuniquen al usuario para la prestación de un servicio determinado.",
    ],
  },
  {
    id: "precios",
    title: "Precios",
    paragraphs: [
      "Cuando el sitio web muestre precios, Teselando procurará indicar de forma clara las condiciones aplicables y cualquier información fiscal que resulte legalmente exigible.",
      "El precio concreto de las clases podrá variar según las características del servicio solicitado y se comunicará al usuario antes de que decida comenzar.",
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual e industrial",
    paragraphs: [
      "Los contenidos de este sitio web, incluidos textos, identidad visual, logotipos, gráficos, fotografías, ilustraciones, diseños, código y demás elementos protegibles, pertenecen a Teselando o se utilizan con la autorización correspondiente.",
      "El acceso al sitio web no concede a la persona usuaria ningún derecho de explotación sobre dichos contenidos.",
      "No está permitida su reproducción, distribución, transformación, comunicación pública o utilización fuera de los límites permitidos por la legislación aplicable sin autorización previa del titular de los derechos correspondientes.",
    ],
  },
  {
    id: "terceros",
    title: "Enlaces a terceros",
    paragraphs: [
      "El sitio web puede incluir enlaces a páginas o servicios de terceros.",
      "Teselando no controla necesariamente el contenido, disponibilidad o políticas de privacidad de esos servicios y no responde de las actuaciones realizadas por terceros fuera de sus propios sistemas.",
      "La inclusión de un enlace no implica, por sí sola, una relación comercial, colaboración o recomendación de la entidad enlazada.",
    ],
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad y funcionamiento",
    paragraphs: [
      "Teselando trabaja para mantener el sitio web disponible y en condiciones adecuadas de funcionamiento, pero no puede garantizar que esté permanentemente libre de interrupciones, errores o incidencias técnicas.",
      "Cuando se detecte una incidencia, Teselando podrá realizar las actuaciones razonablemente necesarias para corregirla.",
    ],
  },
  {
    id: "datos-cookies",
    title: "Protección de datos y cookies",
    paragraphs: [
      {
        parts: [
          "El tratamiento de datos personales realizado a través del sitio web se explica en la ",
          { label: "Política de privacidad", href: "/legal/privacidad/" },
          ".",
        ],
      },
      {
        parts: [
          "El uso de cookies y tecnologías similares se explica en la ",
          { label: "Política de cookies", href: "/legal/cookies/" },
          ".",
        ],
      },
    ],
  },
  {
    id: "legislacion",
    title: "Legislación aplicable",
    paragraphs: [
      "Este sitio web se rige por la legislación española y por la normativa de la Unión Europea que resulte aplicable.",
      "Cualquier controversia se resolverá conforme a las normas de competencia y jurisdicción que resulten legalmente aplicables, sin limitar los derechos que correspondan a consumidores y usuarios.",
    ],
  },
];

export const privacySections: readonly LegalSection[] = [
  {
    id: "responsable",
    title: "Quién es responsable de tus datos",
    paragraphs: ["Puedes utilizar estos datos para realizar cualquier consulta relacionada con tu privacidad o ejercer tus derechos."],
  },
  {
    id: "informacion",
    title: "Qué información podemos tratar",
    paragraphs: [
      "Dependiendo de cómo utilices Teselando, podemos tratar información de contacto, como tu número de teléfono o correo electrónico; información académica que nos facilites, como estudios, curso, asignatura, universidad o comunidad autónoma, examen, convocatoria o necesidad concreta; información relacionada con las comunicaciones que mantengas con Teselando; información necesaria para gestionar las clases, incidencias y pagos cuando te conviertas en alumno; y datos técnicos o de analítica cuando corresponda y exista la base jurídica necesaria.",
      "No te pediremos información que no necesitemos para la finalidad correspondiente.",
    ],
  },
  {
    id: "finalidades",
    title: "Para qué utilizamos tus datos",
    subsections: [
      {
        id: "solicitud-profesor",
        title: "Para atender tu solicitud y buscar un profesor",
        paragraphs: [
          "Cuando nos dejas tu contacto o nos cuentas qué necesitas, utilizamos esa información para comprender tu situación, continuar la conversación contigo, buscar profesores que puedan encajar y presentarte una propuesta.",
          "La base jurídica es la adopción de medidas precontractuales a petición de la persona interesada cuando la solicitud está dirigida a contratar un servicio.",
        ],
      },
      {
        id: "comunicacion",
        title: "Para comunicarnos contigo",
        paragraphs: [
          "Podemos utilizar los datos de contacto que nos facilites para responder a tu solicitud mediante los canales que correspondan, como WhatsApp, teléfono o correo electrónico.",
          "Si nos escribes por una consulta que no está relacionada con una contratación, trataremos únicamente la información necesaria para atenderla.",
        ],
      },
      {
        id: "servicio",
        title: "Para prestar y gestionar las clases",
        paragraphs: [
          "Si empiezas a utilizar Teselando, podremos tratar la información necesaria para gestionar tu relación con la academia, organizar las clases, coordinar al profesor, mantener la información académica necesaria, atender incidencias, gestionar cambios de profesor y prestar los servicios contratados.",
          "La base jurídica será la ejecución de la relación contractual correspondiente.",
        ],
      },
      {
        id: "pagos",
        title: "Para gestionar cobros, facturación y obligaciones legales",
        paragraphs: [
          "Cuando resulte necesario, trataremos los datos necesarios para gestionar pagos, facturación, contabilidad y demás obligaciones legales aplicables.",
          "La base jurídica será la ejecución del contrato y el cumplimiento de las obligaciones legales correspondientes.",
        ],
      },
      {
        id: "analitica",
        title: "Para medir el funcionamiento de la web",
        paragraphs: [
          "Si aceptas las tecnologías de analítica, podremos tratar información sobre el uso del sitio web para comprender cómo se utiliza y mejorar su funcionamiento.",
          "Este tratamiento solo se realizará cuando exista el consentimiento correspondiente y podrá retirarse en cualquier momento desde las preferencias de cookies.",
        ],
      },
      {
        id: "comunicaciones-comerciales",
        title: "Para enviarte comunicaciones comerciales",
        paragraphs: [
          "No utilizaremos una solicitud de profesor, una consulta o una contratación como consentimiento oculto para recibir publicidad.",
          "Si en el futuro ofrecemos comunicaciones comerciales que requieran consentimiento, se solicitará de forma separada, clara y opcional.",
        ],
      },
    ],
  },
  {
    id: "destinatarios",
    title: "Qué información compartimos",
    paragraphs: [
      "Teselando no vende tus datos personales.",
      "Podremos permitir el acceso a la información estrictamente necesaria a proveedores tecnológicos que nos ayuden a prestar el servicio, como servicios de alojamiento, almacenamiento, comunicaciones, gestión, pagos o analítica.",
      "También podremos comunicar al profesor asignado o a los profesionales que deban intervenir en la prestación del servicio la información académica y operativa que necesiten para poder atender correctamente al alumno.",
      "Aplicaremos el principio de minimización, de forma que cada persona o proveedor acceda únicamente a la información necesaria para la función que desempeña.",
    ],
  },
  {
    id: "transferencias",
    title: "Transferencias internacionales",
    paragraphs: [
      "Algunos proveedores tecnológicos pueden tratar información desde países situados fuera del Espacio Económico Europeo.",
      "Cuando esto ocurra, Teselando deberá asegurarse de que la transferencia dispone de una base válida conforme al RGPD, como una decisión de adecuación de la Comisión Europea o las garantías apropiadas previstas por la normativa.",
    ],
  },
  {
    id: "conservacion",
    title: "Durante cuánto tiempo conservamos tus datos",
    paragraphs: [
      "Conservaremos tus datos únicamente durante el tiempo necesario para la finalidad para la que fueron recogidos.",
      "Las solicitudes y consultas se conservarán mientras sea necesario gestionarlas y durante el periodo razonablemente necesario para atender posibles incidencias o responsabilidades derivadas de ellas.",
      "Cuando exista una relación como alumno o cliente, conservaremos los datos mientras dure dicha relación y, posteriormente, bloquearemos o conservaremos únicamente la información necesaria durante los plazos exigidos por las obligaciones fiscales, contables, contractuales o de defensa frente a reclamaciones.",
      "Los datos tratados exclusivamente sobre la base de tu consentimiento dejarán de utilizarse para esa finalidad cuando retires dicho consentimiento, sin perjuicio de los tratamientos realizados legítimamente con anterioridad.",
    ],
  },
  {
    id: "derechos",
    title: "Tus derechos",
    paragraphs: [
      "Puedes solicitar a Teselando el acceso a tus datos personales, su rectificación cuando sean incorrectos, su supresión cuando corresponda, la limitación de su tratamiento, la oposición al tratamiento en los casos previstos legalmente y la portabilidad de tus datos cuando resulte aplicable.",
      "Cuando un tratamiento esté basado en tu consentimiento, puedes retirarlo en cualquier momento.",
      {
        parts: [
          "Puedes ejercer tus derechos escribiendo a ",
          { label: legalConfig.company.privacyEmail, href: legalConfig.company.privacyEmailHref },
          " e indicando qué derecho deseas ejercer. Teselando podrá solicitar información razonablemente necesaria para verificar tu identidad cuando existan dudas sobre quién realiza la solicitud.",
        ],
      },
      {
        parts: [
          "También tienes derecho a presentar una reclamación ante la ",
          { label: "Agencia Española de Protección de Datos", href: "https://www.aepd.es/" },
          " si consideras que tus datos no se están tratando correctamente.",
        ],
      },
    ],
  },
  {
    id: "menores",
    title: "Menores de edad",
    paragraphs: [
      "Teselando presta servicios que pueden ser utilizados por estudiantes menores de edad.",
      "Si tienes menos de 14 años, no debes facilitarnos datos personales por tu cuenta cuando el tratamiento dependa de tu consentimiento. En estos casos será necesaria la intervención de tu padre, madre o tutor legal.",
      "Si tienes entre 14 y 17 años, determinadas actuaciones relacionadas con tus datos podrán realizarse directamente cuando la legislación lo permita, pero Teselando podrá requerir la participación de tus representantes legales cuando sea necesaria para la contratación, los pagos o cualquier otra actuación que legalmente lo requiera.",
      "Si una familia contacta con Teselando en nombre de un menor, deberá facilitar únicamente la información necesaria para gestionar la solicitud y el servicio.",
    ],
  },
  {
    id: "decisiones",
    title: "Decisiones automatizadas",
    paragraphs: [
      "Teselando no utiliza actualmente decisiones exclusivamente automatizadas que produzcan efectos jurídicos sobre el usuario o le afecten significativamente de forma similar.",
      "La búsqueda y recomendación de profesor se plantea como un proceso gestionado por Teselando.",
      "Si esto cambiase en el futuro, esta política deberá actualizarse antes de utilizar el nuevo tratamiento.",
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad",
    paragraphs: [
      "Teselando aplicará medidas técnicas y organizativas adecuadas para proteger los datos personales frente a accesos no autorizados, pérdida, alteración o divulgación indebida, teniendo en cuenta la naturaleza de la información y los riesgos del tratamiento.",
      "Ningún sistema puede garantizar una seguridad absoluta, por lo que las medidas se revisarán cuando resulte necesario.",
    ],
  },
  {
    id: "cambios",
    title: "Cambios en esta política",
    paragraphs: [
      "Podremos actualizar esta política cuando cambien nuestros servicios, proveedores, tratamientos de datos o las obligaciones legales aplicables.",
      "Cuando los cambios sean relevantes, actualizaremos la fecha indicada al inicio y facilitaremos la información adicional que legalmente corresponda.",
    ],
  },
];

export const cookieSections: readonly LegalSection[] = [
  {
    id: "que-son",
    title: "Qué son las cookies y tecnologías similares",
    paragraphs: [
      "Las cookies son pequeños archivos o identificadores que un sitio web puede almacenar o consultar en el dispositivo del usuario.",
      "También existen tecnologías con una función similar, como el almacenamiento local del navegador.",
      "Estas herramientas pueden ser necesarias para que una web funcione correctamente o utilizarse, con el consentimiento correspondiente, para obtener información sobre cómo se utiliza.",
    ],
  },
  {
    id: "que-utiliza",
    title: "Qué utiliza Teselando",
    paragraphs: ["Teselando diferencia entre tecnologías necesarias y tecnologías de analítica."],
    subsections: [
      {
        id: "necesarias",
        title: "Tecnologías necesarias",
        paragraphs: [
          "Son las necesarias para que determinadas funciones de la web operen correctamente o para recordar decisiones realizadas por el propio usuario.",
          "Por ejemplo, Teselando puede almacenar tu elección sobre las preferencias de cookies para no volver a preguntártela en cada visita.",
          "Estas tecnologías no se utilizan para crear perfiles publicitarios.",
        ],
      },
      {
        id: "analitica",
        title: "Analítica",
        paragraphs: [
          "Teselando puede utilizar herramientas de analítica para conocer de forma agregada cómo se utiliza el sitio web y detectar aspectos que podamos mejorar.",
          "Estas herramientas no se activarán hasta que el usuario haya aceptado expresamente la categoría de analítica.",
        ],
      },
    ],
  },
  {
    id: "como-eliges",
    title: "Cómo eliges",
    paragraphs: [
      "Cuando accedes por primera vez al sitio web, puedes aceptar las tecnologías opcionales de analítica, rechazarlas o configurar tus preferencias.",
      "Rechazar la analítica no impide utilizar las funciones esenciales de Teselando.",
    ],
  },
  {
    id: "cambiar",
    title: "Cambiar de opinión",
    paragraphs: [
      "Puedes modificar tu elección en cualquier momento mediante las preferencias de cookies.",
      "Retirar el consentimiento no afecta a la licitud del tratamiento realizado antes de retirarlo.",
    ],
  },
  {
    id: "terceros",
    title: "Tecnologías de terceros",
    paragraphs: [
      "Cuando Teselando utilice una herramienta de un tercero, la información correspondiente deberá aparecer en la tabla de esta política indicando, cuando proceda, el proveedor, finalidad, duración y cualquier información relevante sobre el tratamiento de datos.",
      "No se activarán nuevas categorías de cookies opcionales sin actualizar la información correspondiente y obtener nuevamente el consentimiento cuando resulte necesario.",
    ],
  },
  {
    id: "mas-informacion",
    title: "Más información",
    paragraphs: [
      {
        parts: [
          "Puedes consultar más información sobre cómo tratamos los datos personales en nuestra ",
          { label: "Política de privacidad", href: "/legal/privacidad/" },
          ".",
        ],
      },
      {
        parts: [
          "Si tienes alguna pregunta relacionada con privacidad o cookies, puedes escribir a ",
          { label: legalConfig.company.privacyEmail, href: legalConfig.company.privacyEmailHref },
          ".",
        ],
      },
    ],
  },
];

export const legalTechnologyInventory = [
  {
    technology: "teselando-consent-v2 (almacenamiento local)",
    provider: "Teselando",
    purpose: "Recordar tu elección sobre tecnologías de analítica y cuándo la realizaste.",
    duration: "Hasta 24 meses.",
  },
] as const;
