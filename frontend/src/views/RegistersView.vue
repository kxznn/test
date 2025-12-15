<script setup>
import { ref, onMounted } from 'vue';
import { useMaintenanceStore } from '../store/maintenanceStore';
import { 
    EyeIcon, 
    EyeSlashIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    XMarkIcon 
} from '@heroicons/vue/24/outline';

const store = useMaintenanceStore();

// Estados dos formulários
// Adicionamos 'id' para saber se estamos criando ou editando
const machineForm = ref({ id: null, nome: '', tipo: '' });
const techForm = ref({ id: null, nome: '' });

// Estados de Visibilidade das Listas
const showListaMaquinas = ref(false);
const showListaTecnicos = ref(false);

onMounted(() => {
  store.fetchOpcoes();
});

// ==========================
// LÓGICA MÁQUINAS
// ==========================

async function handleSubmitMachine() {
  if (!machineForm.value.nome || !machineForm.value.tipo) return;
  
  await store.saveMaquina({ ...machineForm.value });
  
  const acao = machineForm.value.id ? 'atualizada' : 'adicionada';
  alert(`Máquina ${acao}!`);
  
  cancelEditMachine(); // Limpa o form
  showListaMaquinas.value = true; // Mostra a lista para ver o resultado
}

function prepareEditMachine(maquina) {
    // Preenche o formulário com os dados da máquina clicada
    machineForm.value = { ...maquina };
    showListaMaquinas.value = true; // Garante que a lista continua visível
}

async function handleDeleteMachine(id) {
    if (confirm("Tem certeza que deseja excluir esta máquina?")) {
        await store.removeMaquina(id);
        // Se estava editando a máquina que foi excluída, limpa o form
        if (machineForm.value.id === id) cancelEditMachine();
    }
}

function cancelEditMachine() {
    machineForm.value = { id: null, nome: '', tipo: '' };
}

// ==========================
// LÓGICA TÉCNICOS
// ==========================

async function handleSubmitTech() {
  if (!techForm.value.nome) return;
  
  await store.saveTecnico({ ...techForm.value });
  
  const acao = techForm.value.id ? 'atualizado' : 'adicionado';
  alert(`Técnico ${acao}!`);
  
  cancelEditTech();
  showListaTecnicos.value = true;
}

function prepareEditTech(tecnico) {
    techForm.value = { ...tecnico };
    showListaTecnicos.value = true;
}

async function handleDeleteTech(id) {
    if (confirm("Tem certeza que deseja excluir este técnico?")) {
        await store.removeTecnico(id);
        if (techForm.value.id === id) cancelEditTech();
    }
}

