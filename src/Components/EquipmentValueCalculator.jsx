import { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
} from '@mui/material';

const EquipmentValueCalculator = () => {
  const [newPrice, setNewPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(null);

  const conditionFactors = {
    'Como novo (pouquíssimo uso)': 0.9,
    'Muito bom (sinais leves de uso)': 0.8,
    'Bom (uso moderado, tudo funcionando)': 0.7,
    'Razoável (marcas visíveis, totalmente funcional)': 0.6,
    'Com problemas (danos ou defeitos)': 0.4,
  };

  const calculateValue = () => {
    const price = parseFloat(newPrice);
    const factor = conditionFactors[condition];
    if (!isNaN(price) && factor) {
      setEstimatedValue((price * factor).toFixed(2));
    } else {
      setEstimatedValue(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Calculadora de Valor Usado
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
