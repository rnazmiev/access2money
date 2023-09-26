
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/bank_operations', component: () => import('pages/main/BankOperations.vue') },
      { path: '/scoring', component: () => import('pages/main/Scoring.vue') },
      { path: '/credit_product', component: () => import('pages/main/CreditProduct.vue') },
      { path: '/company_info', component: () => import('pages/main/CompanyInfo.vue') },
      { path: '/commit_loan_ask', component: () => import('pages/main/CommitLoanAsk.vue') }
    ]
  },
  {
    path: '/faq',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Faq.vue') }
    ]
  },
  {
    path: '/document',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Document.vue') }
    ]
  },
  {
    path: '/platform_rules',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/main/PlatformRules.vue') }
    ]
  },
  {
    path: '/policy_privacy',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/main/PolicyPrivacy.vue') }
    ]
  },
  {
    path: '/contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/my_loans',
    component: () => import('layouts/AccountLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/account/MyLoans.vue') },
      { path: '/loan', component: () => import('src/pages/account/Loan.vue') }
    ]
  },
  {
    path: '/account_document',
    component: () => import('layouts/AccountLayout.vue'),
    children: [
      { path: '', component: () => import('pages/account/Document.vue') }
    ]
  },
  {
    path: '/account_transaction',
    component: () => import('layouts/AccountLayout.vue'),
    children: [
      { path: '', component: () => import('pages/account/Transaction.vue') }
    ]
  },
  {
    path: '/account_setting',
    component: () => import('layouts/AccountLayout.vue'),
    children: [
      { path: '', component: () => import('pages/account/Setting.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
