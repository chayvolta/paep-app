import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, CheckCircle, XCircle, Award, Clock, ArrowRight, 
  RotateCcw, Brain, Calculator, PenTool, Globe, Zap, Layers,
  BarChart3, RefreshCw, AlertCircle, PlayCircle, Star, Home, X,
  Github, ExternalLink
} from 'lucide-react';

// --- CONFIGURACIÓN DE LA APP ---
const APP_VERSION = "2.0.1";
const LAST_UPDATE = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

// --- UTILIDADES ---

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- BANCO DE PREGUNTAS MASIVO ---

const RAW_QUESTION_BANK = [
  // ==========================================
  // RAZONAMIENTO VERBAL
  // ==========================================
  { id: 'v_go_1', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'ADECUADO', options: ['Analizado', 'Estupendo', 'Inadvertido', 'Incorrecto', 'Inesperado'], correctAnswer: 3, explanation: 'Lo opuesto a adecuado es incorrecto.' },
  { id: 'v_go_2', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'AUTÉNTICA', options: ['Falsa', 'Dependiente', 'Devaluada', 'Descompuesta', 'Flexible'], correctAnswer: 0, explanation: 'Lo opuesto a auténtico (verdadero) es falso.' },
  { id: 'v_go_3', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'DIVERSIDAD', options: ['Uniformidad', 'Opulencia', 'Llaneza', 'Oposición', 'Aburrimiento'], correctAnswer: 0, explanation: 'Diversidad implica variedad; uniformidad implica igualdad.' },
  { id: 'v_go_4', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'NOTORIO', options: ['Escabroso', 'Detallado', 'Caprichoso', 'Ilusorio', 'Inadvertido'], correctAnswer: 4, explanation: 'Notorio es conocido; inadvertido pasa desapercibido.' },
  { id: 'v_go_5', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'REACIO', options: ['Confuso', 'Fácil', 'Dócil', 'Rancio', 'Inútil'], correctAnswer: 2, explanation: 'Reacio se resiste; dócil obedece.' },
  { id: 'v_go_6', category: 'Verbal', source: 'Guía Oficial', type: 'Antónimo', question: 'INDÓMITO', options: ['Discreto', 'Gobernable', 'Devastador', 'Débil', 'Atónito'], correctAnswer: 1, explanation: 'Indómito es salvaje; gobernable se controla.' },
  { id: 'v_go_7', category: 'Verbal', source: 'Guía Oficial', type: 'Completar', question: 'Los animales pueden _______ de muchas formas los problemas _______ por los cambios estacionales.', options: ['soportar - comunitarios', 'afrontar - causados', 'rechazar - proporcionados', 'esquivar - esperados', 'someter - propiciados'], correctAnswer: 1, explanation: 'Afrontar problemas causados es la relación lógica.' },
  { id: 'v_go_8', category: 'Verbal', source: 'Guía Oficial', type: 'Completar', question: 'La mundialización del ideal democrático no suprime las relaciones de _______ entre las naciones.', options: ['masas', 'fuerza', 'comprensión', 'pobreza', 'impulso'], correctAnswer: 1, explanation: 'Contexto de realpolitik: persisten las relaciones de fuerza.' },
  { id: 'v_inv_1', category: 'Verbal', source: 'Investigación', type: 'Analogía', question: 'VOCACIÓN : OFICIO ::', options: ['necesidad : satisfactor', 'sacrificio : triunfo', 'capacidad : tarea', 'producción : producto', 'calidad : meta'], correctAnswer: 2, explanation: 'Requisito intrínseco para la actividad.' },
  { id: 'v_inv_2', category: 'Verbal', source: 'Investigación', type: 'Analogía', question: 'PINTOR : BROCHA ::', options: ['escultor : cincel', 'médico : medicina', 'abogado : leyes', 'mecánico : coche', 'profesor : alumno'], correctAnswer: 0, explanation: 'Sujeto : Instrumento.' },
  { id: 'v_inv_3', category: 'Verbal', source: 'Investigación', type: 'Antónimo', question: 'EFÍMERO', options: ['Duradero', 'Fugaz', 'Rápido', 'Mortal', 'Eterno'], correctAnswer: 0, explanation: 'Efímero (corto) vs Duradero (largo).' },
  { id: 'v_inv_4', category: 'Verbal', source: 'Investigación', type: 'Completar', question: 'El _______ no es compatible con la _______; quien duda no puede actuar con convicción.', options: ['amor - esperanza', 'odio - paz', 'escepticismo - fe', 'dinero - avaricia', 'trabajo - pereza'], correctAnswer: 2, explanation: 'Escepticismo (duda) vs Fe (convicción).' },
  { id: 'v_inv_5', category: 'Verbal', source: 'Investigación', type: 'Analogía', question: 'CORAZÓN : SANGRE ::', options: ['cerebro : ideas', 'pulmón : aire', 'estómago : comida', 'bomba : agua', 'tanque : gasolina'], correctAnswer: 3, explanation: 'Órgano/Mecanismo que impulsa un fluido (Bomba:Agua).' },
  { id: 'v_inv_6', category: 'Verbal', source: 'Investigación', type: 'Antónimo', question: 'ALTRUISTA', options: ['Egoísta', 'Bondadoso', 'Rico', 'Pobre', 'Amable'], correctAnswer: 0, explanation: 'Altruista piensa en otros; egoísta en sí mismo.' },

  // ==========================================
  // RAZONAMIENTO CUANTITATIVO
  // ==========================================
  { id: 'm_go_1', category: 'Matemáticas', source: 'Guía Oficial', type: 'Aritmética', question: 'Si 48 es el 39% de una cantidad, el 26% de esa misma cantidad es:', options: ['13', '18', '21', '32', '66.6'], correctAnswer: 3, explanation: 'X = 48/0.39 = 123.07. Luego 123.07 * 0.26 = 32.' },
  { id: 'm_go_2', category: 'Matemáticas', source: 'Guía Oficial', type: 'Geometría', question: 'Rampa para subir plataforma de 5m de altura. Empieza a 12m de la orilla. Longitud:', options: ['13', '17', '25', '60', '119'], correctAnswer: 0, explanation: 'Pitágoras: √(5² + 12²) = 13.' },
  { id: 'm_go_3', category: 'Matemáticas', source: 'Guía Oficial', type: 'Álgebra', question: 'Resultado de -2(1 - 3/4)²', options: ['-10/14', '-1/8', '1/8', '10/14', '17/16'], correctAnswer: 1, explanation: '-2 * (1/4)² = -2 * 1/16 = -1/8.' },
  { id: 'm_go_4', category: 'Matemáticas', source: 'Guía Oficial', type: 'Probabilidad', question: 'Probabilidad de obtener 7 lanzando un par de dados:', options: ['1/6', '3/8', '1/2', '4/6', '5/6'], correctAnswer: 0, explanation: '6 combinaciones favorables / 36 totales = 1/6.' },
  { id: 'm_go_5', category: 'Matemáticas', source: 'Guía Oficial', type: 'Cálculo', question: 'Si x = -4t³ + 20t² + 80t + 100, velocidad en t=3:', options: ['92', '94', '96', '98', '100'], correctAnswer: 0, explanation: 'v = dx/dt = -12t² + 40t + 80. Evaluar en t=3.' },
  { id: 'm_go_6', category: 'Matemáticas', source: 'Guía Oficial', type: 'Álgebra', question: '¿Qué expresión sumada con x³ - x² + 5 da 3x - 6?', options: ['-x³ + x² + 3x - 11', '-x³ + x² - 3x - 1', '-x³ - x² + 3x + 11', 'x³ + x² + 3x - 6', '-x³ + x² + 3x + 11'], correctAnswer: 0, explanation: 'Resta: (3x - 6) - (x³ - x² + 5).' },
  { id: 'm_dyn_1', category: 'Matemáticas', source: 'Investigación', type: 'Porcentajes', isDynamic: true, generator: () => { const base = randomInt(200, 500); const pct = 20; const res = base * 0.2; return { question: `¿Cuánto es el ${pct}% de ${base}?`, options: [(res-10).toString(), res.toString(), (res+5).toString(), (res*2).toString(), (res/2).toString()], correctAnswer: 1, explanation: `${base} * 0.20 = ${res}.` } } },
  { id: 'm_dyn_2', category: 'Matemáticas', source: 'Investigación', type: 'Ecuaciones', isDynamic: true, generator: () => { const x = randomInt(3, 9); const res = 2*x + 5; return { question: `Resuelve para x: 2x + 5 = ${res}`, options: [(x-1).toString(), (x+2).toString(), x.toString(), (x*2).toString(), '0'], correctAnswer: 2, explanation: `Despeje básico: 2x = ${res-5}.` } } },
  { id: 'm_inv_3', category: 'Matemáticas', source: 'Investigación', type: 'Geometría', question: 'Área de círculo con radio 4:', options: ['8π', '16π', '4π', '12π', '64π'], correctAnswer: 1, explanation: 'A = πr² = 16π.' },
  { id: 'm_inv_4', category: 'Matemáticas', source: 'Investigación', type: 'Probabilidad', question: 'Probabilidad de sol en un volado:', options: ['1/2', '1/3', '1/4', '1', '0'], correctAnswer: 0, explanation: '1 de 2 opciones.' },
  { id: 'm_inv_5', category: 'Matemáticas', source: 'Investigación', type: 'Álgebra', question: 'Factoriza x² - 9:', options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x+3)(x-3)', '(x-9)(x+1)', '(x-1)(x+9)'], correctAnswer: 2, explanation: 'Diferencia de cuadrados.' },
  { id: 'm_inv_6', category: 'Matemáticas', source: 'Investigación', type: 'Aritmética', question: 'MCD de 12 y 18:', options: ['2', '3', '6', '12', '36'], correctAnswer: 2, explanation: 'El mayor divisor común es 6.' },

  // ==========================================
  // HABILIDAD COGNITIVA
  // ==========================================
  { id: 'c_go_1', category: 'Cognitiva', source: 'Guía Oficial', type: 'Secuencias', question: 'B1, C3, D5, E7, F9, ___', options: ['H17', 'H13', 'G15', 'G13', 'G11'], correctAnswer: 4, explanation: 'Letra +1, Número +2.' },
  { id: 'c_go_2', category: 'Cognitiva', source: 'Guía Oficial', type: 'Relaciones', question: 'Caballo:Mar :: Automóvil:Tierra :: Ballena:Barco', options: ['Superficie...', 'Tierra, submarino, avestruz', 'Camino, barco, águila', 'Avión, cielo, águila', 'Camino, submarino, avestruz'], correctAnswer: 4, explanation: 'Matriz lógica de medio/vehículo.' },
  { id: 'c_go_3', category: 'Cognitiva', source: 'Guía Oficial', type: 'Secuencias', question: '10, 13, 16, 19, ___', options: ['21', '22', '23', '24', '20'], correctAnswer: 1, explanation: 'Suma 3.' },
  { id: 'c_go_4', category: 'Cognitiva', source: 'Guía Oficial', type: 'Relaciones', question: 'El ocaso de la vida', options: ['Adolescencia', 'Nacimiento', 'Vejez', 'Juventud', 'Madurez'], correctAnswer: 2, explanation: 'Metáfora de final/atardecer.' },
  { id: 'c_go_5', category: 'Cognitiva', source: 'Guía Oficial', type: 'Secuencias', question: '7ZA14, 16WC32, ___', options: ['36QG68', '34QG68', '34GQ68', '36RG68', '38RG68'], correctAnswer: 1, explanation: 'Patrón complejo alfanumérico.' },
  { id: 'c_go_6', category: 'Cognitiva', source: 'Guía Oficial', type: 'Lógica', question: 'Orden en fila: Hernández tras González, González tras Ruiz.', options: ['González, Ruiz, Hernández', 'Ruiz, Hernández, González', 'Hernández, González, Ruiz', 'Ruiz, González, Hernández', 'González, Hernández, Ruiz'], correctAnswer: 3, explanation: 'Ruiz -> González -> Hernández.' },
  { id: 'c_inv_1', category: 'Cognitiva', source: 'Investigación', type: 'Secuencia', question: '2, 4, 8, 16, ___', options: ['30', '32', '24', '18', '20'], correctAnswer: 1, explanation: 'Potencias de 2.' },
  { id: 'c_inv_2', category: 'Cognitiva', source: 'Investigación', type: 'Visual', question: 'Figura que sigue: Triángulo, Cuadrado, Pentágono...', options: ['Hexágono', 'Heptágono', 'Octágono', 'Círculo', 'Rombo'], correctAnswer: 0, explanation: 'Lados: 3, 4, 5 -> 6.' },
  { id: 'c_inv_3', category: 'Cognitiva', source: 'Investigación', type: 'Silogismo', question: 'Todos los hombres son mortales. Sócrates es hombre.', options: ['Sócrates es inmortal', 'Sócrates es mortal', 'Sócrates es filósofo', 'Todos son Sócrates', 'Nada'], correctAnswer: 1, explanation: 'Deducción directa.' },
  { id: 'c_inv_4', category: 'Cognitiva', source: 'Investigación', type: 'Analogía', question: 'LIBRO : LEER ::', options: ['música : escuchar', 'cuadro : pintar', 'canción : componer', 'guitarra : tocar', 'película : actuar'], correctAnswer: 0, explanation: 'Objeto : Acción pasiva.' },
  { id: 'c_inv_5', category: 'Cognitiva', source: 'Investigación', type: 'Secuencia', question: 'A, C, E, G, ___', options: ['H', 'I', 'J', 'K', 'L'], correctAnswer: 1, explanation: 'Salta una letra: B, D, F, H... Sigue I.' },
  { id: 'c_inv_6', category: 'Cognitiva', source: 'Investigación', type: 'Lógica', question: 'Si hoy es lunes, pasado mañana será:', options: ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], correctAnswer: 1, explanation: 'Lunes + 2 días = Miércoles.' },

  // ==========================================
  // REDACCIÓN
  // ==========================================
  { id: 'r_go_1', category: 'Redacción', source: 'Guía Oficial', type: 'Incoherencia', question: 'Identifica la oración incorrecta:', options: ['Vi a mi amigo bajando del avión.', 'Al bajar yo del avión vi a mi amigo.', 'Vi a mi amigo cuando él bajaba.', 'Todas correctas', 'Ninguna correcta'], correctAnswer: 0, explanation: 'Anfibología (ambigüedad).' },
  { id: 'r_go_2', category: 'Redacción', source: 'Guía Oficial', type: 'Concordancia', question: 'Selecciona la correcta:', options: ['Asistieron veintiún personas', 'Asistieron veintiuna personas', 'Asistió veintiún personas', 'Asistieron veinte y un personas', 'Habían veintiún personas'], correctAnswer: 1, explanation: 'Concordancia de género (femenino).' },
  { id: 'r_go_3', category: 'Redacción', source: 'Guía Oficial', type: 'Pleonasmo', question: 'Identifica el error:', options: ['La base fundamental', 'La base esencial', 'El fundamento básico', 'Todas tienen pleonasmo', 'Ninguna'], correctAnswer: 3, explanation: 'Redundancia en todos los casos.' },
  { id: 'r_go_4', category: 'Redacción', source: 'Guía Oficial', type: 'Gramática', question: 'Uso de "médica":', options: ['La médico', 'La médica', 'El médica', 'La doctor', 'El doctor mujer'], correctAnswer: 1, explanation: 'Profesión en femenino.' },
  { id: 'r_go_5', category: 'Redacción', source: 'Guía Oficial', type: 'Régimen', question: 'Selecciona la correcta:', options: ['Coincidieron de que', 'Coincidieron en que', 'Coincidieron que', 'Coincidieron a que', 'Coincidieron con que'], correctAnswer: 1, explanation: 'Coincidir "en".' },
  { id: 'r_inv_1', category: 'Redacción', source: 'Investigación', type: 'Ortografía', question: 'Palabra escrita correctamente:', options: ['Desición', 'Decisión', 'Decición', 'Desisión', 'Dezición'], correctAnswer: 1, explanation: 'C y S.' },
  { id: 'r_inv_2', category: 'Redacción', source: 'Investigación', type: 'Acentuación', question: 'Palabra aguda:', options: ['Árbol', 'Mesa', 'Canción', 'Teléfono', 'Libro'], correctAnswer: 2, explanation: 'Fuerza en la última sílaba.' },
  { id: 'r_inv_3', category: 'Redacción', source: 'Investigación', type: 'Puntuación', question: 'Uso de coma vocativa:', options: ['Hola Juan', 'Hola, Juan', 'Hola Juan,', 'Hola; Juan', 'Hola. Juan'], correctAnswer: 1, explanation: 'Vocativo separado por coma.' },
  { id: 'r_inv_4', category: 'Redacción', source: 'Investigación', type: 'Barbarismo', question: 'Forma correcta:', options: ['Haiga', 'Haya', 'Allá', 'Halla', 'Aya'], correctAnswer: 1, explanation: 'Del verbo haber.' },
  { id: 'r_inv_5', category: 'Redacción', source: 'Investigación', type: 'Queísmo', question: 'Correcto:', options: ['Me di cuenta de que', 'Me di cuenta que', 'Me enteré que', 'Dudo que vengas', 'Pienso de que'], correctAnswer: 0, explanation: 'Requiere preposición "de".' },
  { id: 'r_inv_6', category: 'Redacción', source: 'Investigación', type: 'Sintaxis', question: 'Orden lógico:', options: ['El niño comió la manzana roja', 'La roja manzana comió el niño', 'Comió roja la manzana el niño', 'El niño la roja manzana comió', 'Roja la manzana el niño comió'], correctAnswer: 0, explanation: 'Sujeto + Verbo + Predicado (orden natural).' },
  { id: 'r_inv_7', category: 'Redacción', source: 'Investigación', type: 'Homófonos', question: 'Selecciona: "No _______ bien el agua".', options: ['Hierba', 'Hierva', 'Yerba', 'Yerva', 'Ierba'], correctAnswer: 1, explanation: 'Hierva (del verbo hervir).' },

  // ==========================================
  // INGLÉS (Parte VII)
  // ==========================================
  { id: 'e_go_1', category: 'Inglés', source: 'Guía Oficial', type: 'Grammar', question: 'I _______ already _______ lesson five.', options: ['have... studied', 'has... studying', 'am... studied', 'hasnt... studied', 'are... studying'], correctAnswer: 0, explanation: 'Present Perfect.' },
  { id: 'e_go_2', category: 'Inglés', source: 'Guía Oficial', type: 'Comparatives', question: 'The movie was much _______ than I expected.', options: ['go', 'best', 'better', 'more good', 'gooder'], correctAnswer: 2, explanation: 'Comparativo irregular.' },
  { id: 'e_go_3', category: 'Inglés', source: 'Guía Oficial', type: 'Modals', question: 'You _______ be in your classroom!', options: ['may', 'can', 'must', 'might', 'would'], correctAnswer: 2, explanation: 'Obligación.' },
  { id: 'e_go_4', category: 'Inglés', source: 'Guía Oficial', type: 'Prepositions', question: 'There\'s somebody _______ the window.', options: ['at', 'on', 'in', 'down', 'under'], correctAnswer: 0, explanation: 'Ubicación específica.' },
  { id: 'e_go_5', category: 'Inglés', source: 'Guía Oficial', type: 'Pronouns', question: 'The driver took _______ home.', options: ['we', 'he and I', 'they', 'our', 'us'], correctAnswer: 4, explanation: 'Object Pronoun.' },
  { id: 'e_inv_1', category: 'Inglés', source: 'Investigación', type: 'Conditionals', question: 'If I _______ rich, I would travel.', options: ['am', 'was', 'were', 'have been', 'would be'], correctAnswer: 2, explanation: 'Second Conditional (were).' },
  { id: 'e_inv_2', category: 'Inglés', source: 'Investigación', type: 'Tenses', question: 'She _______ working here for ten years.', options: ['is', 'has been', 'have been', 'was', 'are'], correctAnswer: 1, explanation: 'Present Perfect Continuous.' },
  { id: 'e_inv_3', category: 'Inglés', source: 'Investigación', type: 'Vocabulary', question: 'Opposite of "expensive":', options: ['hard', 'easy', 'cheap', 'soft', 'wealthy'], correctAnswer: 2, explanation: 'Cheap (barato).' },
  { id: 'e_inv_4', category: 'Inglés', source: 'Investigación', type: 'Phrasal Verbs', question: '_______ the lights when you leave.', options: ['turn on', 'turn off', 'turn in', 'turn up', 'turn out'], correctAnswer: 1, explanation: 'Apagar (turn off).' },
  { id: 'e_inv_5', category: 'Inglés', source: 'Investigación', type: 'Quantifiers', question: 'I don\'t have _______ money.', options: ['some', 'many', 'much', 'a few', 'no'], correctAnswer: 2, explanation: 'Much (incontable negativo).' },
  { id: 'e_inv_6', category: 'Inglés', source: 'Investigación', type: 'Prepositions', question: 'Good _______ math.', options: ['in', 'at', 'on', 'for', 'to'], correctAnswer: 1, explanation: 'Good at (bueno para/en).' },
  { id: 'e_inv_7', category: 'Inglés', source: 'Investigación', type: 'Gerunds', question: 'I enjoy _______ books.', options: ['read', 'to read', 'reading', 'reads', 'readed'], correctAnswer: 2, explanation: 'Enjoy + gerundio.' },
];

