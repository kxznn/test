<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMaintenanceStore } from '../store/maintenanceStore';

const store = useMaintenanceStore();

const props = defineProps({
  maquina: [String, Object], // Pode vir ID string ou Objeto populado
  tecnico: [String, Object],
  data: String,
  status: String,
  buttonText: { type: String, default: 'Salvar' },
  cancelText: { type: String, default: 'Cancelar' },
});

const emit = defineEmits(['submit', 'cancel']);

// Ao montar, garante que temos as opções para escolher
onMounted(() => {
    if (store.opcoesMaquinas.length === 0) store.fetchOpcoes();
});

const form = ref({
  maquina: '',
  tecnico: '',
  data: '',
  status: 'Pendente',
});

// Observa mudanças nas props (para edição)
watch(props, (newProps) => {
  // Se vier populado (objeto), pegamos o .id ou ._id, senão pegamos a string direta
  form.value.maquina = newProps.maquina?.id || newProps.maquina?._id || newProps.maquina || '';
  form.value.tecnico = newProps.tecnico?.id || newProps.tecnico?._id || newProps.tecnico || '';
  form.value.data = newProps.data || '';
  form.value.status = newProps.status || 'Pendente';
}, { immediate: true });

function handleSubmit() {
  // Envia apenas os IDs para o backend
  emit('submit', { ...form.value });
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700">Máquina</label>
            <select 
                v-model="form.maquina" 
                required 
                class="mt-1 block w-full shadow-sm h-10 px-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="" disabled>Selecione uma máquina</option>
                <option v-for="m in store.opcoesMaquinas" :key="m.id" :value="m.id">
                    {{ m.nome }} ({{ m.tipo }})
                </option>
            </select>
            <p v-if="store.opcoesMaquinas.length === 0" class="text-xs text-red-500 mt-1">
                Nenhuma máquina cadastrada no banco.
            </p>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Técnico</label>
            <select 
                v-model="form.tecnico" 
                required 
                class="mt-1 block w-full shadow-sm h-10 px-3QP border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="" disabled>Selecione um técnico</option>
                <option v-for="t in store.opcoesTecnicos" :key="t.id" :value="t.id">
                    {{ t.nome }}
                </option>
            </select>
        </div>

        <div>
            <label for="data" class="block text-sm font-medium text-gray-700">Data</label>
            <input v-model="form.data" type="date" required class="mt-1 block w-full shadow-sm h-10 px-3 border-gray-300 rounded-md">
        </div>

        <div>
             <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="form.status" class="mt-1 block w-full h-10 px-3 border-gray-300 rounded-md">
                <option>Concluída</option>
                <option>Pendente</option>
                <option>Atrasada</option>
            </select>
        </div>

        <div class="flex justify-end pt-4">
            <slot name="footer-actions-left"></slot> 
            <button type="button" @click="$emit('cancel')" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
                {{ cancelText }}
            </button>
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                {{ buttonText }}
            </button>
        </div>
    </form>
</template>