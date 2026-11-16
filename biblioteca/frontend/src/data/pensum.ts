import type { CarreraId } from './tipos'

// PENSUM REAL de cada carrera (UCB Santa Cruz).
// El indice 0 es el semestre 1. La cantidad de semestres depende de la carrera.
export const PENSUM: Record<CarreraId, string[][]> = {
  // Malla curricular Mecatronica, gestion 2025 (10 semestres)
  mecatronica: [
    ['Probabilidad y Estadística I', 'Álgebra Lineal', 'Física I y Laboratorio', 'Introducción a la Ingeniería Mecatrónica', 'Pensamiento Crítico'],
    ['Cálculo I', 'Electricidad y Electromagnetismo y Laboratorio', 'Física II y Laboratorio', 'Tecnología de Materiales y Fabricación', 'Programación I'],
    ['Cálculo II', 'Mecanismos y Elementos de Máquina', 'Circuitos Electrónicos I', 'Programación Superior', 'Neumática e Hidráulica', 'Formación Humano Cristiana I'],
    ['Cálculo III', 'Ecuaciones Diferenciales Ordinarias', 'CAD, CAE y Prototipado', 'Circuitos Electrónicos II', 'Inteligencia Artificial', 'Señales y Sistemas', 'Metodología de la Investigación'],
    ['Procesos Avanzados de Manufactura', 'Circuitos Electrónicos III', 'Circuitos Digitales', 'Visión Computarizada', 'Modelado de Sistemas Dinámicos', 'Máquinas Eléctricas y Electrotecnia'],
    ['Taller Integrador Mecánico', 'Electrónica de Potencia y Energías', 'Sistemas Embebidos', 'Tecnologías Emergentes', 'Control Continuo y Discreto', 'Instrumentación y Normalización', 'Formación Humano Cristiana II'],
    ['Taller Integrador de Sistemas Embebidos', 'Control Avanzado', 'Autotrónica', 'Ingeniería de Mantenimiento', 'Robótica y Automatización Industrial', 'Epistemología'],
    ['Diseño Superior de Ingeniería', 'Robótica Móvil', 'Prácticas Pre Profesionales', 'Libre I'],
    ['Ética e Ingeniería Sustentable', 'Taller de Grado I', 'Libre II', 'Formación Humano Cristiana III'],
    ['Taller de Grado II'],
  ],
  // Plan de estudio Ingenieria de Software (9 semestres)
  software: [
    ['Cálculo I', 'Fundamentos en Ingeniería de Software', 'Introducción a la Programación', 'Escritura Académica', 'Álgebra Lineal', 'Física I y Laboratorio'],
    ['Cálculo II', 'Probabilidad y Estadística I', 'Estructuras Discretas', 'Programación I', 'Bases de Datos I', 'Antropología y Valores'],
    ['Metodología de la Investigación', 'Análisis Numérico', 'Estructuras de Datos', 'Programación II', 'Bases de Datos II', 'Metodologías Ágiles para Desarrollo de Software'],
    ['Interacción Humano-Computador', 'Arquitectura de Computadoras', 'Análisis de Algoritmos', 'Gráficos por Computador', 'Diseño de Software', 'Cristología y Biblia'],
    ['Arquitectura de Software', 'Software Quality Assurance I', 'Sistemas Operativos', 'Aplicaciones Web I', 'Taller de Diseño de Software I', 'Inteligencia Artificial'],
    ['Aplicaciones Móviles', 'Machine Learning', 'Criptografía y Ciberseguridad', 'Software Quality Assurance II', 'Libre 1', 'Doctrina Social de la Iglesia'],
    ['Gestión de Proyectos en Ingeniería de Software', 'Libre 2', 'Computación en la Nube', 'Taller de Diseño de Software II', 'Aplicaciones Web II', 'Plataformas Móviles'],
    ['Prácticas Pre Profesionales', 'Taller de Grado I', 'Libre 3'],
    ['Taller de Grado II'],
  ],
  // Plan de estudio Ingenieria en Inteligencia Artificial (8 semestres segun la duracion del PDF;
  // el PDF lista "Semestre 8" dos veces y aqui se unieron en uno solo)
  ia: [
    ['Cálculo I', 'Introducción a la Programación', 'Pensamiento Crítico', 'Fundamentos en Ingeniería de Software', 'Álgebra Lineal'],
    ['Cálculo II', 'Probabilidad y Estadística I', 'Estructuras Discretas', 'Programación I', 'Bases de Datos I', 'Antropología y Valores'],
    ['Metodología de la Investigación', 'Conocimiento y Razonamiento Automático', 'Estructuras de Datos', 'Adquisición, Análisis y Procesamiento de Datos', 'Metodologías Ágiles para Desarrollo de Software', 'Optimización'],
    ['Inteligencia Artificial', 'Diseño de Software', 'Análisis de Algoritmos', 'Arquitectura de Computadoras', 'Interacción Humano-Computador'],
    ['Computación en la Nube', 'Aprendizaje Profundo y Redes Neuronales', 'Procesamiento del Lenguaje Natural', 'Machine Learning', 'Cristología y Biblia'],
    ['Ingeniería de Datos a Gran Escala', 'Visión por Computadora', 'Aprendizaje por Refuerzo y no Supervisado', 'Aspectos Éticos y Sociales de la Inteligencia Artificial', 'Computación Concurrente, Paralela y Distribuida'],
    ['Gestión de Proyectos en Ingeniería de Software', 'Internet de las Cosas', 'Taller de Inteligencia Artificial', 'Doctrina Social de la Iglesia', 'Herramientas de Desarrollo y Despliegue en IA', 'Libre I'],
    ['Prácticas Pre Profesionales', 'Libre II', 'Taller de Grado I', 'Taller de Grado II'],
  ],
}

export function semestresDe(carreraId: CarreraId): number[] {
  return PENSUM[carreraId].map((_, i) => i + 1)
}

export function materiasDe(carreraId: CarreraId, semestre: number): string[] {
  return PENSUM[carreraId][semestre - 1] ?? []
}
