<script setup>
import { onMounted } from 'vue';
import { useMaintenanceStore } from '../store/maintenanceStore';
import Calendar from '../components/Calendar.vue'; // Importa nosso novo componente
import 'v-calendar/style.css'; // Importa o CSS da biblioteca

const store = useMaintenanceStore();

onMounted(() => {
  if (store.manutencoes.length === 0) {
    store.fetchManutencoes();
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Calendário de Manutenções</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div v-if="store.isLoading" class="text-center">Carregando calendário...</div>
      <Calendar v-else :manutencoes="store.manutencoes" />
    </div>
  </div>
</template>