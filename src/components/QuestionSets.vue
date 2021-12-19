<template>
  <div class="main-container">
    <h1>Question Sets</h1>
    <div class="card-container">
      <table v-if="!loading">
        <tr>
          <th class="title">Set Title</th>
          <th class="rate">Score</th>
          <th v-if="!mobileView" class="date">Date Modified</th>
          <th v-if="!mobileView" class="tools">Tools</th>
        </tr>
        <tr
          v-for="(questionSet, counter) in questionSets"
          :key="counter"
          @click="onQuestionSetClick(questionSet.questionSetID)"
          class='question-row'
        >
          <td>{{ questionSet.title }}</td>
          <td>{{ questionSetRate(counter) }}</td>
          <td v-if="!mobileView">{{ questionSetDateParsed(questionSet.dateModified) }}</td>
          <td v-if="!mobileView"></td>
        </tr>
      </table>
      <button @click="createQuestionSet" class='create-button'>Create New</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questionSets: [],
      loading: true,

      mobileView: false,
    };
  },
  methods: {
    createQuestionSet() {
      this.$emit('createQuestionSet');
    },
    questionSetRate(counter) {
      if (
        this.questionSets[counter].data.length == 0 ||
        this.questionSets[counter].data.length == null ||
        this.questionSets[counter].data == null
      ) {
        // Newly created
        return 'No Data Yet';
      }
      const total = this.questionSets[counter].data.length; // Data was reset/wiped
      if (!total) {
        return 'No Data Yet';
      } else {
        let totalCorrect = 0;
        this.questionSets[counter].data.forEach((data) => {
          totalCorrect += data.answerData.slice(-1)[0];
        });
        // let totalIncorrect = total - totalCorrect.length;
        const percentage = Math.round((totalCorrect / total) * 10000) / 100;
        return `${percentage}% (${totalCorrect}/${total})`;
      }
    },
    questionSetDateParsed(dateModified) {
      const date = new Date(dateModified);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    onQuestionSetClick(questionSetID) {
      this.$router.push({ path: `question-set?id=${questionSetID}` });
    },
  },
  computed: {},
  async created() {
    // Program will not actually wait for await functions, watch out for it
    const configGetUser = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };
    const userQuestionSets = await axios.get(
      'api/user-question-sets',
      configGetUser
    );
    this.questionSets = JSON.parse(JSON.stringify(userQuestionSets.data));

    // Add question set titles
    const configGetQuestionSet = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.questionSets.forEach(async (questionSet) => {
      await axios
        .get(
          `api/question-sets/${questionSet.questionSetID}`,
          configGetQuestionSet
        )
        .then((res) => {
          this.$set(questionSet, 'title', res.data.title); // Required way to add key-value pair for vue to set it as reactive
        });
    });
    this.loading = false;
    
    if (screen.width <= 1025) {
      this.mobileView = true;
    }
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1400px;
  min-height: 700px;
}

@media (max-width:1025px){
  .main-container{
    margin: 0 5% auto;
  }
}

.card-container{
  width: 100%;
}

table {
  width: 100%;
  background-color: #c4c4c4;
  border-collapse: collapse;
  border-radius: 15px;
  margin-bottom: 20px;
}
@media (max-width:1025px){
  table{
    margin-top: 20px;
  }
}

td:first-child{
  padding-left: 20px;
}

td:not(:first-child) {
  padding-top:20px;
  padding-bottom:20px;  
}

th{
  font-size: 24px;
  font-weight: 500;
  padding-top:20px;
  padding-bottom:20px;  
}
@media (max-width:1025px){
  th {
    font-size: 20px;
    padding-top:10px;
    padding-bottom:10px;  
  }
}


.title {
  width: 55%;
}
@media (max-width:1025px){
  .title {
    width: 70%;
  }
}

.rate {
  width: 15%;
  text-align: left;
}
@media (max-width:1025px){
  .rate {
    width: 30%;
  }
}

.date {
  width: 15%;
  text-align: left;
}

.tools {
  width: 15%;
}

.question-row{
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.question-row:hover{
  background-color: white;
  color: rgb(34, 34, 34);
}

.create-button{
  font-size: 18px;
  background-color: #C4C4C4;
  padding: 10px 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  border-radius: 7px;
  margin-bottom: 20px;
}

.create-button:hover{
  background-color: white;
}

</style>
