<template>
  <div class="main-container">
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questionSetID: this.$route.params.id,
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
      viewInitial = false;
      viewExam = true;
    },
    selectChoice(choice, counter) {
      // Only store incorrect answers, unstored ones will be considered correct
      if (choice.answer == false) {
        incorrectAnswers.push({
          questionNumber: currentQuestion,
          incorrectAnswer: counter,
        });
      }
      // Check if there are more questions
      if (currentQuestion < questionSet.questions.length - 1) {
        currentQuestion++;
      } else {
        viewExam = false;
        viewResult = true;
      }
    },
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
        this.questionSet = res;
        this.isLoading = false;
      });
  },
};
</script>

<style></style>
