import {useState, useEffect} from 'react';
import { Pagination, Table } from 'antd';

// This is a basic solution which loads data each time the index or the page size is changed
// A more efficient solution would be to cache each page in a redux store
// and each time a cached index is selected use the cache instead of "GET"ting tha data again

const columns = [
  {
    title: 'Label',
    dataIndex: 'label',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Short form',
    dataIndex: 'short_form',
    sorter: true,
    width: '10%',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '20%',
  },
  {
    title: 'Iri',
    dataIndex: 'iri',
    width: '10%',
  },
  {
    title: 'Ontology Iri',
    dataIndex: 'ontology_iri',
    width: '10%',
  },
];

function TermDataTable(){
  const [terms, setTerms] = useState([]);
  const [page, setPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  function handleChange(pagination){

    // antd returns the page number starting from 1 so we decrement once
    setCurrentPage(pagination.current-1);
    setPageSize(pagination.pageSize)
  }

  async function getData(){
    try{
      let url = `https://www.ebi.ac.uk/ols/api/ontologies/efo/terms?page=${currentPage}&size=${pageSize}`;
      let response = await fetch(url);
      setLoading(true);
      let data = await response.json();
      setLoading(false);
      setTerms(data._embedded.terms);
      setPage(data.page);
    }catch(e){
      setLoading(false);
      console.error(e)
    }
  }

  useEffect(()=>{
    getData();
  },[currentPage, pageSize])

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
  }
  return(
    <div>
      {/*{terms.map(term=>{
        return(
          <div>
            {term.label}
          </div>
        )
      })}
      {page?<Pagination total={page.totalElements}
        defaultPageSize={page.size}
        onChange={handleChange}
      />:null}*/}
      <Table columns={columns} dataSource={terms}
        pagination={{
          ...pagination,
          total: page?.totalElements,
        }}
        loading={loading}
        onChange={handleChange} rowKey={record => record.label}
      />
    </div>
  )
}

export default TermDataTable;
