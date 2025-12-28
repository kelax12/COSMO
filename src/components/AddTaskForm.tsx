import React, { useEffect, useState } from 'react';
import { Plus, X, Users, Search, UserPlus, AlertCircle, CheckCircle, Calendar, Star, Bookmark, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useTasks } from '../context/TaskContext';
import CollaboratorItem from './CollaboratorItem';

type AddTaskFormProps = {
  onFormToggle?: (isOpen: boolean) => void;
  expanded?: boolean;
    initialData?: {
      name?: string;
      estimatedTime?: number;
      category?: string;
      priority?: number;
      isFromOKR?: boolean;
    };

};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onFormToggle, expanded = false, initialData }) => {
  const { addTask, colorSettings, categories, friends, shareTask, isPremium } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(expanded);

  useEffect(() => {
    setIsFormOpen(expanded);
  }, [expanded]);
    const [formData, setFormData] = useState({
      name: initialData?.name || '',
      priority: initialData?.priority || 0,
      category: initialData?.category || '',
      deadline: '',
      estimatedTime: initialData?.estimatedTime || 0,
      completed: false,
      bookmarked: false,
      isFromOKR: initialData?.isFromOKR || false
    });

    const [okrFields, setOkrFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
      if (initialData) {
        setFormData(prev => ({
          ...prev,
          name: initialData.name || prev.name,
          estimatedTime: initialData.estimatedTime || prev.estimatedTime,
          category: initialData.category || prev.category,
          priority: initialData.priority || prev.priority,
          isFromOKR: initialData.isFromOKR ?? prev.isFromOKR
        }));
        setHasChanges(true);

        // Track which fields are from OKR
        if (initialData.isFromOKR) {
          setOkrFields({
            name: !!initialData.name,
            category: !!initialData.category,
            estimatedTime: !!initialData.estimatedTime,
          });
        } else {
          setOkrFields({});
        }
      }
    }, [initialData]);


  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showCollaboratorSection, setShowCollaboratorSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string;}>({});
  const [hasChanges, setHasChanges] = useState(false);

  const getCategoryColor = (id: string) => {
    return categories.find(cat => cat.id === id)?.color || '#9CA3AF';
  };

  const availableFriends = friends || [];

  const filteredFriends = availableFriends.filter((friend) =>
    !collaborators.includes(friend.id) && (
      friend.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchUser.toLowerCase())
    )
  );

  const displayInfo = (id: string) => {
    const friend = friends?.find((f) => f.id === id);
    if (friend) {
      return { name: friend.name, email: friend.email, avatar: friend.avatar };
    }
    if (emailRegex.test(id)) {
      return { name: id.split('@')[0], email: id, avatar: undefined };
    }
    return { name: id, email: undefined, avatar: undefined };
  };

  const handleAddEmail = () => {
    const value = emailInput.trim();
    if (!value) return;
    if (collaborators.includes(value)) {
      setEmailInput('');
      return;
    }
    setCollaborators([...collaborators, value]);
    setEmailInput('');
    setHasChanges(true);
  };

  // Validation rules
  const validateForm = () => {
    const newErrors: {[key: string]: string;} = {};

    // Rule 1: Task name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la tâche est obligatoire';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    // Rule 2: Estimated time validation
    if (formData.estimatedTime === '' || formData.estimatedTime === null) {
      newErrors.estimatedTime = 'Le temps estimé est obligatoire';
    } else if (isNaN(Number(formData.estimatedTime))) {
      newErrors.estimatedTime = 'Veuillez entrer un nombre valide';
    } else if (Number(formData.estimatedTime) < 0) {
      newErrors.estimatedTime = 'Le temps estimé ne peut pas être négatif';
    }

    // Rule 3: Priority validation
    if (formData.priority === 0) {
      newErrors.priority = 'Veuillez choisir une priorité';
    }

    // Rule 4: Category validation
    if (!formData.category) {
      newErrors.category = 'Veuillez choisir une catégorie';
    }

    // Rule 5: Deadline validation
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'La date limite ne peut pas être dans le passé';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const isFormValid = () => {
    const nameValid = formData.name.length >= 1 && formData.name.length <= 100;
    const timeValid = formData.estimatedTime !== '' && formData.estimatedTime !== null && !isNaN(Number(formData.estimatedTime)) && Number(formData.estimatedTime) > 0;
    const priorityValid = formData.priority !== 0;
    const categoryValid = !!formData.category;
    
    let deadlineValid = !!formData.deadline;
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineValid = deadlineDate >= today;
    }

    return nameValid && timeValid && priorityValid && categoryValid && deadlineValid;
  };

  const handleInputChange = (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);

      // Remove the special OKR styling for this field if it's modified
      if (okrFields[field]) {
        setOkrFields(prev => ({ ...prev, [field]: false }));
      }

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };


  const handleFormToggle = (open: boolean) => {
    setIsFormOpen(open);
    onFormToggle?.(open);
    if (!open) resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      priority: 0,
      category: '',
      deadline: '',
      estimatedTime: 0,
      completed: false,
      bookmarked: false
    });
    setCollaborators([]);
    setSearchUser('');
    setShowCollaboratorSection(false);
    setErrors({});
    setHasChanges(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newTask = {
        id: Date.now().toString(),
        name: formData.name,
        priority: formData.priority,
        category: formData.category,
        deadline: formData.deadline || new Date().toISOString(),
        estimatedTime: formData.estimatedTime,
        createdAt: new Date().toISOString(),
        bookmarked: formData.bookmarked,
        completed: formData.completed,
        isCollaborative: collaborators.length > 0,
        collaborators: collaborators,
        permissions: 'responsible' as const
      };

      addTask(newTask);

      // Share with collaborators if any
      if (collaborators.length > 0 && isPremium()) {
        collaborators.forEach((userId) => {
          shareTask(newTask.id, userId, 'editor');
        });
      }

      handleFormToggle(false);
    } catch (error) {
      setErrors({ general: 'Erreur lors de la création. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollaborator = (userId: string) => {
    setCollaborators((prev) =>
    prev.includes(userId) ?
    prev.filter((id) => id !== userId) :
    [...prev, userId]
    );
    setHasChanges(true);
  };

  return (
    <div>
      <Dialog open={isFormOpen} onOpenChange={handleFormToggle}>


        <DialogContent
          showCloseButton={false}
          className="p-0 border-0 bg-transparent shadow-none sm:max-w-4xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="rounded-2xl shadow-2xl w-full transition-colors" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-purple-50 dark:to-purple-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <CheckCircle size={24} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>
                  Créer une nouvelle tâche
                </h2>
                {hasChanges &&
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>Non sauvegardé</span>
                  </div>
                }
              </div>
              <button
                onClick={() => handleFormToggle(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'rgb(var(--color-text-muted))' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
                  e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(var(--color-text-muted))';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Fermer le formulaire"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              {/* Error display */}
              {errors.general &&
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span className="font-medium">{errors.general}</span>
                  </div>
                </div>
              }

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column - Main Information */}
                  <div className="space-y-5">
                    
                    {/* Task Name */}
                    <div>
                      <label htmlFor="task-name" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Nom de la tâche *
                      </label>
                        <input
                          id="task-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.name ? 'border-red-300 dark:border-red-600' : ''
                          } ${okrFields.name ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
                          style={{
                            backgroundColor: okrFields.name ? undefined : 'rgb(var(--color-surface))',
                            color: 'rgb(var(--color-text-primary))',
                            borderColor: errors.name ? 'rgb(var(--color-error))' : (okrFields.name ? undefined : 'rgb(var(--color-border))')
                          }}
                          placeholder="Entrez le nom de la tâche"
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          aria-invalid={!!errors.name}
                        />


                      {errors.name &&
                        <div id="name-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm" role="alert">
                          <AlertCircle size={14} aria-hidden="true" />
                          {errors.name}
                        </div>
                      }
                    </div>

                    {/* Priority and Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="task-priority" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          Priorité
                        </label>
                          <select
                            id="task-priority"
                            value={formData.priority}
                            onChange={(e) => handleInputChange('priority', Number(e.target.value))}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            style={{
                              backgroundColor: 'rgb(var(--color-surface))',
                                color: formData.priority === 0 ? 'rgb(var(--color-text-muted))' : 'rgb(var(--color-text-primary))',
                              borderColor: 'rgb(var(--color-border))'
                            }}
                            aria-label="Sélectionner la priorité de la tâche"
                          >
                            <option value="0" disabled hidden>Choisir une priorité</option>
                          <option value="1" style={{ color: 'rgb(var(--color-text-primary))' }}>1 (Très haute)</option>
                          <option value="2" style={{ color: 'rgb(var(--color-text-primary))' }}>2 (Haute)</option>
                          <option value="3" style={{ color: 'rgb(var(--color-text-primary))' }}>3 (Moyenne)</option>
                          <option value="4" style={{ color: 'rgb(var(--color-text-primary))' }}>4 (Basse)</option>
                          <option value="5" style={{ color: 'rgb(var(--color-text-primary))' }}>5 (Très basse)</option>
                        </select>
                        {errors.priority &&
                          <div className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm" role="alert">
                            <AlertCircle size={14} aria-hidden="true" />
                            {errors.priority}
                          </div>
                        }
                      </div>
                      
                      <div>
                        <label htmlFor="task-category" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Catégorie
                        </label>
                                  <select
                                    id="task-category"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                      errors.category ? 'border-red-300 dark:border-red-600' : ''
                                    } ${okrFields.category ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
                                    style={{
                                      backgroundColor: okrFields.category ? undefined : 'rgb(var(--color-surface))',
                                        color: formData.category === '' ? 'rgb(var(--color-text-muted))' : 'rgb(var(--color-text-primary))',
                                      borderColor: errors.category ? 'rgb(var(--color-error))' : (okrFields.category ? undefined : 'rgb(var(--color-border))')
                                    }}
                                    aria-label="Sélectionner la catégorie de la tâche"
                                  >
                                    <option value="" disabled hidden>Choisir une catégorie</option>
                                  {categories.map((category) => (
                                    <option key={category.id} value={category.id} style={{ color: 'rgb(var(--color-text-primary))' }}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                        {errors.category &&
                          <div className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm" role="alert">
                            <AlertCircle size={14} aria-hidden="true" />
                            {errors.category}
                          </div>
                        }
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: getCategoryColor(formData.category) }}
                          />
                          <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{colorSettings[formData.category] || 'Sans catégorie'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deadline and Estimated Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="task-deadline" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          Échéance
                        </label>
                        <input
                          id="task-deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.deadline ? 'border-red-300 dark:border-red-600' : ''}`}
                          style={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            color: 'rgb(var(--color-text-primary))',
                            borderColor: errors.deadline ? 'rgb(var(--color-error))' : 'rgb(var(--color-border))'
                          }}
                          aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                          aria-invalid={!!errors.deadline}
                        />

                        {errors.deadline &&
                          <div id="deadline-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm" role="alert">
                            <AlertCircle size={14} aria-hidden="true" />
                            {errors.deadline}
                          </div>
                        }
                      </div>
                      
                      <div>
                        <label htmlFor="task-time" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          Temps estimé (min)
                        </label>
                              <input
                                  id="task-time"
                                  type="number"
                                  value={formData.estimatedTime === 0 && !hasChanges ? '' : formData.estimatedTime}
                                  onChange={(e) => handleInputChange('estimatedTime', e.target.value === '' ? '' : Number(e.target.value))}
                                  placeholder="Estimation en minute"
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                  errors.estimatedTime ? 'border-red-300 dark:border-red-600' : ''
                                } ${okrFields.estimatedTime ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
                                style={{
                                  backgroundColor: okrFields.estimatedTime ? undefined : 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                  borderColor: errors.estimatedTime ? 'rgb(var(--color-error))' : (okrFields.estimatedTime ? undefined : 'rgb(var(--color-border))')
                                }}
                                aria-describedby={errors.estimatedTime ? 'time-error' : undefined}
                                aria-invalid={!!errors.estimatedTime}
                              />



                        {errors.estimatedTime &&
                          <div id="time-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm" role="alert">
                            <AlertCircle size={14} aria-hidden="true" />
                            {errors.estimatedTime}
                          </div>
                        }
                      </div>
                    </div>

                    {/* Status toggles */}
                    <div className="grid grid-cols-2 gap-4">
                    
                      <div className="flex items-center justify-between p-4 rounded-lg border transition-colors" style={{
                        backgroundColor: 'rgb(var(--color-hover))',
                        borderColor: 'rgb(var(--color-border))'
                      }}>
                        <div className="flex items-center gap-3">
                          <Bookmark size={20} className={formData.bookmarked ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'} aria-hidden="true" />
                          <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>Favori</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.bookmarked}
                            onChange={(e) => handleInputChange('bookmarked', e.target.checked)}
                            aria-label="Marquer comme favori"
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Collaborators and Actions */}
                  <div className="space-y-6">
                    
                      {/* Collaborators Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Collaborateurs
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCollaboratorSection(!showCollaboratorSection)}
                            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <Users size={16} />
                            <span>{showCollaboratorSection ? 'Masquer' : 'Gérer'}</span>
                          </button>
                        </div>

                        {showCollaboratorSection && (
                          <div
                            className="rounded-lg p-4 border transition-colors"
                            style={{
                              backgroundColor: 'rgb(var(--color-hover))',
                              borderColor: 'rgb(var(--color-border))',
                            }}
                          >
                            {!isPremium() ? (
                              <div className="text-center py-6">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                  <Users size={24} className="text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <p className="text-sm mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                  Fonctionnalité Premium requise
                                </p>
                                <button className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition-colors">
                                  Débloquer Premium
                                </button>
                              </div>
                            ) : (
                              <>
                                  {/* Add collaborator by email/id */}
                                  <div className="flex gap-2 mb-4">
                                    <div className="relative flex-1">
                                      <Mail
                                        size={16}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                      />
                                      <input
                                        type="text"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="Email ou identifiant"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                                        style={{
                                          backgroundColor: 'rgb(var(--color-surface))',
                                          color: 'rgb(var(--color-text-primary))',
                                          borderColor: 'rgb(var(--color-border))',
                                        }}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleAddEmail}
                                      disabled={!emailInput.trim()}
                                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                      <UserPlus size={18} />
                                    </button>
                                  </div>

                                  {/* Search users */}
                                  <div className="relative mb-4">
                                    <Search
                                      size={16}
                                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    />
                                    <input
                                      type="text"
                                      value={searchUser}
                                      onChange={(e) => setSearchUser(e.target.value)}
                                      placeholder="Rechercher parmi vos amis..."
                                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                                      style={{
                                        backgroundColor: 'rgb(var(--color-surface))',
                                        color: 'rgb(var(--color-text-primary))',
                                        borderColor: 'rgb(var(--color-border))',
                                      }}
                                    />
                                  </div>

                                    {/* Friends list */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                      {filteredFriends.map((friend) => (
                                        <CollaboratorItem
                                          key={friend.id}
                                          id={friend.id}
                                          name={friend.name}
                                          email={friend.email}
                                          avatar={friend.avatar}
                                          isSelected={collaborators.includes(friend.id)}
                                          onAction={() => toggleCollaborator(friend.id)}
                                          variant="toggle"
                                        />
                                      ))}
                                      {filteredFriends.length === 0 && searchUser && (
                                        <p className="text-center py-4 text-sm text-slate-500">Aucun contact trouvé</p>
                                      )}
                                    </div>

                                    {/* Selected collaborators */}
                                    {collaborators.length > 0 && (
                                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-3">
                                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Sélectionnés ({collaborators.length})
                                          </h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                          {collaborators.map((userId) => {
                                            const info = displayInfo(userId);
                                            return (
                                              <CollaboratorItem
                                                key={userId}
                                                id={userId}
                                                name={info.name}
                                                email={info.email}
                                                avatar={info.avatar}
                                                onAction={() => toggleCollaborator(userId)}
                                                variant="remove"
                                              />
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}


                              </>
                            )}
                          </div>
                        )}
                      </div>
                    {/* Task Preview */}
                    <div className="p-4 rounded-lg border transition-colors" style={{
                      backgroundColor: 'rgb(var(--color-hover))',
                      borderColor: 'rgb(var(--color-border))'
                    }}>
                      <h4 className="text-sm font-semibold mb-3 !whitespace-pre-line" style={{ color: 'rgb(var(--color-text-secondary))' }}>Aperçu de la tâche</h4>
                      <div className="p-4 rounded-lg border transition-colors" style={{
                        backgroundColor: 'rgb(var(--color-surface))',
                        borderColor: 'rgb(var(--color-border))'
                      }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: getCategoryColor(formData.category) }}
                          />
                          <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>
                            {formData.name || 'Nom de la tâche'}
                          </span>
                          {formData.bookmarked && <Bookmark size={16} className="text-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          <span>Priorité {formData.priority}</span>
                          <span>{formData.estimatedTime} min</span>
                          {formData.completed && <span className="text-green-600 dark:text-green-400">✓ Complétée</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center pt-6 border-t mt-6" style={{ borderColor: 'rgb(var(--color-border))' }}>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleFormToggle(false)}
                      disabled={isLoading}
                      className="px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
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
                      aria-label="Annuler la création de la tâche"
                    >
                      Annuler
                    </button>
                        <button
                          type="submit"
                          disabled={isLoading || !isFormValid()}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-blue-500/25 transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Créer la tâche"
                        >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" role="status" aria-label="Création en cours"></div>
                          Création...
                        </>
                      ) : (
                          <>
                           Créer
                          </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTaskForm;
