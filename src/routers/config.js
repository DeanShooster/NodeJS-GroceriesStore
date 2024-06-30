const groceryRouters = {
  Groceries: {
    path: "/groceries",
  },
  Cart: {
    path: "/cart",
  },
  Admin: {
    addItem: "/admin-add-store-item",
  },
};

const babyMonitorRouters = {
  Sign: {
    path: "/sign",
  },
  Auth: {
    path: "/auth",
  },
  Information: {
    path: "/information",
    subPaths: {
      avatar: "/avatar",
      diaper: "/diaper",
      sleep: "/sleep",
    },
  },
};

module.exports = { groceryRouters, babyMonitorRouters };
