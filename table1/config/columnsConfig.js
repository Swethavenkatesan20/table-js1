export const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    filterable: true,
    width: '10%',         // default width
    minWidth: '80px',     // optional min width
    maxWidth: '200px',    // optional max width
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    filterable: true,
    width: '30%',
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
  },
  {
    key: 'age',
    label: 'Age',
    sortable: true,
    filterable: true,
    width: '20%',
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
  },
  {
    key: 'city',
    label: 'City',
    sortable: true,
    filterable: false,
    width: '20%',
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
  },
  {
    key: 'score',
    label: 'Score',
    sortable: true,
    filterable: false,
    width: '10%',
    defaultValue:'-',
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
  },
  {
    key: 'gender',
    label: 'Gender',
    sortable: true,
    filterable: true,
    width: '10%',
    defaultValue:'na',
    sortIcons: {
      default: './asset/sort_default.png',
      asc: './asset/sort-up.png',
      desc: './asset/caret-down.png'
    }
   },
   {
    key: 'batch',
     label: 'batch',
     sortable: true,
     filterable: false,
     width: '10%',
   }
  

];
