export interface Lideres {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    senha: string;
    createdAt: Date;
}

export enum Cargo {
    PASTOR = "Pastor",
    LIDER = "Lider",
    SECRETARIO = "Secretaria",
    ADMINISTRATIVO = "Administrativo"
}
