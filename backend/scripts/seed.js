import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Quiz } from '../src/models/Quiz.js';
import { Question } from '../src/models/Question.js';
import { User } from '../src/models/User.js';

dotenv.config();

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);

    await Quiz.deleteMany({});
    await Question.deleteMany({});

    // JavaScript Basics Quiz
    const jsQuiz = await Quiz.create({
      title: 'JavaScript Fundamentals',
      description: 'Essential JavaScript programming concepts and syntax',
      passThreshold: 60
    });

    const jsQuestions = [
      {
        questionText: 'Which keyword declares a block-scoped variable?',
        options: ['var', 'let', 'const', 'both let and const'],
        correctAnswer: 3
      },
      {
        questionText: 'What is the output of typeof null?',
        options: ['null', 'object', 'undefined', 'number'],
        correctAnswer: 1
      },
      {
        questionText: 'Which array method creates a new array with filtered items?',
        options: ['forEach', 'map', 'filter', 'reduce'],
        correctAnswer: 2
      },
      {
        questionText: 'Which symbol is used for strict equality?',
        options: ['==', '=', '===', '!=='],
        correctAnswer: 2
      },
      {
        questionText: 'What does JSON stand for?',
        options: ['Java Source Open Network', 'JavaScript Object Notation', 'Java Serialized Object Notation', 'None'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(jsQuestions.map(q => ({ ...q, quizId: jsQuiz._id })));

    // React Development Quiz
    const reactQuiz = await Quiz.create({
      title: 'React Development',
      description: 'Modern React development with hooks and components',
      passThreshold: 65
    });

    const reactQuestions = [
      {
        questionText: 'Which hook is used to manage component state?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1
      },
      {
        questionText: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Express'],
        correctAnswer: 0
      },
      {
        questionText: 'Which method is used to create a React component?',
        options: ['React.component()', 'function Component()', 'class Component extends React.Component', 'Both B and C'],
        correctAnswer: 3
      },
      {
        questionText: 'What does useEffect hook do?',
        options: ['Manages state', 'Handles side effects', 'Creates context', 'Renders components'],
        correctAnswer: 1
      },
      {
        questionText: 'How do you pass data from parent to child component?',
        options: ['Using state', 'Using props', 'Using context', 'Using hooks'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(reactQuestions.map(q => ({ ...q, quizId: reactQuiz._id })));

    // Node.js Backend Quiz
    const nodeQuiz = await Quiz.create({
      title: 'Node.js Backend Development',
      description: 'Server-side JavaScript development with Node.js and Express',
      passThreshold: 60
    });

    const nodeQuestions = [
      {
        questionText: 'Which module is used to create HTTP servers in Node.js?',
        options: ['fs', 'http', 'path', 'url'],
        correctAnswer: 1
      },
      {
        questionText: 'What is npm?',
        options: ['Node Package Manager', 'Node Project Manager', 'Network Package Manager', 'New Package Manager'],
        correctAnswer: 0
      },
      {
        questionText: 'Which method is used to read files asynchronously?',
        options: ['fs.readFileSync()', 'fs.readFile()', 'fs.read()', 'fs.open()'],
        correctAnswer: 1
      },
      {
        questionText: 'What is Express.js?',
        options: ['A database', 'A web framework', 'A testing library', 'A build tool'],
        correctAnswer: 1
      },
      {
        questionText: 'How do you handle middleware in Express?',
        options: ['app.use()', 'app.middleware()', 'app.handle()', 'app.process()'],
        correctAnswer: 0
      }
    ];

    await Question.insertMany(nodeQuestions.map(q => ({ ...q, quizId: nodeQuiz._id })));

    // Python Programming Quiz
    const pythonQuiz = await Quiz.create({
      title: 'Python Programming',
      description: 'Core Python programming concepts and data structures',
      passThreshold: 65
    });

    const pythonQuestions = [
      {
        questionText: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1
      },
      {
        questionText: 'What is the output of len([1, 2, 3])?',
        options: ['2', '3', '4', 'Error'],
        correctAnswer: 1
      },
      {
        questionText: 'Which data type is mutable in Python?',
        options: ['tuple', 'string', 'list', 'int'],
        correctAnswer: 2
      },
      {
        questionText: 'How do you create a dictionary in Python?',
        options: ['[]', '()', '{}', '<>'],
        correctAnswer: 2
      },
      {
        questionText: 'What does PEP 8 define?',
        options: ['Python syntax', 'Style guide', 'Error handling', 'Package management'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(pythonQuestions.map(q => ({ ...q, quizId: pythonQuiz._id })));

    // Database Design Quiz
    const dbQuiz = await Quiz.create({
      title: 'Database Design & SQL',
      description: 'Relational database concepts and SQL query optimization',
      passThreshold: 70
    });

    const dbQuestions = [
      {
        questionText: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Standard Query Language', 'Simple Query Language', 'System Query Language'],
        correctAnswer: 0
      },
      {
        questionText: 'Which command is used to retrieve data from a database?',
        options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'],
        correctAnswer: 1
      },
      {
        questionText: 'What is a primary key?',
        options: ['A unique identifier', 'A foreign reference', 'An index', 'A constraint'],
        correctAnswer: 0
      },
      {
        questionText: 'Which normal form eliminates transitive dependencies?',
        options: ['1NF', '2NF', '3NF', '4NF'],
        correctAnswer: 2
      },
      {
        questionText: 'What is the purpose of an index in a database?',
        options: ['Store data', 'Improve query performance', 'Enforce constraints', 'Backup data'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(dbQuestions.map(q => ({ ...q, quizId: dbQuiz._id })));

    // Cybersecurity Fundamentals Quiz
    const securityQuiz = await Quiz.create({
      title: 'Cybersecurity Fundamentals',
      description: 'Essential cybersecurity principles and best practices',
      passThreshold: 75
    });

    const securityQuestions = [
      {
        questionText: 'What does HTTPS provide?',
        options: ['Faster loading', 'Encrypted communication', 'Better SEO', 'Caching'],
        correctAnswer: 1
      },
      {
        questionText: 'Which authentication factor is "something you know"?',
        options: ['Fingerprint', 'Password', 'Smart card', 'Voice recognition'],
        correctAnswer: 1
      },
      {
        questionText: 'What is a firewall?',
        options: ['Antivirus software', 'Network security barrier', 'Encryption tool', 'Backup system'],
        correctAnswer: 1
      },
      {
        questionText: 'What does SQL injection target?',
        options: ['Web servers', 'Databases', 'Email systems', 'File systems'],
        correctAnswer: 1
      },
      {
        questionText: 'What is the principle of least privilege?',
        options: ['Maximum security', 'Minimum necessary access', 'No access control', 'Full administrator rights'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(securityQuestions.map(q => ({ ...q, quizId: securityQuiz._id })));

    // DevOps & Cloud Computing Quiz
    const devopsQuiz = await Quiz.create({
      title: 'DevOps & Cloud Computing',
      description: 'Modern deployment practices and cloud infrastructure',
      passThreshold: 70
    });

    const devopsQuestions = [
      {
        questionText: 'What is CI/CD?',
        options: ['Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Cloud Infrastructure/Cloud Development', 'Container Integration/Container Deployment'],
        correctAnswer: 1
      },
      {
        questionText: 'Which tool is commonly used for containerization?',
        options: ['Git', 'Docker', 'Jenkins', 'Ansible'],
        correctAnswer: 1
      },
      {
        questionText: 'What is Infrastructure as Code (IaC)?',
        options: ['Writing code for applications', 'Managing infrastructure through code', 'Cloud computing service', 'Database management'],
        correctAnswer: 1
      },
      {
        questionText: 'Which AWS service provides compute capacity?',
        options: ['S3', 'RDS', 'EC2', 'CloudFront'],
        correctAnswer: 2
      },
      {
        questionText: 'What is the main benefit of microservices architecture?',
        options: ['Faster development', 'Independent scaling and deployment', 'Lower costs', 'Simpler debugging'],
        correctAnswer: 1
      }
    ];

    await Question.insertMany(devopsQuestions.map(q => ({ ...q, quizId: devopsQuiz._id })));

    const demoEmail = 'demo@example.com';
    const existingUser = await User.findOne({ email: demoEmail });
    if (!existingUser) {
      const passwordHash = await User.hashPassword('Password123');
      await User.create({ name: 'Demo User', email: demoEmail, passwordHash });
      console.log('Demo user created: demo@example.com / Password123');
    }

    console.log('Seed data inserted.');
  } catch (e) {
    console.error('Seed error', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
