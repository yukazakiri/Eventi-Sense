import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE
);

// Predefined comments for more realistic feedback
const commentTemplates = [
  "The interface is easy to use and very intuitive.",
  "The system could perform better during busy times.",
  "All the features I need work perfectly.",
  "It would be great to have more options to customize the system.",
  "The system is very stable and reliable.",
  "Navigation is quick and easy to use.",
  "Response time is very fast.",
  "Some features are a bit hard to find.",
  "I had a great experience using the platform overall.",
  "It would help to have more detailed guides or instructions.",
  "I love the modern look and design.",
  "There are occasional glitches, but they don't affect my experience much.",
  "I'm very happy with how the system works.",
  "The mobile experience could use some improvements.",
  "The customer support team is excellent and responsive."
];

function generateRandomRating() {
  // Weighted random rating (only 3-5 ratings)
  const weights = [0.3, 0.4, 0.3]; // Probabilities for ratings 3, 4, 5
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return i + 3; // Offset by 3 to get ratings 3-5
    }
  }
  return 5;
}

function generateSurveyResponse(userId) {
  return {
    user_id: userId,
    usability: generateRandomRating(),
    responsiveness_performance: generateRandomRating(),
    functionality: generateRandomRating(),
    reliability: generateRandomRating(),
    user_satisfaction: generateRandomRating(),
    comment: Math.random() < 0.7 ? // 70% chance of having a comment
      commentTemplates[Math.floor(Math.random() * commentTemplates.length)] :
      null
  };
}

async function createSurveyResponses() {
  try {
    // Fetch all users from profiles table instead of auth.users
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id');

    if (userError) {
      console.error('Error fetching users:', userError);
      return;
    }

    console.log(`Creating survey responses for ${users.length} users...`);

    for (const user of users) {
      // Some users might have multiple responses
      const numberOfResponses = Math.random() < 0.2 ? 2 : 1; // 20% chance of having 2 responses

      for (let i = 0; i < numberOfResponses; i++) {
        const surveyResponse = generateSurveyResponse(user.id);

        const { error: insertError } = await supabase
          .from('survey_responses')
          .insert([surveyResponse]);

        if (insertError) {
          console.error(`Error creating survey response for user ${user.id}:`, insertError);
        } else {
          console.log(`Survey response created for user ${user.id}`);
        }

        // Add delay between insertions
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log('Survey response creation completed');

  } catch (err) {
    console.error('Exception during survey response creation:', err);
  }
}

// Create survey responses for all users
createSurveyResponses();