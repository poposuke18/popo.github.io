const registerCourseBtn = document.getElementById("registerCourseBtn");
const saveCourseBtn = document.getElementById("saveCourseBtn");
const numOfPlayers = document.getElementById("numOfPlayers");
const selectCourse = document.getElementById("selectCourse");
const selectCourseBtn = document.getElementById("selectCourseBtn");
const holesInfo = document.getElementById("holesInfo");
const playerInfo = document.getElementById("playerInfo");
const scorecard = document.getElementById("scorecard");

function createCourseHoles() {
    holesInfo.innerHTML = "";
    for (let i = 1; i <= 18; i++) {
        const holeInfo = document.createElement("div");
        holeInfo.innerHTML = `
            <label>ホール${i}:</label>
            <input type="number" id="par${i}" placeholder="パー">
            <input type="number" id="length${i}" placeholder="ホールの長さ">
        `;
        holesInfo.appendChild(holeInfo);
    }
}

function saveCourse() {
    const courseName = document.getElementById("courseName").value;
    if (courseName === "") {
        alert("コース名を入力してください");
        return;
    }
    const courseData = {
        name: courseName,
        holes: []
    };
    for (let i = 1; i <= 18; i++) {
        const par = document.getElementById(`par${i}`).value;
        const length = document.getElementById(`length${i}`).value;
        if (par === "" || length === "") {
            alert(`ホール${i}の情報を入力してください`);
            return;
        }
        courseData.holes.push({
            par: parseInt(par),
            length: parseInt(length)
        });
    }
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    storedCourses.push(courseData);
    localStorage.setItem("courses", JSON.stringify(storedCourses));
    updateCourseSelection();
}

function updateCourseSelection() {
    selectCourse.innerHTML = '<option value="" disabled selected>コース選択</option>';
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    storedCourses.forEach((course, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.innerText = course.name;
        selectCourse.appendChild(option);
    });
}

function createPlayerInputs() {
    playerInfo.innerHTML = "";
    const n = parseInt(numOfPlayers.value);
    for (let i = 1; i <= n; i++) {
        const playerInput = document.createElement("div");
        playerInput.innerHTML = `
            <label>プレーヤー${i}:</label>
            <input type="text" id="playerName${i}" placeholder="名前">
            <input type="number" id="handicap${i}" placeholder="ハンデキャップ" value="0">
            <button id="setPlayerName${i}">名前決定</button>
        `;
        playerInfo.appendChild(playerInput);
        document.getElementById(`setPlayerName${i}`).addEventListener("click", () => {
            const playerName = document.getElementById(`playerName${i}`).value;
            if (playerName === "") {
                alert("プレーヤー名を入力してください");
                return;
            }
            document.getElementById(`playerName${i}`).disabled = true;
            document.getElementById(`handicap${i}`).disabled = true;
            document.getElementById(`setPlayerName${i}`).disabled = true;
        });
    }
}

function createScorecard() {
    const n = parseInt(numOfPlayers.value);
    const courseIndex = parseInt(selectCourse.value);
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const courseData = storedCourses[courseIndex];
    let scorecardHtml = `
        <table>
            <tr>
                <th>ホール</th>
                <th>パー</th>
                <th>長さ</th>
    `;
    for (let i = 1; i <= n; i++) {
        scorecardHtml += `<th>プレーヤー${i}</th>`;
    }
    scorecardHtml += "</tr>";

    for (let i = 1; i <= 18; i++) {
        scorecardHtml += `
            <tr>
                <td>${i}</td>
                <td>${courseData.holes[i - 1].par}</td>
                <td>${courseData.holes[i - 1].length}</td>
        `;
        for (let j = 1; j <= n; j++)        {
          scorecardHtml += `<td><input type="number" id="player${j}hole${i}" class="player${j}"></td>`;
      }
      scorecardHtml += "</tr>";
  }
  scorecardHtml += "</table>";
  scorecard.innerHTML = scorecardHtml;

  const totalBtn = document.createElement("button");
  totalBtn.innerText = "合計表示";
  scorecard.appendChild(totalBtn);

  totalBtn.addEventListener("click", () => {
      let totalHtml = `
          <table>
              <tr>
                  <th>合計</th>
                  <th>Out</th>
                  <th>In</th>
                  <th>Total</th>
              </tr>
              <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
          </table>
      `;
      const totalTable = document.createElement("div");
      totalTable.innerHTML = totalHtml;
      scorecard.appendChild(totalTable);

      for (let i = 1; i <= n; i++) {
          let outTotal = 0;
          let inTotal = 0;
          for (let j = 1; j <= 18; j++) {
              const score = parseInt(document.getElementById(`player${i}hole${j}`).value) || 0;
              if (j <= 9) {
                  outTotal += score;
              } else {
                  inTotal += score;
              }
          }
          totalTable.querySelector("tr:nth-child(2)").innerHTML += `
              <td>${outTotal}</td>
              <td>${inTotal}</td>
              <td>${outTotal + inTotal}</td>
          `;
      }
  });
}

registerCourseBtn.addEventListener("click", createCourseHoles);
saveCourseBtn.addEventListener("click", saveCourse);
numOfPlayers.addEventListener("change", createPlayerInputs);
selectCourseBtn.addEventListener("click", createScorecard);
updateCourseSelection();


