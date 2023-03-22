document.getElementById("confirm-player-count").addEventListener("click", function() {
    const playerCount = document.getElementById("player-count").value;
    const playerDetailsContainer = document.getElementById("player-details-container");
    playerDetailsContainer.innerHTML = "";

    for (let i = 0; i < playerCount; i++) {
        const playerDiv = document.createElement("div");
        playerDiv.innerHTML = `
            <label>プレーヤー${i + 1}:</label>
            <input type="text" id="player-name-${i}">
            <label>ハンデキャップ:</label>
            <input type="number" id="player-handicap-${i}" value="0">
        `;
        playerDetailsContainer.appendChild(playerDiv);
    }

    document.getElementById    ("player-details").style.display = "block";
});

document.getElementById("confirm-player-details").addEventListener("click", function() {
    const playerCount = document.getElementById("player-count").value;
    const scoreInputContainer = document.getElementById("score-input-container");
    const playerNamesRow = document.getElementById("player-names-row");
    scoreInputContainer.innerHTML = "";
    playerNamesRow.innerHTML = "";

    const playerNames = [];
    for (let i = 0; i < playerCount; i++) {
        playerNames.push(document.getElementById(`player-name-${i}`).value);
    }

    document.getElementById("player-names-heading").setAttribute("colspan", playerCount);
    for (let i = 0; i < playerCount; i++) {
        const playerNameHeading = document.createElement("th");
        playerNameHeading.textContent = playerNames[i];
        playerNamesRow.appendChild(playerNameHeading);
    }

    for (let i = 0; i < 18; i++) {
        const holeRow = document.createElement("tr");

        holeRow.innerHTML = `
            <td>${i + 1}</td>
            <td><input type="number" id="hole-${i}-par" class="par-input"></td>
            <td><input type="number" id="hole-${i}-distance" class="distance-input"></td>
        `;

        for (let j = 0; j < playerCount; j++) {
            const scoreInput = document.createElement("td");
            scoreInput.innerHTML = `<input type="number" id="player-${j}-hole-${i}-score">`;
            holeRow.appendChild(scoreInput);
        }

        scoreInputContainer.appendChild(holeRow);
    }

    document.getElementById("score-input").style.display = "block";
    document.getElementById("player-names-header").style.display = "block";

    const parInputs = document.getElementsByClassName("par-input");
    const distanceInputs = document.getElementsByClassName("distance-input");

    for (let i = 0; i < parInputs.length; i++) {
        parInputs[i].addEventListener("input", updateTotalPar);
        distanceInputs[i].addEventListener("input", updateTotalDistance);
    }



    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < playerCount; j++) {
            const scoreInput = document.getElementById(`player-${j}-hole-${i}-score`);
            scoreInput.addEventListener("input", updatePlayerScores);
        }
    }
    updatePlayerScores();

});



function updateTotalPar() {
    const parInputs = document.getElementsByClassName("par-input");
    let totalPar = 0;
    let outPar = 0;
    let inPar = 0;

    for (let i = 0; i < parInputs.length; i++) {
        if (parInputs[i].value) {
            totalPar += parseInt(parInputs[i].value);
            if (i < 9) {
                outPar += parseInt(parInputs[i].value);
            } else {
                inPar += parseInt(parInputs[i].value);
            }
        }
    }

    document.getElementById("out-par").innerText = outPar;
    document.getElementById("in-par").innerText = inPar;
    document.getElementById("total-par").innerText = totalPar;
}

function updateTotalDistance() {
    const distanceInputs = document.getElementsByClassName("distance-input");
    let totalDistance = 0;
    let outDistance = 0;
    let inDistance = 0;

    for (let i = 0; i < distanceInputs.length; i++) {
        if (distanceInputs[i].value) {
            totalDistance += parseInt(distanceInputs[i].value);
            if (i < 9) {
                outDistance += parseInt(distanceInputs[i].value);
            } else {
                inDistance += parseInt(distanceInputs[i].value);
            }
        }
    }

    document.getElementById("out-distance").innerText = outDistance;
    document.getElementById("in-distance").innerText = inDistance;
    document.getElementById("total-distance").innerText = totalDistance;
}

function updatePlayerScores() {
    const playerCount = document.getElementById("player-count").value;
    const outRow = document.getElementById("out-row");
    const inRow = document.getElementById("in-row");
    const totalRow = document.getElementById("total-row");
    const playerScoreTemplate = document.getElementById("player-score-template");

    let playerOutScores = [];
    let playerInScores = [];
    let playerTotalScores = [];

    for (let i = 0; i < playerCount; i++) {
        playerOutScores.push(0);
        playerInScores.push(0);
        playerTotalScores.push(0);
    }

    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < playerCount; j++) {
            const scoreInput = document.getElementById(`player-${j}-hole-${i}-score`);
            if (scoreInput.value) {
                const score = parseInt(scoreInput.value);
                playerTotalScores[j] += score;
                if (i < 9) {
                    playerOutScores[j] += score;
                } else {
                    playerInScores[j] += score;
                }
            }
        }
    }

    outRow.innerHTML = '<td>Out</td><td id="out-par"></td><td id="out-distance"></td>';
    inRow.innerHTML = '<td>In</td><td id="in-par"></td><td id="in-distance"></td>';
    totalRow.innerHTML = '<td>全トータル</td><td id="total-par"></td><td id="total-distance"></td>';

    for (let i = 0; i < playerCount; i++) {
        const outScoreCell = playerScoreTemplate.content.cloneNode(true);
        outScoreCell.querySelector(".player-score").innerText = playerOutScores[i];
        outRow.appendChild(outScoreCell);

        const inScoreCell = playerScoreTemplate.content.cloneNode(true);
        inScoreCell.querySelector(".player-score").innerText = playerInScores[i];
        inRow.appendChild(inScoreCell);

        const totalScoreCell = playerScoreTemplate.content.cloneNode(true);
        totalScoreCell.querySelector(".player-score").innerText = playerTotalScores[i];
        totalRow.appendChild(totalScoreCell);
    }

    updateTotalPar();
    updateTotalDistance();
}

