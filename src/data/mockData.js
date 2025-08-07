// Mock data for FeliQuiz backend
// This will be replaced with real database queries in production

export const mockUsers = [
  {
    id: '1',
    username: 'lucasfeliciano',
    name: 'Lucas Feliciano',
    email: 'lucas@feliquiz.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123
    profilePicture: 'https://media.licdn.com/dms/image/v2/D4D03AQE96D4Gs5ECTw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1721184527351?e=1756944000&v=beta&t=Yy6OO6LwTbH5Fiofg7stuDImYSAG1XnfOIS_t49f0J4',
    feliCoins: 250,
    quizzesTaken: 15,
    quizzesCreated: 3,
    badges: [
      {
        id: '1',
        title: 'Harry Potter',
        image: 'https://i.imgur.com/X6C1X0Q.png',
        quizId: '1',
        dateEarned: '2024-01-15',
        coinValue: 15
      },
      {
        id: '2',
        title: 'Líder Visionário',
        image: '/badges/visionary-leader.png',
        quizId: '2',
        dateEarned: '2024-01-10',
        coinValue: 25
      }
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    lastLogin: '2024-01-15T10:30:00.000Z',
    isActive: true
  },
  {
    id: '2',
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    feliCoins: 100,
    quizzesTaken: 8,
    quizzesCreated: 0,
    badges: [
      {
        id: '3',
        title: 'Roxo Criatividade',
        image: '/badges/purple-creative.png',
        quizId: '3',
        dateEarned: '2024-01-15',
        coinValue: 10
      }
    ],
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2024-01-15T08:20:00.000Z',
    lastLogin: '2024-01-15T08:20:00.000Z',
    isActive: true
  }
];

export const mockQuizzes = [
  {
    id: '1',
    title: 'Qual Personagem de Harry Potter é Você?',
    description: 'Responda a este quiz e descubra qual bruxo ou bruxa do mundo de Hogwarts mais se parece com você!',
    coverImage: 'https://i.imgur.com/JLNd6dn.png',
    category: 'self-discovery',
    type: 'standard',
    topic: 'Movies',
    subtopic: 'Fantasy',
    takenCount: 78900,
    createdAt: '2023-01-01',
    coinReward: 5,
    createdBy: 'lucasfeliciano',
    isPublished: true,
    isActive: true,
    questions: [
      {
        id: "q1",
        text: "Um desafio inesperado surge. Qual sua primeira reação?",
        options: [
          {
            id: "q1o1",
            text: "Enfrentá-lo de frente, a coragem é minha melhor ferramenta.",
            traits: [{ name: "bravery", value: 3 }, { name: "courage", value: 2 }]
          },
          {
            id: "q1o2",
            text: "Pesquisar sobre o assunto na biblioteca para entender todas as variáveis.",
            traits: [{ name: "intelligence", value: 3 }, { name: "caution", value: 2 }]
          },
          {
            id: "q1o3",
            text: "Garantir que meus amigos estejam seguros antes de fazer qualquer coisa.",
            traits: [{ name: "loyalty", value: 3 }, { name: "humor", value: 1 }]
          },
          {
            id: "q1o4",
            text: "Verificar como posso usar a situação para ganhar vantagem.",
            traits: [{ name: "ambition", value: 3 }, { name: "cunning", value: 2 }]
          }
        ]
      },
      {
        id: "q2",
        text: "O que você mais valoriza em um amigo?",
        options: [
          {
            id: "q2o1",
            text: "Lealdade inabalável, não importa o quão estranhas as coisas fiquem.",
            traits: [{ name: "loyalty", value: 3 }, { name: "teamwork", value: 2 }]
          },
          {
            id: "q2o2",
            text: "Uma mente aberta que vê a magia que os outros não veem.",
            traits: [{ name: "creativity", value: 3 }, { name: "curiosity", value: 2 }]
          },
          {
            id: "q2o3",
            text: "Alguém que me desafia a ser mais forte e confiante.",
            traits: [{ name: "confidence", value: 3 }, { name: "bravery", value: 1 }]
          },
          {
            id: "q2o4",
            text: "Conexões que me ajudam a alcançar meus objetivos e fortalecer minha posição.",
            traits: [{ name: "ambition", value: 2 }, { name: "resourcefulness", value: 2 }]
          }
        ]
      }
    ],
    results: [
      {
        id: "r1",
        character: "Harry Potter",
        description: "Você é corajoso, leal e sempre defende o que é certo. Como Harry, você enfrenta o perigo de frente para proteger aqueles de quem gosta e confia em seus instintos.",
        image: "https://i.imgur.com/qjH4eyS.jpeg",
        badgeImage: "https://i.imgur.com/X6C1X0Q.png",
        traits: [{ name: "bravery", value: 5 }, { name: "loyalty", value: 4 }, { name: "impulsiveness", value: 2 }],
        coinValue: 15
      },
      {
        id: "r2",
        character: "Hermione Granger",
        description: "Você é inteligente, metódico e está sempre preparado. Como Hermione, você adora aprender, planeja com antecedência e confia na lógica para resolver problemas.",
        image: "https://i.imgur.com/GCMIo8S.jpeg",
        badgeImage: "/badges/hermione-granger.png",
        traits: [{ name: "intelligence", value: 5 }, { name: "caution", value: 3 }, { name: "resourcefulness", value: 2 }],
        coinValue: 18
      },
      {
        id: "r3",
        character: "Ron Weasley",
        description: "Você é leal, de bom coração e às vezes um pouco cético. Como Ron, você valoriza a amizade acima de tudo, traz humor ao grupo e apoia seus amigos mesmo quando está inseguro.",
        image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/ron-weasley.png",
        traits: [{ name: "loyalty", value: 5 }, { name: "humor", value: 4 }, { name: "teamwork", value: 2 }],
        coinValue: 12
      }
    ]
  },
  {
    id: '2',
    title: 'Que Tipo de Líder Você É?',
    description: 'Descubra seu estilo de liderança em apenas 5 perguntas rápidas!',
    coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'self-discovery',
    type: 'temporary',
    topic: 'Psychology',
    subtopic: 'Leadership',
    takenCount: 12450,
    createdAt: '2024-01-10',
    coinReward: 0,
    createdBy: 'lucasfeliciano',
    isPublished: true,
    isActive: true,
    expiresAt: '2024-02-10T23:59:59Z',
    questions: [
      {
        id: "q1",
        text: "Como você toma decisões importantes?",
        options: [
          {
            id: "q1o1",
            text: "Analiso todos os dados disponíveis antes de decidir",
            traits: [{ name: "analytical", value: 3 }, { name: "cautious", value: 2 }]
          },
          {
            id: "q1o2",
            text: "Confio na minha intuição e experiência",
            traits: [{ name: "intuitive", value: 3 }, { name: "confident", value: 2 }]
          },
          {
            id: "q1o3",
            text: "Consulto minha equipe antes de decidir",
            traits: [{ name: "collaborative", value: 3 }, { name: "empathetic", value: 2 }]
          }
        ]
      }
    ],
    results: [
      {
        id: "r1",
        character: "Líder Analítico",
        description: "Você é metódico e baseado em dados. Toma decisões bem fundamentadas e minimiza riscos.",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/analytical-leader.png",
        traits: [{ name: "analytical", value: 5 }, { name: "cautious", value: 4 }],
        coinValue: 20
      },
      {
        id: "r2",
        character: "Líder Visionário",
        description: "Você confia na intuição e inspira outros com sua visão clara do futuro.",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/visionary-leader.png",
        traits: [{ name: "intuitive", value: 5 }, { name: "confident", value: 4 }],
        coinValue: 25
      }
    ]
  },
  {
    id: '3',
    title: 'Flash: Qual Sua Cor da Sorte Hoje?',
    description: 'Quiz relâmpago de 3 perguntas para descobrir sua cor da sorte!',
    coverImage: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'entertainment',
    type: 'flash',
    topic: 'Lifestyle',
    subtopic: 'Colors',
    takenCount: 5670,
    createdAt: '2024-01-15',
    coinReward: 0,
    createdBy: 'lucasfeliciano',
    isPublished: true,
    isActive: true,
    expiresAt: '2024-01-16T23:59:59Z',
    questions: [
      {
        id: "q1",
        text: "Como você está se sentindo hoje?",
        options: [
          {
            id: "q1o1",
            text: "Energético e motivado",
            traits: [{ name: "energy", value: 3 }]
          },
          {
            id: "q1o2",
            text: "Calmo e reflexivo",
            traits: [{ name: "calm", value: 3 }]
          },
          {
            id: "q1o3",
            text: "Criativo e inspirado",
            traits: [{ name: "creative", value: 3 }]
          }
        ]
      }
    ],
    results: [
      {
        id: "r1",
        character: "Vermelho Energia",
        description: "Sua cor da sorte hoje é vermelho! Use essa energia para conquistar seus objetivos.",
        image: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/red-energy.png",
        traits: [{ name: "energy", value: 5 }],
        coinValue: 10
      },
      {
        id: "r2",
        character: "Azul Serenidade",
        description: "Sua cor da sorte é azul! Aproveite essa tranquilidade para tomar boas decisões.",
        image: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/blue-calm.png",
        traits: [{ name: "calm", value: 5 }],
        coinValue: 10
      },
      {
        id: "r3",
        character: "Roxo Criatividade",
        description: "Roxo é sua cor! Use essa criatividade para inovar e se expressar.",
        image: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        badgeImage: "/badges/purple-creative.png",
        traits: [{ name: "creative", value: 5 }],
        coinValue: 10
      }
    ]
  }
];

export const mockTopics = [
  {
    id: '1',
    name: 'Movies',
    subtopics: [
      { id: '1-1', name: 'Fantasy' },
      { id: '1-2', name: 'Sci-Fi' },
      { id: '1-3', name: 'Superheroes' },
      { id: '1-4', name: 'Comedy' },
      { id: '1-5', name: 'Drama' }
    ]
  },
  {
    id: '2',
    name: 'TV Shows',
    subtopics: [
      { id: '2-1', name: 'Sitcoms' },
      { id: '2-2', name: 'Drama' },
      { id: '2-3', name: 'Fantasy' },
      { id: '2-4', name: 'Reality' }
    ]
  },
  {
    id: '3',
    name: 'Animation',
    subtopics: [
      { id: '3-1', name: 'Anime' },
      { id: '3-2', name: 'Cartoons' },
      { id: '3-3', name: 'Disney' },
      { id: '3-4', name: 'Pixar' }
    ]
  },
  {
    id: '4',
    name: 'Books',
    subtopics: [
      { id: '4-1', name: 'Fantasy' },
      { id: '4-2', name: 'Science Fiction' },
      { id: '4-3', name: 'Mystery' },
      { id: '4-4', name: 'Young Adult' }
    ]
  },
  {
    id: '5',
    name: 'Games',
    subtopics: [
      { id: '5-1', name: 'RPG' },
      { id: '5-2', name: 'FPS' },
      { id: '5-3', name: 'Strategy' },
      { id: '5-4', name: 'Adventure' }
    ]
  },
  {
    id: '6',
    name: 'Psychology',
    subtopics: [
      { id: '6-1', name: 'Leadership' },
      { id: '6-2', name: 'Personality' },
      { id: '6-3', name: 'Behavior' },
      { id: '6-4', name: 'Emotions' }
    ]
  },
  {
    id: '7',
    name: 'Lifestyle',
    subtopics: [
      { id: '7-1', name: 'Colors' },
      { id: '7-2', name: 'Fashion' },
      { id: '7-3', name: 'Food' },
      { id: '7-4', name: 'Travel' }
    ]
  }
];

export const mockQuizSubmissions = [
  {
    id: '1',
    userId: '1',
    quizId: '1',
    resultId: 'r1',
    submittedAt: '2024-01-15T10:30:00.000Z',
    earnedCoins: 15,
    answers: [
      { questionId: 'q1', optionId: 'q1o1' },
      { questionId: 'q2', optionId: 'q2o1' }
    ],
    traits: [
      { name: 'bravery', value: 5 },
      { name: 'loyalty', value: 4 }
    ]
  },
  {
    id: '2',
    userId: '1',
    quizId: '2',
    resultId: 'r2',
    submittedAt: '2024-01-10T14:20:00.000Z',
    earnedCoins: 25,
    answers: [
      { questionId: 'q1', optionId: 'q1o2' }
    ],
    traits: [
      { name: 'intuitive', value: 5 },
      { name: 'confident', value: 4 }
    ]
  },
  {
    id: '3',
    userId: '2',
    quizId: '3',
    resultId: 'r3',
    submittedAt: '2024-01-15T08:45:00.000Z',
    earnedCoins: 10,
    answers: [
      { questionId: 'q1', optionId: 'q1o3' }
    ],
    traits: [
      { name: 'creative', value: 5 }
    ]
  }
];

// Mock manifesto likes data
export const mockManifestoLikes = {
  totalLikes: 1247,
  userLikes: new Set(['1']) // User IDs who liked
};