function cancelEditTech() {
    techForm.value = { id: null, nome: '' };
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Cadastros Auxiliares</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div class="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 class="text-xl font-bold mb-4 text-indigo-700 flex justify-between items-center">
            Máquinas
            <span v-if="machineForm.id" class="text-xs font-normal text-orange-600 bg-orange-100 px-2 py-1 rounded border border-orange-200">
                Editando: #{{ machineForm.id }}
            </span>
        </h2>
        
        <form @submit.prevent="handleSubmitMachine" class="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200 relative transition-all" :class="{'border-orange-300 bg-orange-50': machineForm.id}">
          
          <button v-if="machineForm.id" type="button" @click="cancelEditMachine" class="absolute top-2 right-2 text-gray-400 hover:text-red-500" title="Cancelar Edição">
            <XMarkIcon class="h-5 w-5" />
          </button>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Nome da Máquina</label>
            <input v-model="machineForm.nome" type="text" required placeholder="Ex: Torno CNC" 
                   class="mt-1 block w-full h-10 px-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Tipo</label>
            <input v-model="machineForm.tipo" type="text" required placeholder="Ex: Industrial" 
                   class="mt-1 block w-full h-10 px-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
          </div>
          
          <button type="submit" 
            class="w-full text-white py-2 rounded-md font-medium transition-colors shadow-sm"
            :class="machineForm.id ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'"
          >
            {{ machineForm.id ? 'Salvar Alterações' : 'Adicionar Máquina' }}
          </button>
        </form>

        <button 
            @click="showListaMaquinas = !showListaMaquinas"
            class="w-full flex items-center justify-center text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2 rounded-md transition-colors mb-2"
        >
            <component :is="showListaMaquinas ? EyeSlashIcon : EyeIcon" class="h-5 w-5 mr-2" />
            {{ showListaMaquinas ? 'Ocultar Lista' : 'Ver Máquinas Cadastradas' }}
        </button>

        <div v-if="showListaMaquinas" class="border-t pt-2 transition-all">
            <ul class="divide-y divide-gray-200 max-h-60 overflow-y-auto pr-1">
            <li v-for="m in store.opcoesMaquinas" :key="m.id" class="py-3 flex justify-between items-center group hover:bg-gray-50 rounded px-2 transition-colors">
                <div>
                    <div class="font-medium text-gray-800">{{ m.nome }}</div>
                    <div class="text-xs text-gray-500">{{ m.tipo }}</div>
                </div>
                <div class="flex space-x-2">
                    <button @click="prepareEditMachine(m)" class="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Editar">
                        <PencilSquareIcon class="h-4 w-4" />
                    </button>
                    <button @click="handleDeleteMachine(m.id)" class="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Excluir">
                        <TrashIcon class="h-4 w-4" />
                    </button>
                </div>
            </li>
            <li v-if="store.opcoesMaquinas.length === 0" class="text-gray-500 text-sm py-4 text-center italic">
                Nenhuma máquina cadastrada.
            </li>
            </ul>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 class="text-xl font-bold mb-4 text-indigo-700 flex justify-between items-center">
            Técnicos
            <span v-if="techForm.id" class="text-xs font-normal text-orange-600 bg-orange-100 px-2 py-1 rounded border border-orange-200">
                Editando: #{{ techForm.id }}
            </span>
        </h2>
        
        <form @submit.prevent="handleSubmitTech" class="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200 relative transition-all" :class="{'border-orange-300 bg-orange-50': techForm.id}">
          
          <button v-if="techForm.id" type="button" @click="cancelEditTech" class="absolute top-2 right-2 text-gray-400 hover:text-red-500" title="Cancelar Edição">
            <XMarkIcon class="h-5 w-5" />
          </button>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Nome do Técnico</label>
            <input v-model="techForm.nome" type="text" required placeholder="Ex: Maria Silva" 
                   class="mt-1 block w-full h-10 px-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
          </div>
          
          <button type="submit" 
            class="w-full text-white py-2 rounded-md font-medium transition-colors shadow-sm"
            :class="techForm.id ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'"
          >
            {{ techForm.id ? 'Salvar Alterações' : 'Adicionar Técnico' }}
          </button>
        </form>

        <button 
            @click="showListaTecnicos = !showListaTecnicos"
            class="w-full flex items-center justify-center text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2 rounded-md transition-colors mb-2"
        >
            <component :is="showListaTecnicos ? EyeSlashIcon : EyeIcon" class="h-5 w-5 mr-2" />
            {{ showListaTecnicos ? 'Ocultar Lista' : 'Ver Técnicos Cadastrados' }}
        </button>

        <div v-if="showListaTecnicos" class="border-t pt-2 transition-all">
            <ul class="divide-y divide-gray-200 max-h-60 overflow-y-auto pr-1">
            <li v-for="t in store.opcoesTecnicos" :key="t.id" class="py-3 flex justify-between items-center group hover:bg-gray-50 rounded px-2 transition-colors">
                <span class="font-medium text-gray-800">{{ t.nome }}</span>
                <div class="flex space-x-2">
                    <button @click="prepareEditTech(t)" class="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Editar">
                        <PencilSquareIcon class="h-4 w-4" />
                    </button>
                    <button @click="handleDeleteTech(t.id)" class="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Excluir">
                        <TrashIcon class="h-4 w-4" />
                    </button>
                </div>
            </li>
            <li v-if="store.opcoesTecnicos.length === 0" class="text-gray-500 text-sm py-4 text-center italic">
                Nenhum técnico cadastrado.
            </li>
            </ul>
        </div>
      </div>

    </div>
  </div>
</template>