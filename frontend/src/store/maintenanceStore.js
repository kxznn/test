import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api'; 

export const useMaintenanceStore = defineStore('maintenance', () => {
  // === STATE ===
  const manutencoes = ref([]);
  const opcoesMaquinas = ref([]);
  const opcoesTecnicos = ref([]);
  const isLoading = ref(false);

  // === GETTERS ===
  const totalManutencoes = computed(() => manutencoes.value.length);

  const kpis = computed(() => {
    return {
      concluidas: manutencoes.value.filter(m => m.status === 'Concluída').length,
      pendentes: manutencoes.value.filter(m => m.status === 'Pendente').length,
      atrasadas: manutencoes.value.filter(m => m.status === 'Atrasada').length,
    };
  });

  // === ACTIONS ===

  // --- MANUTENÇÕES ---
  async function fetchManutencoes() {
    isLoading.value = true;
    try {
      const response = await api.getManutencoes();
      manutencoes.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function addManutencao(novaManutencao) {
    try {
      const response = await api.addManutencao(novaManutencao);
      manutencoes.value.push(response.data);
    } catch (error) {
      console.error('Erro ao adicionar manutenção:', error);
      throw error;
    }
  }

  async function updateManutencao(manutencaoAtualizada) {
    try {
      const response = await api.updateManutencao(manutencaoAtualizada);
      const index = manutencoes.value.findIndex(m => m.id === response.data.id);
      if (index !== -1) {
        manutencoes.value[index] = response.data;
      }
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      throw error;
    }
  }

  async function deleteManutencao(id) {
    try {
      await api.deleteManutencao(id);
      manutencoes.value = manutencoes.value.filter(m => m.id !== id);
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      throw error;
    }
  }

  // --- OPÇÕES (MÁQUINAS E TÉCNICOS) ---
  
  async function fetchOpcoes() {
    try {
      const [resMq, resTec] = await Promise.all([
        api.getMaquinas(),
        api.getTecnicos()
      ]);
      opcoesMaquinas.value = resMq.data;
      opcoesTecnicos.value = resTec.data;
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
    }
  }

  // --- ACTIONS DE MÁQUINAS ---
  async function saveMaquina(novaMaquina) {
    // Se tiver ID, é edição (PUT)
    if (novaMaquina.id) {
        try {
            const response = await api.updateMaquina(novaMaquina);
            const index = opcoesMaquinas.value.findIndex(m => m.id === novaMaquina.id);
            if (index !== -1) opcoesMaquinas.value[index] = response.data;
        } catch (error) { console.error(error); throw error; }
    } else {
        // Se não tiver ID, é criação (POST)
        try {
            const response = await api.createMaquina(novaMaquina);
            opcoesMaquinas.value.push(response.data);
        } catch (error) { console.error(error); throw error; }
    }
  }

  async function removeMaquina(id) {
    try {
        await api.deleteMaquina(id);
        // Se deu certo, remove da lista
        opcoesMaquinas.value = opcoesMaquinas.value.filter(m => m.id !== id);
    } catch (error) { 
        // SE O ERRO FOR 404 (Não encontrado), REMOVE DA LISTA MESMO ASSIM
        if (error.response && error.response.status === 404) {
            console.warn(`Máquina ${id} não encontrada no banco, removendo da lista local.`);
            opcoesMaquinas.value = opcoesMaquinas.value.filter(m => m.id !== id);
        } else {
            // Se for outro erro (ex: servidor caiu), mantém o erro
            console.error(error); 
            throw error; 
        }
    }
  }

  // --- ACTIONS DE TÉCNICOS ---
  async function saveTecnico(novoTecnico) {
    if (novoTecnico.id) {
        try {
            const response = await api.updateTecnico(novoTecnico);
            const index = opcoesTecnicos.value.findIndex(t => t.id === novoTecnico.id);
            if (index !== -1) opcoesTecnicos.value[index] = response.data;
        } catch (error) { console.error(error); throw error; }
    } else {
        try {
            const response = await api.createTecnico(novoTecnico);
            opcoesTecnicos.value.push(response.data);
        } catch (error) { console.error(error); throw error; }
    }
  }

  async function removeTecnico(id) {
    try {
        await api.deleteTecnico(id);
        opcoesTecnicos.value = opcoesTecnicos.value.filter(t => t.id !== id);
    } catch (error) { 
        if (error.response && error.response.status === 404) {
            console.warn(`Técnico ${id} não encontrado no banco, removendo da lista local.`);
            opcoesTecnicos.value = opcoesTecnicos.value.filter(t => t.id !== id);
        } else {
            console.error(error); 
            throw error; 
        }
    }
  }

  return {
    manutencoes,
    opcoesMaquinas,
    opcoesTecnicos,
    isLoading,
    totalManutencoes,
    kpis,
    fetchManutencoes,
    addManutencao,
    updateManutencao,
    deleteManutencao,
    fetchOpcoes,
    saveMaquina,
    removeMaquina,
    saveTecnico,
    removeTecnico
  };
});