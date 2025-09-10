import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export type Language = "english" | "italian";

export interface MeditationParams {
  duration: number;
  language: "english" | "italian";
  voice: string;
  backgroundMusic: boolean;
  showImages: boolean;
  showSubtitles: boolean;
  includeMantrasSanskrit: boolean;
}

export interface AppState {
  language: Language;
  meditationParams: MeditationParams;
  isAuthenticated: boolean;
  userLevel: "beginner" | "basic" | "intermediate" | "advanced";
}

const defaultMeditationParams: MeditationParams = {
  duration: 15,
  language: "english",
  voice: "marco",
  backgroundMusic: true,
  showImages: true,
  showSubtitles: false,
  includeMantrasSanskrit: true,
};

const defaultState: AppState = {
  language: "english",
  meditationParams: defaultMeditationParams,
  isAuthenticated: false,
  userLevel: "basic",
};

const translations = {
  english: {
    welcome: "Welcome back",
    readyToMeditate: "Ready for your meditation journey?",
    yourJourney: "Your Journey",
    totalSessions: "Total Sessions",
    hoursMediated: "Hours Meditated",
    currentStreak: "Current Streak",
    chooseMeditation: "Choose Your Meditation",
    creative: "Creative",
    creativeDesc: "Customize your meditation experience",
    iFeelSahaj: "I Feel Sahaj",
    iFeelSahajDesc: "Let the system choose for you",
    community: "Community",
    communityDesc: "Join shared meditation experiences",
    history: "History",
    historyDesc: "Replay your previous meditations",
    createMeditation: "Create Meditation",
    customizeExperience: "Customize your meditation experience",
    basicParameters: "Basic Parameters",
    duration: "Duration",
    language: "Language",
    voice: "Voice",
    randomVoice: "Random Voice",
    backgroundMusic: "Background Music",
    advancedParameters: "Advanced Parameters",
    showImages: "Show Images",
    showSubtitles: "Show Subtitles",
    includeMantrasSanskrit: "Include Mantras in Sanskrit",
    startMeditation: "Start Meditation",
    meditationHistory: "Meditation History",
    trackProgress: "Track your meditation progress",
    totalTime: "Total Time",
    avgRating: "Avg Rating",
    recentSessions: "Recent Sessions",
    completed: "Completed",
    incomplete: "Incomplete",
    notifications: "Notifications",
    downloadOnWifi: "Download on WiFi Only",
    preferences: "Preferences",
    account: "Account",
    accountSettings: "Account Settings",
    signOut: "Sign Out",
    meditationLevel: "Meditation Level",
    basicLevel: "Basic Level",
    levelDescription: "Continue your practice to unlock intermediate level meditations",
    toIntermediate: "to Intermediate",
  },
  italian: {
    welcome: "Bentornato",
    readyToMeditate: "Pronto per il tuo viaggio di meditazione?",
    yourJourney: "Il Tuo Percorso",
    totalSessions: "Sessioni Totali",
    hoursMediated: "Ore Meditate",
    currentStreak: "Serie Attuale",
    chooseMeditation: "Scegli la Tua Meditazione",
    creative: "Creativa",
    creativeDesc: "Personalizza la tua esperienza di meditazione",
    iFeelSahaj: "Mi Sento Sahaj",
    iFeelSahajDesc: "Lascia che il sistema scelga per te",
    community: "Comunità",
    communityDesc: "Unisciti alle esperienze di meditazione condivise",
    history: "Cronologia",
    historyDesc: "Riproduci le tue meditazioni precedenti",
    createMeditation: "Crea Meditazione",
    customizeExperience: "Personalizza la tua esperienza di meditazione",
    basicParameters: "Parametri Base",
    duration: "Durata",
    language: "Lingua",
    voice: "Voce",
    randomVoice: "Voce Casuale",
    backgroundMusic: "Musica di Sottofondo",
    advancedParameters: "Parametri Avanzati",
    showImages: "Mostra Immagini",
    showSubtitles: "Mostra Sottotitoli",
    includeMantrasSanskrit: "Includi Mantra in Sanscrito",
    startMeditation: "Inizia Meditazione",
    meditationHistory: "Cronologia Meditazioni",
    trackProgress: "Traccia i tuoi progressi di meditazione",
    totalTime: "Tempo Totale",
    avgRating: "Valutazione Media",
    recentSessions: "Sessioni Recenti",
    completed: "Completata",
    incomplete: "Incompleta",
    notifications: "Notifiche",
    downloadOnWifi: "Scarica solo su WiFi",
    preferences: "Preferenze",
    account: "Account",
    accountSettings: "Impostazioni Account",
    signOut: "Disconnetti",
    meditationLevel: "Livello di Meditazione",
    basicLevel: "Livello Base",
    levelDescription: "Continua la tua pratica per sbloccare le meditazioni di livello intermedio",
    toIntermediate: "a Intermedio",
  },
};

export const [MeditationAppProvider, useMeditationApp] = createContextHook(() => {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    loadStoredState();
  }, []);

  const loadStoredState = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem("app_language");
      const storedParams = await AsyncStorage.getItem("meditation_params");
      
      if (storedLanguage) {
        setState(prev => ({ ...prev, language: storedLanguage as Language }));
      }
      
      if (storedParams) {
        const params = JSON.parse(storedParams);
        setState(prev => ({ ...prev, meditationParams: params }));
      }
    } catch (error) {
      console.log("Error loading stored state:", error);
    }
  };

  const setLanguage = async (language: Language) => {
    setState(prev => ({ ...prev, language }));
    try {
      await AsyncStorage.setItem("app_language", language);
    } catch (error) {
      console.log("Error saving language:", error);
    }
  };

  const updateMeditationParams = async (params: Partial<MeditationParams>) => {
    const newParams = { ...state.meditationParams, ...params };
    setState(prev => ({ ...prev, meditationParams: newParams }));
    
    try {
      await AsyncStorage.setItem("meditation_params", JSON.stringify(newParams));
    } catch (error) {
      console.log("Error saving meditation params:", error);
    }
  };

  return {
    state,
    setState,
    setLanguage,
    updateMeditationParams,
    translations,
  };
});
