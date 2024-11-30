const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for TestCases
const TestCaseSchema = new Schema({
  description: { type: String, required: true },
  includes: { type: String, required: true },
  includestype:{type:String,required:true}
});

// Schema for Sections
const SectionSchema = new Schema({
  sectionTitle: { type: String, required: true },
  sectionContent: { type: String, required: true }
});
//Schema for Criteria
const Criteria = new Schema({
    Criteria1: { type: String, required: true },
    
  });

// Main Task Schema
const TaskSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
  description: { type: String, required: true },
  Requirements: {
    type: [SectionSchema],  // Stores dynamic sections
    required: true
  },
  AcceptanceCriteria: {
     type:[Criteria],
     required:true
  },
  TestCases: {
    type: [TestCaseSchema], // Stores dynamic test cases
    required: true
  },
  language: { type: String, required: true },
  topicname:{type:String,required:true}
});

const QuestionSchema = mongoose.model('WebQuestions', TaskSchema);

module.exports = QuestionSchema;
