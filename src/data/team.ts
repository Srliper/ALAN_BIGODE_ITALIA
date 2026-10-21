// Equipe padrão — editável no painel admin (aba Equipe).
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  instagram: string;
  photo: string;
}

export const defaultTeam: TeamMember[] = [
  {
    name: 'Alan Bedim',
    role: 'Dono',
    bio: 'Fundador e dono da Barbearia Bigode Italia.',
    instagram: 'https://www.instagram.com/alan70bedim/',
    photo: '',
  },
];

// O selo de coroa aparece para quem tem "dono" no cargo
export const isOwner = (member: Pick<TeamMember, 'role'>) => /dono|propriet/i.test(member.role);
