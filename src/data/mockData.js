export const mockUsers = [
  {
    id: '1',
    username: 'lucasfeliciano',
    name: 'Lucas Feliciano',
    email: 'lucas@feliquiz.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    feliCoins: 2500,
    badges: [
      {
        id: '1',
        title: 'Harry Potter Character',
        image: '/badges/harry-potter.png',
        quizId: '1',
        dateEarned: '2023-01-15',
        coinValue: 1000
      },
      {
        id: '2',
        title: 'Marvel Superhero',
        image: '/badges/marvel-hero.png',
        quizId: '2',
        dateEarned: '2023-02-10',
        coinValue: 1500
      }
    ],
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    feliCoins: 1000,
    badges: [
      {
        id: '3',
        title: 'Anime Character',
        image: '/badges/anime-character.png',
        quizId: '3',
        dateEarned: '2023-03-20',
        coinValue: 1000
      }
    ],
    createdAt: '2023-02-01T00:00:00.000Z'
  }
];

export const mockQuizzes = [
  {
    id: '1',
    title: 'Which Harry Potter Character Are You?',
    description: 'Take this quiz to find out which Hogwarts student matches your personality!',
    coverImage: 'https://i.imgur.com/JLNd6dn.png',
    category: 'self-discovery',
    topic: 'Movies',
    subtopic: 'Fantasy',
    takenCount: 789,
    createdAt: '2023-01-01',
    coinReward: 100,
    questions: [
      {
        id: 'q1',
        text: 'How do you approach challenges?',
        options: [
          {
            id: 'q1o1',
            text: 'Head-on with courage, even if it\'s risky',
            traits: [{ name: 'bravery', value: 3 }, { name: 'impulsiveness', value: 2 }]
          },
          {
            id: 'q1o2',
            text: 'With careful planning and research',
            traits: [{ name: 'intelligence', value: 3 }, { name: 'caution', value: 2 }]
          },
          {
            id: 'q1o3',
            text: 'By rallying friends and working together',
            traits: [{ name: 'loyalty', value: 3 }, { name: 'teamwork', value: 2 }]
          },
          {
            id: 'q1o4',
            text: 'By finding the most advantageous path, even if clever deception is needed',
            traits: [{ name: 'ambition', value: 3 }, { name: 'cunning', value: 2 }]
          }
        ]
      }
    ],
    results: [
      {
        id: 'r1',
        character: 'Harry Potter',
        description: 'You\'re brave, loyal, and always stand up for what\'s right. Like Harry, you face danger head-on to protect those you care about and rely on your instincts.',
        image: 'https://i.imgur.com/qjH4eyS.jpeg',
        badgeImage: '/badges/harry-potter.png',
        traits: [{ name: 'bravery', value: 5 }, { name: 'loyalty', value: 4 }, { name: 'impulsiveness', value: 2 }],
        coinValue: 1000
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
  }
];