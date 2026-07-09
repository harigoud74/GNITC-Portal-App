// const mongoose = require("mongoose");
// // Assumes this script is running from your root folder (next to app.js)
// const StudentProfile = require("./models/StudentProfile");

// // Connect to MongoDB using the modern syntax
// mongoose
//   .connect("mongodb://127.0.0.1:27017/StudentAndFaculityDashboard")
//   .then(() => console.log("MongoDB Connected for Activity Update..."))
//   .catch((err) => console.log(err));

// const addActivities = async () => {
//   try {
//     // The specific events and club we are adding to everyone
//     const newActivities = [
//       {
//         type: "Event",
//         activityName: "IGNITE(AISML) 2026 Hackathon",
//         joinedAt: new Date("2026-04-01"),
//       },
//       {
//         type: "Event",
//         activityName: "CSI-LUMINA Tech Fest",
//         joinedAt: new Date("2026-05-10"),
//       },
//       {
//         type: "Club",
//         activityName: "GNITC Cricket Club",
//         joinedAt: new Date("2026-04-17"),
//       },
//     ];

//     // Find ALL student profiles and push the new activities into their arrays
//     const result = await StudentProfile.updateMany(
//       {}, // An empty object means "target everyone"
//       {$push: {activities: {$each: newActivities}}}, // $each allows us to push multiple items at once
//     );

//     console.log(
//       `Success! Updated ${result.modifiedCount} student profiles with 2 Events and 1 Club.`,
//     );
//     process.exit();
//   } catch (error) {
//     console.error("Error updating activities:", error);
//     process.exit(1); // Exit with failure code
//   }
// };

// // Run the function
// addActivities();

