<script setup>
// Adicione Cog6ToothIcon (ícone de engrenagem) ou outro de sua preferência
import { ChartBarIcon, CalendarIcon, ListBulletIcon, Cog6ToothIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <aside class="w-64 min-h-screen bg-gray-800 text-white p-4">
    <h1 class="text-2xl font-bold mb-8">ProSys</h1>
    <nav class="flex flex-col space-y-2">
      <router-link to="/" class="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-900">
        <ChartBarIcon class="h-6 w-6 mr-3" /> Dashboard
      </router-link>
      <router-link to="/calendario" class="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-900">
        <CalendarIcon class="h-6 w-6 mr-3" /> Calendário
      </router-link>
      <router-link to="/lista" class="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-900">
        <Cog6ToothIcon class="h-6 w-6 mr-3" /> Manutenções
      </router-link>

      <router-link to="/cadastros" class="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-900">
        <ListBulletIcon class="h-6 w-6 mr-3" /> Cadastros
      </router-link>
    </nav>
  </aside>
</template>