import { activitySchema } from "./schemas";

export const quizAutomatizacionesAdultos = activitySchema.parse({
  id: "adultos-modulo-2-quiz",
  title: "¿Cuánto sabés de automatización?",
  description:
    "Doce preguntas sobre la Clase 1: verdadero o falso, opción múltiple y respuestas escritas. Al terminar ves tu puntaje y el detalle de cada respuesta.",
  passingScore: 7,
  questions: [
    {
      id: "q1",
      kind: "single-choice",
      prompt: "¿Qué es un flujo de automatización?",
      options: [
        "Un programa que reemplaza a las personas de un equipo",
        "Un diagrama que solo sirve para dibujar procesos, sin ejecutarlos",
        "Una secuencia de pasos que ejecuta una tarea automáticamente a partir de un evento o una condición, sin hacer cada acción a mano",
        "Una base de datos con información del negocio",
      ],
      correctIndex: 2,
      explanation:
        "Un flujo de automatización es una secuencia de pasos que se ejecuta sola a partir de un evento o condición, sin intervención manual en cada acción.",
    },
    {
      id: "q2",
      kind: "true-false",
      prompt: "Se puede automatizar un proceso que todavía no existe: la herramienta lo define por vos.",
      correct: false,
      explanation:
        "Es el requisito fundamental: tiene que haber procesos de trabajo en uso. No se puede automatizar un proceso inexistente, hace falta una base sobre la cual trabajar.",
    },
    {
      id: "q3",
      kind: "multiple-choice",
      prompt: "¿Cuáles son los tres componentes principales de una automatización?",
      options: [
        "Disparadores",
        "Contraseñas",
        "Acciones",
        "Plantillas de correo",
        "Resultados",
      ],
      correctIndices: [0, 2, 4],
      explanation:
        "Las automatizaciones digitales se basan en la gestión de información y tienen tres componentes: disparadores, acciones y resultados.",
    },
    {
      id: "q4",
      kind: "single-choice",
      prompt:
        "¿Qué tipo de disparador conviene para generar un reporte todos los días a la misma hora?",
      options: [
        "Webhook instantáneo",
        "Programado (scheduled)",
        "Custom webhook",
        "De cola o por lotes",
      ],
      correctIndex: 1,
      explanation:
        "El disparador programado se activa con un reloj o calendario preconfigurado, por eso garantiza la ejecución de tareas rutinarias y reportes.",
    },
    {
      id: "q5",
      kind: "true-false",
      prompt:
        "Un webhook permite reaccionar en tiempo real, porque la aplicación de origen envía el evento automáticamente.",
      correct: true,
      explanation:
        "El webhook instantáneo se activa con un evento enviado desde la app de origen, así reacciona de inmediato sin desperdiciar operaciones.",
    },
    {
      id: "q6",
      kind: "multiple-choice",
      prompt: "¿Cuáles de estas acciones son operaciones CRUD?",
      options: [
        "Enviar un correo personalizado",
        "Crear un registro nuevo",
        "Modificar un registro existente",
        "Dividir el flujo en caminos con un Router",
        "Consultar los datos de un usuario",
      ],
      correctIndices: [1, 2, 4],
      explanation:
        "CRUD significa Create, Read, Update y Delete: crear, consultar, modificar y eliminar registros. Enviar mensajes es una notificación y el Router es una operación de control.",
    },
    {
      id: "q7",
      kind: "single-choice",
      prompt: "¿Qué diferencia hay entre un dato y una información?",
      options: [
        "Son exactamente lo mismo",
        "La información es siempre un número y el dato siempre un texto",
        "El dato es el resultado final de una automatización",
        "El dato es un elemento aislado, como una fecha o un importe; la información aparece cuando los datos se organizan o interpretan en un contexto útil",
      ],
      correctIndex: 3,
      explanation:
        "Una lista de importes son datos. Si una automatización los procesa para calcular el total de ventas, el resultado es información.",
    },
    {
      id: "q8",
      kind: "true-false",
      prompt: "La IA dentro de una automatización solo sirve para crear chatbots.",
      correct: false,
      explanation:
        "El potencial de los modelos no se limita a los chatbots: también pueden clasificar mensajes, analizar consultas e integrarse en procesos más amplios.",
    },
    {
      id: "q9",
      kind: "multiple-choice",
      prompt:
        "¿Qué caracteriza a la automatización con flujos visuales (low-code) frente a la programación tradicional?",
      options: [
        "Ofrece control total sobre el sistema",
        "Trabaja con bloques visuales",
        "Requiere conocimientos de código",
        "Permite integrar aplicaciones en poco tiempo",
        "Se puede armar sin escribir código",
      ],
      correctIndices: [1, 3, 4],
      explanation:
        "Los flujos visuales usan bloques, integran aplicaciones rápido y no exigen código. El control total y la necesidad de conocimientos de código son rasgos de la programación tradicional.",
    },
    {
      id: "q10",
      kind: "written",
      prompt: "Explicá qué es un disparador (trigger) y nombrá un tipo de disparador.",
      expectedAnswer:
        "Es el componente que inicia el flujo cuando ocurre un evento o condición. Hay disparadores instantáneos (webhook), programados, custom webhook y de cola o por lotes.",
      keywordGroups: [
        ["inici", "activ", "arranc", "comienz", "empiez", "pone en marcha"],
        ["webhook", "programad", "schedul", "cola", "lote", "queue", "bulk"],
      ],
      explanation:
        "Para sumar el punto tenías que explicar que el disparador inicia el flujo y nombrar un tipo: webhook, programado, custom webhook o de cola o por lotes.",
    },
    {
      id: "q11",
      kind: "written",
      prompt:
        "¿Por qué no se puede automatizar un proceso que no existe? ¿Qué conviene hacer antes de construir un flujo?",
      expectedAnswer:
        "Porque tiene que haber una base sobre la cual trabajar. Antes de construir el flujo conviene entender cómo se realiza el trabajo: sus etapas, la información que usa y el resultado que debe producir, y diagramarlo.",
      keywordGroups: [
        ["proceso"],
        ["entend", "comprend", "defin", "organiz", "conoc", "identific", "diagram", "analiz"],
      ],
      explanation:
        "Para sumar el punto tenías que mencionar el proceso y que antes hay que entenderlo, definirlo u organizarlo.",
    },
    {
      id: "q12",
      kind: "written",
      prompt: "Explicá qué es RAG y para qué sirve.",
      expectedAnswer:
        "RAG (Retrieval-Augmented Generation) consiste en conectar un modelo o agente de IA con una base de datos para que consulte información específica del negocio, como preguntas frecuentes o reglas, al generar sus respuestas.",
      keywordGroups: [
        ["dato", "bdd", "fuente", "conocimiento"],
        ["conect", "consult", "recuper", "acced", "busc", "vincul"],
      ],
      explanation:
        "Para sumar el punto tenías que mencionar la base de datos o fuente de información y que el modelo se conecta y la consulta.",
    },
  ],
});
