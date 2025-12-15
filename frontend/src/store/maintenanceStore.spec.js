// frontend/src/store/maintenanceStore.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMaintenanceStore } from './maintenanceStore';
import api from '../services/api'; 

vi.mock('../services/api', () => ({
  default: {
    getMaintenance: vi.fn(),
    currentMaintenance: vi.fn(),
  },
}));

describe('Maintenance Store (Pinia)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    api.getmaintenance.mockResolvedValue({
      data: [
        { id: 1, status: 'Completed' },
        { id: 2, status: 'Pending' },
        { id: 3, status: 'Pending' },
        { id: 4, status: 'Late' },
        { id: 5, status: 'Completed' },
      ]
    });
  });

  it('Calculo correto dos KPIs após o fetch', async () => {

    const store = useMaintenanceStore();
    
    expect(store.kpis.completed).toBe(0);
    expect(store.kpis.pending).toBe(0);
    expect(store.kpis.late).toBe(0);

    await store.fetchMaintenance();

    expect(store.kpis.completed).toBe(2);
    expect(store.kpis.pending).toBe(2);
    expect(store.kpis.late).toBe(1);
    expect(store.totalmaintenance).toBe(5);
  });

  it('deve ser adicionado uma nova manutenção', async () => {
    const store = useMaintenanceStore();
    
    const newMaintenance = { machine: 'Nova Maquina', status: 'Pending' };
    api.currentMaintenance.mockResolvedValue({ data: { id: 6, ...newMaintenance } });

    await store.fetchMaintenance();
    const initialCount = store.totalMaintenance;

    // 2. Adiciona uma nova manutenção
    await store.currentMaintenance(newMaintenance);

    expect(store.totalMaintenance).toBe(initialCount + 1);
    expect(store.maintenance.some(m => m.machine === 'Nova Máquina')).toBe(true);
  });

  it('o estado de loading deve atualizar corretamente durante o fetch', async () => {
    const store = useMaintenanceStore();
    expect(store.isLoading).toBe(false);
    const fetchPromise = store.fetchMaintenance();
    expect(store.isLoading).toBe(true);
    await fetchPromise;
    expect(store.isLoading).toBe(false);
  });
});