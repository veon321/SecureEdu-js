const users = [
  { id: 1, name: "Jan Kowalski", role: "admin" },
  { id: 2, name: "Anna Nowak", role: "teacher" },
  { id: 3, name: "Piotr Gryz", role: "student", grades: [3, 4, 5] },
  { id: 4, name: "Marta Żak", role: "guest" },
  { id: 5, name: "test", role: "student", grades: [3, 4, 5] },
];

const roles = ["admin", "teacher", "student", "guest"];

const populateRoleOptions = (selectEl, selectedRole = null) => {
  selectEl.replaceChildren();
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    if (role === selectedRole) option.selected = true;
    selectEl.appendChild(option);
  });
};

const renderSelectStep = (containerEl, contentEl, role, onSelected) => {
  const selectedUsers = users.filter((user) => user.role === role);

  containerEl.classList.remove("hidden");
  containerEl.innerHTML = "";
  contentEl.classList.add("hidden");

  selectedUsers.forEach(({ id, name, role: userRole }) => {
    const el = document.createElement("div");
    el.classList.add("select-card");
    el.dataset.id = `${id}`;
    el.innerHTML = `
      <p>ID: ${id}</p>
      <p>Name: ${name}</p>
      <p>Role: ${userRole}</p>
      <button type="button" class="selectUser">Select</button>
    `;
    containerEl.appendChild(el);
  });

  const selectButtons = containerEl.querySelectorAll(".selectUser");
  selectButtons.forEach((select) => {
    select.addEventListener("click", (event) => {
      const card = event.target.closest(".select-card");
      const id = Number(card.dataset.id);

      containerEl.classList.add("hidden");
      contentEl.classList.remove("hidden");

      if (onSelected) onSelected(id);
    });
  });
};

const admin = () => {
  const adminSelect = document.getElementById("admin-select");
  const adminContent = document.getElementById("admin-content");

  renderSelectStep(adminSelect, adminContent, "admin", () => {
    renderAdminContent();
  });
};

const renderAdminContent = () => {
  const listUser = document.getElementById("user-list");
  listUser.replaceChildren();

  users.forEach(({ id, name, role, grades }) => {
    const gradesDisplay =
      Array.isArray(grades) && grades.length > 0 ? grades.join(", ") : "None";

    const divUser = document.createElement("div");
    divUser.classList.add("user-card");
    divUser.dataset.id = `${id}`;

    divUser.setHTMLUnsafe(`
      <div class="user-info">
        <p class="u-id"></p>
        <p class="u-name"></p>
        <p class="u-role"></p>
        <p class="u-grades"></p>
        <button class="edit-btn">edit</button>
        <button class="remove-btn">remove</button>
      </div>
    `);

    divUser.querySelector(".u-id").textContent = `ID: ${id}`;
    divUser.querySelector(".u-name").textContent = `Name: ${name}`;
    divUser.querySelector(".u-role").textContent = `Role: ${role}`;
    divUser.querySelector(".u-grades").textContent =
      role === "student" ? `Grades: ${gradesDisplay}` : "";

    listUser.appendChild(divUser);
  });

  populateRoleOptions(document.getElementById("user-role"));

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) =>
    button.addEventListener("click", removeUser),
  );

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", editUser);
  });
};

const teacher = () => {
  const teacherSelect = document.getElementById("teacher-select");
  const teacherContent = document.getElementById("teacher-content");

  renderSelectStep(teacherSelect, teacherContent, "teacher", () => {
    renderTeacherContent();
  });
};

const renderTeacherContent = () => {
  const students = users.filter((user) => user.role === "student");

  const studentsDiv = document.getElementById("students-list");
  const studentSelect = document.getElementById("studentSelect");
  const gradeSelect = document.getElementById("grade");

  studentsDiv.innerHTML = "";
  studentSelect.innerHTML = "";

  studentsDiv.classList.add("studentsDiv");

  students.forEach((student) => {
    const studentDiv = document.createElement("div");
    studentDiv.classList.add("student-row");
    studentDiv.innerHTML = `
      ID: ${student.id} | Name: ${student.name} | Role: ${student.role} | Grades: ${student.grades}
    `;
    studentsDiv.appendChild(studentDiv);

    const option = document.createElement("option");
    option.text = student.name;
    studentSelect.appendChild(option);
  });

  if (gradeSelect.options.length === 0) {
    const gradesToChoose = [1, 2, 3, 4, 5, 6];
    gradesToChoose.forEach((grade) => {
      const option = document.createElement("option");
      option.text = grade;
      gradeSelect.appendChild(option);
    });
  }
};

const addGradeButton = document.getElementById("add");

addGradeButton.addEventListener("click", () => {
  const gradeSelect = document.getElementById("grade");
  const studentSelect = document.getElementById("studentSelect");
  const selectedOption =
    studentSelect.options[studentSelect.selectedIndex].text;

  const user = users.find((u) => u.name === selectedOption);
  if (user && gradeSelect.value) {
    user.grades.push(gradeSelect.value);
    renderTeacherContent();
  }
});

