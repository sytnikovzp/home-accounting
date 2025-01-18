import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { getAllPermissions } from '../../services/permissionsService';

const { PERMISSIONS_SLICE_NAME } = sliceNames;

export const fetchPermissions = createAsyncThunk(
  `${PERMISSIONS_SLICE_NAME}/fetchAll`,
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllPermissions();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
