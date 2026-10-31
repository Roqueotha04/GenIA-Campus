import { activitySchema } from "./schemas";

export const quizIaAdultos = activitySchema.parse({
  id: "adultos-modulo-1-quiz",
  title: "¿Qué sabés de inteligencia artificial?",
  description:
    "Diez preguntas de opción múltiple sobre lo que vimos en el módulo. Al terminar ves tu puntaje y el detalle de cada respuesta.",
  passingScore: 6,
  questions: [
    {
      id: "q1",
      prompt: "¿Qué es la inteligencia artificial?",
      options: [
        "Un conjunto de técnicas que permite a las máquinas realizar tareas que normalmente requieren inteligencia humana",
        "Un robot con conciencia propia que piensa como una persona",
        "Un buscador que solo sirve para encontrar páginas en internet",
        "Una base de datos muy grande con todas las respuestas posibles",
      ],
      correctIndex: 0,
      explanation:
        "La IA agrupa técnicas que permiten a las máquinas resolver tareas como reconocer imágenes, entender lenguaje o tomar decisiones. No implica conciencia.",
    },
    {
      id: "q2",
      prompt: "¿Qué es el machine learning (aprendizaje automático)?",
      options: [
        "Programar a mano cada regla que debe seguir una computadora",
        "Una máquina que reemplaza por completo a los programadores",
        "Un enfoque donde los sistemas aprenden patrones a partir de datos, en lugar de seguir reglas escritas una por una",
        "Un tipo de hardware especial para jugar videojuegos",
      ],
      correctIndex: 2,
      explanation:
        "En el aprendizaje automático el sistema detecta patrones en los datos y mejora con la experiencia, sin que alguien escriba todas las reglas.",
    },
    {
      id: "q3",
      prompt: "¿Cuál de estos es un ejemplo de IA que usás en tu día a día?",
      options: [
        "Una calculadora básica",
        "Las recomendaciones de series o música en las plataformas de streaming",
        "Un reloj despertador analógico",
        "Una linterna a pilas",
      ],
      correctIndex: 1,
      explanation:
        "Las plataformas de streaming aprenden de lo que mirás y escuchás para sugerirte contenido nuevo.",
    },
    {
      id: "q4",
      prompt: "¿Qué es un modelo de lenguaje, como los que usan ChatGPT, Claude o Gemini?",
      options: [
        "Un diccionario digital con todas las palabras del idioma",
        "Un traductor que solo funciona entre dos idiomas",
        "Un corrector ortográfico automático",
        "Un modelo entrenado con grandes cantidades de texto que genera respuestas prediciendo qué palabras siguen",
      ],
      correctIndex: 3,
      explanation:
        "Los modelos de lenguaje aprenden de enormes volúmenes de texto y generan respuestas calculando qué palabra es más probable a continuación.",
    },
    {
      id: "q5",
      prompt: "¿Qué es un prompt?",
      options: [
        "La instrucción o consulta que le escribís a una IA para que genere una respuesta",
        "El nombre del programa que ejecuta la IA",
        "Una contraseña para entrar a una herramienta de IA",
        "El tiempo que tarda una IA en responder",
      ],
      correctIndex: 0,
      explanation:
        "El prompt es lo que le pedís a la IA. Cuanto más claro y específico, mejor suele ser el resultado.",
    },
    {
      id: "q6",
      prompt: "¿Qué significa que una IA “alucine”?",
      options: [
        "Que se queda sin batería mientras responde",
        "Que se niega a contestar preguntas difíciles",
        "Que inventa información que suena convincente pero es falsa o no tiene sustento",
        "Que genera imágenes con colores muy intensos",
      ],
      correctIndex: 2,
      explanation:
        "Una alucinación es una respuesta inventada que parece correcta. Por eso conviene contrastar lo que dice la IA.",
    },
    {
      id: "q7",
      prompt: "Una IA te da un dato importante para un trabajo. ¿Qué conviene hacer?",
      options: [
        "Usarlo directamente, porque las IA nunca se equivocan",
        "Pedirle a la misma IA que confirme que tiene razón",
        "Compartirlo cuanto antes para ganar tiempo",
        "Verificarlo en fuentes confiables antes de usarlo",
      ],
      correctIndex: 3,
      explanation:
        "Siempre hay que verificar los datos relevantes en fuentes confiables. Pedirle a la misma IA que se confirme a sí misma no alcanza.",
    },
    {
      id: "q8",
      prompt: "¿Cuál de estas afirmaciones sobre la IA es verdadera?",
      options: [
        "Es siempre neutral y objetiva",
        "Puede reproducir los sesgos presentes en los datos con los que fue entrenada",
        "No necesita datos para funcionar",
        "Entiende el mundo exactamente igual que una persona",
      ],
      correctIndex: 1,
      explanation:
        "Si los datos de entrenamiento tienen sesgos, la IA puede reproducirlos. Por eso importa el criterio humano.",
    },
    {
      id: "q9",
      prompt: "¿Qué es la IA generativa?",
      options: [
        "La que solo clasifica datos en categorías",
        "La que se usa únicamente para controlar máquinas industriales",
        "La que crea contenido nuevo, como texto, imágenes, audio o código, a partir de lo que aprendió",
        "La que genera electricidad para los centros de datos",
      ],
      correctIndex: 2,
      explanation:
        "La IA generativa produce contenido original a partir de patrones aprendidos: textos, imágenes, música, código y más.",
    },
    {
      id: "q10",
      prompt: "¿Cuál es la mejor forma de pensar la IA en el trabajo?",
      options: [
        "Como una herramienta que potencia tu criterio, sin reemplazarlo",
        "Como un reemplazo total de las personas del equipo",
        "Como una moda pasajera que conviene ignorar",
        "Como un oráculo que siempre tiene la última palabra",
      ],
      correctIndex: 0,
      explanation:
        "La IA rinde más cuando se usa como asistente: acelera tareas, pero las decisiones y la revisión final siguen siendo tuyas.",
    },
  ],
});
