import { useMemo } from 'react';

import { Box } from '@mui/material';

import Preloader from '../../components/Preloader/Preloader';

import ViewDetails from '../ViewDetails/ViewDetails';

import ModalWindow from './ModalWindow';

import { stylesViewPageBox } from '../../styles';

function EntityViewModal({ isOpen, title, data, isFetching, onClose }) {
  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} />
      </Box>
    );
  }, [data, isFetching]);

  return (
    <ModalWindow
      content={content}
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    />
  );
}

export default EntityViewModal;
