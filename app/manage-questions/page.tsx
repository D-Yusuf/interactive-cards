'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCategories, createQuestion, updateQuestion, deleteQuestion, getCachedCategories } from '../services/api';
import { Category, Question } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import QuestionCard from '../components/manage-questions/QuestionCard';
import QuestionFormModal from '../components/manage-questions/QuestionFormModal';
import ConfirmDeleteModal from '../components/manage-questions/ConfirmDeleteModal';
import CacheStatus from '../components/CacheStatus';

// Add icon
const AddIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

// Search icon
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Filter icon
const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

export default function ManageQuestionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<number | ''>('');
  const [answeredFilter, setAnsweredFilter] = useState<'all' | 'answered' | 'unanswered'>('all');

  // Modal states
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Data for modals
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to get cached data first for instant loading
      const cachedCategories = getCachedCategories();
      if (cachedCategories) {
        setCategories(cachedCategories);
        if (cachedCategories.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(cachedCategories[0]._id);
        }
        setLoading(false);
      }
      
      // Always fetch fresh data from API and update cache
      const res = await getCategories();
      setCategories(res.data);
      if (res.data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(res.data[0]._id);
      }
    } catch (err) {
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on all criteria
  const filteredQuestions = useMemo(() => {
    const displayedQuestions = categories.find(c => c._id === selectedCategoryId)?.questions || [];
    
    return displayedQuestions.filter(question => {
      // Search text filter
      const matchesSearch = searchText === '' || 
        question.question.toLowerCase().includes(searchText.toLowerCase()) ||
        question.answer.toLowerCase().includes(searchText.toLowerCase());
      
      // Points filter
      const matchesPoints = selectedPoints === '' || question.points === selectedPoints;
      
      // Answered status filter
      const matchesAnswered = 
        answeredFilter === 'all' ||
        (answeredFilter === 'answered' && question.isAnswered) ||
        (answeredFilter === 'unanswered' && !question.isAnswered);
      
      return matchesSearch && matchesPoints && matchesAnswered;
    });
  }, [categories, selectedCategoryId, searchText, selectedPoints, answeredFilter]);

  // Sort questions: unanswered first, then answered
  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => 
      (a.isAnswered === b.isAnswered) ? 0 : a.isAnswered ? 1 : -1
    );
  }, [filteredQuestions]);

  const handleAddClick = () => {
    setEditingQuestion(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingQuestionId(id);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Question> & { category: string }) => {
    try {
      if (editingQuestion) {
        // Optimistic update for editing
        const optimisticQuestion = { ...editingQuestion, ...data };
        setCategories(prev => {
          const newCategories = [...prev];
          const oldCatIndex = newCategories.findIndex(c => c.questions.some(q => q._id === editingQuestion._id));
          const newCatIndex = newCategories.findIndex(c => c._id === data.category);
          
          if (oldCatIndex !== -1) {
            newCategories[oldCatIndex].questions = newCategories[oldCatIndex].questions.filter(q => q._id !== editingQuestion._id);
          }
          if (newCatIndex !== -1) {
            newCategories[newCatIndex].questions.push(optimisticQuestion as Question);
          }
          return newCategories;
        });

        // Update in backend
        const updatedQuestion = await updateQuestion(editingQuestion._id, data);
        console.log('Question updated successfully:', updatedQuestion);
        
        // Update with real data from backend
        setCategories(prev => {
          const newCategories = [...prev];
          const catIndex = newCategories.findIndex(c => c._id === data.category);
          if (catIndex !== -1) {
            newCategories[catIndex].questions = newCategories[catIndex].questions.map(q => 
              q._id === editingQuestion._id ? updatedQuestion.data : q
            );
          }
          return newCategories;
        });
      } else {
        // Optimistic update for creating
        if (data.question && data.answer && data.points) {
          const optimisticQuestion: Question = {
            _id: `temp_${Date.now()}`, // Temporary ID
            category: data.category,
            question: data.question,
            answer: data.answer,
            points: data.points,
            isAnswered: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setCategories(prev => prev.map(c => 
            c._id === data.category 
              ? { ...c, questions: [...c.questions, optimisticQuestion] }
              : c
          ));

          // Create in backend
          const newQuestion = await createQuestion({
            category: data.category,
            question: data.question,
            answer: data.answer,
            points: data.points,
          });
          console.log('Question created successfully:', newQuestion);

          // Replace optimistic question with real one
          setCategories(prev => prev.map(c => 
            c._id === data.category 
              ? { 
                  ...c, 
                  questions: c.questions.map(q => 
                    q._id === optimisticQuestion._id ? newQuestion.data : q
                  )
                }
              : c
          ));
        }
      }
      setFormModalOpen(false);
    } catch (err) {
      console.error('Error in form submit:', err);
      setError('فشلت العملية: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
      // Revert optimistic update on error
      fetchData();
    }
  };

  const confirmDelete = async () => {
    if (!deletingQuestionId) return;
    
    try {
      // Optimistic update
      setCategories(prev => prev.map(c => ({
        ...c,
        questions: c.questions.filter(q => q._id !== deletingQuestionId)
      })));

      // Delete from backend
      await deleteQuestion(deletingQuestionId);
      console.log('Question deleted successfully');
      
      setDeleteModalOpen(false);
      setDeletingQuestionId(null);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('فشل في حذف السؤال: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
      // Revert optimistic update on error
      fetchData();
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedPoints('');
    setAnsweredFilter('all');
  };

  const hasActiveFilters = searchText !== '' || selectedPoints !== '' || answeredFilter !== 'all';

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div dir="rtl" className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-cyan-400">إدارة الأسئلة</h1>
            <CacheStatus />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {/* Category Selector */}
          <div className="mb-6">
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4"
            >
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FilterIcon />
              <h3 className="text-lg font-semibold">المرشحات</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  مسح المرشحات
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Filter */}
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="البحث في السؤال أو الإجابة..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 text-white placeholder-gray-400"
                />
              </div>

              {/* Points Filter */}
              <div>
                <select
                  value={selectedPoints}
                  onChange={(e) => setSelectedPoints(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
                >
                  <option value="">جميع النقاط</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(points => (
                    <option key={points} value={points}>{points} نقطة</option>
                  ))}
                </select>
              </div>

              {/* Answered Status Filter */}
              <div>
                <select
                  value={answeredFilter}
                  onChange={(e) => setAnsweredFilter(e.target.value as 'all' | 'answered' | 'unanswered')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
                >
                  <option value="all">جميع الأسئلة</option>
                  <option value="unanswered">غير مجاب عليها</option>
                  <option value="answered">مجاب عليها</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-400">
              عرض {sortedQuestions.length} من {categories.find(c => c._id === selectedCategoryId)?.questions.length || 0} سؤال
              {hasActiveFilters && (
                <span className="text-yellow-400"> (مفلتر)</span>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-4">
            {sortedQuestions.length > 0 ? (
              sortedQuestions.map(q => (
                <QuestionCard key={q._id} question={q} onEdit={handleEditClick} onDelete={handleDeleteClick} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                {hasActiveFilters ? 'لا توجد أسئلة تطابق المرشحات المحددة' : 'لا توجد أسئلة في هذه الفئة'}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddClick}
        className="fixed bottom-8 left-8 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
      >
        <AddIcon />
      </button>

      <QuestionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingQuestion}
        categories={categories}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
} 