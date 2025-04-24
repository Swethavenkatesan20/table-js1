import { renderCell } from './CellRenderer.js';
import { debounce } from '../utils/debounce.js';
import { throttle } from '../utils/throttle.js';

export function MyTable({ columns, searchInput, resetButton, clearSortButton, headerContainer, bodyContainer, fetchCallback }) {
  let allData = [];
  let offset = 0;
  const limit = 100;
  let isFetching = false;
  let sortKey = null;
  let sortOrder = 1;
  let filteredData=[]
  
  const rowHeight=40  //40px per row based on my css 
  const buffer=5      //extra row above and below

  //creating div for spacer
  // const spacerTop=document.createElement("div");
  // const spacerBottom=document.createElement("div");

  // spacerTop.style.height="0px";
  // spacerBottom.style.height="0px";

  // bodyContainer.innerHTML="";

  // //apending to body container
  // bodyContainer.appendChild(spacerTop);
  // bodyContainer.appendChild(spacerBottom);

  // Removed spacerTop and spacerBottom divs
// Using paddingTop and paddingBottom directly on bodyContainer
bodyContainer.style.paddingTop = "0px";
bodyContainer.style.paddingBottom = "0px";




//   function createHeader() {
// // creating dynamic column 

// // const gridColumns = `repeat(${columns.length}, 1fr)`; // Dynamically calculate column widths
// // headerContainer.style.display = "grid";
// // headerContainer.style.gridTemplateColumns = gridColumns; // Apply grid template dynamically

//   const columnWidths = columns.map(col => `minmax(150px, ${col.width || '1fr'})`).join(' '); // Use minmax for responsive columns

//   headerContainer.style.display = "grid";
//   headerContainer.style.gridTemplateColumns = columnWidths; // Apply column widths dynamically

//   //headerContainer.innerHTML="";


//   //iterate to all columns create header div 
//     columns.forEach(col => {
//       const cell = document.createElement("div");
//       cell.className = "column";
//       cell.textContent = col.label;

      
//       if (col.sortable) {
//         cell.classList.add("sortable");

// // adding arrow for direction
//         const arrow=document.createElement("span")
//         arrow.className="sort-arrow"
//         arrow.textContent=sortKey===col.key ? (sortOrder ===1 ? '⬆' : '⬇') : '   ↕' ;

//         cell.appendChild(arrow)


//         cell.addEventListener("click", () => {

//         // toggle sort direction

//           sortKey = col.key;
//           sortOrder = sortKey===col.key && sortOrder=== 1? -1 : 1
          
//         // rerendering to update arrow
//           //createHeader()


//           renderVirtualRows();
//         });
//       }
//       headerContainer.appendChild(cell);
//     });
//   }
function createHeader() {
  headerContainer.innerHTML = ""; // Clear old headers

  const columnWidths = columns.map(col => `minmax(150px, ${col.width || '1fr'})`).join(' ');
  headerContainer.style.display = "grid";
  headerContainer.style.gridTemplateColumns = columnWidths;

  columns.forEach(col => {
    const cell = document.createElement("div");
    cell.className = "column";
    cell.textContent = col.label;

    if (col.sortable) {
      cell.classList.add("sortable");

      const icon = document.createElement("img");
      icon.className = "sort-icon";
      icon.src = getSortIcon(col); // Use helper to get icon based on state
      icon.alt = "sort";

      cell.appendChild(icon);

      cell.addEventListener("click", () => {
        // Toggle sort key and order
        if (sortKey === col.key) {
          sortOrder = -sortOrder;
        } else {
          sortKey = col.key;
          sortOrder = 1;
        }



        //added this logic to comment calling createheader()
        if (col.sortIcons && icon) {
          icon.src = sortKey !== col.key
            ? col.sortIcons.default
            : sortOrder === 1
            ? col.sortIcons.asc
            : col.sortIcons.desc;
        }

        // Re-render header to update icon direction
        //createHeader();

        // Re-render rows
        renderVirtualRows();
      });
    }

    headerContainer.appendChild(cell);
  });
}

// Utility to get correct icon path from config
function getSortIcon(col) {
  if (!col.sortIcons) return '';
  if (sortKey !== col.key) return col.sortIcons.default;
  return sortOrder === 1 ? col.sortIcons.asc : col.sortIcons.desc;
}







  async function loadData() {
    if (isFetching) return;
    isFetching = true;
// i didnt have used await why ?
    const newData = await fetchCallback(offset, limit);
    allData = [...allData, ...newData];
    filteredData = allData;
    offset += limit;
    renderVirtualRows();

    isFetching = false;
  }


//   function applyFilter(){
//     const q=searchInput.value.toLowerCase();
//     filteredData=allData.filter(row=>columns.some(col=>col.filterable && String(row[col.key]?? "").toLowerCase().includes(q)
//   )
// );
//   }

// filters without using includes
function applyFilter() {
  const q = searchInput.value.toLowerCase();
  const regex = new RegExp(q, "i"); // Create a case-insensitive regular expression
  filteredData = allData.filter(row => 
    columns.some(col => 
      col.filterable && regex.test(String(row[col.key] ?? ""))
    )
  );
}




  // function renderVirtualRows() {
  //   let dataToRender = filteredData;

  //   if (sortKey) {
  //     const col = columns.find(c => c.key === sortKey);
  //     dataToRender = [...dataToRender].sort((a, b) => {
  //       const valA = a[sortKey] ?? col.defaultValue;
  //       const valB = b[sortKey] ?? col.defaultValue;
  //       if (typeof valA === "number") return (valA - valB) * sortOrder;
  //       return String(valA).localeCompare(String(valB)) * sortOrder;
  //     });
  //   }

  //   const scrollTop = window.scrollY;
  //   const viewportHeight = window.innerHeight;
  //   const visibleCount = Math.ceil(viewportHeight / rowHeight);

  //   const totalCount = dataToRender.length;
  //   //console.log(totalCount)
  //   const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  //   const endIndex = Math.min(totalCount, startIndex + visibleCount + buffer * 2);


  // //   console.log(`Start Index: ${startIndex}, End Index: ${endIndex}`);
  // //   console.log("Visible Data:", dataToRender.slice(startIndex, endIndex));

  //   // Clear previous visible rows (keep spacers)
  //   [...bodyContainer.querySelectorAll('.row')].forEach(el => el.remove());

  //   // Adjust spacer heights
  //   spacerTop.style.height = `${startIndex * rowHeight}px`;
  //   spacerBottom.style.height = `${(totalCount - endIndex) * rowHeight}px`;

  //   const columnWidths = columns
  //     .map(col => `minmax(150px, ${col.width || '1fr'})`)
  //     .join(' ');

  //   dataToRender.slice(startIndex, endIndex).forEach(row => {
  //     const rowDiv = document.createElement("div");
  //     rowDiv.className = "row";
  //     rowDiv.style.display = "grid";
  //     rowDiv.style.gridTemplateColumns = columnWidths;
  //     rowDiv.style.height = `${rowHeight}px`;

  //     columns.forEach(col => {
  //       const cell = document.createElement("div");
  //       cell.className = "column";
        
  //       const content = renderCell(col.key, row[col.key], col.defaultValue);
  //       // for bg 
  //       cell.textContent=content
  //       cell.setAttribute("data-label", content); //  for styling
  //       rowDiv.appendChild(cell);
  //     });

  //     bodyContainer.insertBefore(rowDiv, spacerBottom);
  //   });
  // }

  // new without spacer div

  // function renderVirtualRows() {
  //   let dataToRender = filteredData;
  
  //   if (sortKey) {
  //     const col = columns.find(c => c.key === sortKey);
  //     dataToRender = [...dataToRender].sort((a, b) => {
  //       const valA = a[sortKey] ?? col.defaultValue;
  //       const valB = b[sortKey] ?? col.defaultValue;
  //       if (typeof valA === "number") return (valA - valB) * sortOrder;
  //       return String(valA).localeCompare(String(valB)) * sortOrder;
  //     });
  //   }
  
  //   const scrollTop = window.scrollY;
  //   const viewportHeight = window.innerHeight;
  //   const visibleCount = Math.ceil(viewportHeight / rowHeight);
  
  //   const totalCount = dataToRender.length;
  //   const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  //   const endIndex = Math.min(totalCount, startIndex + visibleCount + buffer * 2);
  
  //   // Update padding of bodyContainer to simulate rows
  //   // bodyContainer.style.paddingTop = `${startIndex * rowHeight}px`;
  //   // bodyContainer.style.paddingBottom = `${(totalCount - endIndex) * rowHeight}px`;


  //   // Simulate rows above and below using padding on bodyContainer
  //   bodyContainer.style.paddingTop = `${startIndex * rowHeight}px`;
  //   bodyContainer.style.paddingBottom = `${(totalCount - endIndex) * rowHeight}px`;

  
  //   // Clear previous visible rows
  //   [...bodyContainer.querySelectorAll('.row')].forEach(el => el.remove());
  
  //   const columnWidths = columns
  //     .map(col => `minmax(150px, ${col.width || '1fr'})`)
  //     .join(' ');
  
  //   dataToRender.slice(startIndex, endIndex).forEach(row => {
  //     const rowDiv = document.createElement("div");
  //     rowDiv.className = "row";
  //     rowDiv.style.display = "grid";
  //     rowDiv.style.gridTemplateColumns = columnWidths;
  //     rowDiv.style.height = `${rowHeight}px`;
  
  //     columns.forEach(col => {
  //       const cell = document.createElement("div");
  //       cell.className = "column";
  //       const content = renderCell(col.key, row[col.key], col.defaultValue);
  //       cell.textContent = content;
  //       cell.setAttribute("data-label", content); // For styling
  //       rowDiv.appendChild(cell);
  //     });
  
  //     bodyContainer.appendChild(rowDiv);
  //   });
  // }
  
  function renderVirtualRows() {
    let dataToRender = filteredData;
  
    // Apply sorting if required
    if (sortKey) {
      const col = columns.find(c => c.key === sortKey);
      dataToRender = [...dataToRender].sort((a, b) => {
        const valA = a[sortKey] ?? col.defaultValue;
        const valB = b[sortKey] ?? col.defaultValue;
        if (typeof valA === "number") return (valA - valB) * sortOrder;
        return String(valA).localeCompare(String(valB)) * sortOrder;
      });
    }
  
    // Determine visible rows based on scrolling
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const visibleCount = Math.ceil(viewportHeight / rowHeight);
  
    const totalCount = dataToRender.length;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const endIndex = Math.min(totalCount, startIndex + visibleCount + buffer * 2);
  
    // Simulate space for rows above and below using padding
    bodyContainer.style.paddingTop = `${startIndex * rowHeight}px`;
    bodyContainer.style.paddingBottom = `${(totalCount - endIndex) * rowHeight}px`;
  
    // Get existing rows from the container
    const existingRows = [...bodyContainer.querySelectorAll('.row')];
    const rowCountNeeded = endIndex - startIndex;
  
    // Update or reuse existing rows
    for (let i = 0; i < rowCountNeeded; i++) {
      const rowData = dataToRender[startIndex + i];
  
      let rowDiv;
      if (i < existingRows.length) {
        // Reuse an existing row
        rowDiv = existingRows[i];
        rowDiv.style.display = "grid"; // Ensure the row is visible
      } else {
        // Create a new row if necessary
        rowDiv = document.createElement("div");
        rowDiv.className = "row";
        rowDiv.style.display = "grid";
        rowDiv.style.gridTemplateColumns = columns
          .map(col => `minmax(150px, ${col.width || '1fr'})`)
          .join(' ');
        rowDiv.style.height = `${rowHeight}px`;
        bodyContainer.appendChild(rowDiv);
      }
  
      // Update row content dynamically
      columns.forEach((col, colIndex) => {
        let cell;
  
        if (rowDiv.children[colIndex]) {
          // Update existing cell content
          cell = rowDiv.children[colIndex];
        } else {
          // Create a new cell if necessary
          cell = document.createElement("div");
          cell.className = "column";
          rowDiv.appendChild(cell);
        }
  
        // Update the cell's content and attributes
        const content = renderCell(col.key, rowData[col.key], col.defaultValue);
        cell.textContent = content;
        cell.setAttribute("data-label", content); // For styling
      });
    }
  
    // Hide extra rows if too many exist
    for (let i = rowCountNeeded; i < existingRows.length; i++) {
      existingRows[i].style.display = "none"; // Hide the row instead of removing it
    }
  }
  



  
  const handleSearch = debounce(() => {
    applyFilter();
    renderVirtualRows();
  }, 300);


  // here fetch data is fetched and stored in all data but not visible 
   const handleInfiniteScroll = throttle(async() => {
     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
       await loadData();
     }
   }, 200);



  //Updates the DOM to show only the rows that should be visible
  const handleVirtualScroll = throttle(() => {
    renderVirtualRows();
  }, 100);

  searchInput.addEventListener("input", handleSearch);

  // for filter reset
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    applyFilter();
    renderVirtualRows();
    });

    // for sort reset
    clearSortButton.addEventListener("click", () => {
      sortKey = null;
      sortOrder = 1;
      createHeader();
      renderVirtualRows();
    });

  window.addEventListener("scroll", ()=>{
    handleInfiniteScroll();
    handleVirtualScroll();

  });

  createHeader();
   loadData();
}
