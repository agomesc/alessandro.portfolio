import { useState, lazy, Suspense } from 'react';
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

const StarComponent = lazy(() => import("./StarComponent"));
const SocialMetaTags = lazy(() => import("./SocialMetaTags"));
const CustomSkeleton = lazy(() => import("./CustomSkeleton"));
const ViewComponent = lazy(() => import("./ViewComponent"));

const EquipmentValueCalculator = () => {
  const [newPrice, setNewPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [yearsUsed, setYearsUsed] = useState('');
  const [isDiscontinued, setIsDiscontinued] = useState(false);
  const [supplyDemand, setSupplyDemand] = useState(''); // New state for supply/demand
  const [estimatedValue, setEstimatedValue] = useState(null);

  const conditionFactors = {
    'Como novo (pouquíssimo uso)': 0.9,
    'Muito bom (sinais leves de uso)': 0.8,
    'Bom (uso moderado, tudo funcionando)': 0.7,
    'Razoável (marcas visíveis, totalmente funcional)': 0.6,
    'Com problemas (danos ou defeitos)': 0.4,
  };

  // New factors for supply and demand
  const supplyDemandFactors = {
    'Alta (muito procurado, raro)': 1.15, // 15% increase
    'Média (demanda e oferta comuns)': 1.0,  // No change
    'Baixa (pouco procurado, abundante)': 0.85, // 15% decrease
  };

  const depreciationPerYear = 0.05; // 5% ao ano
  const discontinuedPenalty = 0.85; // 15% de desconto adicional

  const calculateValue = () => {
    const price = parseFloat(newPrice);
    const conditionFactor = conditionFactors[condition];
    const demandFactor = supplyDemandFactors[supplyDemand]; // Get the demand factor
    const years = parseInt(yearsUsed, 10);

    if (!isNaN(price) && conditionFactor && demandFactor) { // Check if demandFactor is valid
      let baseValue = price * conditionFactor;

      if (!isNaN(years) && years > 0) {
        baseValue *= Math.pow(1 - depreciationPerYear, years);
      }

      if (isDiscontinued) {
        baseValue *= discontinuedPenalty;
      }

      // Apply the supply/demand factor
      baseValue *= demandFactor;

      setEstimatedValue(baseValue.toFixed(2));
    } else {
      setEstimatedValue(null);
    }
  };

  return (
    <Suspense fallback={<CustomSkeleton />}>
      <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
        <Box display="flex" justifyContent="center" mb={1}>
          <PhotoCameraIcon fontSize="large" color="action" />
        </Box>

        <Typography component="div" variant="h6" gutterBottom>
          Calculadora de Valor Usado
        </Typography>

        <Typography component="div" variant="body2" color="textSecondary" gutterBottom>
          Informe o valor de um equipamento novo, a condição atual, tempo de uso, se o modelo foi descontinuado e a oferta e procura no mercado.
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
          select
          label="Oferta e Procura no Mercado" // New field for supply and demand
          value={supplyDemand}
          onChange={(e) => setSupplyDemand(e.target.value)}
          margin="normal"
        >
          <MenuItem value="">Selecione...</MenuItem>
          {Object.keys(supplyDemandFactors).map((label) => (
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

        <StarComponent id="EquipmentValueCalculator" />


        <Button
          fullWidth
          variant="contained"
          onClick={calculateValue}
          sx={{ mt: 2 }}
        >
          Calcular Valor Estimado
        </Button>

        {estimatedValue !== null && (
          <Typography component="div" variant="h6" sx={{ mt: 3 }}>
            💰 Valor estimado: <strong>R$ {estimatedValue}</strong>
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <ViewComponent id="EquipmentValueCalculator" /> {/* ViewComponent to track views */}
        </Box>
      </Paper>
      <SocialMetaTags
        title="Calculadora de Valor de Equipamento Usado"
        description="Estime o valor de revenda do seu equipamento fotográfico usado, considerando condição, tempo de uso, descontinuação e oferta/procura."
        keywords="calculadora valor usado, estimativa preço equipamento, avaliação equipamento fotográfico, câmera usada valor, lente usada preço, calculadora depreciação"
        url={`${window.location.origin}/EquipmentValueCalculator`}
        type="website"
      />
    </Suspense>
  );
};

export default EquipmentValueCalculator;