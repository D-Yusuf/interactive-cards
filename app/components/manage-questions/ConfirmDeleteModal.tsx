'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">هل أنت متأكد؟</h2>
        <p className="text-gray-300 mb-6">لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md"
          >
            نعم، احذف
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
} 