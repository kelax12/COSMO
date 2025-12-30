import React, { useState, useEffect } from 'react';
import { X, Target, TrendingUp, Save, AlertCircle, Plus, Minus, Clock } from 'lucide-react';
import { OKR, KeyResult, useTasks } from '../context/TaskContext';
import { DatePicker } from './ui/date-picker';

interface OKRModalProps {
  okr?: OKR;
  isOpen: boolean;
  onClose: () => void;
}

const OKRModal: React.FC<OKRModalProps> = ({ okr, isOpen, onClose }) => {
  const { updateOKR, addOKR, okrCategories: categories } = useTasks();
  
  // Form state with validation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    endDate: ''
  });
  
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (okr) {
        setFormData({
          title: okr.title,
          description: okr.description,
          category: okr.category,
          endDate: okr.endDate
        });
        setKeyResults([...okr.keyResults]);
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'personal',
          endDate: ''
        });
        setKeyResults([
          {
            id: `kr-${Date.now()}-1`,
            title: '',
            currentValue: 0,
            targetValue: 10,
            unit: '',
            completed: false,
            estimatedTime: 30
          }
        ]);
      }
      setHasChanges(false);
      setErrors({});
    }
  }, [isOpen, okr]);

  // Track changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (okr) {
      const hasFormChanges = 
        formData.title !== okr.title ||
        formData.description !== okr.description ||
        formData.category !== okr.category ||
        formData.endDate !== okr.endDate ||
        formData.estimatedTime !== okr.estimatedTime ||
        JSON.stringify(keyResults) !== JSON.stringify(okr.keyResults);
      
      setHasChanges(hasFormChanges);
    } else {
      setHasChanges(formData.title !== '' || keyResults.some(kr => kr.title !== ''));
    }
  }, [formData, keyResults, okr, isOpen]);

  if (!isOpen) return null;

  // Validation rules
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Rule 1: Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre de l\'objectif est obligatoire';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }
    
    // Rule 2: Date validation
    if (formData.endDate) {
      const endDate = new Date(formData.endDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (endDate < now) {
        newErrors.endDate = 'La date de fin doit être dans le futur';
      }
    }
    
    // Rule 3: Key results validation
    const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.targetValue > 0);
    if (validKeyResults.length === 0) {
      newErrors.keyResults = 'Au moins un résultat clé valide est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyResultChange = (index: number, field: string, value: any) => {
    setKeyResults(prev => prev.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    ));
    
    // Clear key results error
    if (errors.keyResults) {
      setErrors(prev => ({ ...prev, keyResults: '' }));
    }
  };

  const addKeyResult = () => {
    if (keyResults.length < 10) {
      const newKeyResult: KeyResult = {
        id: `kr-${Date.now()}`,
        title: '',
        currentValue: 0,
        targetValue: 100,
        unit: '',
        completed: false,
        estimatedTime: 30
      };
      setKeyResults(prev => [...prev, newKeyResult]);
    }
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.targetValue > 0);
      
        const okrData: any = {
          ...formData,
          estimatedTime: validKeyResults.reduce((sum, kr) => sum + (kr.estimatedTime * kr.targetValue), 0),
          keyResults: validKeyResults.map(kr => ({
            ...kr,
            completed: kr.currentValue >= kr.targetValue
          }))
        };
      
      if (okr) {
        updateOKR(okr.id, okrData);
      } else {
        addOKR({
          ...okrData,
          id: `okr-${Date.now()}`,
          startDate: new Date().toISOString(), // Rule: creation date
          completed: false
        });
      }
      onClose();
    } catch (error) {
      setErrors({ general: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const getProgress = () => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      return sum + Math.min((kr.currentValue / kr.targetValue) * 100, 100);
    }, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  const progress = getProgress();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="okr-modal-title">
      <div className="rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transition-colors" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
        {/* Header - Compact */}
        <div className="flex justify-between items-center px-6 py-3 border-b bg-gradient-to-r from-green-50 dark:from-green-900/20 to-blue-50 dark:to-blue-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 id="okr-modal-title" className="text-lg font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>
                {okr ? 'Modifier l\'objectif' : 'Ajouter un objectif'}
              </h2>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-medium ml-2">
                <AlertCircle size={14} />
                <span>Non sauvegardé</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgb(var(--color-text-muted))' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
              e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-muted))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fermer la modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Error display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle size={16} />
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                     Titre de l'objectif *
                  </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-4 h-12 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-base ${
                          errors.title ? 'border-red-300 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                        style={{
                          backgroundColor: 'rgb(var(--color-surface))',
                          color: 'rgb(var(--color-text-primary))',
                          borderColor: errors.title ? 'rgb(var(--color-error))' : (undefined)
                        }}
                        placeholder="Ex: Améliorer mes compétences en français"
                        aria-describedby={errors.title ? 'title-error' : undefined}
                      />
                  {errors.title && (
                    <div id="title-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle size={14} />
                      {errors.title}
                    </div>
                  )}
                </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                       Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all resize-none text-base border-slate-200 dark:border-slate-700"
                      style={{
                        backgroundColor: 'rgb(var(--color-surface))',
                        color: 'rgb(var(--color-text-primary))',
                      }}
                      placeholder="Décrivez votre objectif en détail..."
                    />
                  </div>

                {/* Category and Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Catégorie
                      </label>
                            <select 
                              value={formData.category}
                              onChange={(e) => handleInputChange('category', e.target.value)}
                              className="w-full px-4 h-12 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-base border-slate-200 dark:border-slate-700"
                              style={{
                                backgroundColor: 'rgb(var(--color-surface))',
                                color: 'rgb(var(--color-text-primary))',
                              }}
                            >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon ? `${category.icon} ${category.name}` : category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Date d'échéance *
                      </label>
                        <DatePicker
                          value={formData.endDate}
                          onChange={(date) => handleInputChange('endDate', date)}
                          placeholder="Sélectionner une date"
                          className={`h-12 ${errors.endDate ? 'border-red-300 dark:border-red-600' : ''}`}
                        />
                  {errors.endDate && (
                    <div id="enddate-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle size={14} />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

                {/* Calculated Estimated Time Display */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-blue-500" />
                      <span className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Temps réalisé / estimé
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {keyResults.reduce((sum, kr) => sum + (kr.currentValue * kr.estimatedTime), 0)} / {keyResults.reduce((sum, kr) => sum + (kr.estimatedTime * kr.targetValue), 0)} min
                    </span>
                  </div>
                  <p className="text-[10px] mt-1 text-blue-500/70 italic">
                    Calculé automatiquement: Σ (Valeur actuelle × Temps KR) / Σ (Objectif cible × Temps KR)
                  </p>
                </div>
            </div>

            {/* Right Column - Key Results */}
            <div className="space-y-6">
              
              {/* Progress Overview */}
              <div className="bg-gradient-to-r from-gray-50 dark:from-slate-700 to-blue-50 dark:to-blue-900/20 p-5 rounded-xl border transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold" style={{ color: 'rgb(var(--color-text-primary))' }}> Progression calculée</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-500 dark:text-green-400" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">{progress}%</span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Key Results Management */}
              <div className="bg-gradient-to-r from-gray-50 dark:from-slate-700 to-purple-50 dark:to-purple-900/20 p-5 rounded-xl border transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text-primary))' }}>
                     Résultats Clés
                    <span className="text-xs font-normal" style={{ color: 'rgb(var(--color-text-muted))' }}>({keyResults.length}/10)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addKeyResult}
                    disabled={keyResults.length >= 10}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 dark:bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                    <span>Ajouter</span>
                  </button>
                </div>
                
                {errors.keyResults && (
                  <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle size={14} />
                    {errors.keyResults}
                  </div>
                )}
                
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {keyResults.map((keyResult, index) => (
                    <div key={keyResult.id} className="rounded-xl p-4 border transition-colors shadow-sm" style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      borderColor: 'rgb(var(--color-border))'
                    }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>KR {index + 1}</span>
                        {keyResults.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyResult(index)}
                            className="ml-auto p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Supprimer ce résultat clé"
                          >
                            <Minus size={14} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                          <input
                            type="text"
                            value={keyResult.title}
                            onChange={(e) => handleKeyResultChange(index, 'title', e.target.value)}
                            placeholder="Ex: Ficher 20 textes littéraires"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-sm border-slate-200 dark:border-slate-700"
                            style={{
                              backgroundColor: 'rgb(var(--color-surface))',
                              color: 'rgb(var(--color-text-primary))',
                            }}
                          />
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Actuel
                              </label>
                              <input
                                type="number"
                                value={keyResult.currentValue}
                                onChange={(e) => handleKeyResultChange(index, 'currentValue', Number(e.target.value))}
                                min="0"
                                className="w-full px-2 py-1.5 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-xs text-center border-slate-200 dark:border-slate-700"
                                style={{
                                  backgroundColor: 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Cible
                              </label>
                              <input
                                type="number"
                                value={keyResult.targetValue}
                                onChange={(e) => handleKeyResultChange(index, 'targetValue', Number(e.target.value))}
                                min="1"
                                className="w-full px-2 py-1.5 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-xs text-center border-slate-200 dark:border-slate-700"
                                style={{
                                  backgroundColor: 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Tps (m)
                              </label>
                              <input
                                type="number"
                                value={keyResult.estimatedTime}
                                onChange={(e) => handleKeyResultChange(index, 'estimatedTime', Number(e.target.value))}
                                min="1"
                                max="480"
                                className="w-full px-2 py-1.5 border rounded-lg focus:outline-none hover:border-blue-500 focus:border-blue-600 focus:border-2 transition-all text-xs text-center border-slate-200 dark:border-slate-700"
                                style={{
                                  backgroundColor: 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                }}
                              />
                            </div>
                          </div>

                        {/* Progress bar for this key result */}
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-medium" style={{ color: 'rgb(var(--color-text-muted))' }}>Progression KR</span>
                            <span className="text-[10px] font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>
                              {Math.min(Math.round((keyResult.currentValue / keyResult.targetValue) * 100), 100)}%
                            </span>
                          </div>
                          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                keyResult.completed ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((keyResult.currentValue / keyResult.targetValue) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t mt-6 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
            <div className="text-xs font-medium" style={{ color: 'rgb(var(--color-text-muted))' }}>
              {keyResults.length} résultat{keyResults.length !== 1 ? 's' : ''} clé{keyResults.length !== 1 ? 's' : ''} défini{keyResults.length !== 1 ? 's' : ''}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm font-semibold"
                style={{
                  backgroundColor: 'rgb(var(--color-hover))',
                  color: 'rgb(var(--color-text-secondary))'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !hasChanges || Object.keys(errors).length > 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {okr ? 'Sauvegarder les modifications' : 'Créer l\'objectif'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1e2235] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-700/50">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">Modifications non sauvegardées</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Vous avez des modifications en cours. Voulez-vous vraiment fermer sans enregistrer ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white border border-slate-600 hover:bg-slate-800 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OKRModal;
