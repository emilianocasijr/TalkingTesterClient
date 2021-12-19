<template>
  <div class="main-container">
    <button class="back-button" @click="backToDashboard">Back to dashboard</button>
    <input type="file" accept=".csv" @change="handleFileUpload( $event )"/>
    <form v-on:submit.prevent>
      <input
        type="text"
        id="title"
        name="title"
        v-model="title"
        placeholder="Question Set Title"
        required
      /><br />
      <div class="question-wrapper">
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
              <button class="add-choice" @click="addChoice(questionCounter)">
                Add choice
              </button>
            </div>
            <div class="answers">
              <input
                type="checkbox"
                v-for="(answer, answerCounter) in question.choices"
                :key="answerCounter"
                v-model="answer.answer"
                value="Correct Answer"
                class="answer-checkbox"
              />
            </div>
            <div class="delete-choice-buttons">
              <button
                v-for="(choice, choiceCounter) in question.choices"
                :key="choiceCounter"
                @click="removeChoice(questionCounter, choiceCounter)"
              >
                Delete Choice
              </button>
            </div>
          </div>
          <button @click="removeQuestion(questionCounter)">
            Delete Question
          </button>
        </div>
      </div>
    </form>
    <button class="add-question" @click="addQuestion">Add question</button>
    <button class="save-question-set" @click="saveQuestionSet">
      Save Question Set
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import papa from 'papaparse';

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
      file: '',
      content: [],
      parsed: false,
    };
  },
  methods: {
    handleFileUpload( event ){
      this.file = event.target.files[0];
      this.parseFile();
    },

    parseFile(){
      papa.parse( this.file, {
          header: true,
          skipEmptyLines: true,
          complete: function( results ){
              this.content = results;
              this.questions = []; // reset to remove empty one by default
              this.content.data.forEach(question => {
                console.log('loop')
                let newQuestion = {};
                this.title = this.file.name.replace(/\.[^/.]+$/, "");
                newQuestion.question = question.Question;
                newQuestion.choices = [];
                let answer = question.Answer.toUpperCase().charCodeAt(0) - 65;
                Object.keys(question).filter(k => k.startsWith('Choice')).forEach((choice, index) => {
                  if(index == answer){
                    newQuestion.choices.push({choice: question[choice], answer: true})
                  } else{
                    newQuestion.choices.push({choice: question[choice], answer: false})
                  }
                });
                console.log(newQuestion)
                this.questions.push(newQuestion);
              });

              this.parsed = true;
          }.bind(this)
      } );
    },

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

    addChoice(questionCounter) {
      this.questions[questionCounter].choices.push({
        choice: '',
        answer: false,
      });
    },

    removeChoice(questionCounter, choiceCounter) {
      this.questions[questionCounter].choices.splice(choiceCounter, 1);
    },

    removeQuestion(questionCounter) {
      if (this.questions.length == 1) {
        alert("Can't delete. There should be at least one question set.");
        return;
      }
      this.questions.splice(questionCounter, 1);
    },

    async saveQuestionSet() {
      console.log('form submit');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.token,
        },
      };
      const body = JSON.stringify({
        title: this.title,
        questions: this.questions,
      });

      try {
        const res = await axios.post('api/question-sets', body, config);
        const questionSetBody = JSON.stringify({
          questionSetID: res.data.questionSetID,
        });
        await axios
          .post('api/user-question-sets', questionSetBody, config)
          .then(() => {
            this.$router.push({ path: 'dashboard' });
          });
      } catch (err) {
        console.log(err);
      }
    },
    backToDashboard() {
      this.$router.push('dashboard');
    },
  },
};
</script>

<style scoped>
.question-set-wrapper {
  display: flex;
}

.question-container {
  display: flex;
}

.questions {
  display: flex;
}

.choices {
  display: flex;
  flex-direction: column;
}

.answers {
  display: flex;
  flex-direction: column;
}

.answer-checkbox {
  height: 16px;
}

.delete-choice-buttons {
  height: 16px;
  display: flex;
  flex-direction: column;
}

.delete-question-buttons {
  display: flex;
  flex-direction: column;
}

.back-button{
  padding: 5px 15px;
  font-size: 12px;
  margin-bottom: 20px;
  display: block;
}
</style>
