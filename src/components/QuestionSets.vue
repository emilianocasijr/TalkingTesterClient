<template>
  <div class="main-container">
    <h1>Question Sets</h1>
    <button @click="createQuestionSet">Create New</button>
    <div class="card-container">
      <table v-if="!loading">
        <tr>
          <th class="title">Set Title</th>
          <th class="rate">Current Rate</th>
          <th class="date">Date Modified</th>
          <th class="tools">Tools</th>
        </tr>
        <tr
          v-for="(questionSet, counter) in questionSets"
          :key="counter"
          @click="onQuestionSetClick(questionSet.questionSetID)"
        >
          <td>{{ questionSet.title }}</td>
          <td>{{ questionSetRate(counter) }}</td>
          <td>{{ questionSetDateParsed(questionSet.dateModified) }}</td>
        </tr>
      </table>
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
    };
  },
  methods: {
    createQuestionSet() {
      this.$emit('createQuestionSet');
    },
    questionSetRate(counter) {
      if (this.questionSets[counter].data.length == 0) {
        // Newly created
        return 'No Data Yet';
      }
      const total = this.questionSets[counter].data.answerData.length; // Data was reset/wiped
      if (total) {
        return 'No Data Yet';
      } else {
        const totalCorrect = this.questionSets[counter].data.answerData.reduce(
          (a, b) => a + b,
          0
        );
        // let totalIncorrect = total - totalCorrect.length;
        const percentage = Math.round((totalCorrect / total) * 10000) / 100;
        return `${percentage} (${totalCorrect}/${total})`;
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
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1400px;
  min-height: 700px;
}

table {
  width: 100%;
  background-color: #c4c4c4;
}

.title {
  width: 55%;
}

.rate {
  width: 15%;
}

.date {
  width: 15%;
}

.tools {
  width: 15%;
}
</style>
