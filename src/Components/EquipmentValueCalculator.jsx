import { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const EquipmentValueCalculator = () => {
  const [newPrice, setNewPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [yearsUsed, setYearsUsed] = useState('');
  const [isDiscontinued, setIsDiscontinued] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(null);

  const conditionFactors = {
    'Como novo (pouquíssimo uso)': 0.9,
    'Muito bom (sinais leves de uso)': 0.8,
    'Bom (uso moderado, tudo funcionando)': 0.7,
    'Razoável (marcas visíveis, totalmente funcional)': 0.6,
    'Com problemas (danos ou defeitos)': 0.4,
  };

  const depreciationPerYear = 0.05; // 5% ao ano
  const discontinuedPenalty = 0.85; // 15% de desconto adicional

  const calculateValue = () => {
    const price = parseFloat(newPrice);
    const factor = conditionFactors[condition];
    const years = parseInt(yearsUsed, 10);

    if (!isNaN(price) && factor) {
      let baseValue = price * factor;

      if (!isNaN(years) && years > 0) {
        baseValue *= Math.pow(1 - depreciationPerYear, years);
      }

      if (isDiscontinued) {
        baseValue *= discontinuedPenalty;
      }

      setEstimatedValue(baseValue.toFixed(2));
    } else {
      setEstimatedValue(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="center" mb={1}>
        <PhotoCameraIcon fontSize="large" color="action" />
      </Box>

      <Typography variant="h6" gutterBottom>
        Calculadora de Valor Usado
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Informe o valor de um equipamento novo, a condição atual, tempo de uso e se o modelo foi descontinuado.
      </Typography>

      <TextField
        fullWidth
        type="number"
        label="Valor novo do equipamento (R$)"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        margin="normal"
        placeholder="Ex: 13000"
      />

      <TextField
        fullWidth
        select
        label="Condição do equipamento"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        margin="normal"
      >
        <MenuItem value="">Selecione...</MenuItem>
        {Object.keys(conditionFactors).map((label) => (
          <MenuItem key={label} value={label}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Tempo de uso (anos)"
        value={yearsUsed}
        onChange={(e) => setYearsUsed(e.target.value)}
        margin="normal"
        placeholder="Ex: 2"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isDiscontinued}
            onChange={(e) => setIsDiscontinued(e.target.checked)}
          />
        }
        label="Equipamento saiu de linha"
        sx={{ mt: 1 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={calculateValue}
        sx={{ mt: 2 }}
      >
        Calcular Valor Estimado
      </Button>

      {estimatedValue !== null && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          💰 Valor estimado: <strong>R$ {estimatedValue}</strong>
        </Typography>
      )}
    </Paper>
  );
};

export default EquipmentValueCalculator;
