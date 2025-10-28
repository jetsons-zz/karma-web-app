/**
 * Mock 设备数据
 */

import type { Device } from '@/types/api';

export let mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'EOS-3A 生产服务器 #001',
    model: 'EOS-3A',
    status: 'online',
    ip: '192.168.1.100',
    mac: '00:1A:2B:3C:4D:5E',
    serialNumber: 'EOS3A-2024-001',
    firmwareVersion: '1.2.3',
    lastHeartbeat: Date.now() - 5000,
    capabilities: {
      aiComputing: true,
      videoProcessing: true,
      storage: true,
      networking: true,
    },
    hardware: {
      cpu: 'Intel i7-12700K',
      memory: 32,
      storage: 1024,
      gpu: 'NVIDIA RTX 4060',
    },
    network: {
      type: 'ethernet',
      signalStrength: 95,
      bandwidth: 1000,
    },
    location: {
      latitude: 39.9042,
      longitude: 116.4074,
      address: '北京市朝阳区',
    },
    tags: ['生产环境', '高性能', 'AI计算'],
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1000,
  },
  {
    id: 'device-2',
    name: 'EOS-3B 开发测试 #002',
    model: 'EOS-3B',
    status: 'offline',
    ip: '192.168.1.101',
    mac: '00:1A:2B:3C:4D:5F',
    serialNumber: 'EOS3B-2024-002',
    firmwareVersion: '1.2.1',
    lastHeartbeat: Date.now() - 60 * 60 * 1000,
    capabilities: {
      aiComputing: true,
      videoProcessing: false,
      storage: true,
      networking: true,
    },
    hardware: {
      cpu: 'Intel i5-12400',
      memory: 16,
      storage: 512,
    },
    network: {
      type: 'wifi',
      signalStrength: 72,
      bandwidth: 100,
    },
    location: {
      latitude: 31.2304,
      longitude: 121.4737,
      address: '上海市浦东新区',
    },
    tags: ['开发环境', '测试'],
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 60 * 1000,
  },
  {
    id: 'device-3',
    name: 'EOS-3C 边缘计算 #003',
    model: 'EOS-3C',
    status: 'online',
    ip: '192.168.1.102',
    mac: '00:1A:2B:3C:4D:60',
    serialNumber: 'EOS3C-2024-003',
    firmwareVersion: '1.3.0',
    lastHeartbeat: Date.now() - 2000,
    capabilities: {
      aiComputing: true,
      videoProcessing: true,
      storage: false,
      networking: true,
    },
    hardware: {
      cpu: 'AMD Ryzen 7 5800X',
      memory: 64,
      storage: 2048,
      gpu: 'NVIDIA RTX 4070',
    },
    network: {
      type: '5g',
      signalStrength: 88,
      bandwidth: 500,
    },
    location: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区',
    },
    tags: ['边缘计算', '5G', '视频处理'],
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 500,
  },
  {
    id: 'device-4',
    name: 'EOS-3A 备份服务器 #004',
    model: 'EOS-3A',
    status: 'error',
    ip: '192.168.1.103',
    mac: '00:1A:2B:3C:4D:61',
    serialNumber: 'EOS3A-2024-004',
    firmwareVersion: '1.1.9',
    lastHeartbeat: Date.now() - 3 * 60 * 60 * 1000,
    capabilities: {
      aiComputing: false,
      videoProcessing: false,
      storage: true,
      networking: true,
    },
    hardware: {
      cpu: 'Intel i7-11700',
      memory: 32,
      storage: 4096,
    },
    network: {
      type: 'ethernet',
      signalStrength: 0,
      bandwidth: 1000,
    },
    tags: ['备份', '存储'],
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: 'device-5',
    name: 'EOS-3B 边缘节点 #005',
    model: 'EOS-3B',
    status: 'updating',
    ip: '192.168.1.104',
    mac: '00:1A:2B:3C:4D:62',
    serialNumber: 'EOS3B-2024-005',
    firmwareVersion: '1.2.2',
    lastHeartbeat: Date.now() - 30000,
    capabilities: {
      aiComputing: true,
      videoProcessing: true,
      storage: true,
      networking: true,
    },
    hardware: {
      cpu: 'Intel i5-13400',
      memory: 16,
      storage: 1024,
      gpu: 'NVIDIA RTX 3060',
    },
    network: {
      type: 'wifi',
      signalStrength: 85,
      bandwidth: 200,
    },
    location: {
      latitude: 30.5728,
      longitude: 104.0668,
      address: '成都市高新区',
    },
    tags: ['边缘节点', '更新中'],
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30000,
  },
];

/**
 * 生成随机设备数据
 */
export function generateMockDevices(count: number): Device[] {
  const devices: Device[] = [];
  const models: ('EOS-3A' | 'EOS-3B' | 'EOS-3C')[] = [
    'EOS-3A',
    'EOS-3B',
    'EOS-3C',
  ];
  const statuses: Device['status'][] = [
    'online',
    'offline',
    'error',
    'updating',
  ];
  const cpus = [
    'Intel i7-12700K',
    'Intel i5-12400',
    'AMD Ryzen 7 5800X',
    'Intel i9-13900K',
    'AMD Ryzen 9 7950X',
  ];
  const gpus = [
    'NVIDIA RTX 4060',
    'NVIDIA RTX 4070',
    'NVIDIA RTX 3060',
    'AMD RX 7800 XT',
  ];

  for (let i = 0; i < count; i++) {
    const modelIndex = i % 3;
    const model = models[modelIndex];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    devices.push({
      id: `device-${i + 100}`,
      name: `${model} #${String(i + 100).padStart(3, '0')}`,
      model,
      status,
      ip: `192.168.${Math.floor(i / 254) + 1}.${(i % 254) + 1}`,
      mac: `00:1A:2B:3C:${Math.floor(i / 256)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0')}:${(i % 256).toString(16).toUpperCase().padStart(2, '0')}`,
      serialNumber: `EOS3${String.fromCharCode(65 + modelIndex)}-2024-${String(i + 100).padStart(3, '0')}`,
      firmwareVersion: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      lastHeartbeat: Date.now() - Math.random() * 4 * 60 * 60 * 1000,
      capabilities: {
        aiComputing: Math.random() > 0.2,
        videoProcessing: Math.random() > 0.4,
        storage: Math.random() > 0.1,
        networking: true,
      },
      hardware: {
        cpu: cpus[Math.floor(Math.random() * cpus.length)],
        memory: [16, 32, 64, 128][Math.floor(Math.random() * 4)],
        storage: [512, 1024, 2048, 4096][Math.floor(Math.random() * 4)],
        gpu: Math.random() > 0.3 ? gpus[Math.floor(Math.random() * gpus.length)] : undefined,
      },
      network: {
        type: ['ethernet', 'wifi', '5g'][Math.floor(Math.random() * 3)] as any,
        signalStrength: 50 + Math.floor(Math.random() * 50),
        bandwidth: [100, 200, 500, 1000][Math.floor(Math.random() * 4)],
      },
      tags:
        i % 3 === 0
          ? ['生产环境']
          : i % 3 === 1
            ? ['开发环境', '测试']
            : ['边缘计算'],
      createdAt: Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
    });
  }

  return devices;
}
