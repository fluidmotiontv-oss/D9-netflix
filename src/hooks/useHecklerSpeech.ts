import { useState, useEffect, useCallback, useRef } from 'react';
import {
  HecklerPersonaId,
  HecklerPersonaConfig,
  getHecklerPersona,
  HECKLER_PERSONAS,
  HECKLER_PERSONA_LIST,
  loadBrowserVoices,
  speakHeckleWithPersona,
  auditionPersonaVoice,
  stopAllSpeech,
  SpeakPersonaOptions,
} from '../audio/hecklerPersonas';

export interface UseHecklerSpeechOptions {
  initialPersona?: HecklerPersonaId;
  defaultPitch?: number;
  defaultRate?: number;
  defaultVolume?: number;
}

export function useHecklerSpeech(options: UseHecklerSpeechOptions = {}) {
  const [selectedPersona, setSelectedPersona] = useState<HecklerPersonaId>(
    options.initialPersona || 'the_heckler'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferredVoiceUri, setPreferredVoiceUri] = useState<string>('');
  
  // Custom Fine-Tuning Multipliers (1.0 = Default persona calibration)
  const [pitchMultiplier, setPitchMultiplier] = useState<number>(options.defaultPitch ?? 1.0);
  const [rateMultiplier, setRateMultiplier] = useState<number>(options.defaultRate ?? 1.0);
  const [volume, setVolume] = useState<number>(options.defaultVolume ?? 1.0);

  const activePersonaConfig: HecklerPersonaConfig = getHecklerPersona(selectedPersona);

  // Load voices asynchronously on mount
  useEffect(() => {
    loadBrowserVoices().then((voices) => {
      setAvailableVoices(voices);
    });

    return () => {
      stopAllSpeech();
    };
  }, []);

  // Speak heckle text using the active or provided persona
  const speak = useCallback(
    (text: string, personaId?: HecklerPersonaId, customOpts?: SpeakPersonaOptions) => {
      const targetPersona = personaId || selectedPersona;
      setIsSpeaking(true);
      setCurrentlySpeakingText(text);

      const success = speakHeckleWithPersona(text, targetPersona, {
        pitchMultiplier,
        rateMultiplier,
        volume,
        preferredVoiceUri: customOpts?.preferredVoiceUri || preferredVoiceUri,
        onStart: () => {
          setIsSpeaking(true);
          customOpts?.onStart?.();
        },
        onEnd: () => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
          customOpts?.onEnd?.();
        },
        onError: (err) => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
          customOpts?.onError?.(err);
        },
        ...customOpts,
      });

      if (!success) {
        setIsSpeaking(false);
        setCurrentlySpeakingText(null);
      }
      return success;
    },
    [selectedPersona, pitchMultiplier, rateMultiplier, volume, preferredVoiceUri]
  );

  // Audition / preview a persona voice
  const audition = useCallback(
    (personaId?: HecklerPersonaId, samplePhrase?: string) => {
      const targetPersona = personaId || selectedPersona;
      setIsSpeaking(true);

      return auditionPersonaVoice(targetPersona, samplePhrase, {
        pitchMultiplier,
        rateMultiplier,
        volume,
        preferredVoiceUri,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
        },
      });
    },
    [selectedPersona, pitchMultiplier, rateMultiplier, volume, preferredVoiceUri]
  );

  // Stop active speech
  const stop = useCallback(() => {
    stopAllSpeech();
    setIsSpeaking(false);
    setCurrentlySpeakingText(null);
  }, []);

  return {
    selectedPersona,
    setSelectedPersona,
    activePersonaConfig,
    allPersonas: HECKLER_PERSONA_LIST,
    personaMap: HECKLER_PERSONAS,
    isSpeaking,
    currentlySpeakingText,
    currentSpeakingPhrase: currentlySpeakingText,
    isSpeechSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    availableVoices,
    preferredVoiceUri,
    setPreferredVoiceUri,
    pitchMultiplier,
    setPitchMultiplier,
    rateMultiplier,
    setRateMultiplier,
    volume,
    setVolume,
    speak,
    audition,
    stop,
  };
}
