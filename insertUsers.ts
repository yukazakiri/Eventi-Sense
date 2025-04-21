import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE!
)

// Expanded Filipino first names (120+ entries)
const firstNames = [
  // Traditional Spanish-derived
  'Juan', 'José', 'Maria', 'Carmen', 'Luis', 'Carlos', 'Teresa', 'Ramon', 'Consuelo', 'Francisco',
  'Isabel', 'Fernando', 'Guadalupe', 'Alfredo', 'Rosa', 'Ricardo', 'Manuel', 'Dolores', 'Antonio', 'Patricia',
  
  // Common modern Filipino
  'John', 'Michael', 'Michelle', 'Christopher', 'Jennifer', 'Daniel', 'Angel', 'Christian', 'Mark', 'Mary Grace',
  'Ryan', 'Kimberly', 'Paul', 'Marianne', 'Arvin', 'Maricel', 'Jayson', 'Jocelyn', 'Rodel', 'Marilou',
  
  // Regional names (Ilocano, Cebuano, etc.)
  'Bong', 'Nonoy', 'Boyet', 'Ligaya', 'Perla', 'Luningning', 'Luzviminda', 'Edgardo', 'Fe', 'Nenita',
  'Corazon', 'Imelda', 'Rodrigo', 'Efren', 'Virgilio', 'Leila', 'Benigno', 'Jovito', 'Edcel', 'Gloria',
  
  // Nature-inspired
  'Luningning', 'Liwayway', 'Bituin', 'Dalisay', 'Mayumi', 'Sampaguita', 'Sinag', 'Haidee', 'Marikit', 'Alon',
  
  // Modern hybrid names
  'Janella', 'Jerald', 'Jovelyn', 'Cherry Ann', 'Mary Joy', 'John Paul', 'Ana Marie', 'Joanna Marie', 'Juan Carlo', 'Maria Sofia',
  
  // International influences
  'Sophia', 'Ethan', 'Zachary', 'Isabella', 'Nathaniel', 'Gabrielle', 'Vincent', 'Alexandra', 'Adrian', 'Stephanie',
  
  // Bisaya names
  'Junjun', 'Inday', 'Dodong', 'Neneng', 'Totoy', 'Bebang', 'Lito', 'Lorna', 'Junry', 'Baby',
  
  // Muslim/Filipino-Arabic
  'Fatima', 'Amina', 'Mohammad', 'Ibrahim', 'Aisha', 'Yusuf', 'Zainab', 'Abdul', 'Jamal', 'Soraya',
  
  // Chinese-Filipino
  'Santiago', 'Co', 'Tan', 'Lim', 'Uy', 'Sy', 'Go', 'Ong', 'Yu', 'Chan'
];

// Expanded last names (100+ entries)
const lastNames = [
  // Common Spanish-derived
  'Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Aquino', 'Del Rosario', 'Mendoza', 'Torres', 'Gonzales',
  
  // Traditional Filipino
  'Magbanua', 'Macaraeg', 'Dacquel', 'Batungbakal', 'Dalisay', 'Liwanag', 'Dimaguiba', 'Kalaw', 'Sikat', 'Makalintal',
  
  // Regional surnames
  'Ilagan', 'Visaya', 'Bisaya', 'Tagle', 'Cariño', 'Ilacad', 'Bicol', 'Cordero', 'Davao', 'Cebuano',
  
  // Chinese-derived
  'Tan', 'Lim', 'Sy', 'Uy', 'Co', 'Ong', 'Yu', 'Chua', 'Ty', 'Kho',
  
  // Muslim surnames
  'Mangondato', 'Pangandaman', 'Disomimba', 'Abdullah', 'Hassan', 'Macarambon', 'Minalang', 'Bansil', 'Moro', 'Sangki',
  
  // Professional titles-turned-surnames
  'Doktor', 'Abogado', 'Maestro', 'Heneral', 'Senador', 'Gobernador', 'Bishop', 'Kapitan', 'Teniente', 'Presidente',
  
  // Nature-inspired
  'Bundok', 'Ilog', 'Dagat', 'Gubat', 'Langit', 'Bato', 'Bulaklak', 'Kahoy', 'Lupa', 'Silangan',
  
  // Compound surnames
  'Delos Santos', 'Delos Reyes', 'De La Cruz', 'De Vera', 'De Leon', 'De Guzman', 'De Castro', 'De Jesus', 'De Mesa', 'De Villa'
];

// Email generation configuration
const emailFormats = [
  '{f}{l}{yy}', '{f}.{l}{yy}', '{f}_{l}', '{fi}{l}', '{f}{li}',
  '{fi}.{l}', '{l}.{f}', '{f}{mm}{yy}', '{l}{f}{nn}', '{f}{nn}',
  '{fi}{li}{yy}', '{f}-{l}', '{nickname}{yy}',
  // New formats
  '{f}{l}', '{fi}_{l}{yy}', '{nickname}.{l}', '{f}.{li}{yy}',
  '{f}{yy}{mm}', '{l}_{f}{yy}', '{fi}{li}{nn}', '{nickname}{nn}',
  '{f}.{l}', '{fi}{l}{mm}', '{l}{fi}{yy}', '{nickname}_{yy}',
  '{f}{nn}{l}', '{l}{yy}{f}', '{fi}-{li}{yy}', '{f}.{l}{nn}'
];

