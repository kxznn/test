<script setup>
import { computed } from 'vue';

const props = defineProps({
  manutencoes: Array,
});

const attributes = computed(() => {
  if (!props.manutencoes || props.manutencoes.length === 0) {
    return [];
  }
  
  return props.manutencoes.map(m => {
      const color = getStatusColor(m.status);
      
      // CORREÇÃO DE DATA: Garantir que a string de data tenha o fuso horário correto (UTC) para evitar problemas de fuso horário, 
      // embora new Date(m.data) seja o padrão.
      const dateString = m.data ? `${m.data}T00:00:00` : new Date();

      return {
        key: m.id,
        // CONVERSÃO DE DATA: Usar a string com o tempo para evitar o fuso horário local
        dates: new Date(dateString), 
        highlight: {
          color: color,
          fillMode: 'light',
          style: { 
            borderRadius: '6px',
          },
        },
        popover: {
          label: `${m.maquina} (${m.status})`,
          visibility: 'hover',
        },
      };
    });
  });

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'concluída': return 'green';
    case 'pendente': return 'yellow';
    case 'atrasada': return 'red';
    default: return 'gray';
  }
};
</script>

<template>
  <div>
    <v-calendar 
      :attributes="attributes"
      is-expanded
      title-position="left"
      class="custom-calendar"
    />
  </div>
</template>

<style>
/* ==========================================================================
   ESTILIZAÇÃO FINAL E CONSOLIDADA PARA O V-CALENDAR
   ==========================================================================
*/

/* --- Configuração Geral do Calendário --- */
.custom-calendar.vc-container {
  --vc-bg: #ffffff;
  --vc-header-arrow-color: #4f46e5;
  --vc-title-color: #111827;
  --vc-weekday-color: #6b7280;
  --vc-font-family: inherit;
  
  border: none;
  width: 100%;
  height: 700px; 
  display: flex;
  flex-direction: column;
}

/* Garante que o grid dos dias ocupe o espaço disponível */
.custom-calendar .vc-weeks {
  flex: 1;
}


/* --- Estilo dos Dias Individuais (O "Quadradinho") --- */
.custom-calendar .vc-day {
  min-height: 90px;
  border: 1px solid #e5e7eb;
  margin: 2px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Efeito de hover nos dias */
.custom-calendar .vc-day:hover {
  background-color: #f9fafb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Destaque para o dia de hoje */
.custom-calendar .vc-day.is-today {
  border-color: #4f46e5;
}


/* --- Estilo dos Marcadores de Manutenção --- */
.custom-calendar .vc-highlight {
  width: 90%;
  height: 90%;
}
</style>