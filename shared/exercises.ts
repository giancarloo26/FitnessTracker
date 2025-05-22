import { Exercise } from "./schema";
import { v4 as uuidv4 } from "uuid";

// Exercise data with proper categorization and descriptions
export const exerciseData: Exercise[] = [
  {
    id: uuidv4(),
    name: "Agachamento Livre",
    description: "Exercício composto que trabalha quadríceps, glúteos e posterior de coxa. Fundamental para ganho de força.",
    muscleGroup: "Pernas",
    equipment: "Barra",
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Posicione a barra sobre os trapézios, não sobre o pescoço",
      "Mantenha os pés na largura dos ombros e ligeiramente virados para fora",
      "Desça como se fosse sentar em uma cadeira, mantendo o peito erguido",
      "Desça até que as coxas fiquem paralelas ao chão",
      "Empurre através dos calcanhares para retornar à posição inicial"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Flexão de Braço",
    description: "Exercício clássico para peitoral, ombros e tríceps utilizando o peso do próprio corpo.",
    muscleGroup: "Peito",
    equipment: "Peso Corporal",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Apoie as mãos no chão, na largura dos ombros",
      "Mantenha o corpo em linha reta, dos calcanhares à cabeça",
      "Desça o corpo até que o peito quase toque o chão",
      "Empurre o corpo para cima retornando à posição inicial",
      "Mantenha o abdômen contraído durante todo o movimento"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Remada Baixa",
    description: "Exercício para fortalecimento dos músculos das costas, com foco no latíssimo do dorso.",
    muscleGroup: "Costas",
    equipment: "Máquina",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Sente-se na máquina com os joelhos levemente flexionados",
      "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros",
      "Mantenha as costas retas e o peito aberto",
      "Puxe a barra em direção ao abdômen, contraindo as costas",
      "Controle o movimento na volta, sem soltar o peso bruscamente"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Rosca Direta",
    description: "Exercício de isolamento para bíceps. Pode ser realizado com halteres, barra reta ou W.",
    muscleGroup: "Braços",
    equipment: "Halteres",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure os halteres com os braços estendidos",
      "Mantenha os cotovelos próximos ao corpo",
      "Flexione os cotovelos, trazendo os halteres até os ombros",
      "Desça controladamente até a posição inicial"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Prancha Abdominal",
    description: "Exercício isométrico que trabalha toda a região do core, incluindo abdômen, lombar e estabilizadores.",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Apoie os antebraços no chão, com os cotovelos alinhados aos ombros",
      "Estenda as pernas para trás, apoiando as pontas dos pés no chão",
      "Mantenha o corpo em linha reta, dos calcanhares à cabeça",
      "Contraia o abdômen e os glúteos",
      "Mantenha a posição pelo tempo determinado, respirando normalmente"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Desenvolvimento",
    description: "Exercício para desenvolvimento dos deltoides. Pode ser realizado sentado ou em pé.",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Segure os halteres na altura dos ombros, com as palmas voltadas para frente",
      "Mantenha as costas retas e o abdômen contraído",
      "Empurre os halteres para cima, estendendo completamente os braços",
      "Desça controladamente até a posição inicial",
      "Mantenha os ombros afastados das orelhas durante todo o movimento"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Leg Press",
    description: "Exercício de força para pernas, focando principalmente nos quadríceps, mas também trabalhando glúteos e posterior de coxa.",
    muscleGroup: "Pernas",
    equipment: "Máquina",
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Sente-se na máquina com as costas bem apoiadas no encosto",
      "Coloque os pés na plataforma na largura dos ombros",
      "Desbloqueie a máquina e flexione os joelhos, trazendo-os em direção ao peito",
      "Empurre a plataforma até que as pernas estejam quase estendidas",
      "Não trave os joelhos na posição estendida"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Supino Reto",
    description: "Exercício composto para desenvolvimento do peitoral, ombros e tríceps.",
    muscleGroup: "Peito",
    equipment: "Barra",
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Deite-se no banco com os pés apoiados no chão",
      "Segure a barra com as mãos um pouco mais abertas que a largura dos ombros",
      "Desça a barra controladamente até tocar o peito",
      "Empurre a barra para cima até estender os braços",
      "Mantenha os ombros para trás e o peito aberto durante o movimento"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Puxada Alta",
    description: "Exercício para as costas, focando principalmente no latíssimo do dorso e bíceps.",
    muscleGroup: "Costas",
    equipment: "Máquina",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1598266663439-2056e6900339?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Sente-se na máquina com as coxas presas sob os apoios",
      "Segure a barra com as mãos na largura dos ombros ou um pouco mais",
      "Mantenha as costas retas e o peito aberto",
      "Puxe a barra para baixo até que ela toque a parte superior do peito",
      "Controle o movimento na subida, voltando lentamente à posição inicial"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Elevação Lateral",
    description: "Exercício de isolamento para trabalhar os deltoides laterais, ajudando a dar largura aos ombros.",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure um halter em cada mão ao lado do corpo",
      "Mantenha uma leve flexão nos cotovelos durante todo o movimento",
      "Eleve os braços para os lados até que estejam paralelos ao chão",
      "Desça controladamente até a posição inicial"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Abdominal Crunch",
    description: "Exercício básico para fortalecer o reto abdominal, a parte mais superficial do abdômen.",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Deite-se de costas com os joelhos flexionados e os pés apoiados no chão",
      "Coloque as mãos atrás da cabeça ou cruzadas sobre o peito",
      "Levante os ombros e a parte superior das costas do chão",
      "Contraia o abdômen durante o movimento",
      "Desça controladamente, sem deixar a cabeça tocar o chão"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: "Tríceps Corda",
    description: "Exercício de isolamento para fortalecer e definir os tríceps.",
    muscleGroup: "Braços",
    equipment: "Máquina",
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-e0e4c5bfcb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    instructions: [
      "Fique em pé em frente à máquina com os pés na largura dos ombros",
      "Segure as extremidades da corda com as palmas voltadas uma para a outra",
      "Mantenha os cotovelos junto ao corpo durante todo o movimento",
      "Estenda os braços para baixo, abrindo ligeiramente as mãos no final",
      "Volte controladamente à posição inicial"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
