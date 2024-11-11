document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("numProcesses").addEventListener("input", createProcessInputs);
  document.getElementById("startSimulation").addEventListener("click", startFCSFScheduling);

  function createProcessInputs() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processInputContainer = document.getElementById("processInputContainer");
    processInputContainer.innerHTML = "";

    for (let i = 0; i < numProcesses; i++) {
      const processDiv = document.createElement("div");
      processDiv.classList.add("process");

      processDiv.innerHTML = `
        <label>Process ${i + 1}:</label>
        <label>Arrival Time:</label>
        <input type="number" class="arrivalTime" placeholder="Arrival Time" min="0" />
        <label>Burst Time:</label>
        <input type="number" class="burstTime" placeholder="Burst Time" min="1" />
      `;

      processInputContainer.appendChild(processDiv);
    }
  }

  function startFCSFScheduling() {
    const arrivalTimes = Array.from(document.querySelectorAll(".arrivalTime")).map(input => parseInt(input.value));
    const burstTimes = Array.from(document.querySelectorAll(".burstTime")).map(input => parseInt(input.value));

    if (arrivalTimes.includes(NaN) || burstTimes.includes(NaN)) {
      alert("Please enter valid numbers for all Arrival and Burst Times.");
      return;
    }

    const numProcesses = arrivalTimes.length;
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
      processes.push({
        id: i + 1,
        arrivalTime: arrivalTimes[i],
        burstTime: burstTimes[i]
      });
    }

    // Sort processes by arrival time for FCFS
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Calculate completion time, turnaround time, and waiting time
    let currentTime = 0;
    const results = processes.map(process => {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const completionTime = startTime + process.burstTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;

      currentTime = completionTime;

      return {
        ...process,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime
      };
    });

    displayResults(results);
    displayGanttChart(results);
  }

  function displayResults(results) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
      <table>
        <tr>
          <th>Process</th><th>Arrival Time</th><th>Burst Time</th>
          <th>Start Time</th><th>Completion Time</th>
          <th>Turnaround Time</th><th>Waiting Time</th>
        </tr>
    `;

    results.forEach(process => {
      outputDiv.innerHTML += `
        <tr>
          <td>P${process.id}</td>
          <td>${process.arrivalTime}</td>
          <td>${process.burstTime}</td>
          <td>${process.startTime}</td>
          <td>${process.completionTime}</td>
          <td>${process.turnaroundTime}</td>
          <td>${process.waitingTime}</td>
        </tr>
      `;
    });

    outputDiv.innerHTML += "</table>";
  }

  function displayGanttChart(results) {
    const ganttChartDiv = document.getElementById("ganttChart");
    ganttChartDiv.innerHTML = "";

    results.forEach(process => {
      const processDiv = document.createElement("div");
      processDiv.classList.add("ganttProcess");
      processDiv.style.width = `${process.burstTime * 20}px`; // Adjust width scale for visual
      processDiv.innerHTML = `P${process.id} (${process.startTime}-${process.completionTime})`;
      ganttChartDiv.appendChild(processDiv);
    });
  }
});