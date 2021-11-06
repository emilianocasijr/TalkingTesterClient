<template>
  <div class="main-container">
    <form v-on:submit.prevent="onSubmit">
      <input
        type="text"
        id="title"
        name="title"
        v-model="title"
        placeholder="Question Set Title"
      /><br />
      <div
        class="questions"
        v-for="(question, questionCounter) in questions"
        :key="questionCounter"
      >
        <div class="question-container">
          <input
            type="text"
            v-model="question.question"
            placeholder="Question"
          />
          <div class="choices">
            <input
            v-for="(choice, choiceCounter) in question.choices"
            :key="choiceCounter"
            type="text"
            v-model="choice.choice"
            placeholder="Choice"
          />
            <button class="add-choice" @click="addChoice(questionCounter,choiceCounter)">Add choice</button>
          </div>
          
        </div>
      </div>
    </form>
    <button class="add-question" @click="addQuestion">Add question</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      questions: [
        {
          question: '',
          choices: [
            {
              choice: '',
              answer: false,
            },
          ],
        },
      ],
    };
  },
  methods: {
    addQuestion() {
      this.questions.push({
        question: '',
        choices: [
          {
            choice: '',
            answer: false,
          },
        ],
      });
    },
    addChoice(questionCounter,choiceCounter){
      this.questions[questionCounter].choices.push({
        choice: '',
        answer: false,
      })
    }
  },
};
</script>

<style scoped>
.question-container{
  display: flex;
}

.choices{
  display: flex;
  flex-direction: column;
}
</style>
