<script setup>
import { onMounted, computed } from 'vue';
import KpiCard from '../components/KpiCard.vue';
import MaintenanceChart from '../components/MaintenanceChart.vue'; // Importa o gráfico
import { useMaintenanceStore } from '../store/maintenanceStore';

const store = useMaintenanceStore();

onMounted(() => {
  store.fetchManutencoes();
});

// Prepara os dados para o gráfico
const chartData = computed(() => {
  const labels = ['Atrasadas', 'Concluídas', 'Pendentes'];
  const data = [
    store.kpis.atrasadas,
    store.kpis.concluidas,
    store.kpis.pendentes,
  ];

  return {
    labels: labels,
    datasets: [{
      label: 'Total de Manutenções por Status',
      backgroundColor: ['#EF4444', '#22C55E', '#EAB308'], // Vermelho, Verde, Amarelo
      data: data,
    }]
  };
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
    
    <div v-if="store.isLoading" class="text-center">Carregando dados...</div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard title="Manutenções Atrasadas" :value="store.kpis.atrasadas" colorClass="text-red-500" />
      <KpiCard title="Manutenções Concluídas" :value="store.kpis.concluidas" colorClass="text-green-500" />
      <KpiCard title="Manutenções Pendentes" :value="store.kpis.pendentes" colorClass="text-yellow-500" />
    </div>

    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Evolução das Manutenções</h2>
      <MaintenanceChart v-if="!store.isLoading" :chart-data="chartData" />
    </div>
  </div>
</template>