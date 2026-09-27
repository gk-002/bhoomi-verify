import React, { createContext, useContext, useState } from 'react';
import { CaseDossier, FieldCorrectionRecord, OfficerActionType, AuthUser } from '../types';
import { SCENARIO_A, SCENARIO_B, SCENARIO_C, MOCK_CASES } from '../data/mockScenarios';
import { caseService } from '../api/services';

interface CaseContextType {
  currentCase: CaseDossier;
  availableCases: CaseDossier[];
  selectCase: (caseId: string) => void;
  // Backward compatibility
  currentScenario: 'A' | 'B' | 'C';
  setScenario: (scenario: 'A' | 'B' | 'C') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'OFFICER' | 'CITIZEN';
  setUserRole: (role: 'OFFICER' | 'CITIZEN') => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: 'OFFICER' | 'CITIZEN', userInfo?: Partial<AuthUser>) => void;
  logout: () => void;
  selectedFieldHighlight: string | null;
  setSelectedFieldHighlight: (fieldKey: string | null) => void;
  submitCorrection: (fieldName: string, fieldLabel: string, oldValue: string, newValue: string, reason: string, officerName: string) => Promise<void>;
  submitDecision: (action: OfficerActionType, remarks: string, officerName: string, officerPin: string) => Promise<void>;
  quickOfficerAction: (action: 'INSPECT' | 'FLAG' | 'CLEAR') => Promise<void>;
  isProcessing: boolean;
  notification: { message: string; type: 'success' | 'warning' | 'error' | 'info' } | null;
  dismissNotification: () => void;
  
  // API Key & Document Upload
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  uploadAndProcessDocument: (file: File) => Promise<CaseDossier>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableCases, setAvailableCases] = useState<CaseDossier[]>(MOCK_CASES);
  const [currentCase, setCurrentCase] = useState<CaseDossier>(SCENARIO_A);
  const [currentScenario, setCurrentScenarioState] = useState<'A' | 'B' | 'C'>('A');
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'gis';
    }
    return 'gis';
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('bv_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [userRole, setUserRoleState] = useState<'OFFICER' | 'CITIZEN'>(() => {
    try {
      const stored = localStorage.getItem('bv_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role) return parsed.role;
      }
    } catch {}
    return 'OFFICER';
  });

  const setUserRole = (role: 'OFFICER' | 'CITIZEN') => {
    setUserRoleState(role);
    if (currentUser) {
      const updated: AuthUser = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('bv_current_user', JSON.stringify(updated));
    }
  };

  const login = (role: 'OFFICER' | 'CITIZEN', userInfo?: Partial<AuthUser>) => {
    const defaultUser: AuthUser = role === 'OFFICER' ? {
      id: 'officer-1',
      username: 'officer',
      fullName: 'Smt. Smita Deshpande',
      role: 'OFFICER',
      designation: 'Tahsildar & Revenue Adjudicator'
    } : {
      id: 'citizen-1',
      username: 'citizen',
      fullName: userInfo?.fullName || 'Balasaheb Tukaram Pawar',
      role: 'CITIZEN',
      designation: 'Landholder / Applicant',
      caseNumber: userInfo?.caseNumber || 'BV-2026-MH-4201'
    };

    const user: AuthUser = { ...defaultUser, ...userInfo, role };
    setCurrentUser(user);
    setUserRoleState(role);
    localStorage.setItem('bv_current_user', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('bv_auth_token', user.token);
    }

    if (role === 'CITIZEN' && user.caseNumber) {
      const match = availableCases.find(c => c.case_number === user.caseNumber);
      if (match) {
        setCurrentCase(match);
      }
    }

    setNotification({
      message: `Signed in successfully as ${user.fullName} (${role === 'OFFICER' ? 'Revenue Officer' : 'Citizen Landholder'}).`,
      type: 'success'
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bv_current_user');
    localStorage.removeItem('bv_auth_token');
    setNotification({
      message: 'Signed out securely from BhoomiVerify portal.',
      type: 'info'
    });
  };

  const [selectedFieldHighlight, setSelectedFieldHighlight] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // API Key State (stored in localStorage)
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('bv_gemini_api_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('bv_gemini_api_key', key);
    setNotification({
      message: key ? 'Land Record Vision API Key saved & activated.' : 'API Key cleared. Using local DILRMP parser.',
      type: 'info'
    });
  };

  const selectCase = (caseId: string) => {
    const found = availableCases.find(c => c.id === caseId || c.case_number === caseId);
    if (found) {
      setCurrentCase({ ...found });
      const letter = found.id.includes('b') ? 'B' : found.id.includes('c') ? 'C' : 'A';
      setCurrentScenarioState(letter as any);
      setNotification({
        message: `Loaded Registry File: Gat / Survey ${found.survey_number}, ${found.village}, Dist. ${found.district}`,
        type: found.risk_band === 'LOW' ? 'success' : found.risk_band === 'HIGH' ? 'warning' : 'error'
      });
    }
  };

  const setScenario = (scenario: 'A' | 'B' | 'C') => {
    setCurrentScenarioState(scenario);
    if (scenario === 'A') selectCase('case-a-4201');
    else if (scenario === 'B') selectCase('case-b-1080');
    else selectCase('case-c-760');
  };

  const dismissNotification = () => setNotification(null);

  const uploadAndProcessDocument = async (file: File): Promise<CaseDossier> => {
    setIsProcessing(true);
    try {
      const recognized = await caseService.uploadAndAnalyzeRoR(file, apiKey);
      
      // Prepend to available cases and make current
      setAvailableCases(prev => [recognized, ...prev]);
      setCurrentCase(recognized);

      const hasDate = recognized.canonical_record.mutations.some(m => !!m.date);

      setNotification({
        message: `Recognized ${recognized.state_name} (${recognized.canonical_record.document_type}) • Survey ${recognized.survey_number}. Dates verified strictly (Zero Hallucination: ${hasDate ? 'Explicit Date Detected' : 'Unstated Date Preserved as Null'}).`,
        type: 'success'
      });

      return recognized;
    } catch (err: any) {
      setNotification({
        message: err?.message || 'Failed to process document.',
        type: 'error'
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const submitCorrection = async (
    fieldName: string,
    fieldLabel: string,
    oldValue: string,
    newValue: string,
    reason: string,
    officerName: string
  ) => {
    setIsProcessing(true);
    try {
      const correction = await caseService.submitFieldCorrection({
        caseNumber: currentCase.case_number,
        fieldName,
        fieldLabel,
        oldValue,
        newValue,
        reason,
        officerName
      });

      setCurrentCase(prev => ({
        ...prev,
        corrections: [correction, ...prev.corrections],
        extracted_fields: prev.extracted_fields.map(f => 
          f.key === fieldName ? { ...f, normalizedValue: newValue, status: 'MANUALLY_EDITED' } : f
        )
      }));

      setNotification({
        message: `Field '${fieldLabel}' updated successfully with audit trail entry.`,
        type: 'success'
      });
    } catch (err: any) {
      setNotification({
        message: err?.message || 'Failed to submit correction.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const submitDecision = async (
    action: OfficerActionType,
    remarks: string,
    officerName: string,
    officerPin: string
  ) => {
    setIsProcessing(true);
    try {
      const res = await caseService.submitOfficerDecision({
        caseNumber: currentCase.case_number,
        action,
        remarks,
        officerName,
        officerPin
      });

      setCurrentCase(prev => ({
        ...prev,
        status: res.newStatus as any
      }));

      setNotification({
        message: res.message,
        type: (action === 'APPROVE' || action === 'CLEAR') ? 'success' : (action === 'FLAG_FOR_INSPECTION' || action === 'INSPECT' || action === 'FLAG') ? 'warning' : 'error'
      });
    } catch (err: any) {
      setNotification({
        message: err?.message || 'Failed to execute officer action.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickOfficerAction = async (action: 'INSPECT' | 'FLAG' | 'CLEAR') => {
    let remarks = '';
    if (action === 'INSPECT') {
      remarks = 'Order issued under Section 135-D for physical ground boundary inspection & Mojani survey.';
    } else if (action === 'FLAG') {
      remarks = 'Active discrepancy flagged: Cadastral boundary dispute / unauthorized subdivision detected.';
    } else {
      remarks = 'All discrepancies investigated and cleared. Title authenticated & approved for digital certification.';
    }
    await submitDecision(action, remarks, 'Smt. Smita Deshpande (Tahsildar)', '24018');
  };

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        availableCases,
        selectCase,
        currentScenario,
        setScenario,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        selectedFieldHighlight,
        setSelectedFieldHighlight,
        submitCorrection,
        submitDecision,
        quickOfficerAction,
        isProcessing,
        notification,
        dismissNotification,
        apiKey,
        setApiKey,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        uploadAndProcessDocument
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
