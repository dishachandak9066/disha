'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LanguageCode = 'en' | 'es' | 'fr' | 'hi';

interface Dictionary {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
    hi: string;
  };
}

// UI Dictionary for static elements
const uiDictionary: Dictionary = {
  menu: { en: 'Menu', es: 'Menú', fr: 'Menu', hi: 'मेनू' },
  discover: { en: 'Discover', es: 'Descubrir', fr: 'Découvrir', hi: 'खोजें' },
  personal: { en: 'Personal', es: 'Personal', fr: 'Personnel', hi: 'व्यक्तिगत' },
  
  home: { en: 'Home', es: 'Inicio', fr: 'Accueil', hi: 'होम' },
  my_library: { en: 'My Library', es: 'Mi Biblioteca', fr: 'Ma Bibliothèque', hi: 'मेरी लाइब्रेरी' },
  audiobooks: { en: 'Audiobooks', es: 'Audiolibros', fr: 'Livres Audio', hi: 'ऑडियोबुक्स' },
  
  for_you: { en: 'For You', es: 'Para Ti', fr: 'Pour Vous', hi: 'आपके लिए' },
  trending: { en: 'Trending', es: 'Tendencias', fr: 'Tendances', hi: 'ट्रेंडिंग' },
  ai_summaries: { en: 'AI Summaries', es: 'Resúmenes IA', fr: 'Résumés IA', hi: 'AI सारांश' },
  
  favorites: { en: 'Favorites', es: 'Favoritos', fr: 'Favoris', hi: 'पसंदीदा' },
  history: { en: 'History', es: 'Historial', fr: 'Historique', hi: 'इतिहास' },
  
  profile: { en: 'Profile', es: 'Perfil', fr: 'Profil', hi: 'प्रोफ़ाइल' },
  settings: { en: 'Settings', es: 'Ajustes', fr: 'Paramètres', hi: 'सेटिंग्स' },
  sign_out: { en: 'Sign Out', es: 'Cerrar Sesión', fr: 'Se Déconnecter', hi: 'साइन आउट' },

  // WelcomeBanner
  good_morning: { en: 'Good morning', es: 'Buenos días', fr: 'Bonjour', hi: 'सुप्रभात' },
  good_afternoon: { en: 'Good afternoon', es: 'Buenas tardes', fr: 'Bon après-midi', hi: 'नमस्कार' },
  good_evening: { en: 'Good evening', es: 'Buenas noches', fr: 'Bonsoir', hi: 'शुभ संध्या' },
  ai_ready: { en: 'AI-Powered Recommendations Ready', es: 'Recomendaciones impulsadas por IA listas', fr: 'Recommandations alimentées par l\'IA prêtes', hi: 'AI-संचालित सिफारिशें तैयार हैं' },
  reading_streak: { en: "You're on a 14-day reading streak! Dive back into your universe of knowledge.", es: '¡Tienes una racha de lectura de 14 días! Vuelve a sumergirte en tu universo de conocimiento.', fr: 'Vous êtes sur une série de 14 jours de lecture ! Replongez dans votre univers de connaissances.', hi: 'आप 14 दिन की पढ़ने की लकीर पर हैं! ज्ञान के अपने ब्रह्मांड में वापस गोता लगाएँ।' },

  // ContinueReading
  continue_reading: { en: 'Continue Reading', es: 'Continuar Leyendo', fr: 'Continuer la Lecture', hi: 'पढ़ना जारी रखें' },
  progress: { en: 'Progress', es: 'Progreso', fr: 'Progrès', hi: 'प्रगति' },
  left: { en: 'left', es: 'restante', fr: 'restant', hi: 'बाकी' },
  resume_reading: { en: 'Resume Reading', es: 'Reanudar Lectura', fr: 'Reprendre la Lecture', hi: 'पढ़ना फिर से शुरू करें' },
  details: { en: 'Details', es: 'Detalles', fr: 'Détails', hi: 'विवरण' },

  // LibraryBookCard
  read: { en: 'Read', es: 'Leer', fr: 'Lire', hi: 'पढ़ें' },
  listen: { en: 'Listen', es: 'Escuchar', fr: 'Écouter', hi: 'सुनें' },
  added: { en: 'Added', es: 'Añadido', fr: 'Ajouté', hi: 'जोड़ा गया' },
  completed: { en: 'Completed', es: 'Completado', fr: 'Terminé', hi: 'पूरा हुआ' },
  continue: { en: 'Continue', es: 'Continuar', fr: 'Continuer', hi: 'जारी रखें' },
  read_again: { en: 'Read Again', es: 'Leer de nuevo', fr: 'Relire', hi: 'फिर से पढ़ें' },

  // Library
  manage_books: { en: 'Manage and organize your saved books', es: 'Administra y organiza tus libros guardados', fr: 'Gérez et organisez vos livres enregistrés', hi: 'अपनी सहेजी गई पुस्तकों का प्रबंधन और आयोजन करें' },
  search_placeholder: { en: 'Search titles, authors...', es: 'Buscar títulos, autores...', fr: 'Rechercher des titres, auteurs...', hi: 'शीर्षक, लेखक खोजें...' },
  recently_added: { en: 'Recently Added', es: 'Añadido Recientemente', fr: 'Ajouté Récemment', hi: 'हाल ही में जोड़ा गया' },
  title_az: { en: 'Title (A-Z)', es: 'Título (A-Z)', fr: 'Titre (A-Z)', hi: 'शीर्षक (A-Z)' },
  reading_progress: { en: 'Reading Progress', es: 'Progreso de Lectura', fr: 'Progrès de Lecture', hi: 'पढ़ने की प्रगति' },
  no_books: { en: 'No books found', es: 'No se encontraron libros', fr: 'Aucun livre trouvé', hi: 'कोई किताब नहीं मिली' },
  adjust_filters: { en: 'Try adjusting your search or category filters.', es: 'Intenta ajustar tus filtros de búsqueda o categoría.', fr: 'Essayez d\'ajuster votre recherche ou vos filtres de catégorie.', hi: 'अपनी खोज या श्रेणी फ़िल्टर समायोजित करने का प्रयास करें।' },
  search_books: { en: 'Search books or authors... (Press Enter to search)', es: 'Busca libros o autores... (Presiona Enter para buscar)', fr: 'Recherchez des livres ou des auteurs... (Appuyez sur Entrée pour rechercher)', hi: 'पुस्तकें या लेखक खोजें... (खोजने के लिए एंटर दबाएँ)' },
  no_books_found: { en: 'No books found', es: 'No se encontraron libros', fr: 'Aucun livre trouvé', hi: 'कोई किताब नहीं मिली' },
  adjust_search_or_category: { en: 'We couldn\'t find any books matching your criteria. Try adjusting your search query or category.', es: 'No pudimos encontrar libros que coincidan con tus criterios. Intenta ajustar tu búsqueda o categoría.', fr: 'Nous n\'avons trouvé aucun livre correspondant à vos critères. Essayez d\'ajuster votre recherche ou votre catégorie.', hi: 'हम आपकी मापदंडों से मिलती कोई किताब नहीं ढूंढ पाए। अपनी खोज या श्रेणी समायोजित करने का प्रयास करें।' },
  loading_library: { en: 'Loading library...', es: 'Cargando biblioteca...', fr: 'Chargement de la bibliothèque...', hi: 'लाइब्रेरी लोड हो रही है...' },
  load_more_books: { en: 'Load More Books', es: 'Cargar más libros', fr: 'Charger plus de livres', hi: 'और किताबें लोड करें' },
  read_book: { en: 'Read Book', es: 'Leer Libro', fr: 'Lire le livre', hi: 'किताब पढ़ें' },
  epub: { en: 'EPUB', es: 'EPUB', fr: 'EPUB', hi: 'EPUB' },
  downloads: { en: 'downloads', es: 'descargas', fr: 'téléchargements', hi: 'डाउनलोड' },
  no_cover: { en: 'No Cover', es: 'Sin Portada', fr: 'Pas de couverture', hi: 'कोई कवर नहीं' },
  category_all: { en: 'All', es: 'Todos', fr: 'Tous', hi: 'सभी' },
  category_fiction: { en: 'Fiction', es: 'Ficción', fr: 'Fiction', hi: 'कथा' },
  category_scifi: { en: 'Sci-Fi', es: 'Ciencia Ficción', fr: 'Science-Fiction', hi: 'साइंस फिक्शन' },
  category_business: { en: 'Business', es: 'Negocios', fr: 'Affaires', hi: 'व्यवसाय' },
  category_self_help: { en: 'Self-Help', es: 'Autoayuda', fr: 'Développement personnel', hi: 'स्व-सहायता' },

  // Audiobooks
  audiobooks_desc: { en: 'Immersive storytelling for your ears', es: 'Narración inmersiva para tus oídos', fr: 'Une narration immersive pour vos oreilles', hi: 'आपके कानों के लिए इमर्सिव कहानी' },
  exclusive_original: { en: 'Exclusive Original', es: 'Original Exclusivo', fr: 'Original Exclusif', hi: 'विशेष मूल' },
  ai_revolution: { en: 'The AI Revolution', es: 'La Revolución de la IA', fr: 'La Révolution de l\'IA', hi: 'AI क्रांति' },
  ai_revolution_desc: { en: 'Dive deep into the history and future of artificial intelligence with this exclusive full-cast audiobook production. Narrated by top voice talents.', es: 'Sumérgete en la historia y el futuro de la inteligencia artificial con esta exclusiva producción de audiolibro con elenco completo. Narrado por los mejores talentos de voz.', fr: 'Plongez dans l\'histoire et l\'avenir de l\'intelligence artificielle avec cette production audio exclusive à distribution complète. Raconté par les meilleurs talents vocaux.', hi: 'इस विशेष फुल-कास्ट ऑडियोबुक उत्पादन के साथ कृत्रिम बुद्धिमत्ता के इतिहास और भविष्य में गहराई से गोता लगाएँ। शीर्ष आवाज प्रतिभाओं द्वारा सुनाया गया।' },
  start_listening: { en: 'Start Listening', es: 'Empezar a Escuchar', fr: 'Commencer l\'Écoute', hi: 'सुनना शुरू करें' },
  pause_listening: { en: 'Pause Listening', es: 'Pausar Escucha', fr: 'Mettre en Pause', hi: 'सुनना रोकें' },
  view_details: { en: 'View Details', es: 'Ver Detalles', fr: 'Voir les Détails', hi: 'विवरण देखें' },
  jump_back_in: { en: 'Jump Back In', es: 'Vuelve a Saltar', fr: 'Reprendre', hi: 'वापस कूदें' },
  trending_audiobooks: { en: 'Trending Audiobooks', es: 'Audiolibros en Tendencia', fr: 'Livres Audio Tendances', hi: 'ट्रेंडिंग ऑडियोबुक्स' },

  // For You
  curated_by_ai: { en: 'Curated by AI', es: 'Seleccionado por IA', fr: 'Sélectionné par l\'IA', hi: 'AI द्वारा क्यूरेटेड' },
  discover_next: { en: 'Discover Your Next Obsession', es: 'Descubre Tu Próxima Obsesión', fr: 'Découvrez Votre Prochaine Obsession', hi: 'अपना अगला जुनून खोजें' },
  ai_analyzed: { en: 'Our AI has analyzed your reading patterns, favorite genres, and pacing to handpick these recommendations just for you.', es: 'Nuestra IA ha analizado tus patrones de lectura, géneros favoritos y ritmo para seleccionar estas recomendaciones solo para ti.', fr: 'Notre IA a analysé vos habitudes de lecture, genres préférés et rythme pour choisir ces recommandations juste pour vous.', hi: 'हमारे AI ने आपके पढ़ने के पैटर्न, पसंदीदा शैलियों और गति का विश्लेषण किया है ताकि विशेष रूप से आपके लिए ये सिफारिशें चुनी जा सकें।' },
  explore_ai_picks: { en: 'Explore AI Picks', es: 'Explorar Selecciones de IA', fr: 'Explorer les Choix de l\'IA', hi: 'AI पिक्स एक्सप्लोर करें' },
  top_picks: { en: 'Top Picks For You', es: 'Mejores Selecciones Para Ti', fr: 'Meilleurs Choix Pour Vous', hi: 'आपके लिए शीर्ष पिक्स' },
  trending_in: { en: 'Trending in Sci-Fi', es: 'Tendencias en Ciencia Ficción', fr: 'Tendances en Science-Fiction', hi: 'विज्ञान-कथा में ट्रेंडिंग' },
  because_you_read: { en: 'Because you read "Dune"', es: 'Porque leíste "Dune"', fr: 'Parce que vous avez lu "Dune"', hi: '"Dune" पढ़ने के कारण' },
  failed_recommendations: { en: 'Failed to load recommendations.', es: 'Error al cargar recomendaciones.', fr: 'Échec du chargement des recommandations.', hi: 'सिफारिशें लोड करने में विफल।' },
  ai_thinking: { en: 'AI is thinking...', es: 'La IA está pensando...', fr: 'L\'IA réfléchit...', hi: 'AI सोच रहा है...' },
  match: { en: 'Match', es: 'Coincidencia', fr: 'Correspondance', hi: 'मैच' },

  // Trending
  top_charts: { en: 'Top Charts', es: 'Mejores Listas', fr: 'Palmarès', hi: 'टॉप चार्ट्स' },
  trending_now: { en: 'Trending Now', es: 'Tendencias Ahora', fr: 'Tendances Actuelles', hi: 'अभी ट्रेंडिंग' },
  discover_everyone: { en: 'Discover what everyone is reading. These are the hottest books and audiobooks captivating the READ-E-VERSE community today.', es: 'Descubre lo que todos están leyendo. Estos son los libros y audiolibros más populares que cautivan a la comunidad de READ-E-VERSE hoy.', fr: 'Découvrez ce que tout le monde lit. Ce sont les livres et audiolivres les plus populaires qui captivent la communauté READ-E-VERSE aujourd\'hui.', hi: 'खोजें कि हर कोई क्या पढ़ रहा है। ये आज READ-E-VERSE समुदाय को मंत्रमुग्ध करने वाली सबसे हॉट किताबें और ऑडियोबुक्स हैं।' },
  hot: { en: 'Hot', es: 'Popular', fr: 'Populaire', hi: 'हॉट' },
  no_trending: { en: 'No trending items found right now.', es: 'No se encontraron artículos en tendencia en este momento.', fr: 'Aucun article tendance trouvé pour le moment.', hi: 'अभी कोई ट्रेंडिंग आइटम नहीं मिला।' }
};

