<template>
  <div class="main-container" v-if="!isLoading">
    <h1>{{ questionSet.title }}</h1>
    <div class="card">
      <div v-if="viewInitial">
        <button class="start" @click="startExam">Start Exam</button>
      </div>
      <div v-if="viewExam">
        {{ currentQuestion + 1 }} / {{ questionSet.questions.length }}
        <h2>{{ questionSet.questions[currentQuestion].question }}</h2>
        <button
          class="choice"
          v-for="(choice, counter) in questionSet.questions[currentQuestion]
            .choices"
          :key="counter"
          @click="selectChoice(choice, counter)"
        >
          {{ choice.choice }}
        </button>
      </div>
      <div v-if="viewResult">
        <p>You stupid sh*t, you only got</p>
        <b
          >{{ incorrectAnswers.length }} / {{ questionSet.questions.length }}</b
        >
        <button @click="retakeExam">Retake exam</button>
        <button @click="retakeExamDontSave">Retake exam but don't save data</button>
        <button @click="backToDashboard">Back to dashboard</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questionSetID: this.$route.query.id,
      questionSet: null,
      currentQuestion: 0,
      incorrectAnswers: [],
      isLoading: true,
      viewInitial: true,
      viewExam: false,
      viewResult: false,
    };
  },
  methods: {
    startExam() {
      this.viewInitial = false;
      this.viewExam = true;
    },
    selectChoice(choice, counter) {
      // Only store incorrect answers, unstored ones will be considered correct
      if (choice.answer == false) {
        incorrectAnswers.push({
          questionNumber: this.currentQuestion,
          incorrectAnswer: counter,
        });
      }
      // Check if there are more questions
      if (this.currentQuestion < this.questionSet.questions.length - 1) {
        this.currentQuestion++;
      } else {
        this.viewExam = false;
        this.viewResult = true;
      }
    },
    backToDashboard(){
      this.$router.push('dashboard');
    },
    retakeExam(){
      
    }
  },
  async created() {
    const configGetUser = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };
    await axios
      .get(`api/question-sets/${this.questionSetID}`, configGetUser)
      .then((res) => {
        this.questionSet = res.data;
        this.isLoading = false;
      });
  },
};
</script>

<style></style>
