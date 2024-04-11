
let graph=[];
let graphLength;
let firstDistancesArray= [];
let secondDistancesArray=[];
let timeReservesArray=[];

class myGraph{

  /* vertex(vertices) = вершина(вершини)
   edge = дуга між вершинами
   wayLength = довжина шляху між вершинами*/

  constructor(verticesCount){
    this.matrix=[];
    for(let i=0; i<verticesCount; i++){
      this.matrix.push(new Array(verticesCount).fill(0));
    }
  }
  addEdge(vertex1, vertex2, wayLength){
    this.matrix[vertex1][vertex2]=wayLength;
  }
}

document.getElementById("findDistances")
.addEventListener("click", findDistances);
createDefaultGraph();

/**
 * Функція для створення дефолтного графа
 */
function createDefaultGraph(){
  const defaultGraph = new myGraph(10);
  defaultGraph.addEdge(0, 1, 7);
  defaultGraph.addEdge(1, 2, 12);
  defaultGraph.addEdge(2, 4, 6);
  defaultGraph.addEdge(2, 5, 9);
  defaultGraph.addEdge(3, 5, 13);
  defaultGraph.addEdge(4, 6, 3);
  defaultGraph.addEdge(5, 6, 10);
  defaultGraph.addEdge(5, 7, 3);
  defaultGraph.addEdge(5, 8, 4);
  defaultGraph.addEdge(6, 8, 12);
  defaultGraph.addEdge(7, 8, 17);
  defaultGraph.addEdge(8, 9, 6);

  outputGraph(defaultGraph);

}

/**
 * Виводимо наш граф у консольку та в label-елемент в .html-коді
 * @param createdGraph - наш створений граф
 */
function outputGraph(createdGraph){
  console.log(createdGraph);
  graph=createdGraph;
  graphLength=createdGraph.matrix.length;
  let graphLabel=document.getElementById("graph");

  graphLabel.textContent = "";

  for(let i= 0; i < graphLength; i++){
    for(let j= 0; j < createdGraph.matrix[i].length; j++){
      console.log(`Matrix[${i}][${j}]`, createdGraph.matrix[i][j]);
      if(createdGraph.matrix[i][j] !== 0){
        graphLabel.innerHTML += `${i} -> ${j} {<b>${createdGraph.matrix[i][j]}</b>}<br><br>`;
      }
    }
  }
}

/**
 * Метод для безпосереднього знаходження
 * тривалості комплексу робіт за допомогою резервів часу
 */
function findDistances(){
  findEarlyDeadlines();
  findLateDeadlines(firstDistancesArray);
  findTimeReserves(firstDistancesArray, secondDistancesArray);
  findCriticalPath(timeReservesArray);

}


/**
 * Метод для знаходження ранніх термінів здійснення події,
 * що реалізовує обернений алгоритм Дейкстри
 */
function findEarlyDeadlines() {
  let maxDistancesArray=[];
  let maxDistance;

  for(let i=0; i<graphLength; i++) {
    maxDistancesArray[i] = 0;
  }

  for(let i= 0; i<graphLength; i++) {
    for (let j = 0; j < graphLength; j++){
      if (graph.matrix[i][j] !== 0) {
        maxDistance = graph.matrix[i][j] + maxDistancesArray[i];
        if (maxDistance > maxDistancesArray[j]) {
          maxDistancesArray[j] = maxDistance;
        }
      }
    }
  }
  firstDistancesArray=maxDistancesArray;
  console.log("Ранні терміни: "+maxDistancesArray);
  document.getElementById("earlyDeadlines").innerHTML="<b>Ранні терміни здійснення події <br><br>";
  displayDistances(maxDistancesArray, "earlyDeadlines");
}

/**
 * Метод, що обраховує пізні терміни здійснення події
 *
 */
function findLateDeadlines(distances) {
  let minDistancesArray=[];
  let lateTerm;
  let fisrtAppeal = true;

  for(let i=0; i<graphLength; i++) {
    minDistancesArray[i] = 0;
  }

  for (let i = graphLength-1; i >= 0; i--) {
    fisrtAppeal = true;
    for (let j = graphLength-1; j >= 0; j--) {
      if(graph.matrix[i][j]!==0){
        lateTerm = minDistancesArray[j] - graph.matrix[i][j];

        if(fisrtAppeal){
          minDistancesArray[i]=lateTerm;
          fisrtAppeal=false;
        }
        else
        {
          if(lateTerm < minDistancesArray[i]){
            minDistancesArray[i]=lateTerm;
          }
        }
      }
    }
    if(minDistancesArray[i]===0){
      minDistancesArray[i]=distances[i];
    }
  }
  secondDistancesArray=minDistancesArray;
  console.log("Пізні терміни: "+minDistancesArray);
  document.getElementById("lateDeadlines").innerHTML="<b>Пізні терміни здійснення події <br><br>";
  displayDistances(minDistancesArray, "lateDeadlines");
}

/**
 * Функція для відшукання резервів часу
 */
function findTimeReserves(firstArray, secondArray) {
  let timeReserves=[];
  for(let i= 0; i<graphLength; i++) {
    timeReserves[i]=secondArray[i] - firstArray[i];
  }

  timeReservesArray=timeReserves;
  console.log("Резерви часу: "+timeReserves);
  document.getElementById("timeReserves").innerHTML = "<b>Резерви часу: <br><br>" + timeReserves + "<br> <br>";
}

/**
 * Метод, що обраховує критичний шлях:
 * вершини, в яких резерв часу = 0
 * @param reserves - резерви часу
 */
function findCriticalPath(reserves) {
  let criticalPath=[];
  for(let i=0; i<reserves.length; i++){
    if(reserves[i]===0){
      criticalPath.push(i.valueOf());
    }
  }
  console.log("Критичний шлях: "+criticalPath);
  document.getElementById("criticalPath").innerHTML="<b>Критичний шлях:<br><br>"+criticalPath;
}

/**
 * Метод, що виводить обраховані відстані
 * між вершинами графа
 */
function displayDistances(arrayForDisplaying, labelForText) {
  for(let i=0; i<arrayForDisplaying.length; i++){
    document.getElementById(labelForText).innerHTML+=
        `0 -> ${i} ~~ ${arrayForDisplaying[i]}<br><br>`;
  }
}