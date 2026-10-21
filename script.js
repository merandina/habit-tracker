
const habitList = document.getElementById("habit-list");
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-input");
const habitCategory = document.getElementById("habit-category");

const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");

function updateProgress() {
  const checkboxes = habitList.querySelectorAll(
    'input[type="checkbox"]'
  );

  const total = checkboxes.length;
  const completed = habitList.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent = `${completed} of ${total} completed`;
  progressPercent.textContent = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;
}

function saveHabits() {
  const habits = [...habitList.querySelectorAll(".habit")].map(
    (habit) => ({
      name: habit.querySelector(".habit-name").textContent,
      category: habit.querySelector(".habit-tag").textContent,
      completed: habit.querySelector('input[type="checkbox"]').checked
    })
  );

  localStorage.setItem("habits", JSON.stringify(habits));
}

function createHabit(name, category = "PERSONAL", completed = false) {
  const label = document.createElement("label");
  label.className = "habit";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  
  const habitName = document.createElement("span");
  habitName.className = "habit-name";
  habitName.textContent = name;

  const tag = document.createElement("span");
  tag.className = "habit-tag";
  tag.textContent = category;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.type = "button";

  editButton.addEventListener("click", () => {
  const newName = prompt("Enter the new habit name:", habitName.textContent);

  if (newName !== null && newName.trim() !== "") {
    habitName.textContent = newName.trim();
    saveHabits();
  }
});

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.type = "button";

  deleteButton.addEventListener("click", () => {
  label.remove();
  updateProgress();
  saveHabits();
});
  
  label.append(checkbox, habitName, tag, editButton, deleteButton);
  habitList.appendChild(label);
}

function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (savedHabits !== null) {
    try {
      const habits = JSON.parse(savedHabits);

      if (!Array.isArray(habits)) {
        throw new Error("Saved habits are not a list.");
      }

      habitList.replaceChildren();

      habits.forEach((habit) => {
        if (typeof habit.name === "string") {
          createHabit(
            habit.name,
            typeof habit.category === "string"
              ? habit.category
              : "PERSONAL",
            habit.completed === true
          );
        }
      });
    } catch (error) {
      console.error("Could not load saved habits:", error);
    }
  }

  updateProgress();
}

habitList.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    updateProgress();
    saveHabits();
  }
});

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = habitInput.value.trim();

  if (name === "") {
    return;
  }

  createHabit(name, habitCategory.value);
  habitInput.value = "";

  updateProgress();
  saveHabits();
});

loadHabits();
