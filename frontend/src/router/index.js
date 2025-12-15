import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/calendario', name: 'Calendario', component: () => import('../views/CalendarView.vue') },
  { path: '/lista', name: 'ListaManutencoes', component: () => import('../views/MaintenanceListView.vue') },
  { path: '/lista/:id', name: 'DetalhesManutencao', component: () => import('../views/MaintenanceDetailView.vue'), props: true },
  
  // NOVA ROTA
  { 
    path: '/cadastros', 
    name: 'Cadastros', 
    component: () => import('../views/RegistersView.vue') 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;