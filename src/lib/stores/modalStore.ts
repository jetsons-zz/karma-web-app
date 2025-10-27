/**
 * Modal Store
 * 统一管理所有弹窗状态
 */

import { create } from 'zustand';

export type ModalType =
  | 'create-project'
  | 'create-task'
  | 'edit-task'
  | 'assign-avatar'
  | 'upload-file'
  | 'share'
  | 'delete-confirm'
  | 'filter'
  | 'create-channel'
  | null;

interface ModalData {
  [key: string]: any;
}

interface ModalStore {
  // 当前打开的弹窗类型
  activeModal: ModalType;
  // 弹窗数据
  modalData: ModalData;
  // 打开弹窗
  openModal: (type: ModalType, data?: ModalData) => void;
  // 关闭弹窗
  closeModal: () => void;
  // 更新弹窗数据
  updateModalData: (data: Partial<ModalData>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  modalData: {},

  openModal: (type, data = {}) => {
    set({ activeModal: type, modalData: data });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: {} });
  },

  updateModalData: (data) => {
    set((state) => ({
      modalData: { ...state.modalData, ...data },
    }));
  },
}));