const fakeStudents = [
  {
    student: {
      name: "Aarav Sharma",
      rollNo: "23251A0501",
      email: "aarav.sharma@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 85},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Ananya Reddy",
      rollNo: "23251A0502",
      email: "ananya.reddy@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 92},
      fees: {dueAmount: 12500},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Aditya Verma",
      rollNo: "23251A0503",
      email: "aditya.verma@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 74},
      fees: {dueAmount: 45000},
      activities: [],
    },
  },
  {
    student: {
      name: "Bhavana Goud",
      rollNo: "23251A0504",
      email: "bhavana.goud@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 88},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Chaitanya Krishna",
      rollNo: "23251A0505",
      email: "chaitanya.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 68},
      fees: {dueAmount: 62000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Divya Teja",
      rollNo: "23251A0506",
      email: "divya.teja@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 95},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Eshwar Prasad",
      rollNo: "23251A0507",
      email: "eshwar.p@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 81},
      fees: {dueAmount: 15000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Farhan Khan",
      rollNo: "23251A0508",
      email: "farhan.khan@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 78},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Gautam Rao",
      rollNo: "23251A0509",
      email: "gautam.rao@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 83},
      fees: {dueAmount: 24000},
      activities: [],
    },
  },
  {
    student: {
      name: "Harini Rao",
      rollNo: "23251A0510",
      email: "harini.rao@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 90},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Ishaan Mishra",
      rollNo: "23251A0511",
      email: "ishaan.mishra@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 72},
      fees: {dueAmount: 35500},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Jyothi Prakash",
      rollNo: "23251A0512",
      email: "jyothi.p@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 87},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Karthik Kumar",
      rollNo: "23251A0513",
      email: "karthik.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 65},
      fees: {dueAmount: 75000},
      activities: [],
    },
  },
  {
    student: {
      name: "Laxmi Narayana",
      rollNo: "23251A0514",
      email: "laxmi.n@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 84},
      fees: {dueAmount: 8000},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Manish Yadav",
      rollNo: "23251A0515",
      email: "manish.yadav@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 79},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Nikhil Siddhartha",
      rollNo: "23251A0516",
      email: "nikhil.s@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 91},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Pranavi Rao",
      rollNo: "23251A0517",
      email: "pranavi.rao@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 86},
      fees: {dueAmount: 18000},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Rahul Hegde",
      rollNo: "23251A0518",
      email: "rahul.hegde@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 70},
      fees: {dueAmount: 52000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Sanjana Roy",
      rollNo: "23251A0519",
      email: "sanjana.roy@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 94},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Tarun Kumar",
      rollNo: "23251A0520",
      email: "tarun.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 75},
      fees: {dueAmount: 29000},
      activities: [],
    },
  },
  {
    student: {
      name: "Utkarsh Patel",
      rollNo: "23251A0521",
      email: "utkarsh.patel@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 82},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Vennela Kishore",
      rollNo: "23251A0522",
      email: "vennela.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 89},
      fees: {dueAmount: 11000},
      activities: [{type: "Event"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Yashwanth Reddy",
      rollNo: "23251A0523",
      email: "yashwanth.r@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 63},
      fees: {dueAmount: 84000},
      activities: [],
    },
  },
  {
    student: {
      name: "Zain Ahmed",
      rollNo: "23251A0524",
      email: "zain.ahmed@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 80},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Abhinav Singh",
      rollNo: "23251A0525",
      email: "abhinav.s@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 77},
      fees: {dueAmount: 33000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Deepika Padukone",
      rollNo: "23251A0526",
      email: "deepika.p@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 96},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Club"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Charan Kumar",
      rollNo: "23251A0527",
      email: "charan.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 83},
      fees: {dueAmount: 14500},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Ganga Bhavani",
      rollNo: "23251A0528",
      email: "ganga.b@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 88},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Hemant Joshi",
      rollNo: "23251A0529",
      email: "hemant.j@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 71},
      fees: {dueAmount: 48000},
      activities: [],
    },
  },
  {
    student: {
      name: "Kavya Madhavan",
      rollNo: "23251A0530",
      email: "kavya.m@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 93},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Lokesh Rahul",
      rollNo: "23251A0531",
      email: "lokesh.r@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 76},
      fees: {dueAmount: 22000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Meghana Naidu",
      rollNo: "23251A0532",
      email: "meghana.n@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 85},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Nithin Kumar",
      rollNo: "23251A0533",
      email: "nithin.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 69},
      fees: {dueAmount: 67000},
      activities: [],
    },
  },
  {
    student: {
      name: "Pooja Hegde",
      rollNo: "23251A0534",
      email: "pooja.h@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 90},
      fees: {dueAmount: 5000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Rakesh Roshan",
      rollNo: "23251A0535",
      email: "rakesh.r@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 82},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Suresh Raina",
      rollNo: "23251A0536",
      email: "suresh.r@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 74},
      fees: {dueAmount: 39000},
      activities: [],
    },
  },
  {
    student: {
      name: "Tejaswi Prakash",
      rollNo: "23251A0537",
      email: "tejaswi.p@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 87},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Varun Dhawan",
      rollNo: "23251A0538",
      email: "varun.d@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 81},
      fees: {dueAmount: 17500},
      activities: [{type: "Event"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Vivek Oberoi",
      rollNo: "23251A0539",
      email: "vivek.o@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 66},
      fees: {dueAmount: 89000},
      activities: [],
    },
  },
  {
    student: {
      name: "Yamini Krishnan",
      rollNo: "23251A0540",
      email: "yamini.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 92},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Anirudh Ravichander",
      rollNo: "23251A0541",
      email: "anirudh.r@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 84},
      fees: {dueAmount: 12000},
      activities: [{type: "Event"}, {type: "Event"}, {type: "Event"}],
    },
  },
  {
    student: {
      name: "Bhuvan Bam",
      rollNo: "23251A0542",
      email: "bhuvan.b@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 79},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Chitra Lakshman",
      rollNo: "23251A0543",
      email: "chitra.l@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 86},
      fees: {dueAmount: 26000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Dinesh Karthik",
      rollNo: "23251A0544",
      email: "dinesh.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 73},
      fees: {dueAmount: 43000},
      activities: [],
    },
  },
  {
    student: {
      name: "Esha Deol",
      rollNo: "23251A0545",
      email: "esha.d@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 91},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Ganesh Acharya",
      rollNo: "23251A0546",
      email: "ganesh.a@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 80},
      fees: {dueAmount: 19500},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Hari Priya",
      rollNo: "23251A0547",
      email: "haripriya.@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 95},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Indrajit Lankesh",
      rollNo: "23251A0548",
      email: "indrajit.l@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 67},
      fees: {dueAmount: 71000},
      activities: [],
    },
  },
  {
    student: {
      name: "Kiran Bedi",
      rollNo: "23251A0549",
      email: "kiran.bedi@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 89},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}, {type: "Club"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Manoj Bajpayee",
      rollNo: "23251A0550",
      email: "manoj.b@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 78},
      fees: {dueAmount: 31000},
      activities: [{type: "Event"}],
    },
  },
  {
    student: {
      name: "Nayan Tara",
      rollNo: "23251A0551",
      email: "nayan.t@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 93},
      fees: {dueAmount: 0},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Pawan Kalyan",
      rollNo: "23251A0552",
      email: "pawan.k@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 70},
      fees: {dueAmount: 95000},
      activities: [],
    },
  },
  {
    student: {
      name: "Ram Charan",
      rollNo: "23251A0553",
      email: "ram.charan@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 85},
      fees: {dueAmount: 0},
      activities: [{type: "Club"}],
    },
  },
  {
    student: {
      name: "Shruti Haasan",
      rollNo: "23251A0554",
      email: "shruti.h@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 88},
      fees: {dueAmount: 14000},
      activities: [{type: "Event"}, {type: "Club"}],
    },
  },
  {
    student: {
      name: "Vijay Devarakonda",
      rollNo: "23251A0555",
      email: "vijay.d@gnitc.ac.in",
    },
    profile: {
      attendance: {percentage: 76},
      fees: {dueAmount: 28000},
      activities: [{type: "Event"}],
    },
  },
];
