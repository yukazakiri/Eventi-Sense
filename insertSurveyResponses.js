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
  "The customer support team is excellent and responsive.",
  "I feel confident that my data is kept secure.",
  "I would appreciate more transparency about data handling practices.",
  "The privacy controls are easy to find and adjust.",
  "I'm concerned about how my personal information is being used.",
  "The security measures in place give me peace of mind."
];

function generateRandomRating() {
  // Weighted random rating (2-5 ratings, with 2 being very rare)
  const weights = [0.001, 0.3, 0.4, 0.299]; // 0.1% for 2, 30% for 3, 40% for 4, 29.9% for 5
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return i + 2; // Offset by 2 to get ratings 2-5
    }
  }
  return 5;
}

// Generate slightly different weights for data security to reflect potential concerns
function generateDataSecurityRating() {
  const weights = [0.001, 0.2, 0.5, 0.299]; // 0.1% for 2, 20% for 3, 50% for 4, 29.9% for 5
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return i + 2; // Offset by 2 to get ratings 2-5
    }
  }
  return 5;
}

function generateSurveyResponse(userId) {
  const isDataSecurityComment = Math.random() < 0.4; // 40% chance of getting a data security related comment
  let commentPool = commentTemplates;
  
  // If we want a data security comment, only use the last 5 comments which are related to security
  if (isDataSecurityComment) {
    commentPool = commentTemplates.slice(15); // Get only the data security comments
  } else {
    commentPool = commentTemplates.slice(0, 15); // Get the non-security comments
  }

  return {
    user_id: userId,
    usability: generateRandomRating(),
    responsiveness_performance: generateRandomRating(),
    functionality: generateRandomRating(),
    reliability: generateRandomRating(),
    data_security: generateDataSecurityRating(), // Using the specialized data security rating function
    user_satisfaction: generateRandomRating(),
    comment: Math.random() < 0.7 ? // 70% chance of having a comment
      commentPool[Math.floor(Math.random() * commentPool.length)] :
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