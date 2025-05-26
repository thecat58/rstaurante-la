export interface UsuarioModel{
    id?: number;
    username: string;
    email: string;
    password?: string; 
    role_id?: [];
    user_roles?: UsuarioRole[];
}

export interface UsuarioRole {
  id: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
}


