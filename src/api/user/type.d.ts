interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: any;
  phone: any;
  role: string;
  createdAt: string;
  updatedAt: string;
}

namespace AUTH {
  type SignUpReq = { email: string; password: string; name: string };
  type SignUpRes = { message: string; user: User; token: string };
  type SignInReq = { email: string; password: string };
  type SignInRes = { message: string; user: User; token: string };
  type MeRes = {
    user: User;
  };
  type MeReq = void;

  type LogoutRes = { message: string };
  type LogoutReq = void;

  type UpdateProfileReq = {
    name?: string;
    phone?: string;
    avatar?: string;
  };
  type UpdateProfileRes = { message: string; user: User; token: string };
}
