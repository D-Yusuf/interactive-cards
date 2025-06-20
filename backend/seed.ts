import { connect } from "npm:mongoose";
import Question from "./models/Question.ts";
import Category from "./models/Category.ts";


const categories = [
  {
    "_id": "68543770dbf461763cb1935a",
    "name": "قوم تنشط",
    "color": "red"
  },
  {
    "_id": "68543791dbf461763cb1935c",
    "name": "تحدي الثلاثين",
    "color": "blue"
  },
  {
    "_id": "685437a8dbf461763cb1935e",
    "name": "أسئلة وألغاز",
    "color": "green"
  },
  {
    "_id": "685437c0dbf461763cb19360",
    "name": "جيب لي",
    "color": "orange"
  }
];

const questionsData = [
  // قوم تنشط - 20 questions (1-10 points, each twice)
  {
    category: "68543770dbf461763cb1935a",
    question: "ارفع يديك لأعلى 5 مرات",
    answer: "تم رفع اليدين",
    points: 1
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "امشِ في المكان لمدة 30 ثانية",
    answer: "تم المشي",
    points: 1
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "اقفز 5 مرات",
    answer: "تم القفز",
    points: 2
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 5 تمارين قرفصاء",
    answer: "تم إنجاز التمارين",
    points: 2
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 5 تمارين ضغط",
    answer: "تم إنجاز التمارين",
    points: 3
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل تمرين البلانك لمدة 20 ثانية",
    answer: "تم إنجاز التمرين",
    points: 3
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 7 تمارين بربي",
    answer: "تم إنجاز التمارين",
    points: 4
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "اركض في المكان لمدة دقيقة",
    answer: "تم الركض",
    points: 4
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 10 تمارين لمس أصابع القدمين",
    answer: "تم لمس الأصابع",
    points: 5
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "اقفز على قدم واحدة 15 مرة لكل قدم",
    answer: "تم القفز على القدمين",
    points: 5
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 15 تمرين قرفصاء",
    answer: "تم إنجاز التمارين",
    points: 6
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 15 تمرين ضغط",
    answer: "تم إنجاز التمارين",
    points: 6
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل تمرين البلانك لمدة دقيقة",
    answer: "تم إنجاز التمرين",
    points: 7
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 20 تمرين بربي",
    answer: "تم إنجاز التمارين",
    points: 7
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "اركض في المكان لمدة دقيقتين",
    answer: "تم الركض",
    points: 8
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 25 تمرين لمس أصابع القدمين",
    answer: "تم لمس الأصابع",
    points: 8
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "اقفز على قدم واحدة 30 مرة لكل قدم",
    answer: "تم القفز على القدمين",
    points: 9
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 30 تمرين قرفصاء",
    answer: "تم إنجاز التمارين",
    points: 9
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل 30 تمرين ضغط",
    answer: "تم إنجاز التمارين",
    points: 10
  },
  {
    category: "68543770dbf461763cb1935a",
    question: "قم بعمل تمرين البلانك لمدة دقيقتين",
    answer: "تم إنجاز التمرين",
    points: 10
  },

  // تحدي الثلاثين - 20 questions (1-10 points, each twice)
  {
    category: "68543791dbf461763cb1935c",
    question: "عد من 1 إلى 5",
    answer: "تم العد",
    points: 1
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 5 أسماء من أسماء الله الحسنى",
    answer: "تم ذكر الأسماء",
    points: 1
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 5 عواصم عربية",
    answer: "تم ذكر العواصم",
    points: 2
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 5 أنواع من الفواكه",
    answer: "تم ذكر الفواكه",
    points: 2
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اكتب 5 كلمات تبدأ بحرف الألف",
    answer: "تم كتابة الكلمات",
    points: 3
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 10 أسماء من أسماء الحيوانات",
    answer: "تم ذكر الحيوانات",
    points: 3
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "عد من 1 إلى 15 باللغة الإنجليزية",
    answer: "تم العد باللغة الإنجليزية",
    points: 4
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 15 نوع من الخضروات",
    answer: "تم ذكر الخضروات",
    points: 4
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اكتب 20 كلمة تنتهي بحرف التاء",
    answer: "تم كتابة الكلمات",
    points: 5
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 30 اسم من أسماء الله الحسنى",
    answer: "تم ذكر الأسماء",
    points: 5
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 10 ألوان",
    answer: "تم ذكر الألوان",
    points: 6
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 10 أسماء من أسماء الأنبياء",
    answer: "تم ذكر الأنبياء",
    points: 6
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 15 نوع من المشروبات",
    answer: "تم ذكر المشروبات",
    points: 7
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 15 نوع من الحلويات",
    answer: "تم ذكر الحلويات",
    points: 7
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 20 نوع من الطيور",
    answer: "تم ذكر الطيور",
    points: 8
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 20 نوع من الأسماك",
    answer: "تم ذكر الأسماك",
    points: 8
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 25 نوع من الأشجار",
    answer: "تم ذكر الأشجار",
    points: 9
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 25 نوع من الزهور",
    answer: "تم ذكر الزهور",
    points: 9
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 30 نوع من الأطعمة",
    answer: "تم ذكر الأطعمة",
    points: 10
  },
  {
    category: "68543791dbf461763cb1935c",
    question: "اذكر 30 نوع من المهن",
    answer: "تم ذكر المهن",
    points: 10
  },

  // أسئلة وألغاز - 20 questions (1-10 points, each twice)
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي له أسنان ولا يعض؟",
    answer: "المشط",
    points: 1
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يكتب ولا يقرأ؟",
    answer: "القلم",
    points: 1
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي له رأس وليس له عيون؟",
    answer: "الدبوس",
    points: 2
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي له أوراق وليس شجرة؟",
    answer: "الكتاب",
    points: 2
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يبكي بلا عيون؟",
    answer: "السحاب",
    points: 3
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "النار",
    points: 3
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أكلت منه؟",
    answer: "الجوع",
    points: 4
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي ينام ولا يستيقظ؟",
    answer: "الموت",
    points: 4
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يطير بلا أجنحة؟",
    answer: "الوقت",
    points: 5
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "الحفرة",
    points: 5
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "الحفرة",
    points: 6
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "النار",
    points: 6
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "الجوع",
    points: 7
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "الوقت",
    points: 7
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "الموت",
    points: 8
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "السحاب",
    points: 8
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "الكتاب",
    points: 9
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "الدبوس",
    points: 9
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أضفت إليه؟",
    answer: "القلم",
    points: 10
  },
  {
    category: "685437a8dbf461763cb1935e",
    question: "ما هو الشيء الذي يزداد كلما أخذت منه؟",
    answer: "المشط",
    points: 10
  },

  // جيب لي - 20 questions (1-10 points, each twice)
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة مصر؟",
    answer: "القاهرة",
    points: 1
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي أكبر قارة في العالم؟",
    answer: "آسيا",
    points: 1
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة اليابان؟",
    answer: "طوكيو",
    points: 2
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "كم عدد كواكب المجموعة الشمسية؟",
    answer: "8 كواكب",
    points: 2
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هو أسرع حيوان بري؟",
    answer: "الفهد",
    points: 3
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هو أطول نهر في العالم؟",
    answer: "نهر النيل",
    points: 3
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "كم عدد أيام السنة الكبيسة؟",
    answer: "366 يوم",
    points: 4
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هو أكبر محيط في العالم؟",
    answer: "المحيط الهادئ",
    points: 4
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي أطول سلسلة جبال في العالم؟",
    answer: "جبال الأنديز",
    points: 5
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هو أكبر بحر في العالم؟",
    answer: "البحر الأبيض المتوسط",
    points: 5
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة فرنسا؟",
    answer: "باريس",
    points: 6
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة ألمانيا؟",
    answer: "برلين",
    points: 6
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة إيطاليا؟",
    answer: "روما",
    points: 7
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة إسبانيا؟",
    answer: "مدريد",
    points: 7
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة البرازيل؟",
    answer: "برازيليا",
    points: 8
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة الأرجنتين؟",
    answer: "بوينس آيرس",
    points: 8
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة أستراليا؟",
    answer: "كانبرا",
    points: 9
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة نيوزيلندا؟",
    answer: "ويلينغتون",
    points: 9
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة كندا؟",
    answer: "أوتاوا",
    points: 10
  },
  {
    category: "685437c0dbf461763cb19360",
    question: "ما هي عاصمة المكسيك؟",
    answer: "مكسيكو سيتي",
    points: 10
  }
];

export default async function seedData() {
  try {

    // Clear existing data
    await Question.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    for (const categoryData of categories) {
      await Category.create(categoryData);
    }
    console.log("Categories created");

    // Create questions
    for (const questionData of questionsData) {
      const question = await Question.create(questionData);
      await Category.findByIdAndUpdate(questionData.category, { $push: { questions: question._id } });
    }
    console.log(`Created ${questionsData.length} questions`);

    console.log("Seed data created successfully!");
    Deno.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    Deno.exit(1);
  }
}
