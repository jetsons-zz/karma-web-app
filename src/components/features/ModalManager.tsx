'use client';

import { useModalStore } from '@/lib/stores/modalStore';
import { CreateChannelModal } from './CreateChannelModal';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { HapticFeedback } from '@/lib/utils/haptics';

/**
 * Modal Manager
 * 统一管理所有应用级弹窗
 */
export function ModalManager() {
  const { activeModal, modalData, closeModal } = useModalStore();

  // 渲染对应的弹窗
  switch (activeModal) {
    case 'create-project':
      return <CreateProjectModal isOpen onClose={closeModal} data={modalData} />;

    case 'create-task':
      return <CreateTaskModal isOpen onClose={closeModal} data={modalData} />;

    case 'edit-task':
      return <EditTaskModal isOpen onClose={closeModal} data={modalData} />;

    case 'assign-avatar':
      return <AssignAvatarModal isOpen onClose={closeModal} data={modalData} />;

    case 'upload-file':
      return <UploadFileModal isOpen onClose={closeModal} data={modalData} />;

    case 'share':
      return <ShareModal isOpen onClose={closeModal} data={modalData} />;

    case 'delete-confirm':
      return <DeleteConfirmModal isOpen onClose={closeModal} data={modalData} />;

    case 'filter':
      return <FilterModal isOpen onClose={closeModal} data={modalData} />;

    case 'create-channel':
      return <CreateChannelModal isOpen onClose={closeModal} />;

    default:
      return null;
  }
}

// ============================================================================
// 各个具体的弹窗组件
// ============================================================================

// 创建项目弹窗
function CreateProjectModal({ isOpen, onClose, data }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      showToast.error('请输入项目名称');
      return;
    }

    showToast.success(`项目 "${name}" 创建成功！`);
    HapticFeedback.success();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="创建新项目"
      description="设置项目基本信息"
      size="md"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            取消
          </Button>
          <Button fullWidth onClick={handleCreate}>
            创建项目
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            项目名称 *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：电商平台开发"
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            项目描述
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简要描述项目目标"
          />
        </div>
      </div>
    </Modal>
  );
}

// 创建任务弹窗
function CreateTaskModal({ isOpen, onClose, data }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      showToast.error('请输入任务标题');
      return;
    }

    showToast.success(`任务 "${title}" 创建成功！`);
    HapticFeedback.success();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="创建新任务"
      size="md"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            取消
          </Button>
          <Button fullWidth onClick={handleCreate}>
            创建任务
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            任务标题 *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：实现用户登录功能"
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            任务描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细描述任务要求"
            rows={4}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-body)',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

// 编辑任务弹窗
function EditTaskModal({ isOpen, onClose, data }: any) {
  const [title, setTitle] = useState(data?.title || '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="编辑任务"
      size="md"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            取消
          </Button>
          <Button fullWidth onClick={() => {
            showToast.success('任务更新成功');
            onClose();
          }}>
            保存
          </Button>
        </div>
      }
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="任务标题"
      />
    </Modal>
  );
}

// 分配分身弹窗
function AssignAvatarModal({ isOpen, onClose, data }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="分配AI分身"
      description="选择要分配给此任务的分身"
      size="md"
    >
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <p>暂无可用分身</p>
      </div>
    </Modal>
  );
}

// 上传文件弹窗
function UploadFileModal({ isOpen, onClose, data }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="上传文件"
      size="md"
    >
      <div
        style={{
          padding: 'var(--spacing-xxl)',
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <svg
          className="mx-auto h-12 w-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p style={{ color: 'var(--color-text-primary)' }}>点击或拖拽文件到这里</p>
        <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
          支持 PDF, DOC, JPG, PNG 等格式
        </p>
      </div>
    </Modal>
  );
}

// 分享弹窗
function ShareModal({ isOpen, onClose, data }: any) {
  const shareUrl = data?.url || window.location.href;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="分享"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-caption)',
            marginBottom: 'var(--spacing-xs)',
            color: 'var(--color-text-secondary)',
          }}>
            分享链接
          </label>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                showToast.success('链接已复制');
                HapticFeedback.success();
              }}
            >
              复制
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// 删除确认弹窗
function DeleteConfirmModal({ isOpen, onClose, data }: any) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        showToast.success('删除成功');
        if (data?.onConfirm) data.onConfirm();
      }}
      title="确认删除"
      message={data?.message || '此操作不可恢复，确定要删除吗？'}
      confirmText="删除"
      cancelText="取消"
      variant="danger"
    />
  );
}

// 筛选器弹窗
function FilterModal({ isOpen, onClose, data }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="筛选"
      size="md"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            重置
          </Button>
          <Button fullWidth onClick={onClose}>
            应用筛选
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-caption)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            状态
          </label>
          <select
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-primary)',
            }}
          >
            <option>全部</option>
            <option>进行中</option>
            <option>已完成</option>
            <option>暂停</option>
          </select>
        </div>
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-caption)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            优先级
          </label>
          <select
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-primary)',
            }}
          >
            <option>全部</option>
            <option>P0 - 紧急</option>
            <option>P1 - 高</option>
            <option>P2 - 中</option>
            <option>P3 - 低</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
