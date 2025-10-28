/**
 * MSW Mock Handlers - 设备 API
 */

import { http, HttpResponse, delay } from 'msw';
import { mockDevices } from '../data/devices';
import type { GetDevicesResponse, Device, CreateDeviceRequest } from '@/types/api';

export const deviceHandlers = [
  // GET /api/devices - 设备列表
  http.get('/api/devices', async ({ request }) => {
    await delay(300); // 模拟网络延迟

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const model = url.searchParams.get('model');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';

    let devices = [...mockDevices];

    // 筛选
    if (status) {
      devices = devices.filter((d) => d.status === status);
    }
    if (model) {
      devices = devices.filter((d) => d.model === model);
    }

    // 排序
    devices.sort((a, b) => {
      const aVal = a[sort as keyof Device];
      const bVal = b[sort as keyof Device];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    // 分页
    const total = devices.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedDevices = devices.slice(start, end);

    const response: GetDevicesResponse = {
      devices: paginatedDevices,
      total,
      page,
      pageSize,
    };

    return HttpResponse.json({
      success: true,
      data: response,
      timestamp: Date.now(),
    });
  }),

  // GET /api/devices/:id - 设备详情
  http.get('/api/devices/:id', async ({ params }) => {
    await delay(200);

    const { id } = params;
    const device = mockDevices.find((d) => d.id === id);

    if (!device) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Device ${id} not found`,
          },
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: device,
      timestamp: Date.now(),
    });
  }),

  // POST /api/devices - 创建设备
  http.post('/api/devices', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as CreateDeviceRequest;

    // 验证必填字段
    if (!body.name || !body.model || !body.serialNumber || !body.mac) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: {
              required: ['name', 'model', 'serialNumber', 'mac'],
            },
          },
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    // 检查序列号重复
    if (mockDevices.some((d) => d.serialNumber === body.serialNumber)) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Device with this serial number already exists',
            details: {
              field: 'serialNumber',
              value: body.serialNumber,
            },
          },
          timestamp: Date.now(),
        },
        { status: 409 }
      );
    }

    const newDevice: Device = {
      id: `device-${Date.now()}`,
      name: body.name,
      model: body.model,
      status: 'offline',
      ip: body.ip || '',
      mac: body.mac,
      serialNumber: body.serialNumber,
      firmwareVersion: '1.0.0',
      lastHeartbeat: Date.now(),
      capabilities: {
        aiComputing: false,
        videoProcessing: false,
        storage: false,
        networking: false,
      },
      hardware: {
        cpu: 'Unknown',
        memory: 0,
        storage: 0,
      },
      network: {
        type: 'ethernet',
      },
      location: body.location,
      tags: body.tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockDevices.push(newDevice);

    return HttpResponse.json(
      {
        success: true,
        data: { device: newDevice },
        timestamp: Date.now(),
      },
      { status: 201 }
    );
  }),

  // PUT /api/devices/:id - 更新设备
  http.put('/api/devices/:id', async ({ params, request }) => {
    await delay(400);

    const { id } = params;
    const body = (await request.json()) as Partial<CreateDeviceRequest>;
    const index = mockDevices.findIndex((d) => d.id === id);

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Device ${id} not found`,
          },
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    mockDevices[index] = {
      ...mockDevices[index],
      ...body,
      id, // 确保 ID 不变
      updatedAt: Date.now(),
    };

    return HttpResponse.json({
      success: true,
      data: mockDevices[index],
      timestamp: Date.now(),
    });
  }),

  // DELETE /api/devices/:id - 删除设备
  http.delete('/api/devices/:id', async ({ params }) => {
    await delay(300);

    const { id } = params;
    const index = mockDevices.findIndex((d) => d.id === id);

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Device ${id} not found`,
          },
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    mockDevices.splice(index, 1);

    return HttpResponse.json({
      success: true,
      data: null,
      timestamp: Date.now(),
    });
  }),

  // POST /api/devices/:id/heartbeat - 设备心跳
  http.post('/api/devices/:id/heartbeat', async ({ params, request }) => {
    await delay(100);

    const { id } = params;
    const body = await request.json();
    const device = mockDevices.find((d) => d.id === id);

    if (!device) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Device ${id} not found`,
          },
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    // 更新心跳时间和状态
    device.lastHeartbeat = Date.now();
    device.status = (body as any).status || 'online';
    device.updatedAt = Date.now();

    return HttpResponse.json({
      success: true,
      data: { received: true },
      timestamp: Date.now(),
    });
  }),
];
