const constantRoutes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index'),
    meta: {
      title: '主页', keepAlive: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/problems',
    name: 'Problems',
    component: () => import('@/views/problems/Problems'),
    meta: {
      title: '题库', keepAlive: true
    }
  },
  {
    path: '/problems/:pid',
    name: 'ProblemDetails',
    component: () => import('@/views/problems/ProblemDetails'),
    meta: {
      title: '题库'
    }
  },
  {
    path: '/user-home',
    name: 'UserHome',
    component: () => import('@/views/user/UserHome'),
    meta: {
      title: '用户主页'
    }
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import('@/views/status/Status'),
    meta: {
      title: '评测记录'
    }
  },
  {
    path: '/contest',
    name: 'Contest',
    component: () => import('@/views/contest/Contest'),
    meta: { title: '比赛列表' }
  },
  {
    path: '/contest/:contestId',
    name: 'ContestDetails',
    component: () => import('@/views/contest/ContestDetails'),
    meta: { title: '比赛列表' },
    children: [
      {
        path: 'problems',
        name: 'ContestProblemList',
        component: () => import('@/views/contest/children/ContestProblemList'),
        meta: { title: '比赛题目列表' }
      },
      {
        path: 'problems/:pid/',
        name: 'ContestProblemDetails',
        component: () => import('@/views/problems/ProblemDetails'),
        meta: { title: 'Contest Problem Details', requireAuth: true }
      },
      {
        path: 'submissions',
        name: 'ContestSubmissionList',
        component: () => import('@/views/contest/children/ContestSubmissionList'),
        meta: { title: '比赛评测记录' }
      },
      {
        path: 'rank',
        name: 'ContestRank',
        component: () => import('@/views/contest/children/ContestRank'),
        meta: { title: '比赛排行榜' }
      }
    ]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/views/rank/Index'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: '/discuss',
    name: 'Discuss',
    component: () => import('@/views/discuss/Discuss'),
    meta: {
      title: '讨论列表'
    }
  },
  {
    path: '/discuss/edit/:id?',
    name: 'EditDiscuss',
    component: () => import('@/views/discuss/EditDiscuss'),
    meta: {
      title: '编辑帖子', requireAuth: true
    }
  },
  {
    path: '/discuss/:id',
    name: 'DiscussDetail',
    component: () => import('@/views/discuss/DiscussDetails'),
    meta: {
      title: '讨论详情', requireAuth: true
    }
  },
  {
    path: '/editUser',
    name: 'EditUser',
    component: () => import('@/views/settings/EditUser'),
    meta: {

    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/settings/Setting'),
    meta: {

    }
  },
  {
    path: '/accessDenied',
    name: 'AccessDenied',
    component: () => import('@/components/AccessDenied'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      keepAlive: true
    }
  }
]

export { constantRoutes }
