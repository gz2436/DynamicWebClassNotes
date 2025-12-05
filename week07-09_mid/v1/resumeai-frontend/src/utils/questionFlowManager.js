import { questionFlow, resumeSections } from './resumeQuestions';

class QuestionFlowManager {
  constructor() {
    this.currentSectionIndex = 0;
    this.currentQuestionIndex = 0;
    this.experienceCount = 0;
    this.isCollectingExperience = false;
  }

  getCurrentQuestion() {
    const section = questionFlow[this.currentSectionIndex];
    if (!section) return null;

    const question = section.questions[this.currentQuestionIndex];
    return question;
  }

  getNextQuestion() {
    const currentSection = questionFlow[this.currentSectionIndex];

    // Handle repeatable sections (like work experience)
    if (currentSection.section === resumeSections.EXPERIENCE && this.isCollectingExperience) {
      this.currentQuestionIndex++;

      // Check if we need to loop back for another job
      if (this.currentQuestionIndex >= currentSection.questions.length) {
        this.currentQuestionIndex = 1; // Start from jobTitle again
        this.experienceCount++;
      }

      return this.getCurrentQuestion();
    }

    // Move to next question
    this.currentQuestionIndex++;

    // Check if we've finished current section
    if (this.currentQuestionIndex >= currentSection.questions.length) {
      this.currentSectionIndex++;
      this.currentQuestionIndex = 0;

      // Check if we've finished all sections
      if (this.currentSectionIndex >= questionFlow.length) {
        return { section: resumeSections.COMPLETE, question: null };
      }
    }

    return this.getCurrentQuestion();
  }

  startExperienceCollection() {
    this.isCollectingExperience = true;
  }

  stopExperienceCollection() {
    this.isCollectingExperience = false;
    // Move to next section
    this.currentSectionIndex++;
    this.currentQuestionIndex = 0;
  }

  isComplete() {
    return this.currentSectionIndex >= questionFlow.length;
  }

  getCurrentSection() {
    const section = questionFlow[this.currentSectionIndex];
    return section ? section.section : resumeSections.COMPLETE;
  }

  getCurrentQuestionNumber() {
    let count = 0;
    // Count all questions in previous sections
    for (let i = 0; i < this.currentSectionIndex; i++) {
      count += questionFlow[i].questions.length;
    }
    // Add current question index
    count += this.currentQuestionIndex + 1;
    return count;
  }
}

export default QuestionFlowManager;
