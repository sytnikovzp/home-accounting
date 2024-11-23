import { useState, useEffect } from 'react';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';

const CurrenciesPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const data = await restController.fetchAllCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Не вдалося отримати валюти:', error);
        setError('Не вдалося отримати валюти');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleEdit = (currency) => {
    console.log('Edit:', currency);
  };

  const handleDelete = (currency) => {
    console.log('Delete:', currency);
  };

  if (loading) return <Preloader />;
  if (error) return <Error error={error} />;

  return (
    <div style={{ padding: '20px' }}>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва', align: 'center' },
        ]}
        rows={currencies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CurrenciesPage;
