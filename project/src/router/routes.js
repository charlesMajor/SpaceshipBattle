const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/mission/player/:playerName/ship/:shipId',
    name: 'Mission',
    component: () => import('../views/MissionView.vue'),
    props: true
  },
  {
    path: '/score',
    name: 'Score',
    component: () => import('../views/ScoreView.vue')
  }
]

export default routes
