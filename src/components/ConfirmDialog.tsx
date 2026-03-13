import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  message = '정말 삭제하시겠습니까?',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="modal-panel bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-500 shrink-0">
            <AlertTriangle size={20} />
          </span>
          <div>
            <p className="font-semibold text-slate-800">삭제 확인</p>
            <p className="text-sm text-slate-500 mt-0.5">{message}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
