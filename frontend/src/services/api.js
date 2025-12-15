import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sysmaintenance-facul.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // --- Manutenções ---
  getManutencoes() { return apiClient.get('/manutencao'); },
  addManutencao(dados) { return apiClient.post('/manutencao', dados); },
  updateManutencao(dados) { return apiClient.put(`/manutencao/${dados.id}`, dados); },
  deleteManutencao(id) { return apiClient.delete(`/manutencao/${id}`); },

  // --- Máquinas ---
  getMaquinas() { return apiClient.get('/maquina'); },
  createMaquina(maquina) { return apiClient.post('/maquina', maquina); },
  updateMaquina(maquina) { return apiClient.put(`/maquina/${maquina.id}`, maquina); },
  deleteMaquina(id) { return apiClient.delete(`/maquina/${id}`); },

  // --- Técnicos ---
  getTecnicos() { return apiClient.get('/tecnico'); },
  createTecnico(tecnico) { return apiClient.post('/tecnico', tecnico); },
  updateTecnico(tecnico) { return apiClient.put(`/tecnico/${tecnico.id}`, tecnico); },
  deleteTecnico(id) { return apiClient.delete(`/tecnico/${id}`); }
};