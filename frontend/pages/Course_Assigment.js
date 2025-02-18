export default {
    template: `
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Assignments</h2>
        
        <button @click="addWeek" class="bg-green-500 text-white px-4 py-2 mb-4">Add Week</button>
        
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="border p-4 mb-4">
          <h3 class="text-lg font-bold">Week {{ weekIndex + 1 }}</h3>
          <button @click="addAssignment(weekIndex, 'practice')" class="bg-blue-500 text-white px-2 py-1 mr-2">Add Practice Assignment</button>
          <button @click="addAssignment(weekIndex, 'graded')" class="bg-red-500 text-white px-2 py-1">Add Graded Assignment</button>
          
          <ul>
            <li v-for="(assignment, assignmentIndex) in week.assignments" :key="assignment.id" class="border p-2 mt-2">
              <input v-model="assignment.title" placeholder="Title" class="border p-2 w-full mb-2">
              <textarea v-model="assignment.description" placeholder="Description" class="border p-2 w-full mb-2"></textarea>
              <input v-model="assignment.due_date" type="datetime-local" class="border p-2 w-full mb-2">
              <input v-model.number="assignment.max_marks" type="number" placeholder="Max Marks" class="border p-2 w-full mb-2">
              <select v-model="assignment.assignment_type" class="border p-2 w-full mb-2">
                <option value="practice">Practice</option>
                <option value="graded">Graded</option>
              </select>
              <select v-model="assignment.status" class="border p-2 w-full mb-2">
                <option value="pending">Pending</option>
                <option value="published">Published</option>
              </select>
              
              <!-- Questions Section -->
              <h4 class="text-md font-semibold">Questions</h4>
              <button @click="addQuestion(weekIndex, assignmentIndex)" class="bg-green-400 text-white px-2 py-1 mb-2">Add Question</button>
              <ul>
                <li v-for="(question, questionIndex) in assignment.questions" :key="questionIndex" class="border p-2 mt-2">
                  <input v-model="question.text" placeholder="Question Text" class="border p-2 w-full mb-2">
                  <button @click="removeQuestion(weekIndex, assignmentIndex, questionIndex)" class="bg-gray-500 text-white px-2 py-1">Remove Question</button>
                </li>
              </ul>
              
              <button @click="removeAssignment(weekIndex, assignmentIndex)" class="bg-gray-500 text-white px-2 py-1">Remove Assignment</button>
            </li>
          </ul>
        </div>
        
        <button @click="submitAssignments" class="bg-blue-600 text-white px-4 py-2">Save Assignments</button>
      </div>
    `,
    data() {
      return {
        weeks: [],
        course_id: this.$route.params.course_id
      };
    },
    methods: {
      addWeek() {
        this.weeks.push({ assignments: [] });
      },
      addAssignment(weekIndex, type) {
        this.weeks[weekIndex].assignments.push({
          title: '',
          description: '',
          due_date: '',
          max_marks: null,
          assignment_type: type,
          status: 'pending',
          questions: []
        });
      },
      addQuestion(weekIndex, assignmentIndex) {
        this.weeks[weekIndex].assignments[assignmentIndex].questions.push({ text: '' });
      },
      removeQuestion(weekIndex, assignmentIndex, questionIndex) {
        this.weeks[weekIndex].assignments[assignmentIndex].questions.splice(questionIndex, 1);
      },
      removeAssignment(weekIndex, assignmentIndex) {
        this.weeks[weekIndex].assignments.splice(assignmentIndex, 1);
      },
      async fetchAssignments() {
        try {
          const response = await fetch(`/instructor_assignment_api/${this.course_id}`, {
            headers: { 'Authentication-Token': localStorage.getItem('auth_token') }
          });
          if (!response.ok) throw new Error('Failed to fetch assignments');
          const data = await response.json();
          
          if (data.assignments.length > 0) {
            let groupedAssignments = {};
            data.assignments.forEach(assignment => {
              let weekIndex = parseInt(assignment.title.match(/Week (\d+)/)?.[1] || 0) - 1;
              if (!groupedAssignments[weekIndex]) groupedAssignments[weekIndex] = { assignments: [] };
              groupedAssignments[weekIndex].assignments.push({ ...assignment, questions: [] });
            });
            this.weeks = Object.values(groupedAssignments);
          } else {
            this.weeks = [];
          }
        } catch (error) {
          console.error(error);
        }
      },
      async submitAssignments() {
        try {
          const payload = this.weeks.flatMap((week, weekIndex) => 
            week.assignments.map(assignment => ({
              ...assignment,
              title: `Week ${weekIndex + 1}: ${assignment.title}`
            }))
          );
          const response = await fetch(`/instructor_assignment_api/${this.course_id}`, {
            method: 'POST',
            headers: { 'Authentication-Token': localStorage.getItem('auth_token') },
            body: JSON.stringify({ assignments: payload })
          });
          if (!response.ok) throw new Error('Failed to save assignments');
          const data = await response.json();
          alert(data.message);
          this.fetchAssignments();
        } catch (error) {
          console.error(error);
        }
      }
    },
    mounted() {
      this.fetchAssignments();
    }
  };
