import { MyTable } from './Table.js';
import { columns } from '../config/columnsConfig.js';
import { fetchData } from '../utils/fetchData.js';

export function App() {
  // Create wrapper
  const container = document.createElement("div");
  container.className="app-wrapper";

  //topbar
  const topBar=document.createElement("div");
  topBar.className="top-bar"


  //for title
  // const title=document.createElement("div")
  // title.className="table-title";
  // title.textContent="Dynamic table"

  //for placing search center
  const controls=document.createElement("div")
  controls.className="controls"



  const search = document.createElement("input");
  search.id = "search";
  search.placeholder = "Search...";

  const resetBtn = document.createElement("button");
  resetBtn.id = "reset-filters";
  resetBtn.textContent = "Reset Filters";

  const clearSortBtn = document.createElement("button");
  clearSortBtn.id = "clear-sort";
  clearSortBtn.textContent = "Clear Sort";



  //appending search and reset to controls
  controls.appendChild(search);
  controls.appendChild(resetBtn);
  controls.appendChild(clearSortBtn);
  
  //append title and conttrols to topbar
  // topBar.appendChild(title);
  topBar.appendChild(controls);


  const tableContainer = document.createElement("section");
  tableContainer.id = "table-container";

  const tableHeader = document.createElement("div");
  tableHeader.id = "table-header";
  tableHeader.className = "header-row";

  const tableBody = document.createElement("div"); 
  tableBody.id = "table-body";

  //appending head and body to table
  tableContainer.appendChild(tableHeader);
  tableContainer.appendChild(tableBody);


  //append tablecontainer and topbar to entire container
  container.appendChild(topBar)
  container.appendChild(tableContainer);
  document.body.appendChild(container);


  // Dynamically calculate column widths based on total columns
  const columnWidth = 100 / columns.length; // divide 100% equally between all columns

  MyTable({
    columns,
    searchInput: search,
    resetButton: resetBtn,
    clearSortButton: clearSortBtn,
    headerContainer: tableHeader,
    bodyContainer: tableBody,
    fetchCallback: fetchData,
    
  });
}