export default function PAEPUltimateApp() {
  const [screen, setScreen] = useState('menu');
  const [mode, setMode] = useState('practice');
  
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [seenQuestionIds, setSeenQuestionIds] = useState([]);

  // --- LÓGICA GENERADORA ---

  const generateQuiz = (category, quizMode) => {
    let finalQuestions = [];
    const CATEGORIES = ['Verbal', 'Matemáticas', 'Cognitiva', 'Redacción', 'Inglés'];

    if (quizMode === 'exam') {
      // MODO EXAMEN
      const officialQuestions = RAW_QUESTION_BANK.filter(q => q.source === 'Guía Oficial');
      finalQuestions = officialQuestions.sort((a, b) => {
        return CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
      });

    } else {
      // MODO PRÁCTICA
      if (category === 'All') {
        CATEGORIES.forEach(cat => {
          let pool = RAW_QUESTION_BANK.filter(q => q.category === cat);
          let unseen = pool.filter(q => !seenQuestionIds.includes(q.id));
          
          let selectionPool = unseen;
          if (unseen.length < 10) {
            selectionPool = pool; 
            const idsToClear = pool.map(q => q.id);
            setSeenQuestionIds(prev => prev.filter(id => !idsToClear.includes(id)));
          }

          const count = Math.min(selectionPool.length, 10);
          const shuffled = shuffleArray(selectionPool).slice(0, count);
          finalQuestions = [...finalQuestions, ...shuffled];
        });

      } else {
        let pool = RAW_QUESTION_BANK.filter(q => q.category === category);
        let unseen = pool.filter(q => !seenQuestionIds.includes(q.id));
        let selectionPool = unseen.length >= 10 ? unseen : pool;

        if (unseen.length < 10) {
          const idsToClear = pool.map(q => q.id);
          setSeenQuestionIds(prev => prev.filter(id => !idsToClear.includes(id)));
        }

        const count = Math.min(selectionPool.length, 10);
        finalQuestions = shuffleArray(selectionPool).slice(0, count);
      }

      // Procesar dinámicas
      finalQuestions = finalQuestions.map(q => {
        if (q.isDynamic && q.generator) {
          const dynamicData = q.generator();
          return { ...q, ...dynamicData };
        }
        return q;
      });

      // Actualizar historial
      const newIds = finalQuestions.map(q => q.id);
      setSeenQuestionIds(prev => [...new Set([...prev, ...newIds])]);
    }

    if (finalQuestions.length === 0) {
      alert("Error generando el examen. Intenta recargar.");
      return;
    }

    setCurrentQuizQuestions(finalQuestions);
    setMode(quizMode);
    setScreen('quiz');
    setCurrentQuestionIdx(0);
    setAnswers({});
    setScore(0);
    setShowExplanation(false);
  };

  const handleAnswer = (optionIndex) => {
    if (answers[currentQuestionIdx] !== undefined && mode === 'practice') return;
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIndex }));
    if (mode === 'practice') setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < currentQuizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowExplanation(false);
    } else {
      let newScore = 0;
      currentQuizQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) newScore++;
      });
      setScore(newScore);
      setScreen('results');
    }
  };

  // --- UI COMPONENTS ---

  // Componente de Confetti
  const Confetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];
    const confettiPieces = [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    return (
      <>
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              backgroundColor: piece.color
            }}
          />
        ))}
      </>
    );
  };

  const MenuScreen = () => {
    const categories = [
      { id: 'All', label: 'Mix Total', icon: <Layers size={22} />, sub: '50 Pregs', gradient: 'var(--cat-mix)', bgLight: 'bg-emerald-50', textColor: 'text-black', borderColor: 'border-emerald-400' },
      { id: 'Verbal', label: 'Verbal', icon: <BookOpen size={22} />, sub: '10 Pregs', gradient: 'var(--cat-verbal)', bgLight: 'bg-amber-50', textColor: 'text-black', borderColor: 'border-amber-400' },
      { id: 'Matemáticas', label: 'Mate', icon: <Calculator size={22} />, sub: '10 Pregs', gradient: 'var(--cat-math)', bgLight: 'bg-purple-50', textColor: 'text-black', borderColor: 'border-purple-400' },
      { id: 'Cognitiva', label: 'Cognitiva', icon: <Brain size={22} />, sub: '10 Pregs', gradient: 'var(--cat-cognitive)', bgLight: 'bg-blue-50', textColor: 'text-black', borderColor: 'border-blue-400' },
      { id: 'Redacción', label: 'Redacción', icon: <PenTool size={22} />, sub: '10 Pregs', gradient: 'var(--cat-writing)', bgLight: 'bg-pink-50', textColor: 'text-black', borderColor: 'border-pink-400' },
      { id: 'Inglés', label: 'Inglés', icon: <Globe size={22} />, sub: '10 Pregs', gradient: 'var(--cat-english)', bgLight: 'bg-cyan-50', textColor: 'text-black', borderColor: 'border-cyan-400' },
    ];

    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 text-black font-sans overflow-hidden">
        {/* Partículas flotantes mejoradas */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                width: `${4 + Math.random() * 4}px`,
                height: `${4 + Math.random() * 4}px`,
                opacity: 0.3 + Math.random() * 0.4
              }}
            />
          ))}
        </div>

        <div className="max-w-md w-full glass-card rounded-3xl overflow-hidden relative z-10 mb-8 animate-bounce-in mx-4" style={{ boxShadow: 'var(--shadow-2xl)' }}>
          <div className="relative p-6 md:p-10 text-white text-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>
            <Brain className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 animate-float relative z-10" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }} />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight relative z-10 mb-2">PAEP<span className="text-blue-200">Pro</span></h1>
            <p className="text-white/95 text-base font-semibold mt-1 relative z-10">Plataforma de Estudio Integral</p>
            <div className="absolute top-5 right-5 text-[11px] bg-white/25 px-3 py-1.5 rounded-full font-bold backdrop-blur-md z-10">
              v{APP_VERSION}
            </div>
          </div>

          <div className="p-8 space-y-7">
            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} /> Área de Estudio
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`category-btn flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-black shadow-md font-bold transition-all animate-fade-in ${
                      selectedCategory === cat.id
                        ? `${cat.bgLight} ${cat.borderColor} ${cat.textColor} ring-2 ring-offset-1 scale-105`
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{
                      background: selectedCategory === cat.id ? '' : cat.gradient,
                      animationDelay: `${idx * 0.05}s`
                    }}
                  >
                    {cat.icon}
                    <span className="text-[11px] mt-2 font-bold leading-tight">{cat.label}</span>
                    <span className="text-[9px] opacity-80 font-medium mt-0.5">{cat.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <PlayCircle size={16} /> Modo de Prueba
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => generateQuiz(selectedCategory, 'practice')}
                  className="w-full btn-premium btn-ripple group relative overflow-hidden rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 animate-slide-in-right"
                  style={{ 
                    background: 'var(--cat-mix)',
                    boxShadow: 'var(--shadow-glow-success)',
                    animationDelay: '0.3s'
                  }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-white/25 p-3 backdrop-blur-sm"><Zap size={24} strokeWidth={2.5} /></div>
                      <div className="text-left">
                        <div className="font-black text-lg">Iniciar Práctica</div>
                        <div className="text-sm text-white/90 font-medium mt-0.5">
                          {selectedCategory === 'All' ? '50 Preguntas (10/tema)' : '10 Preguntas del tema'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={22} className="transform transition-transform group-hover:translate-x-2" strokeWidth={2.5} />
                  </div>
                </button>

                <button
                  onClick={() => generateQuiz('All', 'exam')}
                  className="w-full btn-premium btn-ripple group relative overflow-hidden rounded-2xl border-3 p-5 text-black transition-all hover:scale-[1.03] duration-300 shadow-lg hover:shadow-xl animate-slide-in-right"
                  style={{ 
                    background: 'white',
                    border: '2px solid rgba(168, 85, 247, 0.2)',
                    animationDelay: '0.4s'
                  }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 p-3 group-hover:from-purple-200 group-hover:to-blue-200 transition-all">
                        <Clock size={24} className="text-purple-600" strokeWidth={2.5} />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-lg">Simulacro Oficial</div>
                        <div className="text-sm text-black group-hover:text-purple-700 transition-colors font-bold mt-0.5">Total reactivos oficiales</div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      <footer className="text-center text-slate-600 font-medium text-[10px] pb-4 space-y-1">
        <p>PAEP Pro &copy; {new Date().getFullYear()} - Versión {APP_VERSION}</p>
        <p>Actualizado: {LAST_UPDATE}</p>
      </footer>
    </div>
    );
  };

  const QuizScreen = () => {
    const question = currentQuizQuestions[currentQuestionIdx];
    const isAnswered = answers[currentQuestionIdx] !== undefined;
    const isCorrect = answers[currentQuestionIdx] === question.correctAnswer;
    const progress = ((currentQuestionIdx + 1) / currentQuizQuestions.length) * 100;

    return (
      <div className="min-h-screen relative flex flex-col items-center p-4" style={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="w-full max-w-2xl flex justify-between items-center mb-4 pt-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {mode === 'exam' ? 'Simulacro' : 'Práctica'}
            </span>
          </div>
          <button 
            onClick={() => {
              setScreen('menu'); // Navegación directa para evitar bloqueos
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold px-2 py-1 hover:bg-red-50 rounded-lg"
          >
            <X size={18} /> Salir
          </button>
        </div>

        <div className="w-full max-w-2xl mb-5 animate-fade-in">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-extrabold text-black uppercase tracking-wider">Pregunta {currentQuestionIdx + 1} de {currentQuizQuestions.length}</span>
            <span className="text-sm font-black text-blue-600 tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner relative">
            <div 
              className="h-full transition-all duration-700 ease-out shadow-lg progress-liquid relative" 
              style={{ 
                width: `${progress}%`,
                background: 'var(--gradient-progress)'
              }}
            >
              <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                animation: 'shimmer 2s infinite'
              }}></div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden flex-1 flex flex-col animate-slide-up shadow-2xl">
          <div className="p-8 border-b border-slate-100/50 bg-gradient-to-br from-slate-50/80 to-white/60">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm ${
                 question.category === 'Matemáticas' ? 'bg-purple-100 text-purple-700' :
                 question.category === 'Verbal' ? 'bg-amber-100 text-amber-700' :
                 question.category === 'Inglés' ? 'bg-pink-100 text-pink-700' :
                 question.category === 'Redacción' ? 'bg-pink-100 text-pink-700' :
                 'bg-blue-100 text-blue-700'
              }`}>
                {question.category}
              </span>
              {question.source === 'Guía Oficial' && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Star size={12} fill="currentColor" /> Oficial
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black leading-snug">{question.question}</h2>
          </div>

          <div className="p-8 space-y-4 flex-1 overflow-y-auto">
            {question.options.map((opt, idx) => {
              let style = "border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-black hover:shadow-md font-medium";
              if (mode === 'practice' && showExplanation) {
                if (idx === question.correctAnswer) style = "bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200 font-bold shadow-lg";
                else if (answers[currentQuestionIdx] === idx) style = "bg-red-50 border-red-400 text-red-900 ring-2 ring-red-200";
                else style = "opacity-40 border-slate-100";
              } else if (mode === 'exam' && isAnswered) {
                if (answers[currentQuestionIdx] === idx) style = "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 text-white shadow-xl transform scale-[1.02] font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered && mode === 'practice'}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between text-base md:text-lg ${style}`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <span className="pr-2">{opt}</span>
                  {mode === 'practice' && showExplanation && idx === question.correctAnswer && <CheckCircle size={20} className="text-emerald-600 min-w-[20px]"/>}
                  {mode === 'practice' && showExplanation && answers[currentQuestionIdx] === idx && idx !== question.correctAnswer && <XCircle size={20} className="text-red-600 min-w-[20px]"/>}
                </button>
              );
            })}
          </div>

          {mode === 'practice' && showExplanation && (
            <div className={`p-6 border-t ${isCorrect ? 'bg-emerald-50/50' : 'bg-red-50/50'} animate-in slide-in-from-bottom-2`}>
               <div className="flex gap-3">
                 <div className={`mt-0.5 p-1 rounded-full h-fit ${isCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'}`}>
                   {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                 </div>
                 <div>
                   <h4 className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                     {isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}
                   </h4>
                   <p className="text-sm text-black leading-relaxed">{question.explanation}</p>
                   {question.category === 'Inglés' && <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1"><Globe size={10} /> Explicación en español.</p>}
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl mt-4 flex justify-end pb-4">
          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 
              ${isAnswered ? 'bg-slate-900 hover:bg-slate-800 hover:translate-x-1' : 'bg-slate-300 cursor-not-allowed'}
            `}
          >
            {currentQuestionIdx === currentQuizQuestions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const percentage = Math.round((score / currentQuizQuestions.length) * 100);
    const passed = percentage >= 60;
    const [showConfetti, setShowConfetti] = useState(passed);
    
    // Circular progress ring calculations
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (percentage / 100) * circumference;

    useEffect(() => {
      if (passed) {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
      }
    }, [passed]);

    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #ddd6fe 100%)' }}>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="glass-card p-10 rounded-3xl text-center max-w-lg w-full relative overflow-hidden animate-bounce-in" style={{ boxShadow: 'var(--shadow-2xl)' }}>
          <div className={`absolute top-0 left-0 w-full h-4 ${passed ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500' : 'bg-gradient-to-r from-red-400 via-orange-500 to-rose-500'}`}></div>
          
          {/* Circular Progress Ring */}
          <div className="mb-8 inline-flex relative">
            {passed && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce-in" style={{ animationDelay: '0.5s' }}>
                <Award size={64} className="text-amber-400" style={{ filter: 'drop-shadow(0 8px 16px rgba(251, 191, 36, 0.5))' }} />
              </div>
            )}
            <svg className="transform -rotate-90" width="220" height="220">
              {/* Background circle */}
              <circle
                cx="110"
                cy="110"
                r="90"
                stroke={passed ? "#d1fae5" : "#fee2e2"}
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="110"
                cy="110"
                r="90"
                stroke={passed ? "url(#successGradient)" : "url(#dangerGradient)"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
              />
              <defs>
                <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            {/* Score in the center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-black text-black mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {score}
              </div>
              <div className="text-xl text-slate-600 font-bold">/ {currentQuizQuestions.length}</div>
              <div className={`text-3xl font-black mt-1 ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
                {percentage}%
              </div>
            </div>
          </div>

          <div className={`inline-block px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg animate-bounce-in ${passed ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'}`} style={{ animationDelay: '0.3s' }}>
            {passed ? '✨ ¡APROBADO! ✨' : '📚 NECESITAS REPASAR'}
          </div>

          <p className="text-black text-base mb-8 leading-relaxed font-bold max-w-md mx-auto">
            {selectedCategory === 'All' && mode === 'practice'
              ? `Has completado el examen completo de 50 preguntas. Tu rendimiento general es del ${percentage}%.`
              : mode === 'exam' 
                ? `Has completado el simulacro oficial con el total de reactivos. Rendimiento: ${percentage}%.`
                : `Has completado la práctica de ${selectedCategory} con un ${percentage}% de acierto.`
            }
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => generateQuiz(selectedCategory, mode)} 
              className="w-full btn-premium btn-ripple py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 text-white hover:scale-[1.03] duration-300"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}
            >
              <RefreshCw size={22} strokeWidth={2.5} /> Repetir Prueba
            </button>
            <button 
              onClick={() => setScreen('menu')} 
              className="w-full py-5 bg-white/90 backdrop-blur border-2 border-slate-300 text-black hover:border-slate-500 hover:bg-white rounded-2xl font-black text-lg transition-all hover:scale-[1.02] hover:shadow-lg duration-300"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {screen === 'menu' && <MenuScreen />}
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'results' && <ResultsScreen />}
    </>
  );
}
