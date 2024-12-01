import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoriesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [modalData, setModalData] = useState({ mode: null, data: null });
  const [crudError, setCrudError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        ...sortModel,
      };
      const { data, totalCount } = await restController.fetchAllCategories(
        params
      );
      setCategories(data);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data.errors[0].title);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel, selectedStatus]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleModalClose = () => {
    setModalData({ mode: null, data: null });
    setCrudError(null);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmitCategory = async (values) => {
    try {
      if (modalData.mode === 'edit') {
        await restController.editCategory(modalData.data.id, values.title);
      } else {
        await restController.addCategory(values.title);
      }
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response.data.errors[0].title);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await restController.removeCategory(modalData.data.id);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response.data.errors[0].title);
    }
  };

  if (isLoading)
    return <Preloader message='Завантаження списку "Kатегорій"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <div>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Категорії</Typography>
        <Button
          variant='contained'
          color='success'
          onClick={() => setModalData({ mode: 'add', data: null })}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'left' },
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        rows={categories}
        onEdit={(category) => setModalData({ mode: 'edit', data: category })}
        onDelete={(category) =>
          setModalData({ mode: 'delete', data: category })
        }
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        showStatusDropdown
        linkEntity='categories'
      />
      {modalData.mode === 'add' || modalData.mode === 'edit' ? (
        <CustomModal
          isOpen
          onClose={handleModalClose}
          showCloseButton={true}
          title={
            modalData.mode === 'edit'
              ? 'Редагування категорії...'
              : 'Додавання категорії...'
          }
          content={
            <CategoryForm
              category={modalData.data}
              onSubmit={handleSubmitCategory}
            />
          }
          error={crudError}
        />
      ) : modalData.mode === 'delete' ? (
        <CustomModal
          isOpen
          onClose={handleModalClose}
          showCloseButton={true}
          title='Видалення категорії...'
          content={
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Ви впевнені, що хочете видалити категорію "{modalData.data?.title}
              "?
            </Typography>
          }
          actions={[
            <Button
              key='delete'
              variant='contained'
              color='error'
              size='large'
              onClick={handleDeleteCategory}
              fullWidth
            >
              Видалити
            </Button>,
          ]}
          error={crudError}
        />
      ) : null}
    </div>
  );
}

export default CategoriesPage;
