const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/budget",
        component: () => import("pages/Budget.vue")
      },
      {
        path: "/research-groups",
        component: () => import("pages/ResearchGroups.vue")
      },
      {
        path: "/poa-groups",
        component: () => import("pages/PoaGroups.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
