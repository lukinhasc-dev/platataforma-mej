export interface Material {
    id: number;
    titulo_material: string;
    categoria_material: Categoria;
    autor_material: string;
    link_material: string;
    created_at: Date;
    updated_at: Date;
}

export enum Categoria {
    SERMAO = 'Sermão',
    MUSICA = 'Música',
    ESTUDOS = 'Estudos',
    AVISOS = 'Avisos',
    EVENTOS = 'Eventos'
}