<template>
  <div class="main-container" v-if="!isLoading">
    <h1>{{ questionSet.title }} <span v-if="viewExam" class='question-number'>({{ currentQuestion + 1 }}/{{ questionSet.questions.length }})</span></h1>
    <div class="card">
      <div v-if="viewInitial">
        <button class="back-button" @click="backToDashboard">Back to dashboard</button>
        <button class="start-button" @click="startExam">Start Exam</button>
        <input type="checkbox" id="speechModeCheckbox" v-model="speechMode">
        <label for="speechModeCheckbox"> Speech Mode</label>
      </div>
      <div v-if="viewExam">
        <h2 class="question">{{ questionSet.questions[currentQuestion].question }}</h2>
        <div v-if="speechMode">{{readQuestion(questionSet.questions[currentQuestion].question)}}</div>
        <button
          class="choice"
          v-for="(choice, counter) in questionSet.questions[currentQuestion]
            .choices"
          :key="counter"
          @click="selectChoice(choice, counter)"
        >
          {{ choice.choice }}
          <div v-if="speechMode">{{ readChoice(choice,counter) }}</div>
        </button>
        <button class="back-button choice-back-button" @click="backToDashboard">Back to dashboard</button>
        <input type="checkbox" id="speechModeCheckbox" v-model="speechMode" @change="speechModeChange">
        <label for="speechModeCheckbox"> Speech Mode</label>
      </div>
      <div v-if="viewResult">
        <p class='comment'>Wow, you only got</p>
        <h2 class='score'>
          {{ questionSet.questions.length - incorrectAnswers.length }} /
          {{ questionSet.questions.length }}
        </h2>
        <button @click="retakeExam">Retake exam</button>
        <button @click="backToDashboardAndSave">Back to dashboard</button>
        <h2 class='incorrect-title'>Incorrect answers:</h2>
        <div v-for="(question, counter) in incorrectAnswers" :key="counter" class="incorrect-set">
          <span class='incorrect-question'>{{ questionSet.questions[question.questionNumber].question }}</span>
          <button disabled class="correct-answer">{{ getCorrectAnswer(question.questionNumber) }}</button>
          <button disabled class="incorrect-answer">
            {{
              questionSet.questions[question.questionNumber].choices[
                question.incorrectAnswer
              ].choice
            }}
          </button>
        </div>
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
      userQuestionSet: null,
      currentData: [],
      currentAnswer: null,

      speechMode: true,
    };
  },
  methods: {
    startExam() {
      this.viewInitial = false;
      this.viewExam = true;
    },
    async saveDataToDatabase() {
      // Add data to current data
      if (this.userQuestionSet == null) {
        let currentData = [];
        console.log('no data yet');
        this.questionSet.questions.forEach((question) => {
          let answerIsCorrect = true;
          this.incorrectAnswers.forEach((incorrectAnswer) => {
            if (question._id == incorrectAnswer.questionID) {
              answerIsCorrect = false;
            }
          });
          let questionData = {
            questionID: question._id,
            answerData: answerIsCorrect ? 1 : 0,
          };
          this.currentData.push(questionData);
        });

        const body = JSON.stringify({
          questionSetID: this.questionSet.questionSetID,
          data: this.currentData,
        });

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
          },
        };

        try {
          await axios
            .post('api/user-question-sets', body, config)
            .then((res) => {
              console.log(res);
              console.log('successfully posted');
              this.$router.push('dashboard');
            });
        } catch (err) {
          console.log('error in posting data');
          console.log(err);
        }
      }
      // If user data exists but no data yet
      if (
        this.userQuestionSet.data.length < 1 ||
        this.userQuestionSet.data == null ||
        this.userQuestionSet.data == undefined
      ) {
        console.log('exists but no data yet');
        this.questionSet.questions.forEach((question) => {
          let answerIsCorrect = true;
          this.incorrectAnswers.forEach((incorrectAnswer) => {
            if (question._id == incorrectAnswer.questionID) {
              answerIsCorrect = false;
            }
          });
          let questionData = {
            questionID: question._id,
            answerData: answerIsCorrect ? [1] : [0],
          };
          this.currentData.push(questionData);
        });

        const body = JSON.stringify({
          questionSetID: this.questionSet.questionSetID,
          data: this.currentData,
        });

        console.log(body);

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
          },
        };

        try {
          await axios
            .put('api/user-question-sets', body, config)
            .then((res) => {
              console.log(res);
              this.$router.push('dashboard');
            });
        } catch (err) {
          console.log('error in posting data');
          console.log(err);
        }
        // Else if user question set data exists, update it
      } else {
        console.log('updating data in database');
        this.userQuestionSet.data.forEach((question) => {
          let correctAnswer = true;
          this.incorrectAnswers.forEach((incorrectAnswer) => {
            if (question.questionID == incorrectAnswer.questionID) {
              correctAnswer = false;
            }
          });
          if (correctAnswer == true) {
            question.answerData.push(1);
          } else {
            question.answerData.push(0);
          }
        });

        const body = JSON.stringify({
          questionSetID: this.questionSet.questionSetID,
          data: this.userQuestionSet.data,
        });

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
          },
        };

        try {
          const res = await axios.put('api/user-question-sets', body, config);
          console.log(res);
          this.$router.push('dashboard');
        } catch (err) {
          console.log(err);
        }
      }
    },
    selectChoice(choice, counter) {
      // Only store incorrect answers, unstored ones will be considered correct
      if (choice.answer == false) {
        this.incorrectAnswers.push({
          questionNumber: this.currentQuestion,
          questionID: this.questionSet.questions[this.currentQuestion]._id,
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
      window.speechSynthesis.cancel();
    },
    backToDashboardAndSave() {
      window.speechSynthesis.cancel();
      this.saveDataToDatabase();
      this.$router.push('dashboard');
    },
    backToDashboard() {
      window.speechSynthesis.cancel();
      this.$router.push('dashboard');
    },
    retakeExam() {},
    getCorrectAnswer(questionNumber) {
      let correctAnswer = null;
      this.questionSet.questions[questionNumber].choices.forEach((choice) => {
        console.log(choice.answer);
        if (choice.answer == true) {
          correctAnswer = choice.choice;
        }
      });
      return correctAnswer;
    },
    readChoice(choice, counter){
      let speech = new SpeechSynthesisUtterance();

      speech.lang = "en-US";
      speech.text = `${String.fromCharCode(97 + counter)}. ${JSON.stringify(choice.choice)}`;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;                

      window.speechSynthesis.speak(speech);

      // If last question then listen for answer
      if(this.questionSet.questions[this.currentQuestion].choices.length -1 == counter){
        speech.onend = () => {
          this.listenAnswer();
        }
      }
    },
    readQuestion(question){
      let speech = new SpeechSynthesisUtterance();

      speech.lang = "en-US";
      speech.text = `Question number ${this.currentQuestion + 1}. ${JSON.stringify(question)}`;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;                

      window.speechSynthesis.speak(speech);
    },
    listenAnswer(){
      let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      let SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
      let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

      let letters = [ 'A', 'Alpha', 'Apple', 'B', 'Bravo', 'Boy', 'C', 'Charlie', 'Cat', 'D', 'Delta', 'Dog' ];
      let grammar = '#JSGF V1.0; grammar letters; public <letter> = ' + letters.join(' | ');

      let recognition = new SpeechRecognition();
      let speechRecognitionList = new SpeechGrammarList();

      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();
      console.log('Ready to receive an answer.');

      recognition.onend = () => {
        console.log('ending recognition')
      };

      recognition.onresult = (event) => {
        let answer = event.results[0][0].transcript;
        // console.log(answer);
        // console.log('Confidence: ' + event.results[0][0].confidence);
        switch(answer.replace(/\.$/, "")){
          case 'A':
          case 'Apple':
          case 'Alpha':
          case '8':
            this.currentAnswer = 0;
            break;
          case 'B':
          case 'Boy':
          case 'Bravo':
            this.currentAnswer = 1;
            break;
          case 'C':
          case 'Charlie':
          case 'Cat':
          case 'See':
            this.currentAnswer = 2;
            break;
          case 'D':
          case 'Delta':
          case 'Dog':
            this.currentAnswer = 3;
            break;
          default:
            this.currentAnswer = 0;
            break;
        }
        this.selectChoice(this.questionSet.questions[this.currentQuestion].choices[this.currentAnswer], this.currentAnswer);
      }
      
      recognition.onspeechend = function() {
        console.log('stopping speech recognition')
        recognition.stop();
      }
      recognition.onerror = function(event) {
        console.log(`Error occurred in recognition:  ${event.error}`);
        console.log('Please try again');
      }
    },
    speechModeChange(){
      if(this.speechMode == false){
        window.speechSynthesis.cancel();
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
        this.questionSet = res.data;
      });
    try {
      await axios
        .get(`api/user-question-sets/${this.questionSetID}`, configGetUser)
        .then((res) => {
          console.log('userquestionset loaded');
          this.userQuestionSet = res.data;
          this.isLoading = false;
        });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.main-container{
  margin: 0 auto;
  max-width: 1400px;
  min-height: 700px;
}
@media (max-width:1025px){
  .main-container{
    margin: 0 5% auto;
    text-align: center;
  }
}

button{
  font-size: 18px;
  background-color: #C4C4C4;
  padding: 10px 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  border-radius: 7px;
  display: block;
  margin-bottom: 10px;
}
@media (max-width:1025px){
  button{
    margin: 0 auto;
    margin-bottom: 10px;
  }
}

button:not(:disabled):hover{
  background-color: white;
}

.back-button{
  padding: 5px 15px;
  font-size: 12px;
  margin-bottom: 20px;
}

.choice-back-button{
  margin-top: 50px;
}

.incorrect-answer{
  background-color: rgb(161, 0, 0);
  color: black;
  cursor: default;
}

.correct-answer{
  background-color: rgb(44, 218, 44);
  color: black;
  cursor: default;
}

.question-number{
  font-weight: 400;
  font-size: 16px;
}

.question{
  margin-top: 30px;
  margin-bottom: 20px;
}

.incorrect-set{
  margin-bottom: 25px;
}

.incorrect-title{
  margin-top: 40px;
}

.comment{
  font-size: 22px;
  margin-top: 10px;
}

.score{
  font-size: 30px;
  margin-bottom: 20px;
}
</style>
