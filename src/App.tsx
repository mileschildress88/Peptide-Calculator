import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  SelectChangeEvent,
} from '@mui/material';

interface CalculatorState {
  peptideAmount: string;
  bacWaterAmount: string;
  desiredAmount: string;
  syringeSize: string;
  unitType: 'mg' | 'IU';
}

function App() {
  const [state, setState] = useState<CalculatorState>({
    peptideAmount: '',
    bacWaterAmount: '',
    desiredAmount: '',
    syringeSize: '1',
    unitType: 'mg',
  });

  const calculateDose = () => {
    const peptide = parseFloat(state.peptideAmount);
    const bacWater = parseFloat(state.bacWaterAmount);
    const desired = parseFloat(state.desiredAmount);
    const syringe = parseFloat(state.syringeSize);

    if (isNaN(peptide) || isNaN(bacWater) || isNaN(desired) || isNaN(syringe)) {
      return null;
    }

    const concentration = peptide / bacWater; // mg/mL or IU/mL
    const dose = desired / concentration; // mL needed
    const syringeUnits = (dose / syringe) * 100; // Convert to syringe units (0-100)

    return {
      dose,
      syringeUnits,
      dosesPerVial: Math.floor(peptide / desired),
    };
  };

  const handleSelectChange = (field: 'unitType' | 'syringeSize') => (
    event: SelectChangeEvent
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInputChange = (field: 'peptideAmount' | 'bacWaterAmount' | 'desiredAmount') => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const result = calculateDose();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Peptide Calculator
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Unit Type</InputLabel>
              <Select
                value={state.unitType}
                label="Unit Type"
                onChange={handleSelectChange('unitType')}
              >
                <MenuItem value="mg">mg</MenuItem>
                <MenuItem value="IU">IU</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Syringe Size</InputLabel>
              <Select
                value={state.syringeSize}
                label="Syringe Size"
                onChange={handleSelectChange('syringeSize')}
              >
                <MenuItem value="1">1 mL</MenuItem>
                <MenuItem value="0.5">0.5 mL</MenuItem>
                <MenuItem value="0.3">0.3 mL</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={`Peptide Amount (${state.unitType})`}
              value={state.peptideAmount}
              onChange={handleInputChange('peptideAmount')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="BAC Water (mL)"
              value={state.bacWaterAmount}
              onChange={handleInputChange('bacWaterAmount')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={`Desired Amount (${state.unitType})`}
              value={state.desiredAmount}
              onChange={handleInputChange('desiredAmount')}
              type="number"
            />
          </Grid>
        </Grid>

        {result && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            <Typography>
              To draw {state.desiredAmount} {state.unitType}, pull the syringe to {result.syringeUnits.toFixed(2)} units
            </Typography>
            <Typography>
              Number of doses per vial: {result.dosesPerVial}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App; 