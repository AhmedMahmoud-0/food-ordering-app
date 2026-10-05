type Field = {
  label: string;
  placeholder: string;
  validation?: {
    required: string;
    invalid?: string;
  };
};

export type Translations = {
  logo: string;
  home: {
    hero: {
      title: string;
      description: string;
      orderNow: string;
      learnMore: string;
    };
    bestSeller: {
      checkOut: string;
      OurBestSellers: string;
    };
    about: {
      ourStory: string;
      aboutUs: string;
      descriptions: {
        one: string;
        two: string;
        three: string;
      };
    };
    contact: {
      "Don'tHesitate": string;
      contactUs: string;
    };
  };
  navbar: {
    home: string;
    about: string;
    menu: string;
    contact: string;
    login: string;
    register: string;
    signOut: string;
    profile: string;
    admin: string;
  };
  auth: {
    login: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      submit: string;
      authPrompt: {
        message: string;
        signUpLinkText: string;
      };
    };
    register: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      confirmPassword: Field;
      submit: string;
      authPrompt: {
        message: string;
        loginLinkText: string;
      };
    };
  };
  validation: {
    nameRequired: string;
    validEmail: string;
    passwordMinLength: string;
    passwordMaxLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
  };
  menuItem: {
    addToCart: string;
    pickYourSize: string;
    anyExtras: string;
    inCart: string;
    remove: string;
  };
  messages: {
    userNotFound: string;
    incorrectPassword: string;
    loginSuccessful: string;
    unexpectedError: string;
    userAlreadyExists: string;
    accountCreated: string;
    updateProfileSucess: string;
    categoryAdded: string;
    updatecategorySucess: string;
    deleteCategorySucess: string;
    productAdded: string;
    updateProductSucess: string;
    deleteProductSucess: string;
    updateUserSucess: string;
    deleteUserSucess: string;
  };
  checkout: {
    title: string;
    phone: string;
    address: string;
    building: string;
    city: string;
    notes: string;
    submit: string;
    processing: string;
    validation: {
      phoneRequired: string;
      phoneInvalid: string;
      addressRequired: string;
      addressInvalid: string;
      buildingRequired: string;
      cityRequired: string;
    };
    messages: {
      cartEmpty: string;
      orderCreated: string;
      orderFailed: string;
      orderNotFound: string;
      alreadyPaid: string;
      paymentSuccess: string;
      paymentFailed: string;
    };
  };
  cart: {
    title: string;
    noItemsInCart: string;
    subtotal: string;
    delivery: string;
    total: string;
    emptyCart: string;
    size: string;
    extras: string;
  };
  orders: {
    title: string;
    orderId: string;
    date: string;
    total: string;
    payment: string;
    status: string;
    noOrders: string;
  };
  profile: {
    title: string;
    form: {
      name: Field;
      email: Field;
      phone: Field;
      address: Field;
      postalCode: Field;
      city: Field;
      country: Field;
    };
  };
  admin: {
    tabs: {
      profile: string;
      categories: string;
      menuItems: string;
      users: string;
      orders: string;
    };
    categories: {
      form: {
        editName: string;
        name: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
      };
    };
    orders: {
      items: string;
      statusUpdateSuccess: string;
      statusUpdateError: string;
      title: string;
      orderId: string;
      customer: string;
      date: string;
      total: string;
      payment: string;
      status: string;
      noOrders: string;
      details: {
        title: string;
        orderId: string;
        createdAt: string;
        customer: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        building: string;
        city: string;
        notes: string;
        items: string;
        size: string;
        extras: string;
        quantity: string;
        unitPrice: string;
        subtotal: string;
        deliveryFee: string;
        total: string;
        paymentStatus: string;
        orderStatus: string;
        notAvailable: string;
        paymentStatuses: {
          PENDING: string;
          PAID: string;
          FAILED: string;
        };
        statuses: {
          PENDING: string;
          CONFIRMED: string;
          PREPARING: string;
          OUT_FOR_DELIVERY: string;
          DELIVERED: string;
          CANCELLED: string;
        };
      };
    };
    "menu-items": {
      addItemSize: string;
      createNewMenuItem: string;
      addExtraItem: string;
      name: string;
      extraPrice: string;
      select: string;
      menuOption: {
        name: string;
        extraPrice: string;
      };
      form: {
        name: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        description: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        basePrice: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        category: {
          validation: {
            required: string;
          };
        };
        image: {
          validation: {
            required: string;
          };
        };
      };
    };
  };
  products: {
    categories: Record<string, string>;
    sizes: Record<string, string>;
    extras: Record<string, string>;
    items: Record<
      string,
      {
        name: string;
        description: string;
      }
    >;
  };
  sizes: string;
  extrasIngredients: string;
  delete: string;
  cancel: string;
  create: string;
  save: string;
  category: string;
  copyRight: string;
  noProductsFound: string;
};
