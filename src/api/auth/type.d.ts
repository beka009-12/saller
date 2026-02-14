interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  stores: Store[];
}

interface Store {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  address?: string;
  region?: string;
  isVerified: boolean;
  isActive: boolean;
  rating?: number;

  ownerId: number;
  owner?: User;

  products?: Product[];

  createdAt: Date;
  updatedAt: Date;
}

namespace AUTH {
  // ! register
  type RegisterReq = {
    email: string;
    password: string;
    name: string;
  };
  type RegisterRes = {
    message: string;
    user: User;
    token: string;
  };
  //! login
  type LoginReq = {
    email: string;
    password: string;
  };
  type LoginRes = {
    message: string;
    user: User;
    token: string;
  };
  // ! get current user
  type CurrentUserRes = {
    user: User;
  };
  type CurrentUserReq = void;

  //! store
  type CreateStoreReq = {
    name: string;
    description?: string;
    logo?: string;
    address?: string;
    region?: string;
  };
  type CreateStoreRes = {
    message: string;
    store: Store;
  };
}
