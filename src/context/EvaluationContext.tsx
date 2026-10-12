import React, { createContext, useContext, useState } from 'react';
import { RiskLevel } from '../components/RiskBadge';

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface EvaluationState {
  step: 'location' | 'assessment' | 'results';
  coordinates: Coordinates | null;
  spatialRisk: {
    hazardType: 'alluvium' | 'seismic' | 'landslide' | 'none';
    level: RiskLevel;
    description: string;
    inaigemZone?: string;
  } | null;
  structuralAnswers: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

interface EvaluationContextType {
  state: EvaluationState;
  setCoordinates: (coords: Coordinates) => void;
  setStep: (step: EvaluationState['step']) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setSpatialRisk: (risk: EvaluationState['spatialRisk']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: EvaluationState = {
  step: 'location',
  coordinates: null,
  spatialRisk: null,
  structuralAnswers: {},
  isLoading: false,
  error: null,
};

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EvaluationState>(initialState);

  const setCoordinates = (coords: Coordinates) => {
    setState((prev) => ({ ...prev, coordinates: coords, error: null }));
  };

  const setStep = (step: EvaluationState['step']) => {
    setState((prev) => ({ ...prev, step }));
  };

  const setAnswer = (questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      structuralAnswers: { ...prev.structuralAnswers, [questionId]: answer },
    }));
  };

  const setSpatialRisk = (risk: EvaluationState['spatialRisk']) => {
    setState((prev) => ({ ...prev, spatialRisk: risk }));
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <EvaluationContext.Provider
      value={{
        state,
        setCoordinates,
        setStep,
        setAnswer,
        setSpatialRisk,
        setLoading,
        setError,
        reset,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = (): EvaluationContextType => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation debe usarse dentro de un EvaluationProvider');
  }
  return context;
};