const nicknames: {[key: string]: string[]} = {
  'Juan': ['juancho', 'jun', 'john', 'juanito', 'johnny'],
  'Maria': ['mar', 'mai', 'mary', 'maring', 'mara', 'marichu'],
  'José': ['pepe', 'joe', 'joey', 'sep', 'josie'],
  'Antonio': ['tony', 'tonio', 'anton', 'antman', 'tonton'],
  'Francisco': ['isco', 'francis', 'frank', 'kiko', 'cisco', 'paco'],
  'Ricardo': ['ric', 'cardo', 'ricky', 'chard', 'richie'],
  'Eduardo': ['ed', 'ward', 'eddie', 'edu', 'eddy', 'wardo'],
  'Roberto': ['bert', 'berto', 'robbie', 'bobby', 'rob', 'obet'],
  'Carlo': ['caloy', 'los', 'carl', 'charlie'],
  'Angelo': ['gelo', 'gel', 'angie', 'angel'],
  'Maricel': ['cel', 'celly', 'mari', 'marcy'],
  'Jennifer': ['jen', 'jenn', 'jenny', 'jeni', 'jennilyn'],
  'Michelle': ['chell', 'mich', 'mitch', 'elle', 'shelly'],
  'Danilo': ['danny', 'dan', 'nil', 'nilo', 'dani'],
  'Christopher': ['chris', 'topher', 'tope', 'kit', 'cris'],
  'Junjun': ['jun', 'junior', 'jj'],
  'Inday': ['inda', 'day', 'inds', 'dayday'],
  'Fatima': ['fats', 'tim', 'tima', 'fati'],
  'Mohammad': ['moh', 'moe', 'ham', 'mad', 'moham'],
  // New entries
  'Michael': ['mike', 'mik', 'micky', 'migs', 'miggy'],
  'Rodrigo': ['rod', 'rody', 'digong', 'drigo', 'rigo'],
  'Sophia': ['soph', 'sophie', 'pia', 'sofi', 'fee'],
  'Elizabeth': ['liz', 'beth', 'eli', 'lisa', 'betty'],
  'Catherine': ['cath', 'cathy', 'kat', 'kate', 'trina'],
  'Gabriel': ['gab', 'gabby', 'gabe', 'yel', 'biel'],
  'Alexandra': ['alex', 'sandra', 'lexi', 'xandra', 'alix'],
  'Christian': ['chris', 'ian', 'tian', 'chano', 'kit'],
  'Stephanie': ['steph', 'steffy', 'annie', 'fanie', 'teppy'],
  'Manuel': ['manny', 'man', 'nuel', 'nel', 'manman'],
  'Rosario': ['rose', 'sario', 'charo', 'rios', 'rosie'],
  'Margarita': ['marga', 'maggie', 'rita', 'marg', 'greta'],
  'Victoria': ['vic', 'vicky', 'tori', 'vicci', 'toya'],
  'Jocelyn': ['joc', 'lyn', 'jocjoc', 'celyn', 'joyce'],
  'Kimberly': ['kim', 'kimmy', 'kimmie', 'berly', 'kiki'],
  'Marianne': ['anne', 'mari', 'marian', 'annie', 'manne']
};

const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

function generateFilipinoEmail(first: string, last: string, birthYear: number): string {
  const format = emailFormats[Math.floor(Math.random() * emailFormats.length)];
  const yy = birthYear.toString().slice(-2);
  const mm = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
  const nn = Math.floor(Math.random() * 99).toString().padStart(2, '0');
  
  const replacements: {[key: string]: string} = {
    '{f}': first.toLowerCase(),
    '{l}': last.toLowerCase(),
    '{fi}': first[0].toLowerCase(),
    '{li}': last.substring(0, 3).toLowerCase(),
    '{yy}': yy,
    '{mm}': mm,
    '{nn}': nn,
    '{nickname}': (nicknames[first] || [first.toLowerCase()])[Math.floor(Math.random() * (nicknames[first]?.length || 1))]
  };

  let email = format;
  for (const [key, value] of Object.entries(replacements)) {
    email = email.replaceAll(key, value);
  }

  if (Math.random() < 0.3) {
    email += Math.floor(Math.random() * 99);
  }

  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  return `${email}@${domain}`.replace(/'/g, '');
}

function generateRandomUser() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const birthYear = Math.floor(Math.random() * (2000 - 1975) + 1975);
  
  return {
    email: generateFilipinoEmail(firstName, lastName, birthYear),
    password: `P@ssw0rd${Math.floor(Math.random() * 999)}!`,
    firstName,
    lastName,
    birthYear
  };
}

async function createUsers(count = 1) {
  console.log(`Creating ${count} users...`);
  
  for (let i = 0; i < count; i++) {
    const user = generateRandomUser();
    
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          birth_year: user.birthYear
        }
      });
      
      if (error) {
        console.error(`Error creating user ${i+1}:`, error);
      } else {
        console.log(`User ${i+1} created:`, data.user.email);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error(`Exception creating user ${i+1}:`, err);
    }
  }
  
  console.log('User creation completed');
}

// Create 122 users with realistic Filipino profiles
createUsers();