'use client';

import { useState, useEffect } from 'react';
import { Question, Category } from '../../types';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Question> & { category: string }) => void;
  initialData?: Question | null;
  categories: Category[];
}

interface FormData extends Partial<Question> {
  category?: string;
}

export default function QuestionFormModal({ isOpen, onClose, onSubmit, initialData, categories }: QuestionFormModalProps) {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (initialData) {
      const categoryId = typeof initialData.category === 'object' ? initialData.category._id : initialData.category;
      setFormData({ ...initialData, category: categoryId });
    } else {
      // Default for new question
      setFormData({
        question: '',
        answer: '',
        points: 1,
        category: categories.length > 0 ? categories[0]._id : '',
        isAnswered: false
      });
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'points' ? parseInt(value) : value)
    }));

    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category) {
      onSubmit(formData as Partial<Question> & { category: string });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">
          {initialData ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="question"
            value={formData.question || ''}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
            placeholder="نص السؤال"
            rows={3}
          />
          <textarea
            name="answer"
            value={formData.answer || ''}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
            placeholder="الإجابة"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="points"
              type="number"
              value={formData.points || 1}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
              placeholder="النقاط"
            />
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4"
            >
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              name="isAnswered"
              type="checkbox"
              checked={formData.isAnswered || false}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label className="text-gray-300">
              السؤال مجاب عليه
            </label>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md">
            {initialData ? 'حفظ التعديلات' : 'إضافة السؤال'}
          </button>
        </form>
      </div>
    </div>
  );
} 