import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

dotenv.config({ path: "../../.env" });

// =====================================================
// CONFIGURATION
// =====================================================

const TUTOR_ID = "6a8af2393768b112b2441f10";

// =====================================================
// NEW COURSES TO ADD (without deleting existing)
// =====================================================

const NEW_COURSES = [
  {
    title: "Advanced Cream Formulation",
    category: "Cream Making",
    level: "Advanced",
    description:
      "Master advanced cream formulation techniques for professional skincare products.",
    lessons: [
      {
        title: "Advanced Emulsification",
        content:
          "Mastering advanced emulsification techniques for stable creams.",
        duration: 25,
      },
      {
        title: "Active Ingredients Deep Dive",
        content:
          "Understanding and formulating with active ingredients like retinol and vitamin C.",
        duration: 30,
      },
      {
        title: "Preservation Systems",
        content:
          "Creating effective preservation systems for water-based formulations.",
        duration: 20,
      },
      {
        title: "Sensory Evaluation",
        content:
          "How to evaluate and improve the sensory qualities of your creams.",
        duration: 22,
      },
      {
        title: "Scale-Up Production",
        content: "Transitioning from lab to production scale.",
        duration: 28,
      },
    ],
    quizzes: [
      {
        passMark: 50,
        questions: [
          {
            question: "What is the purpose of a primary emulsifier?",
            options: [
              "Forms the emulsion base",
              "Adds fragrance",
              "Thickens",
              "Preserves",
            ],
            answer: 0,
          },
          {
            question: "What is the role of a co-emulsifier?",
            options: [
              "Stabilizes the emulsion",
              "Adds color",
              "Thickens",
              "Preserves",
            ],
            answer: 0,
          },
          {
            question: "What is the ideal pH range for vitamin C creams?",
            options: ["2.5-3.5", "4.5-5.5", "6.5-7.5", "8.5-9.5"],
            answer: 0,
          },
          {
            question: "What is the purpose of a chelating agent?",
            options: [
              "Bind metal ions",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question:
              "What is the best preservative system for natural creams?",
            options: ["Paraben-free systems", "Parabens", "Alcohol", "Salt"],
            answer: 0,
          },
          {
            question: "What is the purpose of a rheology modifier?",
            options: [
              "Control viscosity",
              "Add color",
              "Add fragrance",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question:
              "What is the ideal cooling temperature for active ingredients?",
            options: ["Below 40°C", "Below 60°C", "Below 80°C", "Below 100°C"],
            answer: 0,
          },
          {
            question: "What is the purpose of an antioxidant?",
            options: ["Prevent oxidation", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the best way to test skin compatibility?",
            options: [
              "Patch testing",
              "Taste testing",
              "Smell testing",
              "Visual testing",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a humectant blend?",
            options: [
              "Optimize moisture retention",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Herbal Soap Making Advanced",
    category: "Soap Making",
    level: "Advanced",
    description:
      "Create unique herbal soaps with advanced techniques and natural ingredients.",
    lessons: [
      {
        title: "Herbal Infusions in Soap",
        content: "Creating herbal-infused oils for soap making.",
        duration: 22,
      },
      {
        title: "Advanced Swirling Techniques",
        content: "Creating intricate swirl designs in cold process soap.",
        duration: 26,
      },
      {
        title: "Natural Colorants",
        content:
          "Using natural colorants like clays, spices, and plant powders.",
        duration: 20,
      },
      {
        title: "Additive Incorporation",
        content: "Adding exfoliants, herbs, and other additives to soap.",
        duration: 24,
      },
      {
        title: "Business Scale Production",
        content: "Scaling up soap production for small business.",
        duration: 28,
      },
    ],
    quizzes: [
      {
        passMark: 50,
        questions: [
          {
            question: "What is the purpose of herbal infusions?",
            options: [
              "Add plant benefits and color",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best way to create an herbal infusion?",
            options: ["Slow heat method", "Quick boil", "Microwave", "Freeze"],
            answer: 0,
          },
          {
            question: "What is the purpose of a swirl technique?",
            options: [
              "Create visual patterns",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best natural colorant for green?",
            options: ["Spirulina", "Turmeric", "Paprika", "Cinnamon"],
            answer: 0,
          },
          {
            question: "What is the purpose of adding clay to soap?",
            options: [
              "Add color and skin benefits",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best exfoliant for soap?",
            options: ["Oatmeal", "Sugar", "Salt", "All of the above"],
            answer: 3,
          },
          {
            question: "What is the purpose of a superfat?",
            options: [
              "Add skin benefits",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the ideal cure time for herbal soaps?",
            options: ["4-6 weeks", "2-3 weeks", "1 week", "1 day"],
            answer: 0,
          },
          {
            question: "What is the best way to store finished soap?",
            options: [
              "Cool, dry place",
              "Refrigerator",
              "Freezer",
              "Warm place",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a test batch?",
            options: [
              "Test new recipes",
              "Add fragrance",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Premium Perfume Blending",
    category: "Perfume Making",
    level: "Advanced",
    description:
      "Master the art of premium perfume blending for luxury fragrances.",
    lessons: [
      {
        title: "Fragrance Families",
        content: "Understanding fragrance families and their characteristics.",
        duration: 20,
      },
      {
        title: "Complex Accord Creation",
        content: "Creating complex accords using multiple materials.",
        duration: 28,
      },
      {
        title: "Fixative Systems",
        content: "Building effective fixative systems for longevity.",
        duration: 24,
      },
      {
        title: "Fragrance Evaluation",
        content: "How to evaluate and refine your perfume compositions.",
        duration: 22,
      },
      {
        title: "Market-Ready Production",
        content: "Preparing your perfume for market launch.",
        duration: 26,
      },
    ],
    quizzes: [
      {
        passMark: 50,
        questions: [
          {
            question: "What is a fragrance family?",
            options: [
              "Category of perfumes",
              "Type of bottle",
              "Brand of perfume",
              "None of the above",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of an accord?",
            options: [
              "Create a specific scent",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best fixative for floral perfumes?",
            options: ["Musk", "Vanilla", "Patchouli", "All of the above"],
            answer: 3,
          },
          {
            question: "What is the purpose of a blender?",
            options: ["Combine materials", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the ideal aging time for perfume?",
            options: ["1-3 months", "1-2 weeks", "3-5 days", "1 day"],
            answer: 0,
          },
          {
            question: "What is the purpose of a diffuser?",
            options: ["Spread fragrance", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the best way to test a perfume?",
            options: ["On a blotter", "On skin", "In a bottle", "On paper"],
            answer: 0,
          },
          {
            question: "What is the purpose of a modifier?",
            options: [
              "Adjust scent profile",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best storage for perfume?",
            options: [
              "Dark, cool place",
              "Sunny place",
              "Warm place",
              "Humid place",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a base?",
            options: ["Provide foundation", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Artisan Bread & Pastry",
    category: "Baking",
    level: "Advanced",
    description:
      "Master artisan bread and pastry techniques for professional-quality baked goods.",
    lessons: [
      {
        title: "Sourdough Starter",
        content: "Creating and maintaining a sourdough starter.",
        duration: 25,
      },
      {
        title: "Artisan Bread Techniques",
        content: "Mastering artisan bread shaping and baking.",
        duration: 28,
      },
      {
        title: "Laminated Pastry",
        content:
          "Creating croissants and danishes with laminated pastry techniques.",
        duration: 30,
      },
      {
        title: "French Pastry Classics",
        content: "Mastering French pastry classics like éclairs and macarons.",
        duration: 28,
      },
      {
        title: "Professional Baking",
        content: "Scaling and professional baking techniques.",
        duration: 26,
      },
    ],
    quizzes: [
      {
        passMark: 50,
        questions: [
          {
            question: "What is a sourdough starter?",
            options: [
              "Fermented flour and water",
              "Type of bread",
              "Baking tool",
              "Ingredient",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a stretch and fold?",
            options: ["Develop gluten", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the purpose of lamination?",
            options: ["Create layers", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the best flour for croissants?",
            options: [
              "Bread flour",
              "All-purpose",
              "Cake flour",
              "Whole wheat",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a proofing basket?",
            options: ["Shape the bread", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the ideal baking temperature for baguettes?",
            options: ["230°C", "200°C", "180°C", "250°C"],
            answer: 0,
          },
          {
            question: "What is the purpose of a steam injection?",
            options: ["Create crisp crust", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the best way to test bread doneness?",
            options: [
              "Internal temperature",
              "Color",
              "Sound",
              "All of the above",
            ],
            answer: 3,
          },
          {
            question: "What is the purpose of a scoring blade?",
            options: [
              "Create design on bread",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best storage for artisan bread?",
            options: ["Bread box", "Refrigerator", "Freezer", "Plastic bag"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Industrial Chemical Production",
    category: "Chemical Making",
    level: "Advanced",
    description:
      "Learn industrial-scale chemical production techniques for insecticides and disinfectants.",
    lessons: [
      {
        title: "Industrial Safety Protocols",
        content: "Advanced safety protocols for chemical production.",
        duration: 25,
      },
      {
        title: "Large-Scale Formulation",
        content: "Scaling formulations for industrial production.",
        duration: 30,
      },
      {
        title: "Quality Assurance Systems",
        content: "Implementing quality assurance systems in production.",
        duration: 28,
      },
      {
        title: "Production Efficiency",
        content: "Optimizing production efficiency and reducing waste.",
        duration: 26,
      },
      {
        title: "Regulatory Compliance",
        content: "Understanding and implementing regulatory compliance.",
        duration: 24,
      },
    ],
    quizzes: [
      {
        passMark: 50,
        questions: [
          {
            question: "What is the purpose of a hazard assessment?",
            options: ["Identify risks", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the purpose of a production scale-up?",
            options: [
              "Increase production volume",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the role of quality control in production?",
            options: [
              "Ensure product quality",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a batch record?",
            options: [
              "Track production details",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best storage for chemicals?",
            options: [
              "Temperature-controlled area",
              "Outdoors",
              "Warm area",
              "Sunny area",
            ],
            answer: 0,
          },
          {
            question: "What is the purpose of a safety audit?",
            options: [
              "Evaluate safety practices",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the role of a production manager?",
            options: ["Oversee production", "Add color", "Thicken", "Preserve"],
            answer: 0,
          },
          {
            question: "What is the purpose of an emergency response plan?",
            options: [
              "Prepare for emergencies",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
          {
            question: "What is the best practice for waste management?",
            options: ["Proper disposal", "Dump anywhere", "Burn", "Bury"],
            answer: 0,
          },
          {
            question: "What is the purpose of a quality audit?",
            options: [
              "Ensure quality standards",
              "Add color",
              "Thicken",
              "Preserve",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
];

// =====================================================
// GENERATE NEW COURSES (without deleting existing)
// =====================================================

async function generateCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const tutor = await User.findById(TUTOR_ID);
    if (!tutor) {
      console.error("❌ Tutor not found. Please check TUTOR_ID");
      process.exit(1);
    }
    console.log(`✅ Tutor found: ${tutor.name}`);

    // Check existing courses count
    const existingCourses = await Course.countDocuments({});
    console.log(`📊 Existing courses in database: ${existingCourses}`);

    let totalLessons = 0;
    let totalQuizzes = 0;
    let totalQuestions = 0;

    for (let i = 0; i < NEW_COURSES.length; i++) {
      const courseData = NEW_COURSES[i];
      console.log(
        `\n📚 Creating course ${i + 1}/${NEW_COURSES.length}: ${courseData.title}`,
      );

      const course = await Course.create({
        title: courseData.title,
        category: courseData.category,
        level: courseData.level,
        description: courseData.description,
        instructor: TUTOR_ID,
        image: "",
        published: true,
        lessons: courseData.lessons.length,
        quizzes: courseData.quizzes.length,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        students: Math.floor(Math.random() * 500) + 50,
        reviews: Math.floor(Math.random() * 100) + 10,
      });
      console.log(`   ✅ Course created: ${course.title}`);

      const lessonIds = [];
      for (let j = 0; j < courseData.lessons.length; j++) {
        const lessonData = courseData.lessons[j];
        const lesson = await Lesson.create({
          course: course._id,
          title: lessonData.title,
          description: lessonData.content.substring(0, 100),
          content: lessonData.content,
          videoUrl: "",
          duration: lessonData.duration,
          order: j + 1,
          resources: [],
        });
        lessonIds.push(lesson._id);
        console.log(`      📖 Lesson created: ${lesson.title}`);
        totalLessons++;
      }

      for (let k = 0; k < courseData.quizzes.length; k++) {
        const quizData = courseData.quizzes[k];
        const lessonId = lessonIds[k % lessonIds.length];
        const quiz = await Quiz.create({
          lesson: lessonId,
          title: `${courseData.title} Quiz ${k + 1}`,
          questions: quizData.questions,
          passMark: quizData.passMark || 50,
        });
        console.log(
          `      📝 Quiz created: ${quiz.title} (${quizData.questions.length} questions)`,
        );
        totalQuizzes++;
        totalQuestions += quizData.questions.length;
      }
    }

    const newTotal = await Course.countDocuments({});

    console.log("\n" + "=".repeat(50));
    console.log("✅ New courses added successfully!");
    console.log("=".repeat(50));
    console.log(`📊 New courses created: ${NEW_COURSES.length}`);
    console.log(`📊 New lessons created: ${totalLessons}`);
    console.log(`📊 New quizzes created: ${totalQuizzes}`);
    console.log(`📊 New questions created: ${totalQuestions}`);
    console.log(
      `📊 Total courses in database: ${newTotal} (was ${existingCourses})`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

generateCourses();