// Mock translations for books (to simulate AI translation of metadata)
const mockBookTranslations: Record<string, Record<LanguageCode, string>> = {
  'The Midnight Library': {
    en: 'The Midnight Library',
    es: 'La Biblioteca de la Medianoche',
    fr: 'La Bibliothèque de Minuit',
    hi: 'द मिडनाइट लाइब्रेरी'
  },
  'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.': {
    en: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    es: 'Entre la vida y la muerte hay una biblioteca, y dentro de esa biblioteca las estanterías se extienden hasta el infinito. Cada libro ofrece la oportunidad de probar otra vida que podrías haber vivido.',
    fr: 'Entre la vie et la mort, il y a une bibliothèque, et dans cette bibliothèque, les rayonnages s’étendent à l’infini. Chaque livre offre la possibilité d’essayer une autre vie que vous auriez pu vivre.',
    hi: 'जीवन और मृत्यु के बीच एक पुस्तकालय है, और उस पुस्तकालय के भीतर शेल्फ अनंत तक चले जाते हैं। हर किताब आपको एक अन्य जीवन आजमाने का मौका देती है जो आप जी सकते थे।'
  },
  'Project Hail Mary': {
    en: 'Project Hail Mary',
    es: 'Proyecto Hail Mary',
    fr: 'Projet Hail Mary',
    hi: 'प्रोजेक्ट हेल मेरी'
  },
  'Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level event.': {
    en: 'Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level event.',
    es: 'Ryland Grace es el único superviviente en una misión desesperada y de última oportunidad para salvar a la humanidad de un evento de extinción.',
    fr: 'Ryland Grace est le seul survivant d’une mission désespérée et de dernière chance pour sauver l’humanité d’un événement d’extinction.',
    hi: 'राइलैंड ग्रेस मानवता को विलुप्ति-स्तरीय घटना से बचाने के लिए एक हताश अंतिम प्रयास मिशन में एकमात्र जीवित व्यक्ति है।'
  },
  'Zero to One': {
    en: 'Zero to One',
    es: 'De Cero a Uno',
    fr: 'De Zéro à Un',
    hi: 'ज़ीरो टू वन'
  },
  'Notes on Startups, or How to Build the Future. Zero to One presents at once an optimistic view of the future of progress and a new way of thinking about innovation.': {
    en: 'Notes on Startups, or How to Build the Future. Zero to One presents at once an optimistic view of the future of progress and a new way of thinking about innovation.',
    es: 'Notas sobre startups, o cómo construir el futuro. De Cero a Uno presenta una visión optimista del futuro del progreso y una nueva forma de pensar sobre la innovación.',
    fr: 'Notes sur les startups, ou comment construire l’avenir. De Zéro à Un présente à la fois une vision optimiste de l’avenir du progrès et une nouvelle façon de penser l’innovation.',
    hi: 'स्टार्टअप पर नोट्स, या भविष्य कैसे बनाएं। ज़ीरो टू वन एक बार में प्रगति के भविष्य का एक आशावादी दृष्टिकोण और नवाचार के बारे में सोचने का एक नया तरीका प्रस्तुत करता है।'
  },
  'Atomic Habits': {
    en: 'Atomic Habits',
    es: 'Hábitos Atómicos',
    fr: 'Un Rien Peut Tout Changer',
    hi: 'एटॉमिक हैबिट्स'
  },
  'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny Changes, Remarkable Results.': {
    en: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny Changes, Remarkable Results.',
    es: 'Una forma fácil y probada de construir buenos hábitos y romper los malos. Cambios pequeños, resultados notables.',
    fr: 'Une façon facile et éprouvée de créer de bonnes habitudes et de briser les mauvaises. Petits changements, résultats remarquables.',
    hi: 'अच्छी आदतें बनाने और बुरी आदतें तोड़ने का एक आसान और सिद्ध तरीका। छोटे बदलाव, असाधारण परिणाम।'
  },
  'Dune': {
    en: 'Dune',
    es: 'Dune',
    fr: 'Dune',
    hi: 'ड्यून'
  },
  'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad\'Dib.': {
    en: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad\'Dib.',
    es: 'Ambientada en el planeta desértico Arrakis, Dune es la historia del niño Paul Atreides, quien se convertiría en el misterioso hombre conocido como Muad\'Dib.',
    fr: 'Situé sur la planète désertique Arrakis, Dune est l’histoire du garçon Paul Atréides, qui deviendrait l’homme mystérieux connu sous le nom de Muad\'Dib.',
    hi: 'रेगिस्तानी ग्रह अराकिस पर सनी, ड्यून उस लड़के पॉल अत्रेइडिस की कहानी है, जो मुआद\'दीब के नाम से जाने जाने वाला रहस्यमयी व्यक्ति बन जाएगा।'
  },
  'Sapiens': {
    en: 'Sapiens',
    es: 'Sapiens',
    fr: 'Sapiens',
    hi: 'सैपियंस'
  },
  'A Brief History of Humankind. Sapiens tackles the biggest questions of history and of the modern world, written in a vivid language.': {
    en: 'A Brief History of Humankind. Sapiens tackles the biggest questions of history and of the modern world, written in a vivid language.',
    es: 'Una breve historia de la humanidad. Sapiens aborda las mayores preguntas de la historia y del mundo moderno, escrito en un lenguaje vívido.',
    fr: 'Une brève histoire de l’humanité. Sapiens aborde les plus grandes questions de l’histoire et du monde moderne, écrit dans un langage vivant.',
    hi: 'मानवता का एक संक्षिप्त इतिहास। सैपियंस इतिहास और आधुनिक दुनिया के सबसे बड़े सवालों को जीवंत भाषा में संबोधित करता है।'
  },
  'Thinking, Fast and Slow': {
    en: 'Thinking, Fast and Slow',
    es: 'Pensar, rápido y despacio',
    fr: 'Système 1 / Système 2',
    hi: 'सोचना, तेज़ और धीमा'
  },
  'Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.': {
    en: 'Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    es: 'Daniel Kahneman, el renombrado psicólogo y ganador del Premio Nobel de Economía, nos lleva en un recorrido innovador por la mente y explica los dos sistemas que impulsan la forma en que pensamos.',
    fr: 'Daniel Kahneman, le psychologue renommé et lauréat du prix Nobel d’économie, nous emmène dans une visite révolutionnaire de l’esprit et explique les deux systèmes qui gouvernent notre pensée.',
    hi: 'प्रख्यात मनोवैज्ञानिक और अर्थशास्त्र में नोबेल पुरस्कार विजेता डैनियल कहलमन हमें दिमाग के एक पायोनियर दौरे पर ले जाते हैं और उन दो प्रणालियों को समझाते हैं जो हमारे सोचने के तरीके को चलाती हैं।'
  },
  'Deep Work': {
    en: 'Deep Work',
    es: 'Trabajo Profundo',
    fr: 'Deep Work',
    hi: 'डीप वर्क'
  },
  'Rules for Focused Success in a Distracted World. Deep work is the ability to focus without distraction on a cognitively demanding task.': {
    en: 'Rules for Focused Success in a Distracted World. Deep work is the ability to focus without distraction on a cognitively demanding task.',
    es: 'Reglas para el éxito enfocado en un mundo distraído. El trabajo profundo es la capacidad de concentrarse sin distracciones en una tarea cognitivamente exigente.',
    fr: 'Des règles pour réussir avec concentration dans un monde distrait. Le travail en profondeur est la capacité de se concentrer sans distraction sur une tâche cognitivement exigeante.',
    hi: 'एक ध्यान भरे विश्व में केंद्रित सफलता के नियम। डीप वर्क बिना ध्यान भंग के संज्ञानात्मक रूप से मांगलिक कार्य पर ध्यान केंद्रित करने की क्षमता है।'
  }
};

interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Sync translation function for UI elements
  const t = (key: string): string => {
    if (uiDictionary[key] && uiDictionary[key][language]) {
      return uiDictionary[key][language];
    }
    return key; // Fallback to the key itself if not found
  };

  // Async simulated AI translation for dynamic content (metadata)
  const translateText = async (text: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate network/AI delay
      setTimeout(() => {
        if (mockBookTranslations[text] && mockBookTranslations[text][language]) {
          resolve(mockBookTranslations[text][language]);
        } else {
          resolve(text); // Return original if no mock translation available
        }
      }, 500); // 500ms delay to simulate API
    });
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, translateText }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
