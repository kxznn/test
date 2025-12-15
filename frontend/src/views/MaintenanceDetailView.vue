<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useMaintenanceStore } from '../store/maintenanceStore';
import MaintenanceForm from '../components/MaintenanceForm.vue';

const route = useRoute();
const router = useRouter();
const store = useMaintenanceStore();

const maintenanceId = computed(() => route.params.id);
const maintenance = ref(null); 

onMounted(async () => {
    if (store.manutencoes.length === 0) {
        await store.fetchManutencoes();
    }
    
    // CORREÇÃO DE BUSCA ROBUSTA: Garante que comparações sejam feitas entre strings
    const found = store.manutencoes.find(m => String(m.id) === maintenanceId.value);
    
    if (found) {
        maintenance.value = { ...found }; 
    } else {
        console.error(`Manutenção com ID ${maintenanceId.value} não encontrada.`);
        router.push('/lista'); 
    }
});

async function handleEditManutencao(formData) {
    try {
        const dataToSave = {
            id: maintenance.value.id,
            ...formData,
        };
        await store.updateManutencao(dataToSave);
        router.push('/lista'); 
    } catch (error) {
        console.error('Falha ao salvar a edição:', error);
    }
}

async function handleDelete() {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir a manutenção #${maintenanceId.value}?`);

    if (confirmDelete) {
        try {
            // Garante que o ID enviado para o delete seja uma string válida (ex: "4")
            await store.deleteManutencao(String(maintenance.value.id));
            router.push('/lista');
        } catch (error) {
            console.error('Falha ao excluir a manutenção:', error);
            alert(`Erro ao excluir a manutenção. Detalhe: ${error.message}`);
        }
    }
}

function handleCancel() {
    router.push('/lista');
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Editar Manutenção #{{ maintenanceId }}</h1>
    
    <div v-if="!maintenance" class="text-center">Carregando detalhes...</div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md space-y-4">
      
      <MaintenanceForm 
        v-model:maquina="maintenance.maquina"
        v-model:data="maintenance.data"
        v-model:tecnico="maintenance.tecnico"
        v-model:status="maintenance.status"
        @submit="handleEditManutencao"
        @cancel="handleCancel"
        
        button-text="Salvar Edição"
        cancel-text="Cancelar Edição"
      >
        <template #footer-actions-left>
            <button 
                @click.prevent="handleDelete" 
                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mr-auto"
            >
                Excluir
            </button>
        </template>
      </MaintenanceForm>

      <div class="mt-6 flex justify-start pt-4 border-t">
         <button @click="handleCancel" 
                 class="text-indigo-600 hover:text-indigo-900 font-medium flex items-center 
                        px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
            &larr; Voltar para a Lista
        </button>
      </div>
    </div>
  </div>
</template>