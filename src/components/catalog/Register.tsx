'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';

export const Register = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
      >
        Зареєструватися
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-md"
      >
        <div className="flex flex-col space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-xl font-bold text-gray-900">
              Реєстрація організації
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Створіть профіль для вашої компанії в каталозі.
            </p>
          </div>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-center">
              <p className="text-xs font-medium text-emerald-800">
                [ Демонстраційна зона форми ]
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                Компонент повністю адаптований під доступність (A11y).
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Назва компанії
                </label>
                <input
                  type="text"
                  placeholder="Введіть офіційну назву..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Email представника
                </label>
                <input
                  type="email"
                  placeholder="company@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="button"
              onClick={() => alert('Submit')}
              className="cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Створити акаунт
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
