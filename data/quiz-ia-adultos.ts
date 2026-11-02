import { activitySchema } from "./schemas";

export const quizIaAdultos = activitySchema.parse({
  id: "adultos-modulo-1-quiz",
  title: "¿Qué sabés de inteligencia artificial?",
  description:
    "Doce preguntas sobre la Clase 1: verdadero o falso, opción múltiple y respuestas escritas. Al terminar ves tu puntaje y el detalle de cada respuesta.",
  passingScore: 7,
  questions: [
    {
      id: "q1",
      kind: "single-choice",
      prompt: "Según la clase, ¿qué es la inteligencia artificial?",
      options: [
        "El campo de la informática que desarrolla sistemas capaces de realizar tareas que normalmente requieren inteligencia humana",
        "Un buscador que encuentra información en internet",
        "Un robot que piensa y siente como una persona",
        "Una base de datos con todas las respuestas posibles",
      ],
      correctIndex: 0,
      explanation:
        "La IA es el campo de la informática que desarrolla sistemas que aprenden de datos, reconocen patrones, comprenden lenguaje, razonan y toman decisiones.",
    },
    {
      id: "q2",
      kind: "true-false",
      prompt:
        "Una red neuronal aprende a partir de ejemplos: no hace falta que una persona escriba cada regla paso a paso.",
      correct: true,
      explanation:
        "La IA se entrena con muchos ejemplos y ajusta sus valores internos hasta reproducir las respuestas esperadas, en lugar de seguir reglas escritas.",
    },
    {
      id: "q3",
      kind: "multiple-choice",
      prompt: "¿Cuáles de estas características corresponden al software tradicional?",
      options: [
        "Una persona escribe las reglas paso a paso",
        "Aprende las reglas a partir de miles de ejemplos",
        "Es exacto y siempre da lo mismo ante la misma entrada",
        "Su resultado es aproximado y puede variar",
        "Se lee el código para entender por qué dio ese resultado",
      ],
      correctIndices: [0, 2, 4],
      explanation:
        "El software tradicional sigue reglas escritas por una persona, es exacto y se puede auditar leyendo el código. Aprender de ejemplos y dar resultados aproximados son rasgos de las redes neuronales.",
    },
    {
      id: "q4",
      kind: "single-choice",
      prompt: "¿Cuál de estos problemas resuelve mejor una red neuronal que el software tradicional?",
      options: [
        "Calcular el sueldo de un empleado",
        "Sumar el total de una factura",
        "Ordenar una lista de nombres alfabéticamente",
        "Reconocer una cara en una foto",
      ],
      correctIndex: 3,
      explanation:
        "Reconocer una cara es un problema sin reglas claras, ideal para una red neuronal. Calcular un sueldo tiene reglas claras y se resuelve con software tradicional.",
    },
    {
      id: "q5",
      kind: "true-false",
      prompt: "El software basado en IA reemplaza por completo al software tradicional.",
      correct: false,
      explanation:
        "La gran mayoría del software con IA no reemplaza al software tradicional: lo complementa. Esa combinación se llama sistema híbrido.",
    },
    {
      id: "q6",
      kind: "multiple-choice",
      prompt: "En Google Maps, ¿qué tareas resuelve la inteligencia artificial?",
      options: [
        "Mostrar el mapa",
        "Predecir el tráfico",
        "Trazar la ruta sobre el mapa",
        "Estimar los tiempos de llegada",
      ],
      correctIndices: [1, 3],
      explanation:
        "La IA predice el tráfico y estima tiempos. Mostrar el mapa y trazar rutas lo hace el software tradicional.",
    },
    {
      id: "q7",
      kind: "single-choice",
      prompt: "¿Qué parte de Netflix funciona con inteligencia artificial?",
      options: [
        "Cobrar la suscripción",
        "Recomendar series y películas",
        "Reproducir el video",
        "Administrar las cuentas",
      ],
      correctIndex: 1,
      explanation:
        "Las cuentas, los pagos y la reproducción son software tradicional. Las recomendaciones de series y películas son IA.",
    },
    {
      id: "q8",
      kind: "multiple-choice",
      prompt: "¿Cuáles son los tres factores clave que explican el crecimiento de la IA?",
      options: [
        "Avances importantes en Deep Learning",
        "La desaparición del software tradicional",
        "El auge de Internet",
        "La inversión en centros de datos",
        "La reducción de la cantidad de datos generados",
      ],
      correctIndices: [0, 2, 3],
      explanation:
        "La IA creció gracias al auge de Internet (más datos), la inversión en centros de datos y los avances en Deep Learning.",
    },
    {
      id: "q9",
      kind: "true-false",
      prompt:
        "El paper “Attention is all you need”, de 2017, definió la arquitectura transformer, que usan hoy los modelos de IA.",
      correct: true,
      explanation:
        "Un grupo de 8 ingenieros lo publicó en 2017 y la arquitectura transformer es la base de los modelos actuales.",
    },
    {
      id: "q10",
      kind: "written",
      prompt: "Explicá con tus palabras cómo aprende una inteligencia artificial.",
      expectedAnswer:
        "Aprende patrones a partir de grandes cantidades de datos: se entrena con ejemplos y ajusta sus valores internos hasta reproducir las respuestas esperadas.",
      keywordGroups: [
        ["dato", "ejemplo"],
        ["patron", "aprend", "entren"],
      ],
      explanation:
        "Para sumar el punto tenías que mencionar los datos o ejemplos y que la IA aprende o se entrena para detectar patrones.",
    },
    {
      id: "q11",
      kind: "written",
      prompt: "¿Qué es un sistema híbrido? Dá un ejemplo de una aplicación que lo use.",
      expectedAnswer:
        "Es un software que combina software tradicional con inteligencia artificial. Por ejemplo, Uber usa software tradicional para el cobro y la tarifa, e IA para predecir la demanda y el tiempo de llegada.",
      keywordGroups: [
        ["tradicional"],
        ["ia", "inteligencia", "red neuronal"],
        ["uber", "instagram", "netflix", "google maps", "maps", "gmail"],
      ],
      explanation:
        "Para sumar el punto tenías que nombrar el software tradicional, la IA y una aplicación de ejemplo, como Uber, Instagram, Netflix, Google Maps o Gmail.",
    },
    {
      id: "q12",
      kind: "written",
      prompt: "¿Qué es Big Data y por qué es necesario para entrenar modelos de IA?",
      expectedAnswer:
        "Es la industria dedicada a recolectar, almacenar, procesar y analizar grandes volúmenes de datos. Sin esos datos sería imposible entrenar los modelos de IA actuales.",
      keywordGroups: [
        ["dato"],
        ["entren", "model", "ia", "inteligencia"],
      ],
      explanation:
        "Para sumar el punto tenías que mencionar los datos y su relación con el entrenamiento de los modelos de IA.",
    },
  ],
});
