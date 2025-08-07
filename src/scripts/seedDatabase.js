import { supabase } from '../config/database.js';
import { AuthService } from '../services/authService.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data to populate the database
const sampleUsers = [
  {
    username: 'lucas_feliciano',
    name: 'Lucas Feliciano',
    email: 'lucas@feliquiz.com',
    password: '07052003',
    profile_picture: 'https://media.licdn.com/dms/image/v2/D4D03AQE96D4Gs5ECTw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1721184527351?e=1756944000&v=beta&t=Yy6OO6LwTbH5Fiofg7stuDImYSAG1XnfOIS_t49f0J4',
    feli_coins: 500,
    quizzes_taken: 15,
    quizzes_created: 3
  },
  {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    profile_picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    feli_coins: 100,
    quizzes_taken: 8,
    quizzes_created: 0
  },
  {
    username: 'janedoe',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    profile_picture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    feli_coins: 75,
    quizzes_taken: 5,
    quizzes_created: 0
  }
];

const sampleTopics = [
  { name: 'Movies' },
  { name: 'TV Shows' },
  { name: 'Animation' },
  { name: 'Books' },
  { name: 'Games' },
  { name: 'Psychology' },
  { name: 'Lifestyle' }
];

const sampleSubtopics = [
  { topic_name: 'Movies', name: 'Fantasy' },
  { topic_name: 'Movies', name: 'Sci-Fi' },
  { topic_name: 'Movies', name: 'Superheroes' },
  { topic_name: 'Movies', name: 'Comedy' },
  { topic_name: 'Movies', name: 'Drama' },
  { topic_name: 'Psychology', name: 'Leadership' },
  { topic_name: 'Psychology', name: 'Personality' },
  { topic_name: 'Lifestyle', name: 'Colors' },
  { topic_name: 'Lifestyle', name: 'Fashion' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Seed Topics
    console.log('📝 Seeding topics...');
    for (const topic of sampleTopics) {
      const { error } = await supabase
        .from('topics')
        .upsert(topic, { onConflict: 'name' });
      
      if (error) {
        console.error(`❌ Error seeding topic ${topic.name}:`, error);
      } else {
        console.log(`✅ Topic: ${topic.name}`);
      }
    }

    // 2. Get topic IDs and seed subtopics
    console.log('\n📝 Seeding subtopics...');
    const { data: topics } = await supabase.from('topics').select('*');
    
    for (const subtopic of sampleSubtopics) {
      const topic = topics.find(t => t.name === subtopic.topic_name);
      if (topic) {
        const { error } = await supabase
          .from('subtopics')
          .upsert({
            topic_id: topic.id,
            name: subtopic.name
          }, { onConflict: 'topic_id,name' });
        
        if (error) {
          console.error(`❌ Error seeding subtopic ${subtopic.name}:`, error);
        } else {
          console.log(`✅ Subtopic: ${topic.name} > ${subtopic.name}`);
        }
      }
    }

    // 3. Seed Users using AuthService
    console.log('\n👥 Seeding users...');
    for (const userData of sampleUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        console.log(`ℹ️  User ${userData.username} already exists, skipping...`);
        continue;
      }

      const { user, error } = await AuthService.register(userData);
      
      if (error) {
        console.error(`❌ Error creating user ${userData.username}:`, error);
      } else {
        console.log(`✅ User created: ${user.username} (${user.name})`);
        
        // Update additional fields that aren't in registration
        if (userData.feli_coins !== 10 || userData.quizzes_taken > 0) {
          await supabase
            .from('users')
            .update({
              feli_coins: userData.feli_coins,
              quizzes_taken: userData.quizzes_taken,
              quizzes_created: userData.quizzes_created,
              profile_picture: userData.profile_picture
            })
            .eq('id', user.id);
          
          console.log(`   Updated: ${userData.feli_coins} FeliCoins, ${userData.quizzes_taken} quizzes taken`);
        }
      }
    }

    // 4. Seed Sample Quizzes
    console.log('\n🎯 Seeding sample quizzes...');
    
    // Get Lucas's user ID
    const { data: lucasUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'lucas_feliciano')
      .single();

    if (lucasUser) {
      // Sample quizzes data
      const sampleQuizzes = [
        {
          id: '1',
          title: 'Qual Personagem de Harry Potter é Você?',
          description: 'Responda a este quiz e descubra qual bruxo ou bruxa do mundo de Hogwarts mais se parece com você!',
          cover_image: 'https://i.imgur.com/JLNd6dn.png',
          category: 'self-discovery',
          topic: 'Movies',
          subtopic: 'Fantasy',
          coin_reward: 5,
          taken_count: 78900,
          created_by: lucasUser.id,
          created_by_username: 'lucas_feliciano',
          is_published: true
        },
        {
          id: '2',
          title: 'Que Tipo de Líder Você É?',
          description: 'Descubra seu estilo de liderança em apenas 5 perguntas rápidas!',
          cover_image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          category: 'self-discovery',
          topic: 'Psychology',
          subtopic: 'Leadership',
          coin_reward: 0,
          taken_count: 12450,
          created_by: lucasUser.id,
          created_by_username: 'lucas_feliciano',
          is_published: true
        },
        {
          id: '3',
          title: 'Flash: Qual Sua Cor da Sorte Hoje?',
          description: 'Quiz relâmpago de 3 perguntas para descobrir sua cor da sorte!',
          cover_image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          category: 'entertainment',
          topic: 'Lifestyle',
          subtopic: 'Colors',
          coin_reward: 0,
          taken_count: 5670,
          created_by: lucasUser.id,
          created_by_username: 'lucas_feliciano',
          is_published: true
        }
      ];

      for (const quizData of sampleQuizzes) {
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .upsert(quizData, { onConflict: 'id' })
          .select()
          .single();

        if (quizError) {
          console.error(`❌ Error creating quiz ${quizData.title}:`, quizError);
          continue;
        }

        console.log(`✅ Quiz created: ${quiz.title}`);

        // Add questions and results for Harry Potter quiz
        if (quiz.id === '1') {
          // Create questions
          const questions = [
            {
              id: 'q1',
              quiz_id: quiz.id,
              text: 'Um desafio inesperado surge. Qual sua primeira reação?',
              order_index: 1
            },
            {
              id: 'q2',
              quiz_id: quiz.id,
              text: 'O que você mais valoriza em um amigo?',
              order_index: 2
            }
          ];

          for (const question of questions) {
            const { error } = await supabase
              .from('questions')
              .upsert(question, { onConflict: 'id' });
            
            if (error) {
              console.error('❌ Error creating question:', error);
            }
          }

          // Create question options
          const options = [
            {
              id: 'q1o1',
              question_id: 'q1',
              text: 'Enfrentá-lo de frente, a coragem é minha melhor ferramenta.',
              order_index: 1,
              traits: [{ name: "bravery", value: 3 }, { name: "courage", value: 2 }]
            },
            {
              id: 'q1o2',
              question_id: 'q1',
              text: 'Pesquisar sobre o assunto na biblioteca para entender todas as variáveis.',
              order_index: 2,
              traits: [{ name: "intelligence", value: 3 }, { name: "caution", value: 2 }]
            },
            {
              id: 'q2o1',
              question_id: 'q2',
              text: 'Lealdade inabalável, não importa o quão estranhas as coisas fiquem.',
              order_index: 1,
              traits: [{ name: "loyalty", value: 3 }, { name: "teamwork", value: 2 }]
            },
            {
              id: 'q2o2',
              question_id: 'q2',
              text: 'Uma mente aberta que vê a magia que os outros não veem.',
              order_index: 2,
              traits: [{ name: "creativity", value: 3 }, { name: "curiosity", value: 2 }]
            }
          ];

          for (const option of options) {
            const { error } = await supabase
              .from('question_options')
              .upsert(option, { onConflict: 'id' });
            
            if (error) {
              console.error('❌ Error creating option:', error);
            }
          }

          // Create quiz results
          const results = [
            {
              id: 'r1',
              quiz_id: quiz.id,
              character: 'Harry Potter',
              description: 'Você é corajoso, leal e sempre defende o que é certo. Como Harry, você enfrenta o perigo de frente para proteger aqueles de quem gosta e confia em seus instintos.',
              image: 'https://i.imgur.com/qjH4eyS.jpeg',
              badge_image: 'https://i.imgur.com/X6C1X0Q.png',
              traits: [{ name: "bravery", value: 5 }, { name: "loyalty", value: 4 }],
              coin_value: 15
            },
            {
              id: 'r2',
              quiz_id: quiz.id,
              character: 'Hermione Granger',
              description: 'Você é inteligente, metódico e está sempre preparado. Como Hermione, você adora aprender, planeja com antecedência e confia na lógica para resolver problemas.',
              image: 'https://i.imgur.com/GCMIo8S.jpeg',
              badge_image: '/badges/hermione-granger.png',
              traits: [{ name: "intelligence", value: 5 }, { name: "caution", value: 3 }],
              coin_value: 18
            },
            {
              id: 'r3',
              quiz_id: quiz.id,
              character: 'Ron Weasley',
              description: 'Você é leal, de bom coração e às vezes um pouco cético. Como Ron, você valoriza a amizade acima de tudo, traz humor ao grupo e apoia seus amigos mesmo quando está inseguro.',
              image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              badge_image: '/badges/ron-weasley.png',
              traits: [{ name: "loyalty", value: 5 }, { name: "humor", value: 4 }],
              coin_value: 12
            }
          ];

          for (const result of results) {
            const { error } = await supabase
              .from('quiz_results')
              .upsert(result, { onConflict: 'id' });
            
            if (error) {
              console.error('❌ Error creating result:', error);
            }
          }

          console.log('   ✅ Harry Potter quiz fully configured');
        }
      }
    }

    // 5. Add some manifesto likes
    console.log('\n❤️ Adding sample manifesto likes...');
    const { data: users } = await supabase.from('users').select('id').limit(2);
    
    for (const user of users) {
      const { error } = await supabase
        .from('manifesto_likes')
        .upsert({ user_id: user.id }, { onConflict: 'user_id' });
      
      if (error) {
        console.error('❌ Error adding manifesto like:', error);
      }
    }

    console.log('✅ Sample manifesto likes added');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    
    // Get final counts
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: quizCount } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
    const { count: topicCount } = await supabase.from('topics').select('*', { count: 'exact', head: true });
    const { count: likeCount } = await supabase.from('manifesto_likes').select('*', { count: 'exact', head: true });

    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🎯 Quizzes: ${quizCount}`);
    console.log(`   📚 Topics: ${topicCount}`);
    console.log(`   ❤️ Manifesto Likes: ${likeCount}`);

    console.log('\n🔑 Login Credentials:');
    console.log('   Username: lucas_feliciano');
    console.log('   Password: 07052003');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;