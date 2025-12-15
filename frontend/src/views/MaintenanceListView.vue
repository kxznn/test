<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MaintenanceTable from '../components/MaintenanceTable.vue';
import MaintenanceForm from '../components/MaintenanceForm.vue';
import { useMaintenanceStore } from '../store/maintenanceStore';

const store = useMaintenanceStore();
const router = useRouter(); 
const showForm = ref(false);

// Estado para os filtros
const filtros = ref({
  maquina: '',
  status: '',
  dataFiltro: '', // NOVO: Campo para filtro de data (RF05)
});

onMounted(() => {
  if (store.manutencoes.length === 0) {
    store.fetchManutencoes();
  }
});

// Lista de manutenções filtrada
const manutençõesFiltradas = computed(() => {
  return store.manutencoes.filter(m => {
    
    // CORREÇÃO AQUI: 
    // Verifica se m.maquina é um objeto e pega o .nome, ou usa vazio se não existir
    const nomeMaquina = m.maquina?.nome || ''; 
    
    const maquinaMatch = nomeMaquina.toLowerCase().includes(filtros.value.maquina.toLowerCase());
    const statusMatch = filtros.value.status === '' || m.status?.toLowerCase() === filtros.value.status.toLowerCase();
    const dataMatch = filtros.value.dataFiltro === '' || m.data === filtros.value.dataFiltro;

    return maquinaMatch && statusMatch && dataMatch; 
  });
});

async function handleAddManutencao(formData) {
  try {
    await store.addManutencao(formData);
    showForm.value = false;
    // Adicionar feedback visual aqui depois
  } catch (error) {
    console.error(error);
  }
}

// Função para navegar para a página de detalhes (RF06)
function goToDetails(id) {
    router.push(`/lista/${id}`);
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Manutenções</h1>
      <button @click="showForm = !showForm" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        {{ showForm ? 'Fechar Formulário' : 'Adicionar Manutenção' }}
      </button>
    </div>
    
    <div v-if="showForm" class="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">Registro de Manutenção</h2>
        <MaintenanceForm @submit="handleAddManutencao" />
    </div>

    <div class="mb-6 bg-white p-4 rounded-lg shadow-md flex space-x-4">
        <div class="flex-1">
            <label for="filtro-maquina" class="block text-sm font-medium text-gray-700">Filtrar por Máquina</label>
            <input v-model="filtros.maquina" type="text" id="filtro-maquina" class="mt-1 block w-full shadow-sm h-10 px-3 py-2 border-gray-300 rounded-md">
        </div>
        <div class="flex-1">
            <label for="filtro-status" class="block text-sm font-medium text-gray-700">Filtrar por Status</label>
            <select v-model="filtros.status" id="filtro-status" class="mt-1 block w-full h-10 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Todos</option>
                <option value="Concluída">Concluída</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasada">Atrasada</option>
            </select>
        </div>
        <div class="flex-1">
            <label for="filtro-data" class="block text-sm font-medium text-gray-700">Filtrar por Data</label>
            <input v-model="filtros.dataFiltro" type="date" id="filtro-data" class="mt-1 block w-full shadow-sm h-10 px-3 py-2 border-gray-300 rounded-md">
        </div>
    </div>

    <div v-if="store.isLoading" class="text-center">Carregando...</div>
    <MaintenanceTable v-else :manutencoes="manutençõesFiltradas" @view-edit="goToDetails" />
  </div>
</template>