const student = () => {
  const students = document.getElementById("students");
  const studentDetails = document.getElementById("student-details");
  const studentsList = users.filter((user) => user.role === "student");

  students.classList.remove("hidden");
  students.innerHTML = "";
  studentDetails.innerHTML = "";

  studentsList.forEach(({ id, name, role, grades }) => {
    const studentEl = document.createElement("div");
    studentEl.innerHTML = `
      <div class="student-info" data-id="${id}">
        <p class="s-id"></p>
        <p class="s-name"></p>
        <p class="s-role"></p>
        <p class="s-grades"></p>
        <button type="button" class="selectStudent">Select</button>
      </div>
    `;
    studentEl.querySelector(".s-id").textContent = `ID: ${id}`;
    studentEl.querySelector(".s-name").textContent = `Name: ${name}`;
    studentEl.querySelector(".s-role").textContent = `Role: ${role}`;

    students.appendChild(studentEl);
  });

  const selectButtons = students.querySelectorAll(".selectStudent");

  selectButtons.forEach((select) => {
    select.addEventListener("click", (event) => {
      const box = event.target.parentElement;
      const id = box.dataset.id;
      const userIndex = users.findIndex((user) => user.id == id);

      students.classList.add("hidden");

      studentDetails.innerHTML = `
        <p>Welcome ${users[userIndex].name}</p>

        <p>Your grades: ${users[userIndex].grades}
      `;
    });
  });
};

const guest = () => {
  const guestContainer = document.getElementById("guest-container");

  guestContainer.innerHTML = "TODO";
};

const roleRegistry = { admin, teacher, student, guest };

const startButtons = document.querySelectorAll(".user");
const menuContainer = document.getElementById("menu-container");
const addUserButton = document.getElementById("addUser-button");

const showPanel = function (event) {
  const userRole = event.target.dataset.role;
  const panel = document.querySelector(`.panel.${userRole}`);

  if (panel) panel.classList.remove("hidden");
  menuContainer.classList.add("hidden");

  const runRoleMechanics = roleRegistry[userRole];
  if (runRoleMechanics) {
    runRoleMechanics();
  } else {
    console.error(`No mechanics found for role: ${userRole}`);
  }
};

const addUser = function () {
  const usernameInput = document.getElementById("name");
  const username = usernameInput.value.trim();
  const role = document.getElementById("user-role").value;

  if (username === "") {
    alert("Enter a username!");
    return;
  }

  const lastUser = users[users.length - 1];
  const newId = lastUser ? lastUser.id + 1 : 1;

  users.push({ id: newId, name: username, role, grades: [] });
  usernameInput.value = "";

  renderAdminContent();
};

const removeUser = function (event) {
  const parent = event.target.closest(".user-card");
  const id = Number(parent.dataset.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }

  renderAdminContent();
};

const editUser = function (event) {
  const parent = event.target.closest(".user-card");
  const divEdit = parent ? parent.querySelector(".edit-div") : null;

  if (divEdit) {
    divEdit.remove();
    return;
  }

  const editDiv = document.createElement("div");
  editDiv.classList.add("edit-div");

  const userIndex = users.findIndex(
    (user) => user.id === Number(parent.dataset.id),
  );

  editDiv.setHTMLUnsafe(`
    Edit panel
    <label>Username: <input type="text" class="name-edit" id="name-edit" value="" /></label>
    <label>Grades: <input type="text" class="grade-edit" id="grade-edit" value="" /></label>
    <label>Role: <select class="role-edit" id="role-edit"></select></label>
    <button type="button" id="edit-apply" class="edit-apply">Apply</button>
    <p class="error hidden" id="error"></p>
  `);

  parent.appendChild(editDiv);

  const nameInput = editDiv.querySelector("#name-edit");
  nameInput.value = users[userIndex].name;

  const gradeInput = editDiv.querySelector("#grade-edit");
  const currentGrades = users[userIndex].grades;
  gradeInput.value = Array.isArray(currentGrades)
    ? currentGrades.join(" ")
    : "";

  gradeInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/[^1-6]/g, "");
    e.target.value = digits.split("").join(" ");
  });

  populateRoleOptions(
    editDiv.querySelector("#role-edit"),
    users[userIndex].role,
  );

  const applyButton = editDiv.querySelector("#edit-apply");

  applyButton.addEventListener("click", () => {
    const nameField = editDiv.querySelector("#name-edit");

    if (nameField.value.trim() === "") {
      const error = editDiv.querySelector("#error");
      error.textContent = "Enter all values!";
      error.classList.remove("hidden");
      return;
    }

    const newName = nameField.value;
    const newRole = editDiv.querySelector("#role-edit").value;

    const gradesRaw = gradeInput.value.trim();
    const newGradesArray =
      gradesRaw === ""
        ? []
        : gradesRaw.split(" ").map((num) => parseInt(num, 10));

    users[userIndex].name = newName;
    users[userIndex].role = newRole;
    users[userIndex].grades = newGradesArray;

    renderAdminContent();
  });
};

startButtons.forEach((button) => {
  button.addEventListener("click", showPanel);
});

addUserButton.addEventListener("click", addUser);

const backButton = document.querySelectorAll(".back");

const home = () => {
  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    panel.classList.add("hidden");
  });
  const menuContainer = document.getElementById("menu-container");
  menuContainer.classList.remove("hidden");
};

backButton.forEach((back) => {
  back.addEventListener("click", home);
});
